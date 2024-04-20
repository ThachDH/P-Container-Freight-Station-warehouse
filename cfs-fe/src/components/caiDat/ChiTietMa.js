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
  FormControl,
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initalData = {
  id: -1,
  Code: "",
  SeriesCode: '',
  Description: '',
  StartingNo: 1,
  EndingNo: 99999,
  ImcrementNo: 0,
  LastNoUsed: 0,
};

class ChiTietMa extends React.Component {
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

  closeDialog(dataSend) {
    this.props.handleCloseDialog(dataSend);
    this.setState({ data: initalData });
  }

  //Thoilc(*Note)-Kiểm tra trạng thái
  checkTrangthai(type) {
    switch (type) {
      case 0: this.insertCode(); break;
      case 1: this.updateCode(); break;
      default: return;
    }
  }
  //Thoilc(*Note)-Insert dữ liệu
  insertCode() {
    let url = window.root_url + `no-series-lines/insert`;
    let dataSend = {
      SeriesCode: this.state.data.SeriesCode,
      Description: this.state.data.Description,
      StartingNo: parseInt(this.state.data.StartingNo),
      EndingNo: parseInt(this.state.data.EndingNo),
    }
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

  //Thoilc(*Note)-Update dữ liệu mã
  updateCode() {
    let url = window.root_url + `no-series-lines/update`;
    let dataSend = {
      SeriesCode: this.state.data.SeriesCode,
      Description: this.state.data.Description,
      StartingNo: parseInt(this.state.data.StartingNo),
      EndingNo: parseInt(this.state.data.EndingNo),
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
            ? "Thêm Mã"
            : this.props.dialog.type === 1
              ? "Cập Nhật Mã"
              : "Chi Tiết Mã"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1}>
                  <FormControl fullWidth>
                    <TextField
                      id="dialog-so-serial"
                      label="Số Serial*"
                      value={this.state.data.SeriesCode}
                      className={this.props.dialog.type === 1 ? "read-only" : ""}
                      inputProps={{
                        readOnly: this.props.dialog.type === 1 ? true : false,
                      }}
                      onChange={(event) =>
                        this.setState({
                          data: {
                            ...this.state.data,
                            SeriesCode: event.target.value,
                          },
                        })
                      }
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={1} className="double-width">
                  <TextField
                    id="dialog-dien-giai"
                    label="Diễn Giải*"
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
                </Stack>
                <Stack direction="row" spacing={1}>
                  <FormControl fullWidth>
                    <TextField
                      id="dialog-bat-dau"
                      label="Số Bắt Đầu*"
                      type="number"
                      value={this.state.data.StartingNo}
                      className={this.props.dialog.type !== 2 ? "read-only" : ""}
                      inputProps={{
                        readOnly: this.props.dialog.type !== 2 ? true : false,
                      }}
                      onChange={(event) =>
                        this.setState({
                          data: {
                            ...this.state.data,
                            StartingNo: event.target.value,
                          },
                        })
                      }
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      id="dialog-ket-thuc"
                      label="Mã Kết Thúc*"
                      value={this.state.data.EndingNo}
                      className={this.props.dialog.type !== 2 ? "read-only" : ""}
                      inputProps={{
                        readOnly: this.props.dialog.type !== 2 ? true : false,
                      }}
                      onChange={(event) =>
                        this.setState({
                          data: {
                            ...this.state.data,
                            EndingNo: event.target.value,
                          },
                        })
                      }
                    />
                  </FormControl>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
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
export default ChiTietMa;
