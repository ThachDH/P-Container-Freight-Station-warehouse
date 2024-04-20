import * as React from "react";
import {
  Divider,
  TextField,
  Box,
  Snackbar,
  Alert,
  Skeleton,
  Card,
  Stack,
  Button,
  Typography,
  Checkbox,
  Autocomplete,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import SaveIcon from '@mui/icons-material/Save';
import DecodeJWT from "../login/DecodeJWT";
class PhanQuyen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // isCheck: false,
      dataUserGroups: [],
      dataPolicy: [],
      dataPermission: [],
      dataMenu: [],
      selectedIndex: -1,
      filterGroupUser: "",
      dialog: {
        isOpen: false,
        id: -1,
      },
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.dataNo_ = "";
    this.funcCols = [
      {
        field: "id",
        headerName: "STT",
        width: 50
      },
      {
        field: "PARENT_CODE",
        headerName: "Nhóm danh mục",
        width: 250,
        renderCell: (item) => {
          return !item.value ? String(item.row?.MENU_NAME).toUpperCase() : ''
        }
      },
      {
        field: "MENU_NAME",
        headerName: "Tên danh mục",
        width: 250,
        renderCell: (item) => {
          return !item.row?.PARENT_CODE ? '' : item.value
        }
      },
      {
        field: "IS_VIEW",
        headerName: "Xem",
        width: 120,
        renderCell: (item) => {
          return this.renderCellSwitch(item, true)
        }
      },
      {
        field: "IS_ADD_NEW",
        headerName: "Thêm",
        width: 120,
        renderCell: (item) => {
          return this.renderCellSwitch(item, true)
        }
      },
      {
        field: "IS_MODIFY",
        headerName: "Sửa",
        width: 120,
        renderCell: (item) => {
          return this.renderCellSwitch(item, true)
        }
      },
      {
        field: "IS_DELETE",
        headerName: "Xóa",
        width: 120,
        renderCell: (item) => {
          return this.renderCellSwitch(item, true)
        }
      },
    ];
  }

  //Haro(*Note)-Xử lý check-all
  renderCellSwitch(cell, isCheckAllCol = false) {
    let isCellChecked = cell.value === true;
    let tempData = this.state.dataPolicy;
    let { dataMenu } = this.state;
    return (
      <Checkbox
        checked={isCellChecked}
        onChange={(event) => {
          if (isCheckAllCol) {
            tempData[cell.id].IsCheckAll = tempData[cell.id][cell.field] = event.target.checked;
          }
          else {
            tempData[cell.id][cell.field] = event.target.checked;
          }
          tempData[cell.id][cell.field] = event.target.checked;
          let dataFilter = tempData.filter(p => p.PARENT_CODE === tempData[cell.id].MENU_CODE);
          if (dataFilter.length) {
            dataFilter.map(data => {
              data.IsCheckAll = data[cell.field] = tempData[cell.id].IsCheckAll;
              return data;
            });
          }
          let filter = dataMenu.filter(p => p.PARENT_CODE === tempData[cell.id].PARENT_CODE);
          let filterCheck = dataMenu.filter(p => p.PARENT_CODE === tempData[cell.id].PARENT_CODE && (p[cell.field] === true));
          let filterHeader = dataMenu.filter(p => p.MENU_CODE === tempData[cell.id].PARENT_CODE);
          if ((filterHeader || []).length) {
            if (filter.length === filterCheck.length) {
              tempData[filterHeader[0].id][cell.field] = true;
            } else {
              tempData[filterHeader[0].id][cell.field] = false;
            }
          }
        }}
      />
    );
  }

  closeDialog() {
    this.setState({
      dialog: {
        isOpen: false,
      },
    });
  }

  //Thoilc(*Note)-View List
  loadGroupUser() {
    fetch(window.root_url + 'sa-usergroups/getItem', {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
      body: JSON.stringify({ USER_GROUP_CODE: DecodeJWT(JSON.parse(localStorage.getItem("userInfo")).token).roles })
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(response => {
        if (response.Status) {
          let arr = [];
          response.Payload.map(item => {
            return arr.push({
              USER_GROUP_CODE: item.USER_GROUP_CODE,
              label: item.USER_GROUP_NAME,
              USER_GROUP_NAME: item.USER_GROUP_NAME,
            })
          });
          this.setState({
            dataUserGroups: arr,
            alert: {
              isOpen: true,
              duration: 3000,
              type: "success",
              message: "Nạp dữ liệu thành công",
            }
          });
        } else {
          this.setState({
            dataUserGroups: [],
            alert: {
              isOpen: true,
              message: 'Không tìm thấy danh sách nhóm người dùng!',
              duration: 2000,
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

  //Thoilc(*Note)-Load danh sách menu
  loadGrpFunction(item) {
    let url = window.root_url + `sa-accessrights/view`;
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
      body: JSON.stringify({ USER_GROUP_CODE: item })
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(response => {
        if (response.Status) {
          var { dataMenu } = this.state;
          dataMenu.map((menuItem) => {
            let accessrights = response.Payload.filter(p => p.GROUP_MENU_CODE === menuItem.PARENT_CODE);
            let header = response.Payload.filter(p => p.GROUP_MENU_CODE === menuItem.MENU_CODE);
            let arrData = header.concat(accessrights);
            if (arrData.length > 0) {
              arrData.map(acc => {
                let obj = {
                  PARENT_CODE: menuItem.PARENT_CODE,
                  MENU_NAME: !menuItem.MENU_NAME ? acc.MENU_NAME : menuItem.MENU_NAME,
                  IS_VISIBLE: menuItem.IS_VISIBLE ? true : false,
                  ORDER_BY: menuItem.ORDER_BY,
                  IS_VIEW: acc.IS_VIEW,
                  IS_ADD_NEW: acc.IS_ADD_NEW,
                  IS_DELETE: acc.IS_DELETE,
                  IS_MODIFY: acc.IS_MODIFY,
                  IsCheckAll: menuItem.IsCheckAll,
                  IsParent: menuItem.IsParent ? true : false,
                  id: menuItem.id,
                };
                menuItem = Object.assign(menuItem, obj);
                menuItem.IsCheckAll = acc.IS_ADD_NEW && acc.IS_MODIFY && acc.IS_DELETE && acc.IS_VIEW;
                return acc;
              });
            } else {
              menuItem.IsCheckAll = menuItem.IS_ADD_NEW = menuItem.IS_MODIFY = menuItem.IS_DELETE = menuItem.IS_VIEW = false;
            }
            if (!menuItem.GROUP_MENU_CODE) {
              menuItem.IsCheckAll = true;
              // menuItem.NewOrderBy = menuItem.ORDER_BY;
              menuItem.IsParent = true;
            }
            else {
              // menuItem.NewOrderBy = parseFloat(dataMenu.filter(p => p.MENU_CODE == menuItem.MENU_CODE).map(p => p.ORDER_BY)[0]) + (++index / 100)
              menuItem.IsParent = false;
            }
            return menuItem;
          })
          // dataMenu.sort((a, b) => a.NewOrderBy - b.NewOrderBy);
          dataMenu.map((p, idx) => p.id = idx);
          this.setState({
            dataPolicy: dataMenu,
            alert: {
              isOpen: true,
              duration: 2000,
              type: "success",
              message: "Nạp dữ liệu thành công",
            }
          });
        } else {
          this.setState({
            dataPolicy: [],
            alert: {
              isOpen: true,
              message: 'Tải dữ liệu thất bại, vui lòng load lại trang và thử lại!',
              duration: 3000,
              type: 'warning',
            }
          })
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

  loadMenu() {
    let url = window.root_url + `sa-menus/viewMenu`;
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(response => {
        if (response.Status) {
          this.setState({
            dataMenu: response.Payload
          })
        } else {
          this.setState({
            dataPolicy: [],
            alert: {
              isOpen: true,
              message: 'Tải dữ liệu thất bại, vui lòng load lại trang và thử lại!',
              duration: 2000,
              type: 'warning',
            }
          })
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
  // ----------------- start - events handler --------------
  handleListItemClick(USER_GROUP_CODE) {
    // this.loadGrpFunction(this.state.dataUserGroups[index].USER_GROUP_CODE);
    // this.dataNo_ = { USER_GROUP_CODE: this.state.dataUserGroups[index].USER_GROUP_CODE };
    // this.setState({ selectedIndex: index });
    this.loadGrpFunction(USER_GROUP_CODE);
    this.dataNo_ = { USER_GROUP_CODE: USER_GROUP_CODE };

  }
  // ----------------- end - events handler --------------
  //Thoilc(*Note)-Thêm mới và cập nhật bảng phân quyền(AccessRight)
  handleSave() {
    let url = window.root_url + `sa-accessrights/insertAndUpdate`;
    let dataTemp = this.state.dataPolicy.filter(itm => {
      if (itm.IS_ADD_NEW || itm.IS_DELETE || itm.IS_MODIFY || itm.IS_VIEW)
        return true;
      else
        return false;
    });
    let dataSend = dataTemp.map(item => {
      return Object.assign(item, this.dataNo_);
    });
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
      .then(response => {
        if (response.Status) {
          this.setState({
            // dataPolicy: response.Payload,
            alert: {
              isOpen: true,
              message: 'Xử lý thành công!',
              duration: 2000,
              type: 'success'
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
  //----------------------------------------------
  render() {
    let loadingElems = [];
    for (let index = 0; index < 15; index++) {
      loadingElems.push(<Skeleton key={index} variant="text" sx={{ fontSize: "1.5rem" }} />);
    }
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Card>
          <Grid component="div" container direction="row" spacing={1}>
            <Grid component="div" container item direction="column" xs={3} spacing={1} alignItems={"center"}>
              <Grid
                item
              >
                <Typography component="h2" variant="h6" sx={{ fontWeight: 300, ml: "10px", mt: "10px" }}> Danh sách Nhóm Người Dùng</Typography>
                {/* <Box component="div">
                  <TextField
                    id="searchGroup"
                    label="Tìm theo nhóm người dùng..."
                    onChange={(e) => { this.setState({ filterGroupUser: e.target.value }) }}
                  />
                </Box> */}
              </Grid>
              <Divider sx={{ marginTop: 1 }} orientation="horizontal" />
              <Grid component="div" item>
                <Autocomplete
                  sx={{ width: 300 }}
                  options={this.state.dataUserGroups || []}
                  id="nhom-nguoi-dung"
                  onChange={(event, data) => {
                    this.handleListItemClick(data.USER_GROUP_CODE);
                  }}
                  disableClearable
                  renderInput={(params) => (
                    <TextField {...params} label="Nhóm người dùng" />
                  )}
                />
              </Grid>
            </Grid>
            <Grid item xs={9} height="90vh">
              <Stack direction="row" spacing={1}>
                <Button
                  style={{ margin: "10px 10px 10px auto" }}
                  type="button"
                  variant="outlined"
                  onClick={() => this.handleSave()}
                  startIcon={<SaveIcon />}
                  color="success"
                >
                  Lưu
                </Button>
              </Stack>
              {
                this.state.dataPolicy.length === 0 ?
                  <>
                    <Skeleton variant="rounded" width={"100%"} />
                    {
                      loadingElems.map(item => item)
                    }
                  </>
                  :
                  <DataGrid
                    className="m-table"
                    height="100%"
                    columns={this.funcCols}
                    rows={this.state.dataPolicy}
                    sortable={false}
                  // getRowClassName={(params) => `text-${params.row.IsParent ? 'parent' : ''}`}
                  />
              }
            </Grid>
          </Grid>
        </Card>
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
      </Box>


    );
  }

  componentDidMount() {
    this.loadMenu();
    this.loadGroupUser();
  }
}

export default PhanQuyen;
