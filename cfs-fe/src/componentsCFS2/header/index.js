import "./index.scss";
import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Login from "../../KhoCFS2/login";
import { Route } from "react-router-dom";
import EmptyLayout from "../../KhoCFS2/layouts/EmptyLayout";
import { TerminalList } from "../GeneralComponents";
import { Dialog } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import PopupRegistry from "../../componentsCFS2/dialog/PopupRegistry";

const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null,
      contenHeader: false,
      dialogOpen: {
        isOpen: false,
        data: null,
        type: 0,
      },
    };
  }

  closeDialog() {
    this.setState({
      dialogOpen: {
        isOpen: false,
      },
    });
  }

  isOpenRegistry() {
    this.setState({
      dialogOpen: {
        isOpen: true,
      },
    });
  }

  isOpen() {
    return this.state.anchorEl !== null ? true : false;
  }

  handleClick(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }

  refreshPage(value) {
    localStorage.setItem("selectContenHeader", value);
    window.location.reload();
  }
  //----------------------------
  render() {
    return (
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "white",
          color: "#2c2c2c",
        }}
        className="header"
        open={this.props.open}
      >
        <Toolbar>
          <Box>
            <div className="headTitle">
              <Typography
                onClick={() => { this.setState({ contenHeader: true }) }}
                sx={{ display: { xs: 'none', md: 'block', fontSize: '13px', marginTop: '8%' } }}
                component="h5"
              >
                HỆ THỐNG QUẢN LÝ KHO CFS
              </Typography>
            </div>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => this.props.handleDrawerOpen()}
              edge="start"
              className={this.props.open ? "menu-button" : "menu-button show"}
              style={{
                position: "absolute",
                left: "0",
                top: "0px",
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Divider orientation="vertical" variant="middle" flexItem ></Divider>
          <Button
            onClick={(event) => this.handleClick(event)}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Avatar sx={{ width: 24, height: 24, mr: "10px" }}>A</Avatar>
            <Typography component="h6" sx={{ textTransform: "none" }}>
              {
                //Thoilc(*Note)-Get username
                Object.values(JSON.parse(localStorage.getItem("userInfo"))).map(item => item)[0] === undefined
                  ?
                  (
                    <Route element={<EmptyLayout />}>
                      <Route
                        path="login"
                        element={<Login />} />
                    </Route>
                  )
                  :
                  JSON.parse(localStorage.getItem("userInfo")).name
              }
            </Typography>
            <ArrowRightIcon
              sx={{ transform: "rotate(90deg)" }}
            ></ArrowRightIcon>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={this.state.anchorEl}
            open={this.isOpen()}
            onClose={() => this.handleClose()}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => this.isOpenRegistry()}>Đổi mật khẩu</MenuItem>
            <MenuItem component={Link} to="/login" onClick={() => window.localStorage.clear()}>
              Đăng xuất
            </MenuItem>
          </Menu>
        </Toolbar>
        <PopupRegistry
          dialog={this.state.dialogOpen}
          handleCloseDialog={() => this.closeDialog()}
        ></PopupRegistry>
        <Dialog
          open={this.state.contenHeader}
          onClose={() => {
            this.setState({
              contenHeader: false
            })
          }}
          PaperProps={{
            style: {
              height: 220,
              width: '35%',
              marginTop: -30,
            },
          }} >
          <DialogTitle >Vui lòng chọn đơn vị đăng nhập</DialogTitle>
          <TerminalList onSelected={(value) => { this.refreshPage(value) }} handleCloseDialog={() => { this.setState({ contenHeader: false }) }} />
        </Dialog>
      </AppBar >

    );
  }
}
export default Header;
