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
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initalData = {
  id: -1,
  No_: "",
  LineNo: "",
  IndexNo: "",
  Position: "",
  FloorNo: "",
  LocationNo: "",
  Status: { id: 0, text: "Ô trống" },
  IsLock: false,
};

class ChiTietCaiDatO extends React.Component {
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
      return { data: nextProps.dialog.data };
    } else return null;
  }
  closeDialog() {
    this.props.handleCloseDialog();
    this.setState({ data: initalData });
  }

  //Thoilc(*Note)-Kiểm tra trạng thái
  checkTrangthai(type) {
    switch (type) {
      case 0: this.insertCell(); break;
      case 1: this.updateCell(); break;
      default: return;
    }
  }

  //Thoilc(*Note)-Insert dữ liệu ô
  insertCell() {
    let url = window.root_url + `cells/insert`;
    let dataSend = {
      No_: this.state.data.No_,
      LineNo: this.state.data.LineNo,
      IndexNo: parseInt(this.state.data.IndexNo),
      Position: this.state.data.Position,
      FloorNo: parseInt(this.state.data.FloorNo),
      LocationNo: this.state.data.LocationNo,
      Status: this.state.data.Status.id,
      IsLock: (this.state.data.IsLock === true) ? 1 : 0,
    };

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
      .then(() => {
        this.setState({
          data: initalData,
          isOpen: true,
          duration: 2000,
          message: 'Lưu dữ liệu thành công',
          type: 'success'
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
  //Thoilc(*Note)-Update dữ liệu ô
  updateCell() {
    let url = window.root_url + `cells/update`;

    let dataSend = {
      No_: this.state.data.No_,
      LineNo: this.state.data.LineNo,
      IndexNo: parseInt(this.state.data.IndexNo),
      Position: this.state.data.Position,
      FloorNo: parseInt(this.state.data.FloorNo),
      LocationNo: this.state.data.LocationNo,
      Status: this.state.data.Status.id,
      IsLock: (this.state.data.IsLock === true) ? 1 : 0,
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
          isOpen: true,
          duration: 2000,
          message: 'Cập nhật dữ liệu thành công',
          type: 'success'
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
      <Dialog open={this.props.dialog.isOpen} scroll="paper">
        <DialogTitle variant="h5">
          {this.props.dialog.type === 0
            ? "Thêm Ô"
            : this.props.dialog.type === 1
              ? "Cập Nhật Ô"
              : "Chi Tiết Ô"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <TextField
                id="dialog-ma-o"
                label="Mã Ô"
                value={this.state.data.No_}
                className={this.props.dialog.type === 2 ? "read-only" : ""}
                inputProps={{
                  readOnly: this.props.dialog.type === 2 ? true : false,
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
                id="dialog-ma-day"
                label="Mã Dãy"
                value={this.state.data.LineNo}
                className={this.props.dialog.type === 2 ? "read-only" : ""}
                inputProps={{
                  readOnly: this.props.dialog.type === 2 ? true : false,
                }}
                onChange={(event) =>
                  this.setState({
                    data: {
                      ...this.state.data,
                      LineNo: event.target.value,
                    },
                  })
                }
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField
                id="dialog-chi-so"
                label="Chỉ Số"
                value={this.state.data.IndexNo}
                className={this.props.dialog.type === 2 ? "read-only" : ""}
                inputProps={{
                  readOnly: this.props.dialog.type === 2 ? true : false,
                }}
                onChange={(event) =>
                  this.setState({
                    data: {
                      ...this.state.data,
                      IndexNo: event.target.value,
                    },
                  })
                }
              />
              <FormControl fullWidth>
                <InputLabel id="vi-tri-label">Vị Trí</InputLabel>
                <Select
                  labelId="vi-tri-label"
                  id="vi-tri"
                  label="Vị Trí"
                  value={this.state.data.Position}
                  onChange={(event) =>
                    this.setState({
                      data: {
                        ...this.state.data,
                        Position: event.target.value,
                      },
                    })
                  }
                >
                  {/* <MenuItem value=""></MenuItem> */}
                  <MenuItem value="T">T</MenuItem>
                  <MenuItem value="N">N</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField
                id="dialog-ma-tang"
                label="Mã Tầng"
                value={this.state.data.FloorNo}
                className={this.props.dialog.type === 2 ? "read-only" : ""}
                inputProps={{
                  readOnly: this.props.dialog.type === 2 ? true : false,
                }}
                onChange={(event) =>
                  this.setState({
                    data: {
                      ...this.state.data,
                      FloorNo: event.target.value,
                    },
                  })
                }
              />
              <FormControl fullWidth>
                <InputLabel id="kho-label">Kho</InputLabel>
                <Select
                  labelId="kho-label"
                  id="kho"
                  label="Kho"
                  value={this.state.data.LocationNo}
                  onChange={(event) =>
                    this.setState({
                      data: {
                        ...this.state.data,
                        LocationNo: event.target.value,
                      },
                    })
                  }
                >
                  {/* <MenuItem value=""></MenuItem> */}
                  <MenuItem value="KHO1">Kho 1</MenuItem>
                  <MenuItem value="KHO2">Kho 2</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <InputLabel id="trang-thai-label">Trạng Thái</InputLabel>
                <Select
                  labelId="trang-thai-label"
                  id="trang-thai"
                  label="Trạng Thái"
                  value={this.state.data.Status.id}
                  onChange={(event, value) => {
                    this.setState({
                      data: {
                        ...this.state.data,
                        Status: {
                          id: event.target.value,
                          text: value.props.children,
                        },
                      },
                    });
                  }}
                >
                  {/* <MenuItem value={-1}>Ô trống</MenuItem> */}
                  <MenuItem value={0}>Ô trống</MenuItem>
                  <MenuItem value={1}>Ô đầy</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.data.IsLock}
                    onChange={(event) =>
                      this.setState({
                        data: {
                          ...this.state.data,
                          IsLock: event.target.checked,
                        },
                      })
                    }
                  />
                }
                label="Ô Cảnh Báo"
              />
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
export default ChiTietCaiDatO;
