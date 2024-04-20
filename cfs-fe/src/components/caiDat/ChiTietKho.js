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
  Card,
  CardContent,
} from "@mui/material";
import { CreateStorage } from "../GeneralComponents";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initalData = {
  id: -1,
  No_: "",
  Name: "",
  Description: "",

};

class ChiTietKho extends React.Component {
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.dialog.data !== null &&
      prevState.data.id !== nextProps.dialog.data.id
    ) {
      return { data: JSON.parse(JSON.stringify(nextProps.dialog.data)) };
    } else return null;
  }

  closeDialog() {
    this.props.handleCloseDialog();
    this.setState({ data: initalData });
  }

  checkTrangthai(type) {
    switch (type) {
      case 0: this.insertLocation(); break;
      case 1: this.updateLocation(); break;
      default: return;
    }
  }


  //Thoilc(*Note)-Thêm sơ đồ kho đang xử lý
  insertLocation() {
    let url = window.root_url + `locations/insert`;
    let dataSend = {
      No_: this.state.data.No_,
      Name: this.state.data.Name,
      Description: this.state.data.Description,
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
      .then(() => {
        this.setState({
          data: initalData,
          alert: {
            isOpen: true,
            duration: 2000,
            message: 'Lưu dữ liệu thành công!',
            type: 'success',
          }
        })
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

  updateLocation() {
    let url = window.root_url + `locations/update`;
    let dataSend = {
      No_: this.state.data.No_,
      Name: this.state.data.Name,
      Description: this.state.data.Description,
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
      .then(() => {
        this.setState({
          data: initalData,
          alert: {
            isOpen: true,
            duration: 2000,
            message: 'Cập nhật dữ liệu thành công',
            type: 'success',
          }
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
  //-----------------------------------------------------
  render() {
    return (
      <Dialog open={this.props.dialog.isOpen} scroll="paper" maxWidth='lg' fullWidth>
        <DialogTitle variant="h5">
          {this.props.dialog.type === 0
            ? "Thêm Kho"
            : this.props.dialog.type === 1
              ? "Cập Nhật Kho"
              : "Chi Tiết Kho"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    id="dialog-ma-kho"
                    label="Mã Kho"
                    value={this.state.data.No_}
                    className={this.props.dialog.type === 2 ? "read-only" : ""}
                    inputProps={{
                      readOnly: this.props.dialog.type === 2 ? true : false,
                    }}
                    onChange={(event) =>
                      this.setState({
                        data: {
                          ...this.state.data,
                          No_: event.target.value
                        }
                      })
                    }
                  />
                  <TextField
                    id="dialog-ten-kho"
                    label="Tên Kho"
                    value={this.state.data.Name}
                    className={this.props.dialog.type === 2 ? "read-only" : ""}
                    inputProps={{
                      readOnly: this.props.dialog.type === 2 ? true : false,
                    }}
                    onChange={(event) =>
                      this.setState({
                        data: {
                          ...this.state.data,
                          Name: event.target.value
                        }
                      })
                    }
                  />
                  <TextField
                    id="dialog-dien-giai"
                    label="Diễn Giải"
                    fullWidth
                    value={this.state.data.Description}
                    className={this.props.dialog.type === 2 ? "read-only" : ""}
                    inputProps={{
                      readOnly: this.props.dialog.type === 2 ? true : false,
                    }}
                    onChange={(event) =>
                      this.setState({
                        data: {
                          ...this.state.data,
                          Description: event.target.value
                        }
                      })
                    }
                  />
                </Stack>
                <Divider />
                {/* Nhập số dãy */}
                <CreateStorage />
              </Stack>
            </CardContent>
          </Card>
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
export default ChiTietKho;
