import * as React from "react";
import * as moment from "moment";
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import ExportCSV from "../../components/caiDat/ExportCSV";
import {
  Box,
  Button,
  Stack,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  Grid,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from "@mui/material";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initalData = {
  Cnt: "",
  CLASS_CODE: 1,
  Status: '',
};
class GoodsSearchInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: initalData,
      dataInforPallet: [],
      dialogInforPallet: false,
      isInOut: "in",
      searchField: {
        HOUSE_BILL: ''
      },
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
      dataTable: [],
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
    }
    this.columns_In = [
      {
        field: "STT",
        headerName: "STT",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: 'HOUSE_BILL',
        headerName: 'House_Bill',
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (item) => {
          return this.renderCellBill(item, 1);
        }
      },
      {
        field: "TIME_IN",
        headerName: "Ngày nhập kho",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "TIME_OUT",
        headerName: "Ngày xuất kho",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CUSTOMER_CAS",
        headerName: "Chủ hàng",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "ITEM_TYPE_CODE",
        headerName: "Hàng hóa",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      }, {
        field: "UNIT_CODE",
        headerName: "Đơn vị",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CARGO_PIECE",
        headerName: "Số lượng",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CARGO_WEIGHT",
        headerName: "Trọng lượng",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CBM",
        headerName: "Số khối",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "STATUS",
        headerName: "Trạng thái",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
    ];

    this.columns_Out = [
      {
        field: "STT",
        headerName: "STT",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: 'BOOKING_FWD',
        headerName: 'Booking_FWD',
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (item) => {
          return this.renderCellBill(item, 2);
        }
      },
      {
        field: "TIME_IN",
        headerName: "Ngày nhập kho",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "TIME_OUT",
        headerName: "Ngày xuất kho",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CUSTOMER_CAS",
        headerName: "Chủ hàng",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "ITEM_TYPE_CODE",
        headerName: "Hàng hóa",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      }, {
        field: "UNIT_CODE",
        headerName: "Đơn vị",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CARGO_PIECE",
        headerName: "Số lượng",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CARGO_WEIGHT",
        headerName: "Trọng lượng",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CBM",
        headerName: "Số khối",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "STATUS",
        headerName: "Trạng thái",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
    ];
    this.columnInforPallet = [
      {
        field: "PALLET_NO",
        headerName: 'Mã Pallet',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: "CARGO_PIECE",
        headerName: 'Số lượng',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: "BLOCK",
        headerName: 'Vị trí',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
    ]
    this.createRows = (data) => data.map((row, index) => ({
      id: index,
      STT: index + 1,
      ...row
    }),
    );
  }

  renderCellBill(item, type) {
    return (
      <Button
        className='b-button'
        sx={{ color: '#ff9900' }}
        onClick={() => {
          this.setState({
            dialogInforPallet: true
          })
          this.handleLoadPalletCode(item)
        }}
      >
        {
          type === 1 ?
            item.row.HOUSE_BILL
            : item.row.BOOKING_FWD
        }
      </Button>
    )
  }

  handleViewData() {
    let url = window.root_url + `dt-package-stock/getItem`;
    let dataSend = {
      CNTRNO: this.state.data.Cnt,
      CLASS_CODE: this.state.data.CLASS_CODE,
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      STATUS: this.state.data.Status === 1 ? "D" : "S",
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
          let temp = this.createRows(response.Payload);
          let arr_In_Out = [];
          if (this.state.isInOut === 'in') {
            temp.map(item => {
              let obj_In = {
                id: item.id,
                STT: item.STT,
                ID: item.ID,
                HOUSE_BILL: item.HOUSE_BILL,
                TIME_IN: item.TIME_IN,
                TIME_OUT: item.TIME_OUT,
                CUSTOMER_CAS: item.CUSTOMER_CAS,
                ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
                UNIT_CODE: item.UNIT_CODE,
                CARGO_PIECE: item.CARGO_PIECE,
                CARGO_WEIGHT: item.CARGO_WEIGHT,
                CBM: item.CBM,
                STATUS: item.STATUS,
                CNTRNO: item.CNTRNO,
                VESSEL_NAME: item.VESSEL_NAME,
                VESSEL_TRIP: item.VESSEL_TRIP,
                VESSEL_DAY: item.VESSEL_DAY,
                CUSTOMER_CODE: item.CUSTOMER_CODE,
                CUSTOMER_NAME: item.CUSTOMER_NAME,
                WAREHOUSE_CODE: item.WAREHOUSE_CODE,
              };
              return arr_In_Out.push(obj_In);
            });
          } else {
            temp.map(item => {
              let obj_Out = {
                ID: item.ID,
                id: item.id,
                STT: item.STT,
                BOOKING_FWD: item.BOOKING_FWD,
                TIME_IN: item.TIME_IN,
                TIME_OUT: item.TIME_OUT,
                CUSTOMER_CAS: item.CUSTOMER_CAS,
                ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
                UNIT_CODE: item.UNIT_CODE,
                CARGO_PIECE: item.CARGO_PIECE,
                CARGO_WEIGHT: item.CARGO_WEIGHT,
                CBM: item.CBM,
                STATUS: item.STATUS,
                CNTRNO: item.CNTRNO,
                VESSEL_NAME: item.VESSEL_NAME,
                VESSEL_TRIP: item.VESSEL_TRIP,
                VESSEL_DAY: item.VESSEL_DAY,
                CUSTOMER_CODE: item.CUSTOMER_CODE,
                CUSTOMER_NAME: item.CUSTOMER_NAME,
                WAREHOUSE_CODE: item.WAREHOUSE_CODE,
              };
              return arr_In_Out.push(obj_Out);
            });
          }
          this.setState({
            dataTable: arr_In_Out,
            alert: {
              isOpen: true,
              type: "success",
              duration: 3000,
              message: response.Message,
            },
          })
        }
        else {
          this.setState({
            dataTable: [],
            alert: {
              type: 'warning',
              message: response.Message,
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
  handleLoadPalletCode(params) {
    let url = window.root_url + `pallet-stock/viewPallet`;
    let dataSend = {
      CLASS_CODE: this.state.data.CLASS_CODE,
      BOOKING_FWD: params.row.BOOKING_FWD,
      HOUSE_BILL: params.row.HOUSE_BILL,
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
          let temp = this.createRows(response.Payload);
          this.setState({
            dataInforPallet: temp,
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

  //----------------------------------------
  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Card >
          <CardContent >
            <Stack>
              <Grid container>
                <Grid >
                  <Stack direction="row" spacing={1} style={{ margin: "15px 0" }} >
                    <Stack direction="row" gap="12px" >
                      <Stack direction="row" >
                        <Autocomplete
                          sx={{ width: '150px' }}
                          id="status"
                          defaultValue={''}
                          options={[1, 2, '']}
                          onChange={(newValue, value) => {
                            console.log(value)
                            this.setState({
                              data: {
                                ...this.state.data,
                                Status: value,
                              }
                            })
                          }}
                          size="small"
                          getOptionLabel={(params) => {
                            if (params === 1) {
                              params = 'Đã xuất'
                            } else if (params === 2) {
                              params = 'Tồn kho'
                            }
                            else {
                              params = 'Tất cả'
                            };
                            return params
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              readOnly
                              size="small"
                              label='Trạng thái'
                            />
                          )}
                        />
                      </Stack>
                      <Stack direction="row" >
                        <TextField
                          id="so-cnt"
                          size="small"
                          label="Số Container"
                          value={this.state.data.Cnt}
                          onChange={(newValue) => {
                            this.setState({
                              data: {
                                ...this.state.data,
                                Cnt: newValue.target.value.trim(),
                              }
                            })
                          }}
                        />
                      </Stack>
                      <Divider orientation="vertical" />
                      <Stack direction="row" alignItems="center">
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
                            renderInput={(params) => <TextField
                              size="small"
                              {...params} />}
                          />
                        </LocalizationProvider>
                      </Stack>
                      <Stack direction="row" alignItems="center" >
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
                            renderInput={(params) => <TextField
                              size="small"
                              {...params} />}
                          />
                        </LocalizationProvider>
                      </Stack>
                      <Divider orientation="vertical" />
                      <Stack direction="row" >
                        <FormControl>
                          <RadioGroup
                            name="filterType"
                            row
                            value={this.state.isInOut}
                            onChange={(e) => {
                              this.setState({
                                isInOut: e.target.value
                              })
                            }} >
                            <FormControlLabel
                              value="in"
                              control={
                                <Radio
                                  size="small"
                                  onChange={(event) => {
                                    this.setState({
                                      dataTable: [],
                                      data: {
                                        ...this.state.data,
                                        CLASS_CODE: 1,
                                      }
                                    })
                                  }}
                                />}
                              label=" Hướng Nhập" />
                            <FormControlLabel
                              value="out"
                              control={
                                <Radio
                                  size="small"
                                  onChange={(event) => {
                                    this.setState({
                                      dataTable: [],
                                      data: {
                                        ...this.state.data,
                                        CLASS_CODE: 2,
                                      }
                                    })
                                  }} />}
                              label=" Hướng Xuất" />
                          </RadioGroup>
                        </FormControl>
                        <Button
                          type="button"
                          size="small"
                          variant="contained"
                          onClick={() => this.handleViewData()}
                          startIcon={<SearchIcon />}
                        >Lọc dữ liệu</Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
            <Divider textAlign="left"><i>Thông tin chi tiết container</i></Divider>
            <Stack>
              <Grid item container justifyContent="space-between" md={12} spacing={1} style={{ marginTop: "5px" }}>
                <Grid item md={2}>
                  <TextField
                    fullWidth
                    id="load_inf-ctrno"
                    disabled
                    variant="standard"
                    value={this.state.dataTable[0]?.CNTRNO ? "Số Container: " + this.state.dataTable[0]?.CNTRNO : "Số Container: "}
                  />
                </Grid>
                <Grid item md={4} >
                  <TextField
                    fullWidth
                    id="load_inf-Name_Voy"
                    disabled
                    variant="standard"
                    value={this.state.dataTable[0]?.VESSEL_NAME ? "Tên Tàu: " + this.state.dataTable[0]?.VESSEL_NAME : "Tên Tàu: "}
                  />
                </Grid>
                <Grid item md={1.5}>
                  <TextField
                    fullWidth
                    id="load_inf-voy"
                    disabled
                    variant="standard"
                    value={this.state.dataTable[0]?.VESSEL_TRIP ? "Chuyển: " + this.state.dataTable[0]?.VESSEL_TRIP : "Chuyển: "}
                  />
                </Grid>
                <Grid item md={1.5}>
                  <TextField
                    fullWidth
                    id="load_inf-Date"
                    disabled
                    variant="standard"
                    value={this.state.dataTable[0]?.VESSEL_DAY ? "Ngày cập: " + moment(this.state.dataTable[0]?.VESSEL_DAY, "YYYY-MM-DD").format("DD/MM/YYYY") : "Ngày cập: "}
                  />
                </Grid>
                <Grid item md={1.5}>
                  <TextField
                    fullWidth
                    id="load_inf-DL"
                    disabled
                    variant="standard"
                    value={this.state.dataTable[0]?.CUSTOMER_NAME ? "Đại lý: " + this.state.dataTable[0]?.CUSTOMER_NAME : "Đại lý: "}
                  />
                </Grid>
                <Grid item md={1.5}>
                  <TextField
                    fullWidth
                    id="load_inf-kho"
                    disabled
                    variant="standard"
                    value={this.state.dataTable[0]?.WAREHOUSE_CODE ? "Kho: " + this.state.dataTable[0]?.WAREHOUSE_CODE : "Kho: "}
                  />
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card >
        <Card style={{ marginTop: "10px" }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" spacing={1} mb="6px">
              <Typography variant="h5" height="30px" >Thông tin chi tiết hàng hóa</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Grid container justifyContent="space-between">
                <Grid display="flex" alignItems="center" gap="5px">
                  <span>Tìm kiếm:</span>
                  <TextField
                    size="small"
                    id="tim-kiem"
                    onChange={(e) => {
                      this.setState({
                        searchField: {
                          HOUSE_BILL: e.target.value,
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
                </Grid>
                <Grid>
                  <ExportCSV size="small" csvData={this.state.dataTable} fileName="Truy vấn thông tin hàng hóa" ></ExportCSV>
                </Grid>
              </Grid>

            </Stack>
            <Grid item mt={1}>
              <DataGrid
                className="m-table"
                rowHeight={35}
                rows={(this.state.dataTable)
                  .filter(data => data.HOUSE_BILL.toUpperCase().includes(this.state.searchField.HOUSE_BILL.toUpperCase()))
                }
                columns={this.state.isInOut === 'in' ? this.columns_In : this.columns_Out}
                rowsPerPageOptions={[10, 25, 100]}
                sx={{ height: "53vh" }}
              >
              </DataGrid>
            </Grid>
          </CardContent>
        </Card>
        <Dialog
          open={this.state.dialogInforPallet}
          scroll="paper"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle >Thông tin pallet</DialogTitle>
          <DialogContent>
            <Card>
              <DataGrid
                className="m-table"
                hideFooter={true}
                rowHeight={35}
                sx={{ height: "63vh" }}
                columns={this.columnInforPallet}
                rows={this.state.dataInforPallet}
              >
              </DataGrid>
            </Card>
          </DialogContent>
          <DialogActions
          >
            <Button
              type="button"
              onClick={() => {
                this.setState({ dialogInforPallet: false })
              }}
              variant="contained"
            >Đóng</Button>
          </DialogActions>
        </Dialog>
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
export default GoodsSearchInfo;