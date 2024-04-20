import React from "react";
import { Outlet } from "react-router-dom";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import Header from "../../componentsCFS2/header";
import LeftMenu from "../../componentsCFS2/leftMenu";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import "./MainLayout.scss";

const drawerWidth = 240;
const theme = createTheme();

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);
const MainLayout = () => {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return localStorage.getItem('userInfo')
    ? (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Header open={open} handleDrawerOpen={handleDrawerOpen} />
          <LeftMenu
            open={open}
            handleDrawerClose={handleDrawerClose}
            handleDrawerOpen={handleDrawerOpen}
          />
          <Main
            open={open}
            className={open ? "menu-opened" : "menu-hidden"}
            sx={{ flexGrow: 1, p: 0, pt: 0, pl: 0, pr: 0 }}
          >
            <Toolbar />
            <Outlet />
          </Main>
        </Box>
      </ThemeProvider>
    )
    :
    window.location.assign('/login');
};

export default MainLayout;
