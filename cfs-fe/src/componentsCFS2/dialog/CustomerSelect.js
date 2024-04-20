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
  TextField,
  Stack,
  InputAdornment,
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import CachedIcon from '@mui/icons-material/Cached';
import SearchIcon from '@mui/icons-material/Search';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class CustomerSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [],
      selectedCus: {},
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
      searchField: {
        TAX_CODE: '',
      },
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
        field: "CUSTOMER_CODE",
        headerName: "Mã Khách Hàng",
        align: 'center',
        editable: true,
        flex: 1
      },
      {
        field: "CUSTOMER_NAME",
        headerName: "Tên Khách Hàng",
        editable: true,
        flex: 1
      },
      {
        field: "CNTRSZTP",
        headerName: 'Loại',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: "TAX_CODE",
        headerName: "Mã Số Thuế",
        editable: true,
        flex: 1
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
      const { selectedCus } = this.state;
      this.props.handleSelect(selectedCus);
      if (Object.keys(selectedCus).length === 0) {
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
    this.setState({
      isOpen: false,
    });
  }

  closeDialog() {
    this.props.handleCloseDialog();
  }

  componentDidMount() {
    this.handleLoadData();
  }

  handleLoadData() {
    let url = window.root_url + `bs-customer/view`;
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
          let selectAll = {};
          if (this.props.dialog.type === 1) {
            selectAll.CUSTOMER_NAME = 'Tất cả';
            selectAll.CUSTOMER_CODE = '*';
            selectAll.TAX_CODE = '';
            data.unshift(selectAll);
          }
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
          <DialogTitle variant="h5">Chọn Mã Khách Hàng</DialogTitle>
          <Divider />
          <DialogContent>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Tìm kiếm:</span>
                  <TextField
                    size="small"
                    id="tim-kiem"
                    onChange={(e) => {
                      this.setState({
                        searchField: {
                          TAX_CODE: e.target.value,
                        }
                      });
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon
                            style={{ cursor: "default" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
                <Grid item mt={1} md={12}>
                  <DataGrid
                    onRowDoubleClick={(e) => this.selected(e)}
                    onRowClick={(params) => {
                      this.setState({
                        selectedCus: params.row
                      })
                    }}
                    hideFooter={true}
                    className="m-table"
                    rows={(this.state.dataTable)
                      .filter(data => data?.TAX_CODE?.toUpperCase()?.includes(this.state.searchField.TAX_CODE.toUpperCase()))
                    }
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
            <Button variant='contained' onClick={() => this.handleLoadData()} startIcon={<CachedIcon />}>Tải lại</Button>
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
export default CustomerSelect;
