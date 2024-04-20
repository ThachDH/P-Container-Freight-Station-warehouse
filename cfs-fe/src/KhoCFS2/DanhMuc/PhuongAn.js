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
  Checkbox,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
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

class PhuongAn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmPopup: {
        isOpen: false,
      },
      dataTable: [],
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
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
      searchField: {
        STT: '',
        METHOD_CODE: '',
        METHOD_NAME: '',
        IS_IN_OUT: '',
        CLASS_CODE: '',
      }
    };
    this.columns = [
      {
        field: "STT",
        headerName: "STT",
        editable: false,
        align: "center",
        headerAlign: "center"

      },
      {
        field: "METHOD_CODE",
        headerName: "Mã phương án",
        editable: true,
        flex: 1,
      },
      {
        field: "METHOD_NAME",
        headerName: "Tên phương án",
        editable: true,
        flex: 1,
      },
      {
        field: "IS_IN_OUT",
        headerName: "Vào/Ra",
        type: 'singleSelect',
        editable: true,
        flex: 1,
        valueOptions: [{ value: 'Vào', label: 'Vào' }, { value: 'Ra', label: 'Ra' }],
        // renderCell: (item) => {
        //   if (item.value === 'I') {
        //     item.value = 'Vào'
        //   } else if (item.value === 'O') {
        //     item.value = 'Ra'
        //   }
        //   return item.value;
        // }
      },
      {
        field: "CLASS_CODE",
        headerName: "Hướng",
        type: 'singleSelect',
        editable: true,
        flex: 1,
        valueOptions: [{ value: "Nhập", label: 'Nhập' }, { value: "Xuất", label: 'Xuất' }],
        // renderCell: (item) => {
        //   if (item.value === "1") {
        //     item.value = 'Nhập'
        //   } else if (item.value === "2") {
        //     item.value = 'Xuất'
        //   }
        //   return item.value;
        // }
      },
      {
        field: "IS_SERVICE",
        headerName: " Dịch vụ đính kèm",
        type: "actions",
        flex: 1,
        getActions: (params) => {
          return [
            <Checkbox
              onChange={(e) => {
                this.rowSelectHandle(params.row.STT - 1, e.target.checked, params.row);
              }}
              checked={params.row.IS_SERVICE}
            ></Checkbox>
          ];
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

  rowSelectHandle(idx, status, row) {
    const { dataTable } = this.state;
    let updateData = dataTable;
    updateData[idx]['isChecked'] = status;
    updateData[idx]['IS_SERVICE'] = status;
    updateData[idx]['status'] = row.status === 'insert' ? 'insert' : 'update'
    this.setState({
      dataTable: updateData
    })
  }

  handleSave() {
    let url = window.root_url + `bs-method/insertAndUpdate`;
    let { dataTable } = this.state;
    let dataSend = dataTable.filter(p => p.status === 'insert' || p.status === 'update').map(data => {
      data[data.status === 'insert' ? 'CREATE_BY' : 'UPDATE_BY'] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
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
          let newDatas = dataTable.map((item, index) => {
            let returnValue = response.Payload.find(p => p.METHOD_CODE === item.METHOD_CODE && p.METHOD_NAME === item.METHOD_NAME);
            if (returnValue !== undefined) {
              item.ID = returnValue.ID;
              item.id = index;
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

  //Bình(*Note)-Thêm số dòng
  handleAddRow(rowCount) {
    let { dataTable } = this.state;
    let newRow = [];
    for (let i = 0; i < rowCount; i++) {
      let newData = {
        ...this.state.searchField,
        id: dataTable.length + i,
        STT: dataTable.length + i + 1,
        status: 'insert',
        IS_SERVICE: false,
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
        type: "success",
        duration: 2000,
        message: "Thêm dòng thành công",
      }
    })
  }

  //Bình(*Note)-Open load dialog
  openDialogAdd() {
    this.setState({
      dialog: {
        isOpen: true,
        data: null,
        type: 0,
      },
    });
  }

  componentDidMount() {
    this.handleViewData();
  }

  handleViewData() {
    let url = window.root_url + `bs-method/view`;
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
          let temp = this.createRows(response.Payload);
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

  handleDelete() {
    let url = window.root_url + `bs-method/delete`;
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
  //----------------------------------
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
                <Stack mb={1} direction="row" justifyContent="space-between" >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span  >Tìm kiếm:</span>
                    <TextField
                      size="small"
                      id="tim-kiem"
                      onChange={(e) => {
                        this.setState({ searchField: { METHOD_CODE: e.target.value.trim() } })
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <ExportCSV csvData={this.state.dataTable} fileName="DM-Phuong-An"></ExportCSV>
                    <Divider orientation="vertical" />
                    <Button
                      size="small"
                      className="m-btn m-secondary"
                      type="button"
                      variant="outlined"
                      onClick={() => this.openDialogAdd()}
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
                <Grid item mt={1} >
                  <DataGrid
                    className="m-table"
                    rowHeight={53}
                    // hideFooterSelectedRowCount={false}
                    rows={(this.state.dataTable)
                      .filter(data => data.METHOD_CODE.toUpperCase().includes(this.state.searchField.METHOD_CODE.toUpperCase()))
                    }
                    // onRowClick={(e) => console.log(e)}
                    columns={this.columns}
                    rowsPerPageOptions={[10, 25, 100]}
                    sx={{ height: "63vh" }}
                    columnVisibilityModel={{
                      ID: false
                    }}
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
          }}
        />
        <AddRows
          dialog={this.state.dialog}
          handleCloseDialog={() => this.setState({
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
}
export default PhuongAn;