import * as moment from "moment";
import * as React from "react";
import SearchIcon from '@mui/icons-material/Search';
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  Box,
  Button,
  Stack,
  Divider,
  Card,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from "@mui/icons-material/Delete";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import ExportCSV from "../../components/caiDat/ExportCSV";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { DataGrid } from '@mui/x-data-grid';
import MaHopDong from "../../componentsCFS2/dialog/MaHopDong";
import AddRows from "../../componentsCFS2/dialog/AddRows";
import MaKhachHang from "../../componentsCFS2/dialog/MaKhachHang";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class HopDongThue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
      customerCode: {},
      dataTable: [],
      dataWAREHOUSE_CODE: [],
      dataBlock: [],
      dialogAdd: {
        isOpen: false,
        data: null,
        type: 0,
      },
      dialogMaHD: {
        isOpen: false,
        data: null,
        type: 0,
      },
      dialogMaKH: {
        isOpen: false,
        data: null,
        type: 0,
      },
      dialogAlert: {
        isOpen: false,
        data: null,
        type: 0,
      },
      confirmPopup: {
        isOpen: false,
      },
      searchField: {
        WAREHOUSE_CODE: "",
        BLOCK: "",
        ACREAGE: 0,
      },
      dataInput: {
        CUSTOMER_CODE: "",
        CONTRACT_CODE: "",
        CONTRACT_NAME: "",
        NOTE: "",
        ID: "",
        FROM_DATE: null,
        TO_DATE: null,
        status: 'insert',

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
      search: {
        fromDay: null,
        toDay: null,
      },
    };
    this.columns = [

      {
        field: "STT",
        headerName: "STT",
        width: 100,
      },
      {
        field: "WAREHOUSE_CODE",
        headerName: "Mã Kho",
        editable: true,
        flex: 1,
        type: "singleSelect",
        valueOptions: () => {
          const options = [];
          this.state.dataWAREHOUSE_CODE?.map((item) => options.push(item.WAREHOUSE_CODE))
          return options;
        }
      }, {
        field: "BLOCK",
        headerName: "Block",
        editable: true,
        flex: 1,
        type: "singleSelect",
        valueOptions: () => {
          const options = [];
          this.state.dataBlock?.map((item) => options.push(item))
          return options;
        }
      }, {
        field: "ACREAGE",
        headerName: "Diện tích kho",
        editable: true,
        flex: 1,
      },
      {
        field: "ID",
        headerName: "ID",
        editable: false,
      },
    ];

    this.createRows = (data) => data.Payload.map((row, index) => ({
      STT: index + 1,
      id: index,
      ...row
    }),
    );
  }
  handleAddRow(rowCount) {
    let { dataTable } = this.state;
    let newRow = [];
    for (let i = 0; i < rowCount; i++) {
      let newData = {
        ...this.state.searchField,
        id: dataTable.length + i + 1,
        STT: dataTable.length + i + 1,
        status: 'insert',
        isCreate: true,
      }
      newRow.push(newData);
    }
    let mergeDataTable = [...dataTable, ...newRow];
    this.setState({
      dataTable: mergeDataTable
    })
  }

  rowSelectHandle(idx, status) {
    const { dataTable } = this.state;
    let updateData = dataTable;
    updateData[idx]['isChecked'] = status;
    this.setState({
      dataTable: updateData
    })
  }

  handleTable(data) {
    let url = window.root_url + `bs-contract-blocks/getItem`;
    let dataSend = {
      CONTRACT_CODE: data.CONTRACT_CODE,
      CREATE_DATE: [moment(data.FROM_DATE).format("DD/MM/YYYY"), moment(data.TO_DATE).format("DD/MM/YYYY")],
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
      .then(data => {
        if (data.Payload.length > 0) {
          let temp = this.createRows(data.Payload);
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
          });
        }
        this.loadDataWAREHOUSE_CODE();
        this.loadDataBlock();
      })
      .catch(err => {
        console.log(err);
      })
  }

  handleDelete() {
    let url = window.root_url + `bs-contract-blocks/delete`;
    let { dataTable } = this.state;
    let dataSend = dataTable.filter(p => p.isChecked === true && p.status !== "insert").map(item => {
      let obj = {};
      obj["ID"] = item.ID;
      return obj;
    });

    if (!dataSend.length) {
      let clearedData = dataTable.filter(p => p.status === "insert" && p.isChecked !== true);
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
  handleSaveHeader() {
    let url = window.root_url + `bs-contracts/insertAndUpdate`;
    let dataSend = {};
    if (this.state.dataInput.ID === "") {
      dataSend = {
        CONTRACT_CODE: this.state.dataInput.CONTRACT_CODE,
        CONTRACT_NAME: this.state.dataInput.CONTRACT_NAME,
        CUSTOMER_CODE: this.state.customerCode.CUSTOMER_CODE,
        NOTE: this.state.dataInput.NOTE,
        FROM_DATE: this.state.search.fromDay,
        TO_DATE: this.state.search.toDay,
        status: 'insert',
        CREATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
      }
    } else {
      dataSend = {
        ID: this.state.dataInput.ID,
        CONTRACT_CODE: this.state.dataInput.CONTRACT_CODE,
        CONTRACT_NAME: this.state.dataInput.CONTRACT_NAME,
        CUSTOMER_CODE: this.state.dataInput.CUSTOMER_CODE,
        NOTE: this.state.dataInput.NOTE,
        FROM_DATE: this.state.search.fromDay === null ? this.state.dataInput.FROM_DATE : moment(this.state.search.fromDay, "DD/MM/YYYY").format('YYYY-MM-DD HH:mm:ss'),
        TO_DATE: this.state.search.toDay === null ? this.state.dataInput.TO_DATE : moment(this.state.search.toDay, "DD/MM/YYYY").format('YYYY-MM-DD HH:mm:ss'),
        status: 'update',
        UPDATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
      }
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
          let newDatas = this.state.dataTable.map(item => {
            let returnValue = response.Payload.find(p => p.CONTRACT_CODE === item.CONTRACT_CODE && p.CUSTOMER_CODE === item.CUSTOMER_CODE);
            if (returnValue !== undefined) {
              item.ID = item.id = returnValue.ID;
              delete item.status;
            }
            return item;
          });
          this.setState({
            dataTable: newDatas,
            search: { fromDay: null, toDay: null },
            customerCode: { CUSTOMER_CODE: "" },
            dataInput: {
              CONTRACT_CODE: "",
              CONTRACT_NAME: "",
              NOTE: "",
            },
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

  handleSave() {
    let url = window.root_url + `bs-contract-blocks/insertAndUpdate`;
    let { dataTable } = this.state;
    let dataSend = [];
    let arr = [];
    dataTable.map(data => {
      if (data.status === "insert") {
        let temp = dataTable.filter(item => item.status === "insert")
        dataSend = temp.map(item => {
          let obj = {};
          obj['status'] = item.status;
          obj["CONTRACT_CODE"] = this.state.dataInput.CONTRACT_CODE;
          obj["WAREHOUSE_CODE"] = item.WAREHOUSE_CODE;
          obj["BLOCK"] = item.BLOCK;
          obj["ACREAGE"] = item.ACREAGE;
          obj["CREATE_BY"] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
          return obj;
        });
      } else {
        let temp = dataTable.filter(p => p.status === "update")
        dataSend = temp.map(item => {
          let obj = {};
          obj['ID'] = item.ID;
          obj['status'] = item.status;
          obj["WAREHOUSE_CODE"] = item.WAREHOUSE_CODE;
          obj["BLOCK"] = item.BLOCK;
          obj["ACREAGE"] = item.ACREAGE;
          obj["UPDATE_BY"] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
          return obj;
        });
      }
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
            let returnValue = response.Payload.find(p => p.WAREHOUSE_CODE === item.WAREHOUSE_CODE && p.BLOCK === item.BLOCK);
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

  loadDataWAREHOUSE_CODE() {
    let url = window.root_url + `bs-warehouse/view`;
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
        this.setState({
          dataWAREHOUSE_CODE: data.Payload,
        })
      })
      .catch(err => {
        console.log(err)
      });
  }

  loadDataBlock() {
    let url = window.root_url + `bs-blocks/filterBlock`;
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
        this.setState({
          dataBlock: data.Payload,
        })
      })
      .catch(err => {
        console.log(err)
      });
  }

  //-----------------------------------
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
              <Grid item xs={12} spacing={2} >
                <Stack direction="row" spacing={8} gap="6%" >
                  <Stack direction="column" spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <span style={{ width: "120px", fontWeight: "bold", color: "black" }} >Mã Hợp Đồng:</span>
                      <TextField
                        size="small"
                        id="Ma-Hop-Dong"
                        fullWidth
                        placeholder="Mã Hợp Đồng"
                        value={(this.state.dataInput.CONTRACT_CODE)}
                        onChange={(e) => {
                          this.setState({
                            dataInput: {
                              ...this.state.dataInput, CONTRACT_CODE: e.target.value, status: 'insert'
                            }
                          })
                        }}
                        InputProps={{
                          readOnly: this.state.dataInput.ID !== "" ? true : false,
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchIcon
                                style={{ cursor: "default" }}
                                onClick={() =>
                                  this.setState({
                                    dialogMaHD: {
                                      isOpen: true,
                                      data: null,
                                      type: 0,
                                    },
                                  })
                                }
                              />
                              <HighlightOffIcon style={{ cursor: "default" }}
                                onClick={() =>
                                  this.setState({
                                    dataTable: [],
                                    search: { fromDay: null, toDay: null },
                                    customerCode: { CUSTOMER_CODE: "" },
                                    dataInput: {
                                      CONTRACT_CODE: "",
                                      CONTRACT_NAME: "",
                                      NOTE: "",
                                    },
                                  })
                                }
                              />

                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <span style={{ width: "120px", fontWeight: "bold", color: "black" }} >Tên Hợp Đồng:</span>
                      <TextField
                        size="small"
                        id="Ten-Hop-Dong"
                        fullWidth
                        placeholder="Tên Hợp Đồng"
                        onChange={(e) => {
                          if (this.state.dataInput.ID !== null) {
                            this.setState({
                              dataInput: {
                                ...this.state.dataInput, CONTRACT_NAME: e.target.value, status: 'insert'
                              }
                            })
                          }

                        }
                        }
                        value={(this.state.dataInput.CONTRACT_NAME)}
                      />
                    </Stack>
                  </Stack>
                  <Stack direction="column" spacing={1} >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <span style={{ width: "130px", fontWeight: "bold", color: "black" }} >Mã Khách Hàng:</span>
                      <TextField
                        size="small"
                        id="Ma-Khach-Hang"
                        fullWidth
                        placeholder="Mã Khách Hàng"
                        onChange={(e) => {
                          this.setState({
                            dataInput: { ...this.state.dataInput, CUSTOMER_CODE: e.target.value, status: 'insert' }
                          })
                        }}

                        value={(this.state.customerCode.CUSTOMER_CODE) || (this.state.dataInput.CUSTOMER_CODE) || (this.state.customerCode.CUSTOMER_CODE)}

                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchIcon
                                style={{ cursor: "default" }}
                                onClick={() =>
                                  this.setState({
                                    dialogMaKH: {
                                      isOpen: true,
                                      data: null,
                                      type: 0,
                                    },
                                  })
                                }
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <span style={{ width: "130px", fontWeight: "bold", color: "black" }} >Ghi Chú:</span>
                      <TextField
                        size="small"
                        id="Ghi-Chu"
                        fullWidth
                        placeholder="Ghi Chú"
                        value={(this.state.dataInput.NOTE)}

                        onChange={(e) => {
                          if (this.state.dataInput.ID !== null) {
                            this.setState({
                              dataInput: {
                                ...this.state.dataInput, NOTE: e.target.value, status: 'insert'
                              }
                            })
                          }

                        }
                        }
                      />
                    </Stack>
                  </Stack>
                  <Stack direction="column" spacing={1} style={{ marginLeft: "auto", }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <span style={{ width: "120px", fontWeight: "bold", color: "black" }} >Từ Ngày:</span>
                        <DatePicker
                          label="Từ ngày"
                          inputFormat="DD/MM/YYYY"
                          value={(
                            this.state.search.fromDay === null
                              ? this.state.search.fromDay
                              : moment(this.state.search.fromDay, "DD/MM/YYYY")
                          ) || (this.state.dataInput.FROM_DATE) || (this.state.search.fromDay)
                          }
                          onChange={(newValue) => {
                            if (this.state.dataInput.ID !== null) {
                              this.setState({
                                search: {
                                  ...this.state.search,
                                  fromDay: moment(newValue).format("DD/MM/YYYY"),
                                },
                              })
                            }

                          }
                          }
                          renderInput={(params) => <TextField size="small" {...params} />}
                        />
                      </LocalizationProvider>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <span style={{ width: "120px", fontWeight: "bold", color: "black" }} >Đến Ngày:</span>
                        <DatePicker
                          label="đến ngày"
                          inputFormat="DD/MM/YYYY"
                          value={(
                            this.state.search.toDay === null
                              ? this.state.search.toDay
                              : moment(this.state.search.toDay, "DD/MM/YYYY")
                          ) || (this.state.dataInput.TO_DATE) || (this.state.search.toDay)
                          }
                          onChange={(newValue) => {
                            if (this.state.dataInput.ID !== null) {
                              this.setState({
                                search: {
                                  ...this.state.search,
                                  toDay: moment(newValue).format("DD/MM/YYYY"),
                                },
                              })
                            }

                          }
                          }
                          renderInput={(params) => <TextField size="small" {...params} />}
                        />
                      </LocalizationProvider>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction="row">
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => { this.handleSaveHeader() }}
                    startIcon={<SaveIcon />}
                    color="primary"
                    style={{ marginLeft: "auto", marginTop: "9px" }}
                  >Lưu dữ liệu </Button>
                </Stack>
              </Grid>
            </Grid>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Grid container>
              <Grid item xs={12} spacing={2}>
                <Stack mb={1} direction="row" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span  >Tìm kiếm:</span>
                    <TextField
                      size="small"
                      id="tim-kiem"
                      onChange={(e) => {
                        this.setState({ searchField: { WAREHOUSE_CODE: e.target.value } })
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
                    <ExportCSV csvData={this.state.dataTable} fileName="DM-Hop-Dong"></ExportCSV>
                    <Divider flexItem orientation="vertical" />
                    <Button
                      size="small"
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
                      Thêm BLOCK
                    </Button>
                    <Button
                      size="small"
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
                      size="small"
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
                <Divider />
                <Grid item mt={1} md={12}>
                  <DataGrid
                    hideFooterSelectedRowCount={true}
                    className="m-table"
                    rows={(this.state.dataTable)
                      .filter(data => data.WAREHOUSE_CODE.toUpperCase().includes(this.state.searchField.WAREHOUSE_CODE.toUpperCase()))

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
                          data[params.field] = params.value;
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
        <MaHopDong
          dialog={this.state.dialogMaHD}
          handleLoadData={(data) => {
            this.setState({
              dataInput: data,
              dialogMaHD: {
                isOpen: false,
                data: null,
                type: 0,
              },
            })
            this.handleTable(data);
          }}
          handleCloseDialog={(data) => {
            this.setState({
              dialogMaHD: {
                isOpen: false,
                data: null,
                type: 0,
              },
            })
          }}
        >
        </MaHopDong>
        <MaKhachHang
          dialog={this.state.dialogMaKH}
          handleCloseDialog={(data) => {
            this.setState({
              customerCode: data,
              dialogMaKH: {
                isOpen: false,
                data: null,
                type: 0,
              },
            })

          }}
        ></MaKhachHang>
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
      </Box>
    );
  }
}
HopDongThue.defaultProps = { multiple: true };
export default HopDongThue;