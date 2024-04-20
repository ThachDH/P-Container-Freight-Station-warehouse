import * as moment from "moment";
import * as React from "react";
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
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
  Paper,
  Typography,
} from "@mui/material";
// import DecodeJWT from '../login/DecodeJWT'
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from "@mui/icons-material/Delete";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import ExportCSV from "../../components/caiDat/ExportCSV";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { DataGrid} from '@mui/x-data-grid';
import AddRows from "../../componentsCFS2/dialog/AddRows";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RenderStorage = (props) => {
  let storageList = [];
  const [dataSource, setDataSource] = React.useState(props.dataSource);
  const cellStyle = {
    width: 160,
    height: "auto",
    padding: "12px",
    position: "relative"
  };

  const renderRow = (row, index) => {
    let renderRows = [];
    const status = [
      {
        label: "Sẵn sàng",
        id: 0,
      },
      {
        label: "Tạm",
        id: 1,
      },
      {
        label: "Giữ",
        id: 2,
      },
    ];
    for (let i1 = 1; i1 <= row.TIER_COUNT; i1++) {
      let renderCells = [];
      for (let i2 = 1; i2 <= row.SLOT_COUNT; i2++) {
        renderCells = ([
          ...renderCells,
          <Paper
            sx={cellStyle}
            key={i1 + '-' + i2}
            elevation={2}
            onClick={() => {
              let temp = dataSource;
              temp[index].STATUS = temp[index].STATUS === 2 ? 0 : temp[index].STATUS + 1;
              setDataSource(temp);
              if (props.updateStatus) {
                props.updateStatus({
                  WAREHOUSE_CODE: temp[index].WAREHOUSE_CODE,
                  BLOCK: temp[index].BLOCK,
                  TIER_COUNT: i1,
                  SLOT_COUNT: i2,
                  STATUS: temp[index].STATUS === 2 ? 0 : temp[index].STATUS + 1
                });
              }
            }}
          >
            <Typography variant="h6">{status[row.STATUS].label}</Typography>
            <div
              style={{
                display: 'inline',
                position: "absolute",
                right: '0',
                bottom: '0',
                padding: "6px"
              }}
            >
              <Typography component="span">
                {row.BLOCK + '-' + i1 + '-' + i2}
              </Typography>
            </div>
          </Paper>
        ]);
      }
      renderRows = ([
        ...renderRows,
        <Stack direction="row" spacing={2}>
          {renderCells}
        </Stack>,
      ]);
    }
    return renderRows;
  }
  return (
    <Stack direction="column" spacing={2}>
      {
        dataSource.map((item, i) => {
          let checkStorage = storageList.findIndex(e => e === item.WAREHOUSE_CODE);
          if (checkStorage === -1) {
            storageList = [item.WAREHOUSE_CODE, ...storageList];
          }
          return (
            <>
              {
                checkStorage === -1 ?
                  <Divider textAlign="left">{item.WAREHOUSE_CODE}</Divider>
                  : ""
              }
              {
                i === 0 || checkStorage !== -1 ?
                  <Divider /> : ""
              }
              <Stack alignItems="center" direction="row" spacing={1}>
                <Typography variant="h6" component="h6">{item.BLOCK}</Typography>
                <Divider component="div" orientation="vertical" />
                <Stack direction="column" spacing={2}>
                  {renderRow(item, i)}
                </Stack>
              </Stack>
            </>
          );
        })
      }

    </Stack>
  );
}

class DanhMucBlock extends React.Component {
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
        WAREHOUSE_CODE: ""
      },
      isDetail: false
    };

    this.warehouseList = [];
    this.columns = [
      {
        field: "Action",
        headerName: "Chọn",
        type: "actions",
        width: 80,
        getActions: (params) => {
          return [
            <Checkbox onChange={(e) => {
              this.rowSelectHandle(params.row.STT - 1, e.target.checked);
            }}
              checked={
                params.row.isChecked
              } ></Checkbox>
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
        headerName: "Mã kho",
        editable: true,
        flex: 1,
        type: 'singleSelect',
        valueOptions: () => {
          let options = this.warehouseList?.map((item) => item.WAREHOUSE_CODE)
          return options;
        },
      },
      {
        field: "BLOCK",
        headerName: "Mã dãy",
        editable: true,
        flex: 1,
      },
      {
        field: "TIER_COUNT",
        headerName: "Số tầng",
        editable: true,
        flex: 1,
      },
      {
        field: "SLOT_COUNT",
        headerName: "Số Ô Từng Tầng",
        editable: true,
        flex: 1,
      },
      {
        field: "ID",
        headerName: "ID",
        editable: false,
      },
    ];

    this.createRows = (data) => {
      let returnData = [];
      let stt = 0;
      for (let i = 0; i < data.length; i++) {
        let checkIsset = returnData.findIndex(e => e.WAREHOUSE_CODE === data[i].WAREHOUSE_CODE && e.BLOCK === data[i].BLOCK);
        if (checkIsset > -1) {
          if (data[i].TIER_COUNT > returnData[checkIsset]["TIER_COUNT"]) {
            returnData[checkIsset]["TIER_COUNT"] = data[i].TIER_COUNT;
          }

          if (data[i].SLOT_COUNT > returnData[checkIsset]["SLOT_COUNT"]) {
            returnData[checkIsset]["SLOT_COUNT"] = data[i].SLOT_COUNT;
          }
        } else {
          stt++;
          returnData.push({
            STT: stt,
            WAREHOUSE_CODE: data[i].WAREHOUSE_CODE,
            BLOCK: data[i].BLOCK,
            TIER_COUNT: 1,
            SLOT_COUNT: 1,
            STATUS: 1,
            ID: data[i].ID,
            id: data[i].WAREHOUSE_CODE + '-' + data[i].BLOCK
          });
        }
      }

      return returnData;
    };
  }

  handleAddRow(rowCount) {
    let { dataTable } = this.state;
    let newRow = [];
    for (let i = 0; i < rowCount; i++) {
      let newData = {
        WAREHOUSE_CODE: '',
        BLOCK: '',
        TIER_COUNT: '',
        SLOT_COUNT: '',
        id: dataTable.length + i + 1,
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

  handleDelete() {
    let url = window.root_url + `bs-blocks/delete`;
    let { dataTable } = this.state;
    let dataSend = dataTable.filter(p => p.isChecked === true).map(item => {
      let obj = {};
      obj["ID"] = item.ID;
      obj["WAREHOUSE_CODE"] = item.WAREHOUSE_CODE;
      obj["BLOCK"] = item.BLOCK;
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
    let url = window.root_url + `bs-blocks/saveData`;
    let { dataTable } = this.state;
    let checkEmptySend = true;
    let dataSend = dataTable.filter(p => p.status === 'insert' || p.status === 'update').map(data => {
      data[data.status === 'insert' ? 'CREATE_BY' : 'UPDATE_BY'] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
      if (data.WAREHOUSE_CODE.length === 0 || data.BLOCK.length === 0) {
        checkEmptySend = false;
      }
      return data;
    });

    if (!checkEmptySend) {
      this.setState({
        alert: {
          isOpen: true,
          duration: 3000,
          message: "Vui lòng nhập đủ thông tin!",
          type: "warning"
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
            let returnValue = response.Payload.find(p => p.WAREHOUSE_CODE === item.WAREHOUSE_CODE && p.WAREHOUSE_NAME === item.WAREHOUSE_NAME);
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

  filterGridView() {
    this.setState({ tableFilter: Object.assign({}, this.tableFilter) });
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
                          searchField: {
                            WAREHOUSE_CODE: e.target.value.trim(),
                          }
                        });
                      }}
                      onKeyPress={(e) => {
                        if (e.code === "Enter") {
                          this.setState({ tableFilter: Object.assign({}, this.tableFilter) });
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon
                              onClick={() => { this.setState({ tableFilter: Object.assign({}, this.tableFilter) }) }}
                              style={{ cursor: "default" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      className="m-btn m-secondary"
                      type="button"
                      variant="outlined"
                      startIcon={<SettingsIcon />}
                      onClick={() => {
                        this.setState({
                          isDetail: !this.state.isDetail
                        })
                      }}
                    >
                      Quản lý chi tiết
                    </Button>
                    <Divider orientation="vertical" />
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
                {
                  this.state.isDetail ?
                    <RenderStorage
                      dataSource={this.state.dataTable.filter(item => item.isChecked)}
                      updateStatus={(value) => {
                        console.log(value);
                      }}
                    />
                    :
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
                        isCellEditable={(params) => {
                          if (params.field === 'WAREHOUSE_CODE' || params.field === 'BLOCK') {
                            if (params.value !== '' && params.row.status !== 'insert') {
                              return false;
                            } else {
                              return true;
                            }
                          } else {
                            return true;
                          }
                        }}
                        sx={{ height: "63vh" }}
                        onCellEditCommit={(params) => {
                          let temp = [...this.state.dataTable];
                          temp.map(data => {
                            if (params.id === data.id) {
                              data[params.field] = params.value.trim();
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
                }
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

  componentDidMount() {
    fetch(window.root_url + `bs-blocks/view`, {
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
    // ----------- get warehouse list -----------
    fetch(window.root_url + `bs-warehouse/view`, {
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
          this.warehouseList = data.Payload;
        }
      }).catch(err => {
        console.log(err)
      });
  }
}
DanhMucBlock.defaultProps = { multiple: true };
export default DanhMucBlock;