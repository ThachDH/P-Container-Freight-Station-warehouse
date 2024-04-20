import * as React from "react";
import {
  Box,
  Button,
  TextField,
  Stack,
  Divider,
  Grid,
  Snackbar,
  Alert,
  Card,
  Checkbox,
  CardContent
} from "@mui/material";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import { DataGrid } from '@mui/x-data-grid';
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import AddRows from "../../componentsCFS2/dialog/AddRows";

const createRows = (data) => data.map((row, index) => ({
  id: index,
  STT: index + 1,
  ...row
}),
);

const initalData = {
  id: -1,
  MENU_CODE: "",
  MENU_NAME: "",
  GROUP_MENU_CODE: "",
  PARENT_CODE: "",
  GROUP_MENU_NAME: "",
  APP_CODE: "",
  IS_VISIBLE: 0,
  ORDER_BY: 0,
};

class QuanLyMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmPopup: {
        isOpen: false,
      },
      dataTable: [],
      data: initalData,
      dataParent_Code: {},
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
      }, dialogAdd: {
        isOpen: false,
        data: null,
        type: 0,
      },
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.tableFilter = {
      MENU_NAME: '',
    };
    this.columns = [
      {
        field: "STT",
        width: 90,
        headerName: "STT",
      },
      {
        field: "GROUP_MENU_CODE",
        flex: 1,
        editable: true,
        headerName: "Mã nhóm",
      },
      {
        field: "GROUP_MENU_NAME",
        flex: 1,
        editable: true,
        headerName: "Tên nhóm",
      },
      {
        field: "PARENT_CODE",
        flex: 1,
        editable: true,
        headerName: "Danh mục cha",
        type: "singleSelect",
        valueOptions: () => {
          const options = [];
          this.state.dataParent_Code?.map((item) => options.push(item.MENU_CODE))
          return options;
        },
        // renderCell: (item) => {
        //   return !item.value ? item.row?.MENU_CODE : '';
        // }
      },
      {
        field: "MENU_CODE",
        flex: 1,
        editable: true,
        headerName: "Danh mục con",
        renderCell: (item) => {
          return !item.row?.PARENT_CODE ? '' : item.value;
        },
      },
      {
        field: "MENU_NAME",
        flex: 1,
        editable: true,
        headerName: "Tên danh mục con",
      },
      {
        field: "VIEW_CLASS",
        flex: 1,
        editable: true,
        headerName: "Tên lớp",
      },
      {
        field: "VIEW_PAGE",
        flex: 1,
        editable: true,
        headerName: "Đường dẫn",
      },
      {
        field: "IS_VISIBLE",
        flex: 1,
        headerName: "Sử dụng/không sử dụng",
        type: "actions",
        width: 80,
        getActions: (params) => {
          return [
            <Checkbox
              onChange={(e) => {
                this.rowSelectHandle(params.row.STT - 1, e.target.checked);
              }}
              checked={
                params.row.IS_VISIBLE === true ? true : false
              }
            ></Checkbox>
          ];
        }
      },
      {
        field: "ORDER_BY",
        flex: 1,
        editable: true,
        headerName: "Số thứ tự danh mục",
      },
      {
        field: "ID",
        headerName: "ID",
        editable: false,
      },
    ];
  }

  rowSelectHandle(idx, status) {
    let updateData = this.state.dataTable;
    if (updateData[idx]['status'] !== 'insert') {
      updateData[idx]['status'] = 'update';
    }
    updateData[idx]['IS_VISIBLE'] = status;
    this.setState({
      ...this.state,
      dataTable: updateData
    })
  }

  //Thoilc(*Note)-Thêm dữ liệu và setState dataTable
  // handleCreateSuccess(data) {
  //   let temp = this.state.dataTable;
  //   let obj = {};

  //   Object.keys(data).map(key => {
  //     return obj[key] = data[key];
  //   });

  //   temp.push(obj);
  //   this.setState({
  //     dataTable: temp,
  //   });
  // }

  //Thoilc(*Note)-Lifecycle
  componentDidMount() {
    this.loadInfo();
    this.loadDataParent_Code();
  }

  componentDidUpdate(nextProps, nextState) {
    let check = (this.deleteInfo === true) ? true : false;
    return check;
  }

  //Thoilc(*Note)-Load dữ liệu lên bảng
  loadInfo() {
    let url = window.root_url + `sa-menus/viewMenu`;
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
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
      .then(response => {
        if (response.Status) {
          let temp = createRows(response.Payload);
          this.setState({ dataTable: temp });
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
          this.loadDataParent_Code();
        }
      });
  }

  handleAddRow(rowCount) {
    let { dataTable } = this.state;
    let newRow = [];
    for (let i = 0; i < rowCount; i++) {
      let newData = {
        id: dataTable.length + i + 1,
        STT: dataTable.length + i + 1,
        status: 'insert',
      }
      newRow.push(newData);
    };
    let mergeDataTable = [...dataTable, ...newRow];
    this.setState({
      dataTable: mergeDataTable,
      alert: {
        isOpen: true,
        type: 'success',
        message: "Thêm dòng thành công",
        duration: 2000,
      }
    })
  }

  handleSave() {
    let url = window.root_url + `sa-menus/insertAndUpdate`;
    let { dataTable } = this.state;
    let dataSend = [];
    dataTable.map(data => {
      if (data.status === "insert") {
        let temp = dataTable.filter(item => item.status === "insert")
        dataSend = temp.map(item => {
          let obj = {};
          obj['status'] = item.status;
          obj["MENU_CODE"] = item.MENU_CODE;
          obj["MENU_NAME"] = item.MENU_NAME;
          obj["GROUP_MENU_CODE"] = item.GROUP_MENU_CODE;
          obj["PARENT_CODE"] = item.PARENT_CODE;
          obj["GROUP_MENU_NAME"] = item.GROUP_MENU_NAME;
          obj["IS_VISIBLE"] = item.IS_VISIBLE === undefined || item.IS_VISIBLE === false ? false : true;
          obj["ORDER_BY"] = item.ORDER_BY;
          obj["VIEW_CLASS"] = item.VIEW_CLASS;
          obj["VIEW_PAGE"] = item.VIEW_PAGE;
          obj["CREATE_BY"] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
          return obj;
        });
      } else {
        let temp = dataTable.filter(p => p.status === "update")
        dataSend = temp.map(item => {
          let obj = {};
          obj['status'] = item.status;
          obj["MENU_CODE"] = item.MENU_CODE;
          obj["MENU_NAME"] = item.MENU_NAME;
          obj["GROUP_MENU_CODE"] = item.GROUP_MENU_CODE;
          obj["PARENT_CODE"] = item.PARENT_CODE;
          obj["GROUP_MENU_NAME"] = item.GROUP_MENU_NAME;
          obj["IS_VISIBLE"] = item.IS_VISIBLE === undefined || item.IS_VISIBLE === false ? false : true;
          obj["ORDER_BY"] = item.ORDER_BY;
          obj["VIEW_CLASS"] = item.VIEW_CLASS;
          obj['ID'] = item.ID;
          obj["VIEW_PAGE"] = item.VIEW_PAGE;
          obj["UPDATE_BY"] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
          return obj;
        });
      }
      return data;
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
          let newDatas = dataTable.map(item => {
            let returnValue = response.Payload.find(p => p.PARENT_CODE === item.PARENT_CODE && p.MENU_CODE === item.MENU_CODE);
            if (returnValue !== undefined) {
              item.ID = item.id = returnValue.ID;
              delete item.status;
            }
            return item;
          });
          this.setState({
            dataTable: newDatas,
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message,
              type: "success"
            }
          })
        } else {
          this.setState({
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message !== '' ? response.Message : 'Không có dữ liệu',
              type: "error"
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
              message: 'Không có dữ liệu được cập nhật',
              type: 'error'
            }
          });
        }
      });
  }

  handleDelete() {
    let url = window.root_url + `sa-menus/delete`;
    let { dataTable } = this.state;
    let clearedData = dataTable.filter(p => p.status !== "insert");
    this.setState({ dataTable: clearedData });
    let dataSend = dataTable.filter(p => p.isChecked === true && p.status !== "insert").map(item => {
      let obj = {};
      obj["ID"] = item.ID;
      return obj;
    });
    if (dataSend.length === 0) return;
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
      .then(data => {
        let temp = dataTable.filter(p => p.isChecked !== true);
        temp = temp.map((item, idx) => {
          item.STT = idx + 1;
          return item;
        });
        this.setState({
          dataTable: temp,
          alert: {
            isOpen: true,
            message: "Xóa dữ liệu thành công",
            duration: 2000,
            type: 'success',
          }
        })
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
              message: 'Xóa dữ liệu không thành công',
              type: 'error'
            }
          });
        }
      });
  }

  loadDataParent_Code() {
    let url = window.root_url + `sa-menus/viewParentID`;
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
      .then(response => {
        if (response.Status) {
          this.setState({
            dataParent_Code: response.Payload,
          })
        }
      })
      .catch(err => {
        console.log(err)
      });
  }
  //Thoilc(*Note)-Tìm kiếm tên danh mục
  filterGridView() {
    this.setState({ tableFilter: Object.assign({}, this.tableFilter) });
  }
  //--------------------------------------
  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Card>
          <CardContent>
            <Stack direction="column" spacing={1}>
              {/* <Stack direction="row" justifyContent="space-between" alignItems="flex-end"> */}
              <Grid item md={8}>
                <Stack mb={1} direction="row" justifyContent="space-between">
                  <Stack component="form" direction="row" spacing={1}>
                    <TextField
                      id="MENU_NAME"
                      label="Tìm theo tên danh mục"
                      onChange={(e) => {
                        this.tableFilter.MENU_NAME = e.target.value
                      }}
                    />
                    <Divider orientation="vertical" />
                    <Button type="button" variant="contained"
                      onClick={() => this.filterGridView()}>
                      Tìm kiếm
                    </Button>

                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button
                      className="m-btn m-secondary"
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        this.setState({
                          dialogAdd: {
                            isOpen: true,
                            data: null,
                            type: 0,
                          },
                        });
                      }}
                      startIcon={<AddIcon />}
                    >
                      Thêm dòng
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => this.handleSave()}
                      startIcon={<SaveIcon />}
                      color="success"
                    >
                      Lưu
                    </Button>

                    <Divider orientation="vertical" />
                    <Button
                      style={{ marginLeft: "10px" }}
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        this.setState({
                          confirmPopup: {
                            isOpen: true,
                            message: 'Bạn có muốn xóa dữ liệu?'
                          }
                        })
                      }}
                      startIcon={<DeleteIcon />}
                      color="error"
                    >
                      Xóa dòng
                    </Button>
                  </Stack>
                </Stack>

              </Grid>


              {/* </Stack> */}
            </Stack>
            <Divider sx={{ marginTop: 1 }} />
            <DataGrid
              className="m-table"
              rows={createRows(this.state.dataTable)
                // .filter(data => {
                //   if (data.MENU_NAME.includes(this.tableFilter.MENU_NAME)) {
                //     return data;
                //   } else {
                //     return false;
                //   }
                // })
              }
              rowHeight={35}
              columns={this.columns}
              columnVisibilityModel={{
                ID: false
              }}
              rowsPerPageOptions={[10, 25, 100]}
              sx={{ height: "70vh" }}
              onCellEditCommit={(params) => {
                let temp = [...this.state.dataTable];
                temp.map(data => {
                  if (params.id === data.id) {
                    data[params.field] = params.value;
                    if (data.status !== 'insert') {
                      data.status = 'update'
                    }
                  }
                  return true;
                });
                this.setState({ dataTable: temp })
              }}
            >
            </DataGrid>
            <ConfirmPopup
              dialog={this.state.confirmPopup}
              text={'XÁC NHẬN'}
              handleCloseDialog={(type) => {
                if (type === "agree") {
                  this.setState({
                    confirmPopup: {
                      isOpen: false
                    }
                  })
                  this.handleDelete();
                } else {
                  this.setState({
                    confirmPopup: {
                      isOpen: false
                    }
                  })
                }
              }
              }
            ></ConfirmPopup>
            <AddRows
              dialog={this.state.dialogAdd}
              handleCloseDialog={() => {
                this.setState({
                  dialogAdd: {
                    isOpen: false,
                    data: null,
                    type: 0,
                  },
                });
              }}
              handleAddRows={(rowCount) => this.handleAddRow(rowCount)}
            >
            </AddRows>
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
          </CardContent>
        </Card >
      </Box >
    )
  }
}
export default QuanLyMenu;