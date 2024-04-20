import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import * as moment from "moment";
import * as React from "react";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Stack,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
// import DecodeJWT from '../login/DecodeJWT'
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from "@mui/icons-material/Delete";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import ExportCSV from "../../components/caiDat/ExportCSV";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { DataGrid } from '@mui/x-data-grid';
import AddRows from '../../componentsCFS2/dialog/AddRows';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert eleTAX_CODEion={6} ref={ref} variant="filled" {...props} />;
});

class DanhMucKhachHang extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowCount: 1,
      selectedRow: {},
      dataTable: [],
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
      },
      confirmPopup: {
        isOpen: false,
      },
      CustomerType: [],
      data: {
        CUSTOMER_CODE: "",
        CUSTOMER_NAME: "",
        CUSTOMER_TYPE_CODE: "",
        ADDRESS: null,
        TAX_CODE: "",
        EMAIL: null,
        IS_ACTIVE: "",
      },
      tableFilter: {
        CUSTOMER_CODE: "",
      },
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
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
        width: 100,
        align: "center",
        headerAlign: "center",
        editable: false,
      },
      {
        field: "CUSTOMER_CODE", headerName: "Mã Khách Hàng",
        editable: true,
        flex: 1
      },
      {
        field: "CUSTOMER_NAME",
        headerName: "Tên Khách Hàng",
        editable: true,
        flex: 1,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "CUSTOMER_TYPE_CODE",
        headerName: "Loại Khách Hàng",
        editable: true,
        flex: 1,
        type: 'singleSelect',
        valueOptions: () => {
          const options = [];
          this.state.CustomerType?.map((type) => options.push(type))
          return options;
        }
      },
      {
        field: "ADDRESS",
        headerName: "Địa Chỉ",
        editable: true,
        flex: 1
      },
      {
        field: "TAX_CODE",
        headerName: "Mã Số Thuế",
        editable: true,
        flex: 1
      },
      {
        field: "EMAIL",
        headerName: "Email",
        editable: true,
        flex: 1
      },
      {
        field: "IS_ACTIVE",
        headerName: "Tình Trạng",
        type: 'singleSelect',
        editable: true,
        flex: 1,
        valueOptions: [{ label: 'Active', value: true }, { label: 'DeActive', value: false }],
        renderCell: (item) => {
          if (item.value === true) {
            item.value = 'Active'
          } else if (item.value === false) {
            item.value = 'DeActive'
          }
          return item.value;
        }
      },
      {
        field: "ID",
        headerName: "ID",
        editable: false,
      },
      {
        field: 'ACC_TYPE',
        headerName: 'HTTT',
        flex: 1,
        editable: true,
        type: 'singleSelect',
        valueOptions: [{ label: 'Thu ngay', value: 'CAS' }, { label: 'Thu sau', value: 'CRE' }],
        renderCell: (item) => {
          if (item.value === 'CAS') {
            item.value = 'Thu ngay'
          } else if (item.value === 'CRE') {
            item.value = 'Thu sau'
          }
          return item.value;
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
    const { dataTable } = this.state;
    let updateData = dataTable;
    updateData[idx]['isChecked'] = status;
    this.setState({
      dataTable: updateData
    })
  }

  handleAddRow(rowCount) {
    let { dataTable } = this.state;
    let newRow = [];
    for (let i = 0; i < rowCount; i++) {
      let newData = {
        ...this.state.data,
        id: dataTable.length + i + 'insert',
        STT: dataTable.length + i + 1,
        status: 'insert'
      }
      newRow.push(newData);
    }
    let mergeDataTable = [...newRow, ...dataTable].map((item, idx) => {
      item.id = idx;
      item.STT = idx + 1;
      return item;
    });
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

  componentDidMount() {
    this.handleViewData();
    this.handleLoadCustomerType();
  }

  handleViewData() {
    let url = window.root_url + `bs-customer/view`;
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
        if (data.length > 0) {
          let temp = this.createRows(data);
          this.setState({
            dataTable: temp,
            alert: {
              isOpen: true,
              type: "success",
              duration: 3000,
              message: "Nạp dữ liệu thành công!"
            },
          })
        }
        else {
          this.setState({
            dataTable: [],
            alert: {
              type: 'warning',
              message: 'Không tìm thấy dữ liệu!',
              duration: 3000,
              isOpen: true
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
              message: JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }

  handleLoadCustomerType() {
    let url = window.root_url + `bs-customer-type/getCustomerType`;
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
        let arr = [];
        if (data) {
          data.map(item => {
            return arr.push(item.CUSTOMER_TYPE_CODE);
          });
          this.setState({
            CustomerType: arr,
          })
        } else {
          return;
        }

      }).catch(err => {
        console.log(err)
      });
  }

  handleDelete() {
    let url = window.root_url + `bs-customer/delete`;
    let { dataTable } = this.state;
    let dataSend = dataTable.filter(p => p.isChecked === true && p.status !== "insert").map(item => {
      let obj = {};
      obj["ID"] = item.ID;
      return obj;
    });

    if (!dataSend.length) {
      let clearedData = dataTable.filter(p => p.isChecked !== true);
      clearedData = clearedData.map((item, i) => {
        item.STT = i + 1;
        return item;
      });
      this.setState({ dataTable: clearedData });
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
              message: response.Message !== '' ? response.Message : 'Không có dữ liệu',
              duration: 2000,
              type: 'error',
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
    let url = window.root_url + `/bs-customer/insertAndUpdate`;
    let { dataTable } = this.state;
    let checkColumn = {
      CUSTOMER_CODE: 'Mã Khách Hàng',
      CUSTOMER_NAME: 'Tên Khách Hàng',
      CUSTOMER_TYPE_CODE: 'Loại Khách Hàng',
      TAX_CODE: 'Mã Số Thuế'
    };
    let checkEmptySend = true;
    let arr = [];
    let dataSend = dataTable.filter(p => p.status === 'insert' || p.status === 'update').map(data => {
      data[data.status === 'insert' ? 'CREATE_BY' : 'UPDATE_BY'] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : null;
      if (!(data.IS_ACTIVE === true || data.IS_ACTIVE === false)) {
        checkEmptySend = false;
      }
      Object.keys(data).map((key) =>{
        if (!data[key]) {
          delete data[key];
        }
        return key;
      })
      Object.keys(checkColumn).map((key) => {
        return !data[key] ? arr.push(checkColumn[key]) : [];
      });
      return data;
    });
    if (arr.length > 0) {
      this.setState({
        alert: {
          isOpen: true,
          duration: 3000,
          message: arr.join(', ') + " không được để trống",
          type: "error"
        }
      })
      return;
    }
    if (!checkEmptySend) {
      this.setState({
        alert: {
          isOpen: true,
          duration: 3000,
          message: "Tình trạng không được phép để trống!",
          type: "error"
        }
      });
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
          let newDatas = dataTable.map((item, index) => {
            let returnValue = response.Payload.find(p => p.CUSTOMER_CODE === item.CUSTOMER_CODE && p.CUSTOMER_NAME === item.CUSTOMER_NAME);
            if (returnValue !== undefined) {
              item.id = index;
              item.ID = returnValue.ID
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

  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Card style={{ marginBottom: "12px" }}>
          <CardContent>
            <Grid container>
              <Grid item xs={12} spacing={2}>
                <Stack mb={1} direction="row" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>Tìm kiếm:</span>
                    <TextField
                      size="small"
                      id="tim-kiem"
                      onChange={(e) => {
                        this.setState({
                          tableFilter: {
                            CUSTOMER_CODE: e.target.value.trim(),
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
                    <ExportCSV csvData={this.state.dataTable} fileName="DM-Khach-Hang"></ExportCSV>
                    <Divider orientation="vertical" />
                    <Button
                      className="m-btn m-secondary"
                      type="button"
                      size="small"
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
                      variant="outlined"
                      onClick={() => this.handleSave()}
                      startIcon={<SaveIcon />}
                      size="small"
                      color="success"
                    >
                      Lưu
                    </Button>

                    <Divider orientation="vertical" />
                    <Button
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
                      size="small"
                      color="error"
                    >
                      Xóa dòng
                    </Button>
                  </Stack>
                </Stack>
                <Divider />
                <Grid item mt={1} md={12}>
                  <DataGrid
                    className="m-table"
                    rows={(this.state.dataTable)
                      .filter(data => data.CUSTOMER_CODE.toUpperCase().includes(this.state.tableFilter.CUSTOMER_CODE.toUpperCase()))
                    }
                    rowHeight={35}
                    columns={this.columns}
                    columnVisibilityModel={{
                      ID: false
                    }}
                    sx={{ height: "63vh" }}
                    onCellEditCommit={(params) => {
                      let temp = [...this.state.dataTable];
                      temp.map(data => {
                        if (params.id === data.id) {
                          typeof (params.value) !== "boolean"
                            ? (data[params.field] = params.value.trim())
                            : (data[params.field] = params.value)
                          if (data.status !== 'insert') {
                            data.status = 'update'
                          }
                        }
                        return true;
                      });
                      this.setState({ dataTable: temp })
                    }}
                    checkboxSelection
                    disableSelectionOnClick
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
        />
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
      </Box>
    );
  }
}
export default DanhMucKhachHang;
