
import * as moment from "moment";
import * as React from "react";
import SearchIcon from '@mui/icons-material/Search';
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Stack,
  Autocomplete,
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
import AddRows from "../../componentsCFS2/dialog/AddRows";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class MaBieuCuoc
  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      confirmPopup: {
        isOpen: false,
      },
      rowsPerPage: 10,
      dataTable: [],
      dataUnit: [],
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
      },
      dialogUnit: {
        isOpen: false,
        data: null,
        type: 0,
      },
      dialogAlert: {
        isOpen: false,
        data: null,
        type: 0,
      },
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
      data: {
        REVENUE_ACC: '',
        TRF_CODE: '',
        TRF_DESC: '',
        INV_UNIT: '',
      },
      searchField: {
        TRF_CODE: '',
        TRF_DESC: '',
        INV_UNIT: '',
      },
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 6000,
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
        field: "TRF_CODE",
        headerName: "Mã Biểu Cước",
        editable: true,
        flex: 1
      },
      {
        field: "TRF_DESC",
        headerName: "Diễn Giải",
        editable: true,
        flex: 1
      },
      {
        field: "INV_UNIT",
        headerName: "Đơn vị tính",
        editable: true,
        flex: 1,
        type: "singleSelect",
        renderEditCell: (params) => {
          let CodeItem = '';
          return [
            <Autocomplete
              style={{ width: "100%" }}
              id="clear-on-escape"
              clearOnEscape
              options={this.state.dataUnit || []}
              onChange={(e, value) => {
                if (value) {
                  params.row.INV_UNIT = value;
                  CodeItem = value;
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  params.formattedValue = CodeItem;
                }
              }}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  multiline
                  {...params} variant="outlined" />
              )}
            />
          ]
        }
      },
      {
        field: "REVENUE_ACC",
        headerName: "TK doanh thu",
        editable: true,
        flex: 1
      },
      {
        field: "VAT_CHK",
        headerName: "VAT",
        type: 'boolean',
        editable: true,
        width: 150,
        getActions: (params) => {
          return params.value;
        }
      },
      {
        field: "ID",
        headerName: "ID",
        editable: false,
      },
    ];
    this.createRows = (data) => data.map((row, index) => ({
      id: index,
      STT: index + 1,
      ...row
    }),
    );
  }

  handleAddRow(rowCount) {
    let { dataTable } = this.state;
    let newRow = [];
    for (let i = 0; i < rowCount; i++) {
      let newData = {
        id: dataTable.length + i + 1,
        STT: dataTable.length + i + 1,
        ...this.state.data,
        status: 'insert',
      }
      newRow.push(newData);
    };
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
    this.handleTable();
    this.loadDataUnit();
  }

  handleTable() {
    let url = window.root_url + `trf-codes/view`;
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
        let temp = this.createRows(data);
        this.setState({
          dataTable: temp,
          alert: {
            isOpen: true,
            duration: 3000,
            type: "success",
            message: "Nạp dữ liệu thành công",
          }
        });
        console.log(this.state.dataTable)

      }).catch(err => {
        console.log(err)
      });
  }

  handleDelete() {
    let url = window.root_url + `trf-codes/delete`;
    let { dataTable } = this.state;
    let clearedData = dataTable.filter(p => p.status !== "insert");
    this.setState({ dataTable: clearedData });
    let dataSend = dataTable.filter(p => p.isChecked === true).map(item => {
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

  handleSave() {
    let url = window.root_url + `trf-codes/insertAndUpdate`;
    let { dataTable } = this.state;
    let dataSend = [];
    dataTable.map((data) => {
      if (data.status === "insert") {
        let temp = dataTable.filter(item => item.status === "insert")
        dataSend = temp.map(item => {
          let obj = {};
          obj['status'] = item.status;
          obj["TRF_CODE"] = item.TRF_CODE;
          obj["TRF_DESC"] = item.TRF_DESC;
          obj["VAT_CHK"] = item.VAT_CHK === true ? 1 : 0;
          obj["INV_UNIT"] = item.INV_UNIT;
          obj["REVENUE_ACC"] = item.REVENUE_ACC;
          obj["CREATE_BY"] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
          return obj;
        });
      } else {
        let temp = dataTable.filter(p => p.status === "update")
        dataSend = temp.map(item => {
          let obj = {};
          obj['ID'] = item.ID;
          obj['status'] = item.status;
          obj["TRF_CODE"] = item.TRF_CODE;
          obj["TRF_DESC"] = item.TRF_DESC;
          obj["VAT_CHK"] = item.VAT_CHK === true ? 1 : 0;
          obj["REVENUE_ACC"] = item.REVENUE_ACC;
          obj["INV_UNIT"] = item.INV_UNIT;
          obj["UPDATE_BY"] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
          return obj;
        });
      }
      return data;
    })

    if (dataSend.length === 0) {
      this.setState({
        alert: {
          isOpen: true,
          message: "Dữ liệu chưa được cập nhật",
          duration: 2000,
          type: "warning"
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
            let returnValue = response.Payload.find(p => p.TRF_CODE === item.TRF_CODE && p.TRF_DESC === item.TRF_DESC);
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
              message: response.Message,
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

  loadDataUnit() {
    let url = window.root_url + `bs-units/viewCode`;
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
            return arr.push(item.UNIT_CODE);
          });
          this.setState({
            dataUnit: arr,
          })
        } else {
          return;
        }

      })
      .catch(err => {
        console.log(err)
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
              <Grid item xs={12}>
                <Stack mb={1} direction="row" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>Tìm kiếm:</span>
                    <TextField
                      size="small"
                      id="tim-kiem"
                      onChange={(e) => {
                        this.setState({
                          searchField: {
                            TRF_CODE: e.target.value,
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
                    <ExportCSV csvData={this.state.dataTable} fileName="DS-khach-hang"></ExportCSV>
                    <Divider orientation="vertical" />
                    <Button
                      size="small"
                      className="m-btn m-secondary"
                      type="button"
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
                      }
                      }
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
                    className="m-table"
                    rows={(this.state.dataTable)
                      .filter(data => data.TRF_CODE.toUpperCase().includes(this.state.searchField.TRF_CODE.toUpperCase()))
                    }
                    rowHeight={35}
                    columns={this.columns}
                    columnVisibilityModel={{
                      ID: false
                    }}
                    sx={{ height: "63vh" }}
                    onCellEditCommit={(params) => {
                      let temp = [...this.state.dataTable];
                      if (params.field === "INV_UNIT") {
                        temp.map(data => {
                          if (params.id === data.id) {
                            data[params.value] = params.formattedValue;
                            if (data.status !== 'insert') {
                              data.status = 'update'
                            }
                          }
                          return true;
                        })
                      } else {
                        temp.map(data => {
                          if (params.id === data.id) {
                            data[params.field] = params.value;
                            if (data.status !== 'insert') {
                              data.status = 'update'
                            }
                          }
                          return true;
                        });
                      }

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
        {/* <DonViTinh
          dialog={this.state.dialogUnit}
        ></DonViTinh> */}

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
export default MaBieuCuoc
  ;