import * as React from "react";
import * as moment from "moment";
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import {
  Box,
  Button,
  Stack,
  TextField,
  Divider,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { DataGrid } from '@mui/x-data-grid';
import InputAdornment from '@mui/material/InputAdornment';
import ExportCSV from "../../components/caiDat/ExportCSV";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import AddRows from "../../componentsCFS2/dialog/AddRows";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


class VoyageCharter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [],
      tempData: '',
      flag: false,
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
      tableFilter: {
        VESSEL_NAME: '',
      },
      data: {
        VESSEL_NAME: "",
        INBOUND_VOYAGE: "",
        OUTBOUND_VOYAGE: "",
        ETA: moment().subtract(1, "days"),
        ETD: moment(),
        CallSign: '',
        IMO: '',
        TOS_SHIPKEY: '',
      },
      confirmPopup: {
        isOpen: false,
      },
      dialog: {
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
    this.columns = [
      {
        field: "STT",
        headerName: "STT",
        width: 100,
      },
      {
        field: "VESSEL_NAME",
        headerName: "Tên Tàu (*)",
        flex: 1,
        editable: true,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "INBOUND_VOYAGE",
        headerName: "Chuyến Nhập (*)",
        flex: 1,
        editable: true,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "OUTBOUND_VOYAGE",
        headerName: "Chuyến Xuất (*)",
        flex: 1,
        editable: true,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "ETA",
        headerName: "Ngày Tàu Đến (*)",
        flex: 1,
        type: 'dateTime',
        editable: true,
        valueFormatter: params => {
          return params.value ? moment(params.value, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm:ss") :
            moment().format("DD/MM/YYYY HH:mm:ss");
        },
      },
      {
        field: "ETD",
        headerName: "Ngày Tàu Rời (*)",
        flex: 1,
        type: 'dateTime',
        editable: true,
        valueFormatter: params => {
          return params.value ? moment(params.value, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm:ss") :
            moment().format("DD/MM/YYYY HH:mm:ss");
        },
      },
      {
        field: "CallSign",
        headerName: "CallSign",
        flex: 1,
        editable: true,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "IMO",
        headerName: "IMO",
        flex: 1,
        editable: true,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "TOS_SHIPKEY",
        headerName: "TOS_SHIPKEY",
        flex: 1,
        editable: true,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      }
    ];
    this.createRows = (data) => data.map((row, index) => ({
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
        ...this.state.data,
        status: 'insert',
      }
      newRow.push(newData);
    }

    let mergeDataTable = [...newRow, ...dataTable];
    mergeDataTable.map((item, index) => {
      item.id = index;
      item.STT = index + 1;
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

  handleDelete() {
    let url = window.root_url + `dt-vessel-visits/delete`;
    let { dataTable } = this.state;

    let dataSend = dataTable.filter(p => p.isChecked === true && p.status !== "insert").map(item => {
      let obj = {};
      obj["ID"] = item.ID;
      return obj;
    });
    if (!dataSend.length) {
      let clearedData = dataTable.filter(item => item.isChecked !== true && item.status === "insert");
      clearedData = clearedData.map((item, i) => {
        item.STT = i + 1;
        return item;
      })
      this.setState({
        dataTable: clearedData
      });
      return;
    };
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
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
          let temp = dataTable.filter(p => p.isChecked !== true && p.status === 'insert');
          temp = temp.map((item, idx) => {
            item.STT = idx + 1;
            return item;
          });
          this.setState({
            dataTable: temp,
            alert: {
              isOpen: true,
              message: response.Message ? response.Message : 'Vui lòng cung cấp ID trước khi xoá',
              duration: 3000,
              type: 'warning',
            }
          })
        };
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

  //Thoilc(*Note)-Nạp dữ liệu
  loadVessel() {
    let url = window.root_url + `dt-vessel-visits/getItem`;
    let dataSend = {
      _from: this.state.fromDate,
      _to: this.state.toDate,
    };

    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
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
      .then((response) => {
        if (response.Status) {
          let newData = response.Payload.map(item => {
            item.ETA = item.ETA ? moment(item.ETA).format("DD/MM/YYYY HH:mm:ss") : '';
            item.ETD = item.ETD ? moment(item.ETD).format("DD/MM/YYYY HH:mm:ss") : '';
            return item;
          });
          if (response.Payload.length) {
            this.setState({
              dataTable: this.createRows(newData),
              alert: {
                isOpen: true,
                duration: 2000,
                message: response.Message,
                type: 'success',
              }
            });
          }
        } else {
          this.setState({
            dataTable: response.Payload,
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message,
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

  //Thoilc(*Note)-Lưu dữ liệu tàu chuyến
  handleSave() {
    let url = window.root_url + `dt-vessel-visits/insertAndUpdate`;
    let { dataTable } = this.state;
    let checkColumn = {
      VESSEL_NAME: "Tên tàu",
      INBOUND_VOYAGE: "Chuyến nhập",
      OUTBOUND_VOYAGE: "Chuyến xuất",
      ETA: 'Ngày tàu đến',
      ETD: 'Ngày tàu rời',
    };
    let checkEmptyCells = [];
    let filteredDataSend = dataTable.filter(p => p.isChecked === true &&  (p.status === 'insert' || p.status === 'update'));
    let dataSend = [];
    let checkVesselDate = true;

    for (let i = 0; i < filteredDataSend.length; i++) {
      console.log(filteredDataSend[i].ETA);
      if (moment(filteredDataSend[i].ETA, 'DD/MM/YYYY HH:mm:ss').toDate().getTime() > moment(filteredDataSend[i].ETD, 'DD/MM/YYYY HH:mm:ss').toDate().getTime()) {
        checkVesselDate = false;
        break;
      };

      Object.keys(checkColumn).forEach(item => {
        if (!filteredDataSend[i][item]) {
          checkEmptyCells.push(checkColumn[item]);
        };
      });
      filteredDataSend[i][filteredDataSend[i].status === 'insert' ? 'CREATE_BY' : 'UPDATE_BY'] = localStorage.getItem("userInfo") ?
        JSON.parse(localStorage.getItem("userInfo")).name : "";
      // filteredDataSend[i]['ETA'] = moment(filteredDataSend[i]['ETA']).format('DD/MM/YYYY HH:mm:ss:')
      // filteredDataSend[i]['ETD'] = moment(filteredDataSend[i]['ETD']).format('DD/MM/YYYY HH:mm:ss:')
      dataSend.push(filteredDataSend[i]);
    };

    if (!checkVesselDate) {
      this.setState({
        alert: {
          isOpen: true,
          duration: 2000,
          message: 'Ngày tàu đến không được lớn hơn tàu rời !!!',
          type: 'warning',
        }
      })
      return;
    };

    if (checkEmptyCells.length > 0) {
      checkEmptyCells = [...new Set(checkEmptyCells)];
      this.setState({
        alert: {
          isOpen: true,
          duration: 3000,
          message: checkEmptyCells.join(', ') + " không được để trống",
          type: "error"
        }
      })
      return;
    };

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
            let returnValue = response.Payload.find(p => p.INBOUND_VOYAGE === item.INBOUND_VOYAGE && p.VESSEL_NAME === item.VESSEL_NAME &&  p.OUTBOUND_VOYAGE === item.OUTBOUND_VOYAGE);
            item.id = index;
            if (returnValue !== undefined) {
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
          let returnValue = [];
          response.Payload.map((item) => {
            returnValue = dataTable.filter(p => p.VESSEL_NAME !== item.VESSEL_NAME
              && p.INBOUND_VOYAGE !== item.INBOUND_VOYAGE
              && p.OUTBOUND_VOYAGE !== item.OUTBOUND_VOYAGE
              && p.CallSign !== item.CallSign
              && p.IMO !== item.IMO);
            return returnValue;
          });
          let newData = returnValue.map((itm, idx) => {
            itm['STT'] = idx + 1;
            itm['ETA'] = moment(itm.ETA).format('DD/MM/YYYY HH:mm:ss');
            itm['ETD'] = moment(itm.ETD).format('DD/MM/YYYY HH:mm:ss');
            return itm;
          });
          this.setState({
            dataTable: newData,
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message !== '' ? response.Message : 'Không có dữ liệu',
              type: "warning"
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
              message: 'Không có dữ liệu được cập nhật',
              type: 'error'
            }
          });
        }
      });
  }

  //Thoilc(*Note)-Get data Tos
  getTos() {
    let dataSend = {
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      CREATE_BY: JSON.parse(localStorage.getItem("userInfo")).name
    };
    fetch(window.root_url + `dt-vessel-visits/CFStoVTOS_getVessel`, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
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
      .then((response) => {
        if (response.Status) {
          let newData = response.Payload.map(item => {
            item.ETA = item.ETA ? moment(item.ETA).format("DD/MM/YYYY HH:mm:ss") : '';
            item.ETD = item.ETD ? moment(item.ETD).format("DD/MM/YYYY HH:mm:ss") : '';
            item['status'] = 'insert';
            return item;
          });
          if (response.Payload.length) {
            this.setState({
              dataTable: this.createRows(newData),
              flag: response.Status,
              alert: {
                isOpen: true,
                duration: 2000,
                message: response.Message,
                type: 'success',
              }
            });
          } else {
            this.setState({
              dataTable: [],
              alert: {
                isOpen: true,
                duration: 2000,
                message: response.Message,
                type: 'warning',
              }
            });
          }
        } else {
          this.setState({
            dataTable: response.Payload,
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message,
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
  //--------------------------------------
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
            <Stack component="form" direction="row" spacing={2}>
              <Stack direction="row" spacing={1}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Từ ngày"
                    inputFormat="DD/MM/YYYY"
                    value={this.state.fromDate}
                    onChange={(newValue) => {
                      this.setState({
                        fromDate: newValue,
                      })
                    }}
                    renderInput={(params) => <TextField size="small" {...params} />}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Đến ngày"
                    inputFormat="DD/MM/YYYY"
                    value={this.state.toDate}
                    onChange={(newValue) => {
                      this.setState({
                        toDate: newValue,
                      })
                    }}
                    renderInput={(params) => <TextField size="small" {...params} />}
                  />
                </LocalizationProvider>
                <Divider orientation="vertical" />
              </Stack>
              <Button
                size="small"
                type="button"
                variant="contained"
                onClick={() => this.loadVessel()}
              >
                Nạp dữ liệu
              </Button>
              <Button
                size="small"
                type="button"
                variant="contained"
                onClick={() => this.getTos()}
              >
                Lấy dữ liệu TOS
              </Button>
            </Stack>
          </CardContent>
        </Card>
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
                            VESSEL_NAME: e.target.value
                          }
                        })
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
                    <ExportCSV csvData={this.state.dataTable} fileName="DM-Thiet-Bi"></ExportCSV>
                    <Divider orientation="vertical" />
                    <Button
                      // size="small"
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
                      // size="small"
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
                    hideFooterSelectedRowCount={true}
                    className="m-table"
                    rows={(this.state.dataTable)
                      .filter(data => data.VESSEL_NAME.toUpperCase().includes(this.state.tableFilter.VESSEL_NAME.toUpperCase()))
                    }
                    rowHeight={35}
                    columns={this.columns}
                    sx={{ height: "63vh" }}
                    onCellEditCommit={(params) => {
                      let temp = [...this.state.dataTable];
                      if (params.field === "ETA") {
                        temp.map(data => {
                          if (params.id === data.id) {
                            data[params.field] = moment(params.value, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm:ss");
                            if (data.status !== 'insert') {
                              data.status = 'update'
                            }
                          }
                          return true;
                        });
                      } else if (params.field === "ETD") {
                        temp.map(data => {
                          if (params.id === data.id) {
                            data[params.field] = moment(params.value, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm:ss");
                            if (data.status !== 'insert') {
                              data.status = 'update'
                            }
                          }
                          return true;
                        });
                      } else {
                        temp.map(data => {
                          if (params.id === data.id) {
                            if (typeof params.value === 'string') {
                              data[params.field] = params.value.trim().toUpperCase();
                            } else {
                              data[params.field] = params.value;
                            }
                            if (data.status !== 'insert') {
                              data.status = 'update'
                            }
                          }
                          return true;
                        });
                      }
                      this.setState({ dataTable: temp })
                    }
                    }
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
      </Box >
    )
  }
}
export default VoyageCharter;
