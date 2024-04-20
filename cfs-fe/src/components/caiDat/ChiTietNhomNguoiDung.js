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
  InputLabel,
  MenuItem,
  Select,
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
  GroupGrant: "Quản trị",
  Description: "",
};

class ChiTietNhomNguoiDung extends React.Component {
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

  //Thoilc(*Note)-Kiểm tra trạng thái
  checkTrangthai(type) {
    switch (type) {
      case 0: this.insertgrpUser(); break;
      case 1: this.updategrpUser(); break;
      default: return;
    }
  }

  //Thoilc(*Note)-Insert dữ liệu
  insertgrpUser() {
    let url = window.root_url + `group-users/insert`;
    let dataSend = {
      No_: this.state.data.No_,
      Name: this.state.data.Name,
      GroupGrant: this.state.data.GroupGrant === "Quản trị" ? 1 : 2,
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
          alert: {
            type: 'success',
            message: 'Lưu dữ liệu thành công',
            duration: 2000,
            isOpen: true
          }
        });

        let temp = {
          RowID: Math.max.apply(Math, (this.props.dialog.temp).map(target => target.RowID)) + 1,
          No_: this.state.data.No_,
          Name: this.state.data.Name,
          GroupGrant: this.state.data.GroupGrant === "Quản trị" ? "Quản trị" : "Người dùng",
          Description: this.state.data.Description,
        };
        this.props.handleCreate(temp);
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

  //Thoilc(*Note)-Update dữ liệu group người dùng
  updategrpUser() {
    let url = window.root_url + `group-users/update`;
    let dataSend = {
      No_: this.state.data.No_,
      Name: this.state.data.Name,
      GroupGrant: this.state.data.GroupGrant === "Quản trị" ? 1 : 2,
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
        this.props.handleCloseDialog({ type: 'update', data: dataSend });
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
            ? "Thêm Nhóm Người Dùng"
            : this.props.dialog.type === 1
              ? "Cập Nhật Nhóm Người Dùng"
              : "Chi Tiết Nhóm Người Dùng"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <TextField
                  id="dialog-ma-nhom"
                  label="Mã Nhóm*"
                  value={this.state.data.No_}
                  className={this.props.dialog.type === 1 ? "read-only" : ""}
                  inputProps={{
                    readOnly: this.props.dialog.type === 1 ? true : false,
                  }}
                  onChange={(event) =>
                    this.setState({
                      data: {
                        ...this.state.data,
                        No_: event.target.value.toUpperCase(),
                      },
                    })
                  }
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  id="dialog-ten-nhom"
                  label="Tên Nhóm*"
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
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <InputLabel id="cap-do-nhom">Cấp Độ Nhóm*</InputLabel>
                <Select
                  labelId="cap-do-nhom-lable"
                  id="cap-do-nhom"
                  label="Cấp Độ Nhóm"
                  value={this.state.data.GroupGrant}
                  onChange={(event, value) => {
                    this.setState({
                      data: {
                        ...this.state.data,
                        GroupGrant: event.target.value,
                      },
                    });
                  }}
                >
                  <MenuItem value="Quản trị">Quản trị</MenuItem>
                  <MenuItem value="Người dùng">Người dùng</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <TextField
                  id="dialog-dien-giai"
                  label="Ghi chú"
                  multiline
                  value={this.state.data.Description}
                  className={this.props.dialog.type === 2 ? "read-only" : ""}
                  inputProps={{
                    readOnly: this.props.dialog.type === 2 ? true : false,
                  }}
                  onChange={(event) =>
                    this.setState({
                      data: {
                        ...this.state.data,
                        Description: event.target.value,
                      },
                    })
                  }
                />
              </FormControl>
            </Stack>
          </Stack>
        </DialogContent>
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
      </Dialog>
    );
  }
}
export default ChiTietNhomNguoiDung;
