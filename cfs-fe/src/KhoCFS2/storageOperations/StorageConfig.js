import * as React from "react";
import CustomerSelect from "../../componentsCFS2/dialog/CustomerSelect";
import * as moment from "moment";
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import SaveIcon from '@mui/icons-material/Save';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { DataGrid } from '@mui/x-data-grid';
import {
  Stack,
  Grid,
  Divider,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Autocomplete,
  InputAdornment,
  IconButton,
  Checkbox,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FixedPageName from "../../componentsCFS2/fixedPageName";
import FormSelect from "../../componentsCFS2/dialog/FormSelect";
import AddIcon from '@mui/icons-material/Add';
import AddRows from "../../componentsCFS2/dialog/AddRows";
import DeleteIcon from "@mui/icons-material/Delete";

// import ImportExcel from "../../components/caiDat/ImportExcel";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class StorageConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [],
      confirmPopup: {
        isOpen: false,
      },
      dialogSelectCus: {
        isOpen: false,
        type: 1,
      },
      tableFilter: {
        ITEM_TYPE_CODE: '',
      },
      data: {
        CLASS_CODE: '',
        ITEM_TYPE_CODE: '',
        START_TIME: '',
        FREE_DAYS: '',
      },
      formSelectDialog: {
        isOpen: false
      },
      dialog: {
        isOpen: false
      },
      selectedCustomer: {
        CUSTOMER_NAME: '',
        CUSTOMER_CODE: '',
      },
      lstClassCode: [],
      timeInList: [],
      detailsData: {
        FROM_DATE: moment(),
        TO_DATE: moment().subtract(1, "days"),
        ACC_TYPE: ''
      },
      selectedForm: '',
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.createRows = (data) => data.map((row, index) => ({
      STT: index + 1,
      id: index,
      ...row
    }),
    );
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
        field: 'CLASS_CODE',
        headerName: "Hướng",
        flex: 1,
        editable: true,
        type: 'singleSelect',
        valueOptions: [{ value: "1", label: 'Nhập' }, { value: "2", label: 'Xuất' }, { value: '✶', label: 'Tất cả' }],
        renderCell: (item) => {
          if (item.value === "1") {
            item.value = 'Nhập'
          } if (item.value === "2") {
            item.value = 'Xuất'
          }
          return item.value;
        }
      },
      {
        field: "ITEM_TYPE_CODE",
        headerName: "Loại hàng hoá",
        flex: 1,
        editable: true,
        type: 'singleSelect',
        renderEditCell: (params) => {
          let CodeItem = '';
          return [
            <Autocomplete
              style={{ width: "100%" }}
              id="clear-on-escape"
              clearOnEscape
              options={this.state.ItemTypeCode || []}
              onChange={(e, value) => {
                if (value) {
                  params.row.ITEM_TYPE_CODE = value;
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
        field: "START_TIME",
        headerName: "Ngày nhập kho",
        editable: true,
        flex: 1,
        type: 'singleSelect',
        valueOptions: ['TIME_IN'],
      },
      {
        field: "FREE_DAYS",
        headerName: "Số ngày miễn lưu",
        editable: true,
        flex: 1
      },
    ];
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
    let { dataTable } = this.state;
    let url = window.root_url + `config-free-days/delete`;
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
      .then(data => {
        if (data.Status) {
          let temp = dataTable.filter(p => p.isChecked !== true);
          temp = temp.map((item, idx) => {
            item.STT = idx + 1;
            return item;
          });
          this.setState({
            dataTable: temp,
            alert: {
              isOpen: true,
              message: data.Message,
              duration: 2000,
              type: 'success',
            }
          })
        } else {
          this.setState({
            alert: {
              isOpen: true,
              message: data.Message,
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

  handleCheckDetails() {
    let arr = []
    Object.keys(this.state.detailsData).forEach((p) => {
      if (this.state.detailsData[p] === '' && p !== 'desc') {
        return arr.push(p)
      }
    });
    if (arr.length > 0) {
      this.setState({
        alert: {
          isOpen: true,
          message: 'Vui lòng nhập đầy đủ thông tin chủ hàng!',
          type: 'error',
          duration: 2000
        }
      })
      return;
    }
    this.handleSave();
  }

  handleLoadTimeIn() {
    let url = window.root_url + `config-free-days/viewAllTimeIn`;
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
        const arr = [];
        if (data.Status) {
          data.Payload.map(item => {
            return arr.push(moment(item.TIME_IN).format('DD/MM/YYYY'));
          });
          this.setState({
            timeInList: arr,
          })
        } else {
          return;
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

  handleSelectForm(formData) {
    let url = window.root_url + `config-free-days/view`;
    let dataSend = {
      NAME: formData.NAME
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
        if (data.Status) {
          let temp = this.createRows(data.Payload)
          this.setState({
            selectedForm: formData.NAME,
            dataTable: temp,
            detailsData: {
              FROM_DATE: data.Payload[0].APPLY_DATE,
              TO_DATE: data.Payload[0].EXPIRE_DATE,
              ACC_TYPE: data.Payload[0].ACC_TYPE,
            },
            selectedCustomer: {
              ...this.state.selectedCustomer,
              CUSTOMER_NAME: data.Payload[0].CUSTOMER_NAME,
              CUSTOMER_CODE: data.Payload[0].CUSTOMER_CODE,
            },
          });
        }
        else {
          this.setState({
            alert: {
              isOpen: true,
              message: data.Message,
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
              message: JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }

  handleAddRow(rowCount) {
    let { dataTable } = this.state;
    let newRow = [];
    for (let i = 0; i < rowCount; i++) {
      let newData = {
        ...this.state.data,
        id: dataTable.length + i + 'insert',
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
      dataTable: mergeDataTable,
    })
  }

  LoadItemTypeCode() {
    let url = window.root_url + `bs-item-types/view`;
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
        const arr = [];
        if (data) {
          data.map(item => {
            return arr.push(item.ITEM_TYPE_CODE);
          });
          this.setState({
            ItemTypeCode: arr,
          })
        } else {
          return;
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

  handleSave() {
    let { dataTable } = this.state;
    let url = window.root_url + `config-free-days/insertAndUpdate`;
    let dataSend = dataTable.filter(p => p.status === 'insert' || p.status === 'update').map(data => {
      data[data.status === 'insert' ? 'CREATE_BY' : 'UPDATE_BY'] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
      data['CUSTOMER_CODE'] = this.state.selectedCustomer.CUSTOMER_CODE;
      data['ACC_TYPE'] = this.state.detailsData.ACC_TYPE;
      data['APPLY_DATE'] = this.state.detailsData.FROM_DATE;
      data['EXPIRE_DATE'] = this.state.detailsData.TO_DATE;
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
            let returnValue = response.Payload.find(p => p.CUSTOMER_CODE === item.CUSTOMER_CODE && p.CLASS_CODE === item.CLASS_CODE);
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

  componentDidMount() {
    this.LoadItemTypeCode();
    this.handleLoadTimeIn();
  }

  //--------------------------------------
  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Grid container spacing={1}>
          <Grid item xs={3} >
            <Card style={{ marginBottom: "12px" }}>
              <CardContent>
                <Grid container rowSpacing={1} columnSpacing={1}>
                  <Grid item md={12}>
                    <TextField
                      key="form"
                      fullWidth
                      size="small"
                      value={
                        this.state.selectedForm !== ''
                          ? this.state.selectedForm : '--Chọn mẫu biểu cước--'
                      }
                      onClick={() => {
                        this.setState({
                          formSelectDialog: {
                            isOpen: true
                          }
                        })
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip placement="top" title={<Typography fontSize={10}>Clear dữ liệu</Typography>}>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  this.setState({
                                    dataTable: [],
                                    detailsData: {
                                      ACC_TYPE: '',
                                      FROM_DATE: moment().subtract(1, "days"),
                                      TO_DATE: moment(),
                                    },
                                    selectedCustomer: {},
                                    selectedForm: '',
                                  })
                                }}>
                                <HighlightOffIcon sx={{ cursor: 'pointer' }} />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item md={12} sx={{ textAlign: 'center' }}>
                    <Divider flexItem> <span style={{ fontSize: '18px' }}> Chi tiết </span> </Divider>
                  </Grid>
                  <Grid item md={6}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        label='Ngày hiệu lực'
                        inputFormat="DD/MM/YYYY"
                        value={this.state.detailsData.FROM_DATE}
                        readOnly={this.state.selectedForm !== '' ? true : false}
                        onChange={(newValue) => {
                          this.setState({
                            detailsData: {
                              ...this.state.detailsData,
                              FROM_DATE: moment(newValue)
                            }
                          })
                        }}
                        renderInput={(params) => <TextField fullWidth size="small" readOnly {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item md={6}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        label="Ngày kết thúc"
                        inputFormat="DD/MM/YYYY"
                        readOnly={this.state.selectedForm !== '' ? true : false}
                        value={this.state.detailsData.TO_DATE}
                        onChange={(newValue) => {
                          this.setState({
                            detailsData: {
                              ...this.state.detailsData,
                              TO_DATE: moment(newValue)
                            }
                          })
                        }}
                        renderInput={(params) => <TextField fullWidth size="small" readOnly {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Chủ hàng"
                      value={this.state.selectedCustomer.CUSTOMER_NAME ?? ''}
                      onClick={(e) => {
                        if (this.state.selectedForm !== '') {
                          return;
                        } else {
                          this.setState({
                            dialogSelectCus: {
                              isOpen: true,
                              type: 1,
                            }
                          });
                        }
                      }}
                    />
                  </Grid>
                  <Grid item md={12}>
                    <Autocomplete
                      id="tags-outlined"
                      options={['CAS', 'CRE']}
                      size="small"
                      onChange={(event, listSelected) => {
                        let temp = this.state.dataTable.map(item => {
                          if (item.status !== 'insert') item.status = 'update'
                          return item;
                        })
                        this.setState({
                          dataTable: temp,
                          detailsData: {
                            ...this.state.detailsData,
                            ACC_TYPE: listSelected
                          }
                        })
                      }}
                      value={this.state.detailsData.ACC_TYPE}
                      getOptionLabel={(params) => {
                        if (params === 'CAS') {
                          params = 'Thu ngay'
                        } else if (params === 'CRE') {
                          params = 'Thu sau'
                        }
                        return params
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          readOnly
                          placeholder='Loại thanh toán'
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid >
          <Grid item xs={9}>
            <Grid container>
              <Grid item xs={12}>
                <Card style={{ marginBottom: "12px" }}>
                  <CardContent>
                    <Stack mb={1} direction="row" justifyContent='space-between'>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <span>Tìm kiếm:</span>
                        <TextField
                          id="tim-kiem"
                          onChange={(e) => {
                            this.setState({
                              tableFilter: {
                                ITEM_TYPE_CODE: e.target.value,
                              }
                            });
                          }}
                          size="small"
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
                          onClick={() =>
                            this.handleCheckDetails()
                          }
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
                        hideFooter={true}
                        className="m-table"
                        rows={(this.state.dataTable)
                          .filter(data => data?.ITEM_TYPE_CODE?.toUpperCase()?.includes(this.state.tableFilter.ITEM_TYPE_CODE.toUpperCase()))
                        }
                        rowHeight={35}
                        columns={this.columns}
                        columnVisibilityModel={{
                          ID: false
                        }}
                        sx={{ height: "63vh" }}
                        onCellEditCommit={(params) => {
                          let temp = [...this.state.dataTable];
                          if (params.field === 'ITEM_TYPE_CODE') {
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
                      >
                      </DataGrid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid >
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
        <CustomerSelect
          dialog={this.state.dialogSelectCus}
          handleSelect={(data) => {
            if (Object.keys(data).length > 0) {
              if (data.CUSTOMER_NAME === 'Tất cả') {
                data.CUSTOMER_NAME = '✶';
                data.CUSTOMER_CODE = '✶';
                this.setState({
                  selectedCustomer: data,
                  dialogSelectCus: {
                    isOpen: false
                  }
                })
              } else {
                this.setState({
                  selectedCustomer: data,
                  dialogSelectCus: {
                    isOpen: false
                  }
                })
              }
            } else {
              this.setState({
                alert: {
                  isOpen: true,
                  message: 'Không có dữ liệu!',
                  duration: 2000,
                  type: 'error'
                }
              })
              return;
            }
          }}
          handleCloseDialog={() => {
            this.setState({
              dialogSelectCus: {
                isOpen: false
              }
            })
          }} />
        <FormSelect
          dialog={this.state.formSelectDialog}
          handleCloseDialog={() => {
            this.setState({
              formSelectDialog: {
                isOpen: false
              }
            })
          }}
          handleSelect={(data) => {
            this.setState({
              formSelectDialog: {
                isOpen: false
              }
            });
            this.handleSelectForm(data)
          }} />
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

export default StorageConfig;