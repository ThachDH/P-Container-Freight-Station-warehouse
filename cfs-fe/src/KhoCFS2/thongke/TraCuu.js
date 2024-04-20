import * as moment from "moment";
import * as React from "react";
import {
  Button,
  FormControl,
  InputLabel,
  Stack,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  DialogActions,
} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class TraCuu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
      dataTable: [],
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
      filterType: 'khachHang',
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
      },
    };
    this.filterValue = '';
  }

  traCuu() {
    let url = window.root_url;
    let dataSend = {
      actions: 'tracking',
    }
    let _id = "";
    switch (this.state.filterType) {
      case 'khachHang':
        url += `customers/getCustomer`;
        _id = "No_";
        break;
      case 'phieuNhap':
        url += `journal-receive-headers/getItem`;
        _id = "No_";
        break;
      case 'phieuXuat':
        url += `journal-export-headers/getItem`;
        _id = "No_";
        break;
      case 'hopDong':
        url += `customer-contract/getContractList`;
        _id = "No_";
        break;
      default: return;
    }
    dataSend[_id] = this.filterValue;

    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
      body: JSON.stringify(dataSend)
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(data => {
        this.setState({
          dialog: {
            isOpen: true,
            data: data,
            type: 0,
          },
        });
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

  renderSwitchTraCuu(params) {
    switch (params) {
      default: return;
    }
  }

  closeDialog() {
    this.setState({
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
      },
    });
  }

  //Thoilc(*Note)-View nhật ký nhập kho
  fetchData() {
    let url
    //let url = window.root_url + (this.state.isInOut === "in" ? 'journal-receive-headers/getReciveWithDetails' : 'journal-export-headers/getExportWithDetails');
    switch (this.state.filterType) {
      case 'khachHang':
        url = window.root_url + (`customers/getCustomer`);
        break;
      case 'phieuNhap':
        url = window.root_url + (`journal-receive-headers/update`);
        break;
      case 'phieuXuat':
        url = window.root_url + (`journal-export-headers/update`);
        break;
      case 'hopDong':
        url = window.root_url + (`customer-contract/update`);
        break;
      default: return;
    }

    let dataSend = {
      No_: this.filterValue,
      DocumentDate: [this.state.fromDate, this.state.toDate],
    };

    fetch(url, {
      method: "POST",
      headers: {
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Credentials': true,
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
      body: JSON.stringify(dataSend),
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
          this.setState({
            dataTable: data,
            alert: {
              isOpen: true,
              duration: 2000,
              message: 'Nạp dữ liệu thành công!',
              type: 'success',
            }
          });
        } else {
          this.setState({
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
              message: 'Lỗi ' + JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }
  //..................................
  render() {
    return (
      <>
        <Card style={{ marginTop: 1, marginLeft: 1, backgroundColor: "	#F8F8FF" }}>
          <CardContent container>
            <Grid item xs={4}>
              <Divider textAlign="center">
                <span className="m-filter-title">Lọc dữ liệu</span>
              </Divider>
            </Grid>
            <Stack component="form" direction="row" spacing={2}>
              <Stack direction="row" spacing={1}>
                <FormControl fullWidth>
                  <InputLabel id="select-type-to-find">Lọc theo</InputLabel>
                  <Select
                    labelId='select-type-to-find'
                    id='select-type-to-find'
                    label='Lọc theo'
                    value={this.state.filterType}
                    onChange={(e) => {
                      this.setState({
                        filterType: e.target.value
                      })
                    }}
                  >
                    <MenuItem value='khachHang'>Mã Khách Hàng</MenuItem>
                    <MenuItem value='phieuNhap'>Số Phiếu Nhập</MenuItem>
                    <MenuItem value='phieuXuat'>Số Phiếu Xuất</MenuItem>
                    <MenuItem value='hopDong'>Mã Hợp Đồng</MenuItem>
                  </Select>
                </FormControl>
                <Divider orientation="vertical" />
                <TextField
                  id="ma"
                  label="Mã"
                  onChange={(event) => {
                    this.filterValue = event.target.value
                  }}
                />
              </Stack>
              <Button type="button"
                variant="contained"
                onClick={() => this.traCuu()}
              >
                Tra cứu
              </Button>
            </Stack>
          </CardContent>
        </Card>
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
        <Dialog fullWidth maxWidth="md" open={this.state.dialog.isOpen} onClose={() => { this.closeDialog() }} >
          {this.renderSwitchTraCuu(this.state.filterType)}
          <DialogActions>
            <Button onClick={() => this.closeDialog()} variant="contained">Huỷ</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
export default TraCuu;

