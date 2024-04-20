import * as React from "react";
import * as moment from "moment";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import CachedIcon from '@mui/icons-material/Cached';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class CDSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [],
      selectedCD: {},
      TRF_TEMP: '',
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
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
        field: "ACC_NO",
        headerName: 'Tên biểu cước',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
      },
      {
        field: "ACC_NAME",
        headerName: 'Diễn giải',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
      },
      {
        field: "ACC_TYPE",
        headerName: 'Loại',
        flex: 0.5,
        headerAlign: 'center',
        align: 'center',
      },
    ];
    this.createRows = (data) => data.map((row, index) => ({
      id: index,
      ...row
    }),
    );
  }

  closeDialog() {
    this.props.handleCloseDialog();
  }

  selected() {
    this.props.handleSelect(this.state.selectedCD);
    const { selectedCD } = this.state;
    if (Object.keys(selectedCD).length === 0) {
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

  componentDidMount() {
    this.handleViewData();
  }

  handleViewData() {
    let url = window.root_url + `accounts/view`;
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
        if (data.length > 0) {
          let temp = this.createRows(data);
          this.setState({
            dataTable: temp,
            alert: {
              isOpen: true,
              type: "success",
              duration: 3000,
              message: "Nạp dữ liệu thành công!"
            },
          })
        }
        else {
          this.setState({
            dataTable: [],
            alert: {
              type: 'warning',
              message: 'Không tìm thấy dữ liệu!',
              duration: 3000,
              isOpen: true
            }
          });
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
              message: JSON.parse(err.message).error.message,
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
          <DialogTitle variant="h5">Hình thức thanh toán</DialogTitle>
          <Divider />
          <DialogContent>
            <Card>
              <CardContent>
                <Grid item mt={1} md={12}>
                  <DataGrid
                    onRowClick={(params) => {
                      this.setState({
                        selectedCD: params.row
                      })
                    }}
                    hideFooter={true}
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
            <Button onClick={() => this.closeDialog()}>Đóng</Button>
            <Button variant='contained' onClick={() => this.handleViewData()} startIcon={<CachedIcon />}>Tải lại</Button>
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
export default CDSelect;
