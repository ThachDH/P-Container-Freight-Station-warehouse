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
  FormControl,
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import ChonNhanVien from "../popovers/ChonNhanVien";
// import md5 from 'md5';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initalData = {
  id: -1,
  Name: "",
  Pass: "",
  UserID: "",
  GroupUser: "",
  IsUsed: 1,
};

class ChiTietNguoiDung extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: initalData,
      popoverChonNhanVien: {
        isOpen: false,
        anchorEl: "",
      },
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
      lstGroupUsers: [],
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

  closeDialog(dataSend) {
    this.props.handleCloseDialog(dataSend);
    this.setState({ data: initalData });
  }

  //Thoilc(*Note)-Kiểm tra trạng thái
  checkTrangthai(type) {
    switch (type) {
      case 0: this.insertLogin(); break;
      case 1: this.updateLogin(); break;
      default: return;
    }
  }

  //Thoilc(*Note)-Insert dữ liệu
  insertLogin() {
    let url = window.root_url + `users/signup`;
    let dataSend = {
      Name: this.state.data.Name,
      Pass: this.state.data.Pass,
      UserID: this.state.data.UserID,
      GroupUser: this.state.data.GroupUser,
      IsUsed: (this.state.data.IsUsed === true) ? 1 : 0,
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
          },
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

  //Thoilc(*Note)-Update dữ liệu người dùng
  updateLogin() {
    let url = window.root_url + `users/update`;
    let dataSend = {
      Name: this.state.data.Name,
      Pass: this.state.data.Pass,
      UserID: this.state.data.UserID,
      GroupUser: this.state.data.GroupUser,
      IsUsed: (this.state.data.IsUsed === true) ? 1 : 0,
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

  //Thoilc(*Note)-Lifecycle
  componentDidMount() {
    this.loadGroupUser();
  }

  //Thoilc(*Note)-View dữ liệu phòng ban
  loadGroupUser() {
    let url = window.root_url + `group-users/view`;

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
        let arr = [];
        data.map(item => {
          return arr.push({
            No_: item.No_,
            label: item.Name,
            Name: item.Name,
          })
        })
        this.setState({ lstGroupUsers: arr })
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
            ? "Thêm Người Dùng"
            : this.props.dialog.type === 1
              ? "Cập Nhật Người Dùng"
              : "Chi Tiết Người Dùng"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <TextField
                  id="dialog-ten-dn"
                  label="Tên Đăng Nhập"
                  value={this.state.data.Name}
                  className={this.props.dialog.type === 1 ? "read-only" : ""}
                  inputProps={{
                    readOnly: this.props.dialog.type === 1 ? true : false,
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
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  id="dialog-mk"
                  label="Mật Khẩu"
                  ref='password'
                  // hintText="Password"
                  // floatingLabelText="Password"
                  type="password"
                  className={this.props.dialog.type === 1 ? "read-only" : ""}
                  inputProps={{
                    readOnly: this.props.dialog.type === 1 ? true : false,
                  }}
                  onChange={(event) =>
                    this.setState({
                      data: {
                        ...this.state.data,
                        Pass: event.target.value,
                      },
                    })
                  }
                />
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <TextField
                  id="dialog-nhan-vien"
                  label="Nhân Viên"
                  value={this.state.data.UserID}
                  className={this.props.dialog.type === 2 ? "read-only" : ""}
                  inputProps={{
                    readOnly: true,
                  }}
                  onClick={(event) => {
                    if (this.props.dialog.type === 2) return;
                    this.setState({
                      popoverChonNhanVien: {
                        ...this.state.popoverChonNhanVien,
                        anchorEl: event.currentTarget,
                        isOpen: true,
                      },
                    });
                  }}
                />
              </FormControl>
              <FormControl fullWidth>
                <Autocomplete
                  options={this.state.lstGroupUsers || []}
                  id="nhom"
                  disableClearable
                  value={this.state.data.GroupUser}
                  onChange={(event, data) => {
                    this.setState({
                      data: {
                        ...this.state.data,
                        GroupUser: data.No_,
                      },
                    })
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Nhóm*  " />
                  )}
                />
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.data.IsUsed}
                    onChange={(event) =>
                      this.setState({
                        data: {
                          ...this.state.data,
                          IsUsed: event.target.checked,
                        },
                      })
                    }
                  />
                }
                label="Sử Dụng"
              />
            </Stack>
          </Stack>
          <ChonNhanVien
            isOpen={this.state.popoverChonNhanVien.isOpen}
            anchorEl={this.state.popoverChonNhanVien.anchorEl}
            handleClose={(selectedNhanVien) => {
              this.setState({
                popoverChonNhanVien: {
                  ...this.state.popoverChonNhanVien,
                  anchorEl: null,
                  isOpen: false,
                },
              });
              if (selectedNhanVien !== null) {
                this.setState({
                  selectedNhanVien: selectedNhanVien,
                  data: {
                    ...this.state.data,
                    UserID: selectedNhanVien.employee_No_,
                  },
                });
              }
            }}
          ></ChonNhanVien>
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
export default ChiTietNguoiDung;
