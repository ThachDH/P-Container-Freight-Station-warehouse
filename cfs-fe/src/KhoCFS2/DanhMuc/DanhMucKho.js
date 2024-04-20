import * as moment from "moment";
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import * as React from "react";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Stack,
  Checkbox,
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

class DanhMucKho extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmPopup: {
        isOpen: false,
      },
      page: 0,
      rowsPerPage: 10,
      dataTable: [],
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
      },
      dialogAlert: {
        isOpen: false,
        data: null,
        type: 0,
      },
      searchField: {
        WAREHOUSE_CODE: ""
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
        field: "Action",
        headerName: "Chọn",
        type: "actions",
        width: 80,
        getActions: (params) => {
          return [
            <Checkbox
              onChange={(e) => {
                this.rowSelectHandle(params.row.STT - 1, e.target.checked);
              }}
              checked={
                params.row.isChecked
              }
            ></Checkbox>
          ];
        }
      },
      {
        field: "STT",
        headerName: "STT",
        editable: false,
        width: 100,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "WAREHOUSE_CODE",
        headerName: "Mã Kho",
        editable: true,
        flex: 1

      },
      {
        field: "WAREHOUSE_NAME",
        headerName: "Tên Kho",
        editable: true,
        flex: 1

      },
      {
        field: "ACREAGE",
        headerName: "Diện Tích kho",
        type: 'number',
        headerAlign: "center",
        align: "center",
        editable: true,
        flex: 1

      },
      {
        field: "ID",
        headerName: "ID",
        editable: false,
      },
    ];

    this.createRows = (data) => data.map((row, index) => ({
      id: row.ID,
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
        id: "insert" + dataTable.length + i + 1,
        STT: dataTable.length + i + 1,
        WAREHOUSE_CODE: "",
        WAREHOUSE_NAME: "",
        ACREAGE: "",
        status: 'insert',
      }
      newRow.push(newData);
    }
    let mergeDataTable = [...dataTable, ...newRow];
    this.setState({
      dataTable: mergeDataTable,
      alert: {
        isOpen: true,
        message: "Thêm dòng thành công",
        type: "success",
        duration: 2000,

      }
    })
  }

  handleDelete() {
    let url = window.root_url + `bs-warehouse/delete`;
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
    let url = window.root_url + `bs-warehouse/saveData`;
    let { dataTable } = this.state;
    let checkEmptySend = true;
    let dataSend = dataTable.filter(p => p.status === 'insert' || p.status === 'update').map(data => {
      data[data.status === 'insert' ? 'CREATE_BY' : 'UPDATE_BY'] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
      if (data.WAREHOUSE_CODE.length === 0) {
        checkEmptySend = false;
      }
      return data;
    });

    if (!checkEmptySend) {
      this.setState({
        alert: {
          isOpen: true,
          duration: 3000,
          message: "Mã loại khách hàng không được phép để trống",
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
          let newDatas = dataTable.map(item => {
            let returnValue = response.Payload.find(p => p.WAREHOUSE_CODE === item.WAREHOUSE_CODE && p.WAREHOUSE_NAME === item.WAREHOUSE_NAME);
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
                            WAREHOUSE_CODE: e.target.value.trim(),
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
                    <ExportCSV csvData={this.state.dataTable} fileName="DM-Kho"></ExportCSV>
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
                          typeof (params.value) === "string"
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
          }}
        />
        <AddRows
          dialog={this.state.dialog}
          handleCloseDialog={() =>
            this.setState({
              dialog: {
                isOpen: false,
                data: null,
                type: 0,
              },
            })}
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

  componentDidMount() {
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
        if (data.Status) {
          let temp = this.createRows(data.Payload);
          this.setState({
            dataTable: temp,
          });
        }
      }).catch(err => {
        console.log(err)
      });
  }
}
export default DanhMucKho;