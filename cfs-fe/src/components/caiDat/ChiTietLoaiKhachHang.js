import * as React from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Divider,
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initalData = {
  id: -1,
  No_: "",
  Name: "",
};

class ChiTietLoaiKhachHang extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: initalData,
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
  }

  //Thoilc(*Note)-Lấy thông tin từ lưới
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.dialog.data !== null &&
      prevState.data.id !== nextProps.dialog.data.id
    ) {
      return { data: JSON.parse(JSON.stringify(nextProps.dialog.data)) };
    } else return null;
  }

  closeDialog(dataSend) {
    this.props.handleCloseDialog(dataSend);
    this.setState({ data: initalData });
  }

  //Thoilc(*Note)-Kiểm tra trạng khi click vào nút button thái tỷ giá
  checkTrangthai(type) {
    switch (type) {
      case 0: this.insertCusType(); break;
      case 1: this.updateCusType(); break;
      default: return;
    }
  }

  //Thoilc(*Note)-Thêm mới item loại khách hàng
  insertCusType() {
    let url = window.root_url + `customer-types/insert`;
    let dataSend = {
      No_: this.state.data.No_,
      Name: this.state.data.Name,
    };
    fetch(url, {
      method: "POST",
      headers: {
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
      .then((data) => {
        this.setState({
          data: initalData,
          alert: {
            isOpen: true,
            duration: 2000,
            message: 'Lưu dữ liệu thành công!',
            type: 'success',
          }
        });
        this.props.handleCreate(data);
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

  //Thoilc(*Note)-Cập nhật item loại khách hàng
  updateCusType() {
    let url = window.root_url + `customer-types/update`;
    let dataSend = {
      No_: this.props.dialog.data.No_,
      Name: this.state.data.Name,
    };

    fetch(url, {
      method: "POST",
      headers: {
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
      .then((data) => {
        if (data) {
          this.props.handleCloseDialog({ type: 'update', data: dataSend });
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
  //-----------------------------------------------------
  render() {
    return (
      <Dialog open={this.props.dialog.isOpen} scroll="paper">
        <DialogTitle variant="h5">
          {this.props.dialog.type === 0
            ? "Thêm Loại Khách Hàng"
            : "Cập Loại Khách Hàng"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <TextField
                id="dialog-ma-loai-kh"
                label="Mã Loại Khách Hàng*"
                value={this.state.data.No_}
                className={this.props.dialog.type === 1 ? "read-only" : ""}
                inputProps={{
                  readOnly: this.props.dialog.type === 1 ? true : false,
                }}
                onChange={(event) =>
                  this.setState({
                    data: {
                      ...this.state.data,
                      No_: event.target.value,
                    },
                  })
                }
              />
              <TextField
                id="dialog-ten-loai-kh"
                label="Tên Loại Khách Hàng*"
                value={this.state.data.Name}
                className={this.props.dialog.type === 2 ? "read-only" : ""}
                inputProps={{
                  readOnly: this.props.dialog.type === 2 ? true : false,
                }}
                onChange={(event) =>
                  this.setState({
                    data: {
                      ...this.state.data,
                      Name: event.target.value,
                    },
                  })
                }
              />
            </Stack>
          </Stack>
        </DialogContent>
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
        <DialogActions>
          {this.props.dialog.type === 2 ? (
            <Button onClick={() => this.closeDialog()}>Đóng</Button>
          ) : (
            <>
              <Button onClick={() => this.closeDialog()}>Huỷ</Button>
              <Button onClick={() => this.checkTrangthai(this.props.dialog.type)} variant="contained">
                Lưu
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}
export default ChiTietLoaiKhachHang;