import "./index.scss";
import "../../assets/styles/responsive.scss";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, TextField, FormControlLabel, Checkbox, Grid } from "@mui/material";
import Logo from "../../assets/images/logo_ceh.jpg";
import background from "../../assets/images/background.jpg";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { TerminalList } from "../../componentsCFS2/GeneralComponents";
import PopupRegistry from "../../componentsCFS2/dialog/PopupRegistry";
import { socketServices } from "../../_services/socket.service";
import DecodeJWT from "./DecodeJWT";


const { socket } = socketServices;
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
// const theme = useMediaQuery({
//   breakpoints: {
//     values: {
//       xxs: 0, // smol phone
//       xs: 300, // phone
//       sm: 600, // tablets
//       md: 900, // small laptop
//       lg: 1200, // desktop
//       xl: 1536,// large screens
//     }
//   }
// });
//Thoilc(*Note)-Chức năng đăng nhập
const Login = () => {
  let userInfo = {};
  const [kq, setState] = useState({
    alert: {
      isOpen: false,
      message: 'Lỗi không xác định!',
      duration: 5000,
      type: 'info'
    }
  });

  const [openDialog, setOpenDialog] = useState({
    dialogOpen: {
      isOpen: false,
    }
  });

  const [terminalVisible, setTerminalVisible] = useState(false);
  const [userName, setTerminal] = useState(userInfo);
  // const [pwd, setPassword] = useState("");
  // const [nameValue, setNameValue] = useState("");
  // const [passwordValue, setPasswordValue] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    socket.on("client_login", (response) => {
      if (response.status) {
        setTerminal({
          name: response.payload.userName,
          token: response.payload.token,
          userID: response.payload.userID
        });
        setTerminalVisible(true);
      } else {
        setState({
          alert: {
            isOpen: true,
            type: 'warning',
            duration: 2000,
            message: response.message
          }
        });
      }
    })
  }, []);

  //Thoilc(*Note)-Đăng nhập
  const handleSubmit = (event) => {
    event.preventDefault();
    let userObj = new FormData(event.currentTarget);
    if (!openDialog.dialogOpen.isOpen) {
      let url = window.root_url + `sa-users/login`;

      let dataSend = {
        Name: userObj.get("username"),
        Pass: userObj.get("password"),
      };

      fetch(url, {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json; charset=UTF-8',
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
        .then(response => {
          let tempUserInfo = DecodeJWT((response.token));
          let login = {
            socketId: socket.id,
            userID: tempUserInfo.ID,
            userName: response.USER_NAME,
            userGroup: tempUserInfo.roles,
            token: response.token,

          }
          socket.emit("server_login", login);
        })
        .catch((err) => {
          if (JSON.parse(err.message).error.statusCode >= 401 && JSON.parse(err.message).error.statusCode <= 404) {
            setState({
              alert: {
                isOpen: true,
                message: 'Tài khoản hoặc mật khẩu chưa đúng hoặc chưa được kích hoạt, Vui lòng thử lại hoặc báo với quản trị để được hổ trợ!',
                duration: 10000,
                type: 'warning',
              }
            });
            localStorage.clear();
          }
        });
    }
  }

  //Thoilc(*Note)-Check thông tin đăng nhập
  const selectTerminalHandler = (value, data) => {
    setTerminalVisible(false);
    localStorage.setItem("userInfo", JSON.stringify(data));
    if (data.name !== '') {
      navigate("/overview");
    } else {
      window.location.assign("/login");
    }
    localStorage.setItem("selectContenHeader", value);
  }
  //---------------------------
  return (
    <>
      <Grid container>
        <div className="login" style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', fontSize: 14, position: 'fixed' }}>
          <img src={background} alt="background" height="100%" width="100%"></img>
          <Grid item xs={10} style={{ position: 'absolute' }}>
            <Box sx={{ backgroundColor: 'white', borderRadius: '35px', textAlign: 'center', paddingTop: '5vh', paddingBottom: '5vh' }}>
              <Grid item xs={12}>
                <img src={Logo} alt="logo" style={{ width: '30vh' }} />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}
                  style={{ width: "75%" }}
                  autoComplete="off"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit(e);
                    }
                  }}
                >
                  <Grid container style={{ textAlign: 'center' }}>
                    <Grid item xs={12}>
                      <TextField
                        id="username"
                        name="username"
                        label="Tên đăng nhập*"
                        margin="normal"
                        placeholder="Username"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="password"
                        name="password"
                        label="Mật khẩu*"
                        margin="normal"
                        placeholder="Password"
                        type="password"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} style={{ textAlign: 'left' }}>
                      <FormControlLabel
                        control={<Checkbox
                          value="remember"
                          color="primary" />}
                        label="Nhớ mật khẩu"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        size="large"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Đăng Nhập
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Box>
          </Grid>
        </div>
      </Grid>
      {/* -------------------- global alert -------------------- */}
      <Snackbar
        open={kq.alert.isOpen}
        autoHideDuration={kq.alert.duration}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        onClose={() => {
          setState({ alert: { ...kq.alert, isOpen: false } })
        }}
      >
        <Alert
          severity={kq.alert.type}
          sx={{ width: '100%' }}
        >
          {kq.alert.message}
        </Alert>
      </Snackbar>
      <TerminalList
        terminalVisible={terminalVisible}
        dataName={userName}
        onSelected={(value, data) => { selectTerminalHandler(value, data) }}
        handleCloseDialog={() => setTerminalVisible(false)}
      ></TerminalList>
      <PopupRegistry
        dialog={openDialog.dialogOpen}
        handleCloseDialog={() => setOpenDialog({
          dialogOpen: {
            isOpen: false,
          }
        })}
      ></PopupRegistry>
    </>
  );
};

export default Login;
