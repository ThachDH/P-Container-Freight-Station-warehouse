import * as React from "react";
import {
  Button,
  Stack,
  Checkbox,
  Grid,
  TextField,
  Box,
  Card,
  Divider,
  CardContent,
  Autocomplete,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
} from "@mui/material";
import * as moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from '@mui/x-data-grid';
import FixedPageName from "../../componentsCFS2/fixedPageName";
import AddRows from "../../componentsCFS2/dialog/AddRows";
import ExportCSV from "../../components/caiDat/ExportCSV";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DecodeJWT from "../login/DecodeJWT";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initalData = {
  id: -1,
  Name: "",
  USER_GROUP_CODE: "",
  USER_GROUP_NAME: "",
  USER_NUMBER: "",
  USER_NAME: "",
  BIRTHDAY: "",
  ADDRESS: "",
  TELPHONE: "",
  EMAIL: "",
  IS_ACTIVE: false,
  REMARK: "",
};

class NguoiDung extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: initalData,
      dataTable: [],
      dataGrpCode: [],
      userGroup: [],
      isActive: 'all',
      isChecks: false,
      isStatus: '',
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
      },
      tableFilter: {
        Name: '',
      },
      searchField: {
        USER_GROUP_CODE: '',
        IS_ACTIVE: 'all',
      },
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.columns = [
      {
        field: "STT",
        headerName: "STT",
        editable: false,
        width: 100,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "USER_GROUP_CODE",
        headerName: "Nhóm tài khoản",
        flex: 1,
        align: "center",
        headerAlign: "center",
        editable: true,
        type: 'singleSelect',
        valueOptions: () => {
          const options = [];
          this.state.dataGrpCode?.map((type) => options.push({
            label: type.label,
            value: type.USER_GROUP_CODE
          }))
          return options;
        }
      },
      {
        field: "NotFound",
        headerName: "Mã cảng",
        flex: 1,
        align: "center",
        width: 80,
        headerAlign: "center",
        editable: true,
      },
      {
        field: "Name",
        headerName: "Tên đăng nhập",
        flex: 1,
        align: "center",
        headerAlign: "center",
        editable: true,
      },
      {
        field: "Pass",
        headerName: "Mật khẩu",
        flex: 1,
        align: "center",
        headerAlign: "center",
        editable: true,
        renderCell: (params) => {
          let dataChange = "*".repeat(params.value?.length);
          return dataChange;
        }
      },
      {
        field: "USER_NAME",
        headerName: "Họ tên",
        flex: 1,
        align: "center",
        headerAlign: "center",
        editable: true,
      },
      {
        field: "ADDRESS",
        headerName: "Địa chỉ",
        flex: 1,
        align: "center",
        headerAlign: "center",
        editable: true,
      }, {
        field: "TELPHONE",
        headerName: "SĐT",
        flex: 1,
        align: "center",
        headerAlign: "center",
        editable: true,
      },
      {
        field: "EMAIL",
        headerName: "Email",
        flex: 1,
        align: "center",
        headerAlign: "center",
        editable: true,
      },
      {
        field: "IS_ACTIVE",
        headerName: "Trạng thái",
        flex: 1,
        align: "center",
        headerAlign: "center",
        type: 'actions',
        editable: true,
        getActions: (params) => {
          // return params.value;
          return [
            <Checkbox
              onChange={(event) => {
                // this.handleCheckbox(e, params);
                this.rowSelectHandle(params.row.STT - 1, event.target.checked);
              }}
              checked={
                params.row.IS_ACTIVE === true ? true : false
              }
            ></Checkbox>
          ];

        }
      },
    ];
    this.createRows = (data) => data.map((row, index) => ({
      id: index,
      STT: index + 1,
      ...row
    }),
    );
  }

  rowSelectHandle(idx, status) {
    let updateData = this.state.dataTable;
    if (updateData[idx]['status'] !== 'insert') {
      updateData[idx]['status'] = 'update';
    }
    updateData[idx]['IS_ACTIVE'] = status;
    this.setState({
      ...this.state,
      dataTable: updateData
    });
  }

  handleAddRow(rowCount) {
    let { dataTable } = this.state;
    let newRow = [];
    for (let i = 0; i < rowCount; i++) {
      let newData = {
        ...this.state.tableFilter,
        id: dataTable.length + i + 'insert',
        STT: dataTable.length + i + 1,
        status: 'insert',
      }
      newRow.push(newData);
    }
    let mergeDataTable = [...dataTable, ...newRow];
    this.setState({
      dataTable: mergeDataTable,
      alert: {
        isOpen: true,
        type: "success",
        duration: 2000,
        message: "Thêm dòng thành công",
      }
    })
  }

  handleDelete() {
    let url = window.root_url + `sa-users/delete`;
    let { dataTable } = this.state;
    let clearedData = dataTable.filter(p => p.status !== "insert");
    this.setState({ dataTable: clearedData });
    let dataSend = dataTable.filter(p => p.isChecked === true && p.status !== "insert").map(item => {
      let obj = {};
      obj["ID"] = item.ID;
      obj['IS_ACTIVE'] = item.IS_ACTIVE;
      obj['USER_GROUP_CODE'] = DecodeJWT(JSON.parse(localStorage.getItem("userInfo")).token).roles;
      return obj;
    });
    if (dataSend.length === 0) return;

    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
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
      .then(response => {
        if (response.Status) {
          let temp = dataTable.filter(p => p.isChecked !== true);
          temp = temp.map((item, idx) => {
            item.STT = idx + 1;
            return item;
          });
          this.setState({
            dataTable: temp,
            alert: {
              isOpen: true,
              message: response.Message,
              duration: 2000,
              type: 'success',
            }
          })
        } else {
          this.setState({
            alert: {
              isOpen: true,
              message: response.Message,
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
    return true;
  }

  handleFilterUser() {
    let url = window.root_url + `sa-users/getUser`;
    let dataSend = {
      USER_GROUP_CODE: this.state.searchField.USER_GROUP_CODE?.split(':')[0],
      IS_ACTIVE: this.state.searchField.IS_ACTIVE,
    }
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
          let temp = this.createRows(response.Payload)
          this.setState({
            dataTable: temp,
            alert: {
              isOpen: true,
              message: response.Message,
              type: 'success',
              duration: 2000,
            }
          })
        } else {
          this.setState({
            dataTable: [],
            alert: {
              isOpen: true,
              message: response.Message,
              type: 'error',
              duration: 2000,
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

  handleSave() {
    let url = window.root_url + `sa-users/signupAndUpdate`;
    let { dataTable } = this.state;
    let arr = [];
    let checkColumn = {
      Name: "Tên đăng nhập",
      USER_NAME: "Tên người dùng",
      USER_GROUP_CODE: 'Mã nhóm tài khoản',
    };
    let dataSend = dataTable.filter(p => p.status === 'insert' || p.status === 'update').map(data => {
      data[data.status === 'insert' ? 'CREATE_BY' : 'UPDATE_BY'] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
      data.IS_ACTIVE = (data.IS_ACTIVE === undefined || data.IS_ACTIVE === false) ? false : true;
      Object.keys(checkColumn).map((key) => {
        return !data[key] ? arr.push(checkColumn[key]) : [];
      });
      return data;
    });
    if (arr.length) {
      this.setState({
        alert: {
          isOpen: true,
          duration: 3000,
          message: "Chưa nhập đầy đủ các trường dữ liệu",
          type: "error"
        }
      })
      return;
    }

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
          let newDatas = dataTable.map((item) => {
            let returnValue = response.Payload.find(p => p.Name === item.Name.toUpperCase());
            if (returnValue !== undefined) {
              // item.id = returnValue.ID;
              item.ID = returnValue.ID;
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

  //Thoilc(*Note)-Lifecycle
  componentDidMount() {
    this.loadUser();
    this.loadGroup();
  }

  //Thoilc(*Note)-View ds người dùng
  loadUser() {
    let url = window.root_url + `sa-users/view`;
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
      .then(data => {
        if (data.Status) {
          let newData = data.Payload.User.map(item => {
            item.BIRTHDAY = moment(item.BIRTHDAY).format("DD/MM/YYYY HH:mm:ss");
            return item;
          });
          let arrGroupUser = [];
          let arrUser = this.createRows(newData);
          data.Payload.GroupUser.map(item => {
            return arrGroupUser.push({
              USER_GROUP_CODE: item.USER_GROUP_CODE,
              label: item.USER_GROUP_NAME,
              USER_GROUP_NAME: item.USER_GROUP_NAME,
            });
          });

          this.setState({
            dataTable: arrUser,
            dataGrpCode: arrGroupUser,
            alert: {
              isOpen: true,
              type: "success",
              message: "Nạp dữ liệu thành công!"
            },
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

  loadGroup() {
    let url = window.root_url + `sa-usergroups/view`;
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
      .then(data => {
        let temp = data.Payload.map(item => {
          return `${item.USER_GROUP_CODE}: ${item.USER_GROUP_NAME}`
        })
        this.setState({
          userGroup: temp
        })
      }
      )
  }

  //------------------------------------------
  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Card style={{ marginBottom: "12px" }} >
          <CardContent>
            <Grid>
              <Divider textAlign="center">
                <span className="m-filter-title">Lọc dữ liệu</span>
              </Divider>
            </Grid>
            <Stack direction='row' spacing={2} mt={'12px'}>
              <Autocomplete
                sx={{ width: '450px' }}
                id="tags-outlined"
                options={this.state.userGroup || []}
                size="small"
                onChange={(event, listSelected) => {
                  this.setState({
                    searchField: {
                      ...this.state.searchField,
                      USER_GROUP_CODE: listSelected
                    }
                  })
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    readOnly
                    label='Nhóm người dùng'
                  />
                )}
              />
              <Divider flexItem orientation="vertical" />
              <FormControl>
                <RadioGroup
                  sx={{ marginLeft: "2vh" }}
                  name="filterType"
                  row
                  value={this.state.isActive}
                  onChange={(e) => {
                    this.setState({
                      isActive: e.target.value
                    })
                  }} >
                  <FormControlLabel
                    value="all"
                    control={
                      <Radio
                        onChange={(event) => {
                          this.setState({
                            searchField: {
                              ...this.state.searchField,
                              IS_ACTIVE: 'all'
                            },
                            value: 1,
                            type: 1,
                          })
                        }}
                      />}
                    label="Tất cả" />
                  <FormControlLabel
                    value="active"
                    control={
                      <Radio
                        onChange={(event) => {
                          this.setState({
                            value: 2,
                            type: 2,
                            searchField: {
                              ...this.state.searchField,
                              IS_ACTIVE: true
                            },
                          })
                        }}
                      />}
                    label="Hoạt động" />
                  <FormControlLabel
                    value="inactive"
                    control={
                      <Radio
                        onChange={(event) => {
                          this.setState({
                            value: 3,
                            type: 3,
                            searchField: {
                              ...this.state.searchField,
                              IS_ACTIVE: false
                            },
                          })
                        }} />} label="Không hoạt động" />
                </RadioGroup>
              </FormControl>
              <Divider flexItem orientation="vertical" />
              <Button
                type="button"
                variant="contained"
                onClick={() => this.handleFilterUser()}
              >
                Nạp dữ liệu
              </Button>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Grid container>
              <Grid item xs={12} spacing={2}>
                <Stack mb={1} direction="row" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>Tìm kiếm:</span>
                    <TextField
                      size='small'
                      id="tim-kiem"
                      onChange={(e) => {
                        this.setState({
                          tableFilter: {
                            Name: e.target.value,
                          }
                        });
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon
                              style={{ cursor: "default" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <ExportCSV csvData={this.state.dataTable} fileName="Users"></ExportCSV>
                    <Divider orientation="vertical" />
                    <Button
                      className="m-btn m-secondary"
                      type="button"
                      size='small'
                      variant="outlined"
                      onClick={() => {
                        this.setState({
                          dialog: {
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
                      size='small'
                      variant="outlined"
                      onClick={() => this.handleDelete()}
                      startIcon={<DeleteIcon />}
                      color="error"
                    >
                      Xóa dòng
                    </Button>
                    <Divider orientation="vertical" />
                    <Button
                      type="button"
                      size='small'
                      variant="outlined"
                      onClick={() => this.handleSave()}
                      startIcon={<SaveIcon />}
                      color="success"
                    >
                      Lưu
                    </Button>
                  </Stack>
                </Stack>
                <Divider />
                <Grid item mt={1} md={12}>
                  <DataGrid
                    className="m-table"
                    rows={(this.state.dataTable)
                      .filter(data => data.Name.includes(this.state.tableFilter.Name.toUpperCase())
                        || data.Name.includes(this.state.tableFilter.Name.toLowerCase())
                      )}
                    rowHeight={35}
                    columns={this.columns}
                    columnVisibilityModel={{
                      ID: false
                    }}
                    // isCellEditable={(params) => {
                    //   if (params.field === 'Name') {
                    //     if (params.value !== '' && params.row.status !== 'insert') {
                    //       return false;
                    //     } else {
                    //       return true;
                    //     }
                    //   } else {
                    //     return true;
                    //   }
                    // }}
                    sx={{ height: "63vh" }}
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
                    // checkboxSelection
                    // disableSelectionOnClick
                    onSelectionModelChange={(ids) => {
                      let { dataTable } = this.state;
                      dataTable.map(item => item['isChecked'] = ids.indexOf(item.id) >= 0);
                      this.setState({
                        dataTable: dataTable
                      })
                    }}
                  >
                  </DataGrid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <AddRows
          dialog={this.state.dialog}
          handleCloseDialog={() => {
            this.setState({
              dialog: {
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
      </Box >

    );
  }
}

export default NguoiDung;

