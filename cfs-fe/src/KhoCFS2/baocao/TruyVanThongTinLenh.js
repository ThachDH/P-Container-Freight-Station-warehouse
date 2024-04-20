import * as React from "react";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import DialogExportOrder from "../../componentsCFS2/dialog/dialogExportOrder";
import {
  Grid,
  Divider,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  DialogActions,
  DialogContent,
  DialogTitle,
  CardHeader,
  Dialog,
} from "@mui/material";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import InputAdornment from '@mui/material/InputAdornment';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { DataGrid } from "@mui/x-data-grid";


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initData = {
  ORDER_NO: "",
  BOOKING_NO: "",
  BILLOFLADING: "",
  CLASS_CODE: 1,
  CNTRNO: "",
  EXP_DATE: "",
  ITEM_TYPE_CODE: "",
  ACC_TYPE: "",
  VESSEL_NAME: "",
  METHOD_CODE: "",
  OWNER: '',
  OWNER_PHONE: ''
}
class QueryInforOder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataInput: initData,
      dataTableOrderNo: [],
      dataTable: [],
      dialogExportOrder: {
        isOpen: false,
      },
      dialogOrderNo: {
        isOpen: false,
        type: 1
      },
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.inforOder = [
      {
        field: "STT",
        headerName: "STT",
        editable: false,
        width: 100,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "HOUSE_BILL",
        headerName: "House_Bill",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "BOOKING_FWD",
        headerName: "Booking_FWD",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "ITEM_TYPE_CODE",
        headerName: "Loại hàng",
        flex: 1,
        width: 100,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CARGO_PIECE",
        headerName: "Số lượng",
        flex: 1,
        width: 100,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "UNIT_CODE",
        headerName: "Đơn vị tính",
        flex: 1,
        width: 100,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CARGO_WEIGHT",
        headerName: "Trọng lượng",
        flex: 1,
        width: 100,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CBM",
        headerName: "Số khối",
        flex: 1,
        width: 100,
        align: "center",
        headerAlign: "center"
      },

    ];
    this.listOrderNo = [
      {
        field: "STT",
        headerName: "STT",
        editable: false,
        width: 100,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "ORDER_NO",
        headerName: "Mã lệnh",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "BILLOFLADING",
        headerName: "Masterbill",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "BOOKING_NO",
        headerName: "Booking",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CNTRNO",
        headerName: "Số container",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "METHOD_CODE",
        headerName: "Mã phương án",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CLASS_CODE",
        headerName: "Hướng",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          return [
            params.row.CLASS_CODE === 1 ? "Hướng nhập" : "Hướng Xuất"
          ]
        }
      },
    ]
    this.createRows = (data) => data.map((row, index) => ({
      STT: index + 1,
      id: index,
      ...row
    }),
    );
    this.createRowOrderNo = (data) => data.map((row, index) => ({
      STT: index + 1,
      id: index,
      ...row
    }),
    );
  }

  componentDidMount() {
    if (localStorage.getItem("loadOrderNo") !== null) {
      this.handleLoadData();
    }
  }
  handleLoadData() {
    let url = window.root_url + `dt-order/getOrder`;
    let dataSend = {
      ORDER_NO: this.state.dataInput.ORDER_NO ? this.state.dataInput.ORDER_NO : localStorage.getItem("loadOrderNo"),
      BOOKING_NO: this.state.dataInput.BOOKING_NO ? this.state.dataInput.BOOKING_NO : "",
      BILLOFLADING: this.state.dataInput.BILLOFLADING ? this.state.dataInput.BILLOFLADING : "",
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
          if (this.state.dataInput.ORDER_NO || localStorage.getItem("loadOrderNo")) {
            let temp = this.createRows(response.Payload);
            this.setState({
              dataTable: temp,
              dataInput: temp[0],
              alert: {
                isOpen: true,
                duration: 3000,
                type: "success",
                message: response.Message
              }
            })
            localStorage.removeItem("loadOrderNo");

          } else if ((this.state.dataInput.BILLOFLADING.length > 0 && response.Payload.length > 1) || (this.state.dataInput.BOOKING_NO.length > 0 && response.Payload.length > 1)) {
            let _data = [];
            let arr = response.Payload
            let tempArrOrderNo = arr.map((item) => item.ORDER_NO)
            tempArrOrderNo = [...new Set(tempArrOrderNo)]
            for (let i = 0; i < tempArrOrderNo.length; i++) {
              let tempObj = {
                ORDER_NO: '',
                METHOD_CODE: '',
                NOTE: '',
                BOOKING_NO: '',
                BILLOFLADING: '',
                CNTRNO: '',
                CLASS_CODE: ""
              }
              for (let j = 0; j < arr.length; j++) {
                if (tempArrOrderNo[i] === arr[j].ORDER_NO) {
                  tempObj.ORDER_NO = arr[j].ORDER_NO;
                  tempObj.METHOD_CODE = arr[j].METHOD_CODE;
                  tempObj.NOTE = arr[j].NOTE;
                  tempObj.BOOKING_NO = arr[j].BOOKING_NO;
                  tempObj.BILLOFLADING = arr[j].BILLOFLADING;
                  tempObj.CNTRNO = arr[j].CNTRNO;
                  tempObj.CLASS_CODE = arr[j].CLASS_CODE;
                }
              }
              _data.push(tempObj)
            }
            let storage = this.createRowOrderNo(_data);
            this.setState({
              dataTable: this.createRowOrderNo(response.Payload),
              dataTableOrderNo: storage,
              dialogOrderNo: {
                isOpen: true,
                type: 1
              }
            })
          } else {
            this.setState({
              dataInput: initData,
              dataTable: [],
              alert: {
                isOpen: true,
                type: "error",
                duration: 3000,
                message: response.Message
              }
            })
          }
        } else {
          localStorage.removeItem("loadOrderNo");
          this.setState({
            dataInput: initData,
            dataTable: [],
            alert: {
              isOpen: true,
              type: "error",
              duration: 3000,
              message: response.Message
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
  }

  handleLoadBillOrBooking(params) {
    let tempTable = this.state.dataTable.filter(item => item.ORDER_NO === params.row.ORDER_NO);
    this.setState({
      dataTable: tempTable,
      dataInput: tempTable[0]
    })
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
              <Divider textAlign="left" sx={{ mb: 1, mt: 1, fontSize: "18px" }}>Điều kiện lọc dữ liệu</Divider>
              <CardContent>
                <Grid display="flex" flexDirection="column" alignItems="end" >
                  <Grid container rowSpacing={1} columnSpacing={1}>
                    <Grid item md={12}>
                      <TextField
                        key="OderNo"
                        fullWidth
                        size="small"
                        label="Số lệnh"
                        value={this.state.dataInput.ORDER_NO || localStorage.getItem("loadOrderNo") || this.state.dataInput.ORDER_NO}
                        onChange={(e, value) => {
                          this.setState({
                            dataInput: {
                              ...this.state.dataInput,
                              ORDER_NO: e.target.value.trim(),
                            }
                          })
                        }
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {
                                <HighlightOffIcon style={{ cursor: "default" }}
                                  onClick={() => {
                                    localStorage.removeItem("loadOrderNo");
                                    this.setState({
                                      dataInput: initData,
                                      dataTable: []
                                    })
                                  }
                                  }
                                />
                              }
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item md={6}>
                      <TextField
                        key="Booking"
                        fullWidth
                        size="small"
                        label="Số Booking"
                        value={this.state.dataInput.BOOKING_NO}
                        onChange={(e) => {
                          this.setState({
                            dataInput: {
                              ...this.state.dataInput,
                              BOOKING_NO: e.target.value.trim()
                            }
                          })
                        }}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextField
                        key="BILLOFLADING"
                        fullWidth
                        size="small"
                        label="Số Masterbill"
                        value={this.state.dataInput.BILLOFLADING}
                        onChange={(e) => {
                          this.setState({
                            dataInput: {
                              ...this.state.dataInput,
                              BILLOFLADING: e.target.value.trim()
                            }
                          })
                        }}
                      />
                    </Grid>

                  </Grid>
                  <Grid item>
                    <Button
                      sx={{ marginTop: "10px", marginRight: "10px" }}
                      type="button"
                      label="In lênh"
                      variant="contained"
                      onClick={() => {
                        this.setState({
                          dialogExportOrder: {
                            isOpen: true,
                            dataTable: this.state.dataTable,
                          }
                        })
                      }}
                    >
                      Xem lệnh
                    </Button>
                    <Button
                      sx={{ marginTop: "10px" }}
                      type="button"
                      label="Nạp dữ liệu"
                      variant="contained"
                      onClick={() => this.handleLoadData()}
                    >
                      Nạp dữ liệu
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <Divider textAlign="left" sx={{ mb: 1, mt: 1, fontSize: "18px" }} > Thông tin lệnh</Divider>
              <CardContent>
                <Grid container rowSpacing={1} columnSpacing={1}>
                  <Grid item md={12}>
                    <TextField fullWidth disabled size="small" id="VESSEL_NAME" label="Tên tàu" value={this.state.dataInput.VESSEL_NAME} />
                  </Grid>

                  <Grid item md={6}>
                    <TextField fullWidth disabled size="small" id="ClassCode" label="Hướng" value={this.state.dataInput.CLASS_CODE === 1 ? "Nhập" : "Xuất"} />

                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      key="tac-nghiep"
                      fullWidth
                      label="Tác nghiệp"
                      size="small"
                      value={this.state.dataInput.METHOD_CODE}
                      disabled
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      key="Ctrno"
                      fullWidth
                      size="small"
                      value={this.state.dataInput.CNTRNO}
                      disabled
                      label="Số container"
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      key="number"
                      fullWidth
                      disabled
                      size="small"
                      label="SĐT*"
                      value={this.state.dataInput.OWNER_PHONE}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      key="boss"
                      fullWidth
                      disabled
                      size="small"
                      label="Chủ hàng"
                      value={this.state.dataInput.OWNER}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        label="Hạn lệnh"
                        inputFormat="DD/MM/YYYY"
                        disabled
                        value={this.state.dataInput.EXP_DATE ? this.state.dataInput.EXP_DATE : null}
                        renderInput={(params) => <TextField fullWidth size="small" readOnly {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      key="type-Good"
                      fullWidth
                      size="small"
                      disabled
                      label="Loại hàng"
                      value={this.state.dataInput.ITEM_TYPE_CODE}
                    />
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      key="HTTT"
                      fullWidth
                      disabled
                      size="small"
                      label="Hình thức thanh toán"
                      value={this.state.dataInput.ACC_TYPE}
                    />
                  </Grid>
                </Grid>

              </CardContent>
            </Card>
          </Grid>
          <Grid item md={9}>
            <Card style={{ marginBottom: "12px" }}>
              <CardHeader title="Thông tin chi tiết lệnh"></CardHeader>
              {/* ------------------------------- start - Chi tiết lệnh ---------------------------- */}
              <CardContent>
                <Grid>
                  <DataGrid
                    hideFooter={true}
                    className="m-table"
                    rows={this.state.dataTable}
                    rowHeight={35}
                    columns={this.inforOder}
                    sx={{ height: "63vh" }}
                  >
                  </DataGrid>
                </Grid>
              </CardContent>
            </Card>
          </Grid >
        </Grid >
        <Dialog
          open={this.state.dialogOrderNo.isOpen}
          croll="paper"
          fullWidth={true}
          maxWidth="md"
        >
          <Divider />
          <DialogTitle >Danh sách lệnh</DialogTitle>
          <DialogContent>
            <Card>
              <Grid>
                <DataGrid
                  hideFooter={true}
                  className="m-table"
                  rows={this.state.dataTableOrderNo}
                  rowHeight={35}
                  columns={this.listOrderNo}
                  sx={{ height: "63vh" }}
                  onRowClick={(params) => {
                    this.handleLoadBillOrBooking(params)
                    this.setState({
                      dialogOrderNo: {
                        isOpen: false,
                        type: 0
                      }
                    });
                  }}
                >

                </DataGrid>
              </Grid>

            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              this.setState({
                dialogOrderNo: {
                  isOpen: false,
                },
              })
            }}>Đóng</Button>

          </DialogActions>

        </Dialog>
        {this.state.dialogExportOrder.isOpen === true
          ?
          <DialogExportOrder
            dialog={this.state.dialogExportOrder}
            handleCloseDialog={() => {
              this.setState({
                dialogExportOrder: {
                  isOpen: false
                }
              })
            }}
          />
          : ''
        }
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
export default QueryInforOder;
