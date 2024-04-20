import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  Radio,
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import CachedIcon from '@mui/icons-material/Cached';
import * as moment from "moment";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class FormSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [],
      selectedForm: {},
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.columns = [
      {
        field: "Action",
        headerName: "Chọn",
        type: "actions",
        width: 80,
        getActions: (params) => [
          <Radio
            checked={
              this.state.dataTable !== [] &&
              this.state.selectedForm.id === params.row.id
            }
            onClick={() => {
              this.setState({
                selectedForm: params.row,
              })
            }}
            inputProps={{ "aria-label": params.row.id }}
          />
        ]
      },
      {
        field: "NAME",
        headerName: 'Tên mẫu',
        flex: 1,
      },
    ];
    this.createRows = (data) => data.map((row, index) => ({
      id: index,
      ...row
    }),
    );
  }

  selected(params) {
    if (params) {
      this.props.handleSelect(params.row);
    } else {
      const { selectedForm } = this.state;
      this.props.handleSelect(selectedForm);
      if (selectedForm.NAME.length === 0) {
        this.setState({
          alert: {
            isOpen: true,
            duration: 2000,
            message: 'không có dữ liệu',
            type: 'warning',
          }
        });
        return;
      }
    }
  }

  componentDidMount() {
    this.loadForm();
  }

  loadForm() {
    let url = '';
    if (this.props.dialog.type === 'discount') {
      url = window.root_url + `config-discounts/viewCode`
    } else if (this.props.dialog.type === 'progressive') {
      url = window.root_url + `config-day-level/viewName`
    } else {
      url = window.root_url + `config-free-days/viewName`
    }
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(data => {
        if (data.Status) {
          let temp;
          if (this.props.dialog.type === 'discount') {
            let temp1 = data.Payload.confDiscount.map(item => {
              item.FROM_DATE = moment(item.FROM_DATE, "DD/MM/YYYY").format("YYYY-MM-DD")
              item.TO_DATE = moment(item.TO_DATE, 'DD/MM/YYYY').format('YYYY-MM-DD')
              return item;
            });
            temp = this.createRows(temp1)
          } else {
            temp = this.createRows(data.Payload);
          }
          this.setState({
            dataTable: temp,
            alert: {
              isOpen: true,
              type: "success",
              duration: 3000,
              message: "Nạp dữ liệu thành công!"
            },
          })
        } else {
          this.setState({
            alert: {
              isOpen: true,
              message: data.message,
              type: 'error',
              duration: 2000
            }
          })
        }
      })
      .catch(err => {
        if (JSON.parse(err.message).error.statusCode === 401) {
          localStorage.clear();
          window.location.assign('/login');
        } else {
          this.setState({
            alert: {
              isOpen: true,
              duration: 3000,
              message: 'Lỗi ' + JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }

  //-----------------------------------
  render() {
    return (
      <>
        <Dialog
          open={this.props.dialog.isOpen}
          scroll="paper"
          fullWidth={true}
          maxWidth="sm"
        >
          <DialogTitle variant="h5">Chọn Mẫu</DialogTitle>
          <Divider />
          <DialogContent>
            <Card>
              <CardContent>
                <Grid item mt={1} md={12}>
                  <DataGrid
                    onRowDoubleClick={(params) => this.selected(params)}
                    onRowClick={(params) => {
                      this.setState({
                        selectedForm: params.row,
                      })
                    }}
                    hideFooterSelectedRowCount={true}
                    className="m-table"
                    rows={(this.state.dataTable)}
                    rowHeight={35}
                    columns={this.columns}
                    sx={{ height: "63vh" }}
                  >
                  </DataGrid>
                </Grid>
              </CardContent>
            </Card>
          </DialogContent >
          <DialogActions>
            <Button onClick={() => this.selected()} variant="contained">
              Chọn
            </Button>
            <Button onClick={() => this.props.handleCloseDialog()}>Đóng</Button>
            <Button variant='contained' onClick={() => this.loadForm()} startIcon={<CachedIcon />}>Tải lại</Button>
          </DialogActions>
          {/* -------------------- global alert -------------------- */}
          <Snackbar
            open={this.state.alert.isOpen}
            autoHideDuration={this.state.alert.duration}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            onClose={() => {
              this.setState({ alert: { ...this.state.alert, isOpen: false } })
            }}
          >
            <Alert
              severity={this.state.alert.type}
              sx={{ width: '100%' }}
            >
              {this.state.alert.message}
            </Alert>
          </Snackbar>
        </Dialog >
      </>
    );
  }
}
export default FormSelect;
