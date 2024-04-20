import * as React from "react";
import * as moment from "moment";
import {
  Box,
  Button,
  Stack,
  TextField,
  Divider,
  Card,
  CardContent,
  Grid,
  Typography,
  FormControl,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,

} from "@mui/material";
import MuiAlert from '@mui/material/Alert';

import FormGroup from '@mui/material/FormGroup';
import FixedPageName from "../../componentsCFS2/fixedPageName";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import AddRows from "../../componentsCFS2/dialog/AddRows";
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import CustomerSelect from "../../componentsCFS2/dialog/CustomerSelect";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class InvoiceCre extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invoice: "1",
      isChecked: true,
      customer_Pay: {
        CUSTOMER_CODE: '',
        ADDRESS: '',
        CUSTOMER_NAME: '',
      },
      dataTableVessel: [],
      lstCD: [],
      fieldVessel: {
        VESSEL_NAME: '',
      },
      dataTable: [],
      itemList: [
        "Thu ngay",
        "Thu sau"
      ],
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
      },
      isOpen: false,
      confirmPopup: {
        isOpen: false,
      },
      dialog_Customer: {
        isOpen: false
      },
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
      tableFilter: {
        VESSEL_NAME: '',
      },
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 6000,
        type: 'info' // info / warning / error / success
      },
      dataField: {
        BC: "",
        NAMEBC: "",
        CONT: "",
        DVT: "",
        CLASSCODE: "",
        ITEMTYPE: "",
        SIZE: "",
        FullEMPT: "",
        VAT: "",
        LF: "",
        SL: "",
        DGIA: "",
        DGIATHUE: "",
        SUMCODE: "",
        VATPECEnt: "",
        SUMVAT: "",
        SUMCODEMONEY: "",
      }
    };
    this.columns = [
      {
        field: "STT",
        headerName: "STT",
        editable: true,
        align: "center",
        width: 50,
        headerAlign: "center"
      },
      {
        field: "BC",
        headerName: "Mã biểu cước",
        editable: true,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "NAMEBC",
        headerName: "Tên biểu cước",
        editable: true,
        width: 200,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CONT",
        headerName: "Danh sách cont",
        width: 100,
        editable: true,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "DVT",
        headerName: "Đơn vị tính",
        editable: true,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CLASSCODE",
        headerName: "Hướng",
        editable: true,
        width: 100,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "ITEMTYPE",
        headerName: "Loại hàng",
        width: 100,
        editable: true,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "SIZE",
        headerName: "Size",
        editable: true,
        width: 100,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "FullEMPT",
        headerName: "Full/Empty",
        editable: true,
        width: 100,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "VAT",
        headerName: "Tiền thuế",
        editable: true,
        width: 120,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "LF",
        headerName: "Nội ngoại(L/F)",
        editable: true,
        width: 100,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "SL",
        headerName: "Số lượng",
        editable: true,
        width: 100,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "DGIA",
        headerName: "Đơn giá gồm thuế",
        editable: true,
        width: 120,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "DGIATHUE",
        headerName: "Đơn giá chưa thuế",
        editable: true,
        width: 120,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "SUMCODE",
        headerName: "Thành tiền",
        editable: true,
        width: 130,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "VATPECEnt",
        headerName: "Thuế(%)",
        editable: true,
        width: 100,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "SUMVAT",
        headerName: "Tiền thuế",
        editable: true,
        width: 120,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "SUMCODEMONEY",
        headerName: "Tổng tiền",
        editable: true,
        width: 120,
        align: "center",
        headerAlign: "center"
      }
    ];
    this.columnVessel = [
      {
        field: "VESSEL_NAME",
        headerName: 'Tên Tàu',
        flex: 1,
      },
      {
        field: "INBOUND_VOYAGE",
        headerName: "Chuyến Nhập",
        flex: 1,
      },
      {
        field: "OUTBOUND_VOYAGE",
        headerName: "Chuyến Xuất",
        flex: 1,
      },
      {
        field: "ETA",
        headerName: "Ngày Tàu Đến",
        flex: 1,
      },
      {
        field: "ETD",
        headerName: "Ngày Tàu Rời",
        flex: 1,
      },
    ];
    this.createRows = (data) => data.map((row, index) => ({
      STT: index + 1,
      id: index,
      ...row
    }))
  }

  handleAddRow(rowCount) {
    let { dataTable } = this.state;
    let newRow = [];
    for (let i = 0; i < rowCount; i++) {
      let newData = {
        id: dataTable.length + i + 1,
        STT: dataTable.length + i + 1,
        ...this.state.dataField,
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

  handleDelete() {
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
  }

  selected(params) {
    if (params) {
      this.setState({
        fieldVessel: params,
        isOpen: false
      })
    } else {
      this.setState({
        isOpen: false
      })
    }
  }

  componentDidMount() {
    this.loadVessel();
    this.handleLoadPayment();
  }

  loadVessel() {
    let url = window.root_url + `dt-vessel-visits/view`;
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
        console.log(data)
        data.map(item => {
          item.ETA = moment(item.ETA).format("DD/MM/YYYY")
          item.ETD = moment(item.ETD).format("DD/MM/YYYY")
          return item;
        })
        let newData = data;
        if (data.length > 0) {
          let temp = this.createRows(newData);
          this.setState({
            dataTableVessel: temp,
            alert: {
              isOpen: true,
              type: "success",
              duration: 3000,
              message: "Nạp dữ liệu thành công!"
            },
          })
        } else {
          this.setState({
            alert: {
              isOpen: true,
              duration: 3000,
              message: 'Không tìm thấy dữ liệu',
              type: 'warning'
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

  handleLoadPayment() {
    let url = window.root_url + `accounts/view`;
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
        const arrType = [];
        data.map(item => {
          arr.push(item.value = `${item.ACC_TYPE} : ${item.ACC_NO}`);
          return item;
        });
        data.map(item => {
          arrType.push(item.value = `${item.ACC_TYPE} `);
          return item;
        })
        this.setState({
          dataPay: data,
          lstCD: arr
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
              message: JSON.parse(err.message).error.message,
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
        <Card>
          <CardContent>
            <Stack marginTop="10px">
              <Divider flexItem textAlign="left"> Thông tin chung</Divider>
              <Grid>
                <Stack direction="row" alignItems="center" marginTop="10px" gap="15px" >
                  <Stack >
                    <TextField
                      size="small"
                      fullWidth
                      value={this.state.fieldVessel.VESSEL_NAME}
                      onClick={(e) => { this.setState({ isOpen: true }) }}
                      label="Tàu chuyến">
                    </TextField>
                  </Stack>
                  <Stack >
                    <Autocomplete
                      sx={{ width: '200px' }}
                      id="tags-outlined"
                      defaultValue={''}
                      options={this.state.itemList || []}
                      size="small"
                      getOptionLabel={(params) => {
                        if (params === '') {
                          params = 'Tất cả'
                        }
                        return params
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          readOnly
                          label='Loại thanh toán'
                        />
                      )}
                    />
                  </Stack>
                  <Stack >
                    <TextField
                      size="small"
                      fullWidth
                      value={this.state.customer_Pay.CUSTOMER_CODE}
                      onClick={() => {
                        this.setState({
                          dialog_Customer: {
                            isOpen: true
                          }
                        })
                      }}
                      label="Mã KH">
                    </TextField>
                  </Stack>
                  <Stack >
                    <Autocomplete
                      sx={{ width: "300px" }}
                      id="tags-outlined"
                      options={this.state.lstCD || []}
                      onChange={(event, listSelected) => {
                        this.setState({
                          selectedCD: listSelected
                        })
                      }}
                      size="small"

                      renderInput={(params) => (
                        <TextField
                          {...params}
                          readOnly
                          placeholder="Hình thức thanh toán"
                        />
                      )}
                    />
                  </Stack>
                  <Stack >
                    <TextField
                      size="small"
                      fullWidth
                      label="Số lệnh">
                    </TextField>
                  </Stack>
                  <Stack >
                    <TextField size="small" fullWidth label="--Chọn mã biểu cước--"></TextField>
                  </Stack>
                </Stack>
                <Stack direction="row" gap="20px" margin="15px 0 10px 0">
                  <Stack width="30%">
                    <TextField
                      size="small"
                      fullWidth
                      variant="standard"
                      value={"Tên KH: " + this.state.customer_Pay.CUSTOMER_NAME}
                      disabled
                    ></TextField>
                  </Stack>
                  <Stack width="30%" >
                    <TextField
                      size="small"
                      fullWidth
                      variant="standard"
                      disabled
                      value={"Địa chỉ: " + this.state.customer_Pay.ADDRESS}

                    ></TextField>
                  </Stack>
                </Stack>
                <Divider flexItem textAlign="left"> Tổng cước phí</Divider>
                <Stack direction="row" marginTop="10px" alignItems="center">
                  <Stack width="30%" >
                    <Grid container gap="5px" alignItems="end">
                      <Grid >
                        <Typography sx={{ fontWeight: "600", }} >Thành tiền</Typography>
                      </Grid>
                      <Grid width="80%">
                        <TextField
                          size="small"
                          fullWidth
                          variant="standard"
                          disabled
                          defaultValue="0 VND"
                          color="primary"
                        ></TextField>
                      </Grid>
                    </Grid>
                  </Stack>
                  <Stack width="30%">
                    <Grid container gap="5px" alignItems="end">
                      <Grid >
                        <Typography sx={{ fontWeight: "600", }} >Tiền thuế</Typography>
                      </Grid>
                      <Grid width="80%">
                        <TextField
                          size="small"
                          fullWidth
                          variant="standard"
                          disabled
                          defaultValue="0 VND"
                          color="warning"
                        ></TextField>
                      </Grid>
                    </Grid>
                  </Stack>
                  <Stack width="30%">
                    <Grid container gap="5px" alignItems="end">
                      <Grid >
                        <Typography sx={{ fontWeight: "600", }} >Tổng tiền</Typography>
                      </Grid>
                      <Grid width="80%">
                        <TextField
                          size="small"
                          fullWidth
                          variant="standard"
                          disabled
                          defaultValue="0 VND"
                          color="success"
                        ></TextField>
                      </Grid>
                    </Grid>
                  </Stack>
                </Stack>
                <Stack direction="row" marginTop="10px" alignItems="center" gap="20px">
                  <Stack >
                    <Typography sx={{ fontweight: "600", fontSize: "15px", color: "#3366CC" }}>Loại phát hành</Typography>
                    <Divider />
                  </Stack>
                  <Stack direction="row" spacing={2} width="28%">
                    <Grid >
                      <FormGroup row>
                        <FormControlLabel control={<Checkbox />} label="Phiếu thu" />
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Hóa đơn điện tử" />
                      </FormGroup>
                    </Grid>
                  </Stack>
                </Stack>
              </Grid>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ marginTop: "10px" }}>
          <Grid container justifyContent="space-between" padding="10px 15px">
            <Stack direction="row" spacing={1} alignItems="center">
              <span>Tìm kiếm:</span>
              <TextField
                size="small"
                id="tim-kiem"
                onChange={(e) => {
                  this.setState({
                    dataField: {
                      UNIT_CODE: e.target.value.trim(),
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
            <Stack direction="row" spacing={1}  >
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
                color="error"
                onClick={() => {
                  this.setState({
                    confirmPopup: {
                      isOpen: true,
                      message: 'Bạn có muốn xóa dữ liệu?'
                    }
                  })
                }}
                startIcon={<DeleteIcon />}
              >
                Xóa dòng
              </Button>
              <Divider orientation="vertical" />
              <Button
                size="small"
                type="button"
                variant="outlined"
                color="success"
                startIcon={<SaveIcon />}
              >
                Xác nhận hóa đơn
              </Button>
            </Stack>
          </Grid>
          <Divider />
          <Grid>
            <DataGrid
              className="m-table"
              rows={this.state.dataTable}
              columns={this.columns}
              rowHeight={35}
              columnVisibilityModel={{
                ID: false
              }}
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
              sx={{ height: "43vh" }}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(ids) => {
                let { dataTable } = this.state;
                dataTable.map(item => item['isChecked'] = ids.indexOf(item.id) >= 0);
                this.setState({
                  dataTable: dataTable
                })
              }}
            />
          </Grid>
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
        <CustomerSelect
          dialog={this.state.dialog_Customer}
          handleSelect={(data) => {
            if (Object.keys(data).length > 0) {
              this.setState({
                customer_Pay: data,
                dialog_Customer: {
                  isOpen: false
                }
              })
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
              dialog_Customer: {
                isOpen: false
              }
            })
          }} />
        <Dialog
          open={this.state.isOpen}
          scroll="paper"
          fullWidth={true}
          maxWidth="lg"
        >
          <DialogTitle variant="h5">Chọn Tàu Chuyến</DialogTitle>
          <Divider />
          <DialogContent>
            <Card sx={{ mb: 1 }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Tìm kiếm:</span>
                  <FormControl>
                    <TextField
                      size="small"
                      id="tim-kiem"
                      label='Tên tàu'
                      onChange={(e) => {
                        this.setState({
                          tableFilter: { VESSEL_NAME: e.target.value }
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
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Grid item mt={1} md={12}>
                  <DataGrid
                    // onRowDoubleClick={(e) => this.selected(e)}
                    className="m-table"
                    rows={(this.state.dataTableVessel)
                      // .filter(data => data.VESSEL_NAME.toUpperCase().includes(this.state.tableFilter.VESSEL_NAME.toUpperCase()))
                    }
                    rowHeight={35}
                    columns={this.columnVessel}
                    columnVisibilityModel={{
                      ID: false
                    }}
                    sx={{ height: "63vh" }}
                    onCellEditCommit={(params) => {
                      let temp = [...this.state.dataTableVessel];
                      temp.map(data => {
                        if (params.id === data.id) {
                          data[params.field] = params.value;
                          if (data.status !== 'insert') {
                            data.status = 'update'
                          }
                        }
                        return true;
                      });
                      this.setState({ dataTableVessel: temp })
                    }}
                    onRowDoubleClick={(params) => {
                      this.selected(params.row);
                    }}
                    onRowClick={(params) => {
                      this.setState({
                        fieldVessel: params.row
                      })
                    }}
                  >
                  </DataGrid>
                </Grid>
              </CardContent>
            </Card>
          </DialogContent >
          <DialogActions>
            <Button onClick={() => { this.setState({ isOpen: false }) }}>Đóng</Button>
            <Button onClick={() => this.selected()} variant="contained">
              Chọn
            </Button>
          </DialogActions>
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
        </Dialog >

      </Box>
    )
  }
}
export default InvoiceCre;