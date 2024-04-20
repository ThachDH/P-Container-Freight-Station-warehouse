import * as React from "react";
import {
  Card,
  CardContent,
  Dialog,
  TextField,
  Typography,
  Button,
  Divider,
  DialogActions,
  DialogTitle,
  DialogContent,
  Grid
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import DecodeJWT from "../../KhoCFS2/login/DecodeJWT";
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initalData = {
  id: -1,
  Name: "",
  PassOld: "",
  PassL1: "",
  PassL2: "",
};

class PopupRegistry extends React.Component {
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

  closeDialog() {
    this.props.handleCloseDialog();
  }

  savePopup() {
    let data = this.state.data;
    if (data.PassL1 === data.PassL2) {
      let url = window.root_url + `sa-users/updatePwd`;
      let dataSend = {
        ID: DecodeJWT(JSON.parse(localStorage.getItem("userInfo")).token).ID,
        Name: data.Name,
        PassOld: data.PassOld,
        PassNew: data.PassL1,
      };
      fetch(url, {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json; charset=UTF-8',
          // 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
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
          if (data.Status) {
            this.setState({
              alert: {
                isOpen: true,
                message: data.message,
                type: 'success'
              }
            });
            localStorage.clear();
            window.location.assign('/login');
          } else {
            this.setState({
              data: {
                ...this.state.data,
                PassOld: "",
                PassL1: "",
                PassL2: "",
              },
              alert: {
                isOpen: true,
                duration: 3000,
                message: data.message,
                type: 'warning'
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
                message: data.message,
                type: 'error'
              }
            });
          }
        });
    } else {
      this.setState({
        data: {
          ...this.state.data,
          PassOld: "",
          PassL1: "",
          PassL2: "",
        },
        alert: {
          isOpen: true,
          duration: 2000,
          message: 'Hiện tại cung cấp mật khẩu mới chưa khớp',
          type: 'warning',
        }
      });
    }
  }

  componentDidMount() {

  }

  //-------------------------------------
  render() {
    return (
      <Dialog
        open={this.props.dialog.isOpen}
        scroll="paper"
      >
        <DialogTitle variant="h5">
          <Typography>Đổi mật khẩu</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Card>
            <CardContent>
              <Grid container rowSpacing={1} columnSpacing={1}>
                <Grid item md={6}>
                  <TextField
                    id="dialog-ten-nguoi-dung"
                    label="Tên người dùng*"
                    size="small"
                    fullWidth
                    value={this.state.data.Name}
                    inputProps={{
                      readOnly: false,
                    }}
                    onChange={(event) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          Name: event.target.value,
                        },
                      });
                    }}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    id="dialog-mat-khau-cu"
                    label="Mật khẩu cũ*"
                    size="small"
                    fullWidth
                    value={this.state.data.PassOld}
                    type="password"
                    autoComplete="new-password"
                    onChange={(event) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          PassOld: event.target.value,
                        }
                      })
                    }}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    id="dialog-ten-nguoi-dung"
                    label="Mật khẩu mới*"
                    size="small"
                    fullWidth
                    value={this.state.data.PassL1}
                    type="password"
                    inputProps={{
                      readOnly: false,
                    }}
                    onChange={(event) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          PassL1: event.target.value,
                        }
                      });
                    }}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    id="dialog-mat-khau-cu"
                    label="Nhập lại mật khẩu mới*"
                    value={this.state.data.PassL2}
                    type="password"
                    size="small"
                    fullWidth
                    inputProps={{
                      readOnly: false,
                    }}
                    onChange={(event) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          PassL2: event.target.value,
                        }
                      });
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.closeDialog()}>Huỷ</Button>
          <Button onClick={() => this.savePopup()} variant="contained">
            Lưu
          </Button>
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
    );
  }
}

export default PopupRegistry;