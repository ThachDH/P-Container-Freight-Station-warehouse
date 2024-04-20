import "./index.scss";
import * as React from "react";
import { connect } from "react-redux";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { ListItemButton, Collapse, IconButton } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link, NavLink } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Logo from "../../assets/images/logo_ceh.jpg";
import DecodeJWT from '../../KhoCFS2/login/DecodeJWT';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ListIcon from '@mui/icons-material/List';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import DirectionsOutlinedIcon from '@mui/icons-material/DirectionsOutlined';
import RoomPreferencesOutlinedIcon from '@mui/icons-material/RoomPreferencesOutlined';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const drawerWidth = 240;
class ConnectedLeftMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: [],
    };
  }

  //Thoilc(*Note)-Lifecycle
  componentDidMount() {
    let url = window.root_url + `sa-menus/view`;
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
      body: JSON.stringify({
        USER_GROUP_CODE: DecodeJWT(JSON.parse(localStorage.getItem("userInfo")).token).roles
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(response => {
        let mainMenu = [];
        if (response.Status) {
          response.Payload.map(item => {
            return !item.PARENT_CODE
              ? mainMenu.push({
                MENU_CODE: item.MENU_CODE,
                id: item.ID,
                text: item.MENU_NAME,
                isOpen: false,
                href: '/' + item.VIEW_PAGE,
                VIEW_CLASS: item.VIEW_CLASS,
                VIEW_PAGE: item.VIEW_PAGE
              })
              :
              [];
          });
          mainMenu.map((dataMain, index) => {
            let subMenu = [];
            response.Payload.map(dataSub => {
              return dataMain.MENU_CODE === dataSub.PARENT_CODE
                ? subMenu.push({
                  text: dataSub.MENU_NAME,
                  href: dataMain.href + '/' + dataSub.VIEW_PAGE,
                  VIEW_CLASS: dataSub.VIEW_CLASS,
                  VIEW_PAGE: dataSub.VIEW_PAGE
                })
                :
                [];
            });

            //Kiểm tra lại subMenu, nếu có dữ liệu thì đẩy vào ds ở index của thằng cha
            return subMenu.length ? mainMenu[index]['children'] = subMenu : [];
          });
          localStorage.setItem('mainMenu', JSON.stringify(mainMenu));
          this.setState({ menu: mainMenu });
        } else {
          this.setState({
            alert: {
              isOpen: true,
              duration: 3000,
              message: 'Không có dữ liệu',
              type: 'warning',
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
              message: 'Lỗi ' + JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }

  //---------------------------
  render() {
    return (
      <Drawer
        className="menu"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        open={this.props.open}
        variant="persistent"
        anchor="left"
      >
        <Toolbar
          className="menu-header"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Link to="/overview">
              <img src={Logo} alt="logo" height="30px" />
            </Link>
            {/* <Typography component="h2" variant="h5">
              Kho CFS
            </Typography> */}
          </Box>
          <IconButton onClick={() => this.props.handleDrawerClose()}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Box className="scrollBar__">
          <List>
            {this.state.menu.map((item, index) => (
              < React.Fragment key={item.text} >
                <ListItemButton
                  style={{ padding: "7px", gap: "5px" }}
                  className={item.isOpen ? 'select__ParentMenu' : ''}
                  onClick={(e) => {
                    const { menu } = this.state;
                    let temp = menu.map((p, idx) => {
                      let itemIndex = this.state.menu.findIndex((i) => i.id === item.id);
                      if (p.MENU_CODE === item.MENU_CODE && itemIndex === idx) {
                        p.isOpen = !item.isOpen;
                      } else {
                        p.isOpen = false;
                      };
                      return p;
                    });
                    this.setState({
                      menu: temp
                    })
                  }}
                  component={!item.children ? NavLink : "div"}
                  to={!item.children ? item.href : ""}

                >
                  {
                    index === 0 ? <HomeOutlinedIcon fontSize="large" />
                      : index === 1 ? <PermIdentityOutlinedIcon fontSize="large" />
                        : index === 2 ? <ListIcon fontSize="large" />
                          : index === 3 ? <SourceOutlinedIcon fontSize="large" />
                            : index === 4 ? <SaveAsOutlinedIcon fontSize="large" />
                              : index === 5 ? <LowPriorityIcon fontSize="large" />
                                : index === 6 ? <DirectionsOutlinedIcon fontSize="large" />
                                  : index === 7 ? <RoomPreferencesOutlinedIcon fontSize="large" />
                                    : index === 8 ? <StackedLineChartIcon fontSize="large" />
                                      : index === 9 ? <ContentPasteSearchIcon fontSize="large" />
                                        : index === 10 ? <BuildOutlinedIcon fontSize="large" />
                                          : ''
                  }
                  <ListItemText sx={{ fontSize: "14px" }} primary={item.text.toUpperCase()} />
                  {item.children &&
                    (item.isOpen === true ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
                {
                  item.children && (
                    <Collapse in={item.isOpen} timeout="auto" unmountOnExit>
                      <List
                        className="background__selected"
                        component="div" disablePadding>
                        {item.children.map((child, index) => (
                          <ListItemButton
                            key={child.text}
                            sx={{ pl: 4, gap: "10px" }}
                            component={NavLink}
                            to={child.href}
                            end
                          >
                            <ArrowRightIcon />
                            <ListItemText primary={child.text} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )
                }
              </React.Fragment>
            )
            )}
          </List>
        </Box>
      </Drawer >
    );
  }
}

const LeftMenu = connect(
  // mapStateToProps,
  // mapDispatchToProps
)(ConnectedLeftMenu);
export default LeftMenu;
