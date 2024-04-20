import * as moment from "moment";
import * as React from "react";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Stack,
  Card,
  CardContent,
  Divider,
  Grid,
  Autocomplete,
  TextField,
} from "@mui/material";
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from "@mui/icons-material/Delete";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import ExportCSV from "../../components/caiDat/ExportCSV";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { DataGrid } from '@mui/x-data-grid';
import AddRows from "../../componentsCFS2/dialog/AddRows";
import TRFSelect from "../../componentsCFS2/dialog/TRFSelect";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class BieuCuocChuan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      confirmPopup: {
        isOpen: false,
      },
      rowsPerPage: 10,
      temp111: {},
      dataTable: [],
      dataInfor: {},
      dataInforTf_Code: [],
      selectedTRF: {
        TRF_TEMP: '',
        TRF_NAME: '',
        FROM_DATE: moment().subtract(1, "days"),
        TO_DATE: moment()
      },
      dialogSelect: {
        isOpen: false,
        data: null,
        type: 0
      },
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
      },
      dataInput: {
        FROM_DATE: moment(),
        TO_DATE: moment().subtract(1, "days"),
        TRF_NAME: '',
      },
      data: {
        TRF_CODE: "",
        TRF_DESC: "",
        METHOD_CODE: "",
        ITEM_TYPE_CODE: "",
        CURRENCY_CODE: "",
        AMT_MIN20: "",
        AMT_MIN40: "",
        AMT_MIN45: "",
        AMT_RT: "",
        VAT: 0,
        INCLUDE_VAT: "",
        AMT_NON: '',
      },
      searchField: {
        TRF_CODE: "",
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
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "TRF_CODE",
        headerName: "Mã Biểu Cước",
        editable: true,
        type: "singleSelect",
        flex: 1,
        renderEditCell: (params) => {
          let CodeItem
          return [
            <Autocomplete
              style={{ width: "100%" }}
              id="clear-on-escape"
              clearOnEscape
              options={this.state.dataInforTf_Code || []}
              onChange={(e, value) => {
                if (value) {
                  params.row.TRF_CODE = value;
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
        field: "TRF_DESC",
        headerName: "Diễn Giải",
        editable: true,
        renderCell: (params) => {
          const newData = this.state.dataInfor.Payload.trfCode.find(item => item.TRF_CODE === params.row.TRF_CODE)
          if (newData !== undefined && params.row.TRF_DESC === undefined) {
            params.row.TRF_DESC = newData.TRF_DESC
          }
          return params.row.TRF_DESC
        },
        flex: 1,
      },
      {
        field: "METHOD_CODE",
        headerName: "Mã phương án",
        flex: 1,
        editable: true,
        align: "center",
        headerAlign: "center",
        type: "singleSelect",
        valueOptions: () => {
          const options = ["✶"];
          const newArr = this.state.dataInfor.Payload.bsMethod.map(item => {
            return item.METHOD_CODE;
          })
          return options.concat(newArr);
        }
      },
      {
        field: 'CLASS_CODE',
        headerName: 'Hướng',
        align: "center",
        headerAlign: "center",
        type: 'singleSelect',
        valueOptions: ["✶", { label: 'Nhập', value: "1" }, { label: 'Xuất', value: "2" }],
        flex: 1,
        editable: true,
        renderCell: (item) => {
          if (item.value === "1") {
            item.value = 'Nhập'
          } else if (item.value === "2") {
            item.value = 'Xuất'
          }
          return item.value;
        }
      },
      {
        field: "ITEM_TYPE_CODE",
        headerName: "Mã loại hàng hóa",
        flex: 1,
        align: "center",
        headerAlign: "center",
        editable: true,
        type: "singleSelect",
        valueOptions: () => {
          const options = ["✶"];
          const newArr = this.state.dataInfor.Payload.bsItemType.map(item => {
            return item.ITEM_TYPE_CODE;
          })
          return options.concat(newArr);
        }
      },
      {
        field: "CURRENCY_CODE",
        headerName: "Loại tiền",
        flex: 1,
        editable: true,
        type: "singleSelect",
        valueOptions: () => {
          const options = [];
          const newArr = this.state.dataInfor.Payload.bsCurrent.map(item => {
            return item.CURRENCY_CODE;
          })
          return options.concat(newArr);
        }
      },
      {
        field: "AMT_NON",
        headerName: "Giá ngoài tác nghiệp",
        editable: true,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "AMT_RT",
        headerName: "Tấn doanh thu",
        type: "number",
        editable: true,
        flex: 1,
      },
      {
        field: "VAT",
        headerName: "Thuế",
        editable: true,
        flex: 1,
        type: 'number',
        renderCell: (item) => {
          if (item.value === undefined || item.value === null) {
            item.value = 0 + ' %'
          } else {
            item.value = item.value + " %";
          }
          return item.value;
        }
      },
      {
        field: "INCLUDE_VAT",
        headerName: "Có thuế/ Không thuế",
        flex: 1,
        type: 'boolean',
        editable: true,
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

  handleClose() {
    this.setState({
      dialogSelect: {
        isOpen: false
      }
    })
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

  componentDidMount() {
    this.loadDataTRF_CODE();
  }

  handleSelectTRF(data) {
    if (data) {
      this.setState({
        dialogSelect: {
          isOpen: false,
        }
      })
      let url = window.root_url + `trf-stds/viewTrfTemp`;
      let dataSend = {
        TRF_TEMP: data.TRF_TEMP
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
        .then(data1 => {
          let temp = this.createRows(data1);
          this.setState({
            selectedTRF: data,
            dataTable: temp,
            alert: {
              isOpen: true,
              duration: 3000,
              message: "Nạp dữ liệu thành công",
              type: "success"
            }
          });
        }).catch(err => {
          console.log(err)
        });
    }
  }

  handleDelete() {
    let url = window.root_url + `trf-stds/delete`;
    let { dataTable } = this.state;
    let clearedData = dataTable.filter(p => p.status !== "insert");
    this.setState({ dataTable: clearedData });
    let dataSend = dataTable.filter(p => p.isChecked === true).map(item => {
      let obj = {};
      obj["ID"] = item.ID;
      return obj;
    });
    if (dataSend.length === 0) return;

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
        if (temp.length === 0) {
          this.setState({
            dataTable: temp,
            selectedTRF: {
              TRF_TEMP: '',
              TRF_NAME: '',
              FROM_DATE: moment().subtract(1, "days"),
              TO_DATE: moment()
            },
            alert: {
              isOpen: true,
              message: "Xóa dữ liệu thành công",
              duration: 2000,
              type: 'success',
            }
          })
        } else {
          this.setState({
            dataTable: temp,
            alert: {
              isOpen: true,
              message: "Xóa dữ liệu thành công",
              duration: 2000,
              type: 'success',
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
              message: 'Xóa dữ liệu không thành công',
              type: 'error'
            }
          });
        }
      });
  }

  handleSave() {
    let url = window.root_url + `trf-stds/insertAndUpdate`;
    let { dataTable } = this.state;
    let dataSend = dataTable.filter(p => p.status === 'insert' || p.status === 'update').map(data => {
      data[data.status === 'insert' ? 'CREATE_BY' : 'UPDATE_BY'] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
      data.FROM_DATE = moment(this.state.selectedTRF.FROM_DATE).format('DD/MM/YYYY')
      data.TO_DATE = moment(this.state.selectedTRF.TO_DATE).format('DD/MM/YYYY')
      data.TRF_NAME = this.state.selectedTRF.TRF_NAME
      data.TRF_TEMP = this.state.selectedTRF.TRF_TEMP
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
            let returnValue = response.Payload.find(p => p.TRF_CODE === item.TRF_CODE && p.METHOD_CODE === item.METHOD_CODE);
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

  loadDataTRF_CODE() {
    let url = window.root_url + `trf-stds/viewCode`;
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
        let arrTf_Code = [];
        if (data) {
          data.Payload.trfCode.map(item => {
            return arrTf_Code.push(item.TRF_CODE);
          });
          this.setState({
            dataInforTf_Code: arrTf_Code,
            dataInfor: data
          })
        } else {
          return;
        }
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
        <Card sx={{ marginBottom: '12px' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item>
                <Stack direction='row' alignItems='center' spacing={1}>
                  <span>Mẫu:</span>
                  <TextField
                    size="small"
                    id='form'
                    value={
                      this.state.selectedTRF.TRF_TEMP !== ''
                        ? this.state.selectedTRF.TRF_TEMP : '--Chọn mẫu biểu cước--'
                    }
                    onClick={() => {
                      this.setState({
                        dialogSelect: {
                          isOpen: true,
                          data: null,
                          type: 0
                        }
                      })
                    }}
                    fullWidth
                  />
                </Stack>
                <Divider flexItem sx={{ marginBottom: 2, marginTop: 2 }} />
                <Stack direction='row' spacing={1}>
                  <Stack direction='row' alignItems='center' spacing={1}>
                    <span>Thời gian hiệu lực:</span>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        label="Hiệu lực từ"
                        inputFormat="DD/MM/YYYY"
                        readOnly={this.state.dataTable.length === 0 ? true : false}
                        value={
                          this.state.selectedTRF.FROM_DATE
                        }
                        onChange={(newValue) => {
                          const temp = this.state.dataTable.map(item => {
                            if (this.state.selectedTRF.TRF_TEMP !== '') {
                              item.status = 'update'
                            }
                            return item;
                          })
                          this.setState({
                            dataTable: temp,
                            selectedTRF: {
                              ...this.state.selectedTRF,
                              FROM_DATE: moment(newValue)
                            }
                          })
                        }}
                        renderInput={(params) => <TextField size="small" {...params} />}
                      />
                    </LocalizationProvider>
                  </Stack>
                  <Stack direction='row' alignItems='center' spacing={1}>
                    <span>đến</span>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        label="Hiệu lực đến"
                        inputFormat="DD/MM/YYYY"
                        readOnly={this.state.dataTable.length === 0 ? true : false}
                        value={this.state.selectedTRF.TO_DATE}
                        onChange={(newValue) => {
                          const temp = this.state.dataTable.map(item => {
                            if (this.state.selectedTRF.TRF_TEMP !== '') {
                              item.status = 'update'
                            }
                            return item;
                          })
                          this.setState({
                            dataTable: temp,
                            selectedTRF: {
                              ...this.state.selectedTRF,
                              TO_DATE: moment(newValue)
                            }
                          })
                        }}
                        renderInput={(params) => <TextField size="small" {...params} />}
                      />
                    </LocalizationProvider>
                  </Stack>
                  <Stack direction='row' alignItems='center' spacing={1}>
                    <span>Tên biểu cước</span>
                    <TextField
                      size="small"
                      id='name'
                      label='Tên biểu cước'
                      inputProps={{
                        readOnly: this.state.dataTable.length === 0 ? true : false
                      }}
                      className={this.state.dataTable.length === 0 ? 'read-only' : ''}
                      value={this.state.selectedTRF.TRF_NAME}
                      onChange={(e) => {
                        const temp = this.state.dataTable.map(item => {
                          if (this.state.selectedTRF.TRF_TEMP !== '') {
                            item.status = 'update'
                          }
                          return item;
                        })
                        this.setState({
                          dataTable: temp,
                          selectedTRF: {
                            ...this.state.selectedTRF,
                            TRF_NAME: e.target.value
                          }
                        })
                      }}
                    />
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
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
                <Grid item mt={1} md={12} style={{ flexGrow: 1 }}>
                  <DataGrid
                    className="m-table"
                    rows={(this.state.dataTable)
                      .filter(data => data.TRF_CODE.includes(this.state.searchField.TRF_CODE.toUpperCase())
                        || data.TRF_CODE.includes(this.state.searchField.TRF_CODE.toLowerCase())
                      )
                    }
                    rowHeight={35}
                    columns={this.columns}
                    columnVisibilityModel={{
                      ID: false
                    }}
                    sx={{ height: "63vh", appearance: 'textfield' }}
                    onCellEditCommit={(params) => {
                      let temp = [...this.state.dataTable];
                      if (params.field === 'TRF_CODE') {
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
                            let checkKeys = ['TRF_CODE', 'METHOD_CODE', 'CURRENCY_CODE', 'ITEM_TYPE_CODE', 'CLASS_CODE'];
                            if (checkKeys.includes(params.field)) {
                            };
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
        <TRFSelect
          dialog={this.state.dialogSelect}
          handleSelect={(data) => this.handleSelectTRF(data)}
          handleCloseDialog={() => this.handleClose()}
        />
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
export default BieuCuocChuan;