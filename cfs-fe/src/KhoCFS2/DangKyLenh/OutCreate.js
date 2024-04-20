import * as React from "react";
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import CustomerSelect from "../../componentsCFS2/dialog/CustomerSelect";
import ContNumberSelect from "../../componentsCFS2/dialog/ContNumberSelect";
import * as moment from "moment";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import QRCode from 'qrcode.react';
import DialogExportOrder from "../../componentsCFS2/dialog/dialogExportOrder";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import {
  Stack,
  Grid,
  Divider,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FixedPageName from "../../componentsCFS2/fixedPageName";
import SelectVessel from "../../componentsCFS2/dialog/SelectVessel"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid } from "@mui/x-data-grid";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class OutCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogExportOrder: {
        isOpen: false,
      },
      cusInfor: {},
      ownerInfor: {
        phone: '',
        cusName: '',
        desc: '',
        owner: ''
      },
      servicesTable: [],
      activeStep: 1,
      dataTable: [],
      backdropLoad: false,
      dialogSelectCont: {
        isOpen: false,
        type: 1,
      },
      confirmPopup: {
        isOpen: false,
        type: 1,
      },
      money: [],
      inforComamd: {
        BookingFWD: '',
        Lot: '',
        DO: '',
        EXP_DATE: moment(),
      },
      dialogSelectCus: {
        isOpen: false,
      },
      tableFilter: {
        Lot: '',
        packageMNF_BOOKING_FWD: '',
      },
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

    this.tableDetail = [
      {
        field: "packageMNF_BOOKING_FWD",
        headerName: "Booking_FWD",
        flex: 1
      },
      {
        field: "packageMNF_LOT_NO",
        headerName: "Số Lot",
        flex: 1
      },
      {
        field: "packageMNF_SHIPMARKS",
        headerName: "Shipmark",
        flex: 1
      },
      {
        field: "packageMNF_CUSTOMER_NAME",
        headerName: "Khách hàng",
        flex: 1
      },
      {
        field: "packageMNF_ITEM_TYPE_CODE",
        headerName: "Loại hàng hóa",
        flex: 1
      }, {
        field: "packageMNF_COMMODITYDESCRIPTION",
        headerName: "Mô tả hàng hóa",
        flex: 1
      }, {
        field: "packageMNF_CARGO_PIECE",
        headerName: "Số lượng",
        flex: 1
      }, {
        field: "packageMNF_UNIT_CODE",
        headerName: "Đơn vị tính",
        flex: 1
      }, {
        field: "packageMNF_CARGO_WEIGHT",
        headerName: "Trọng lượng",
        flex: 1
      }, {
        field: "packageMNF_CBM",
        headerName: "Số khối",
        flex: 1
      }, {
        field: "packageMNF_DECLARE_NO",
        headerName: "Số tờ khai",
        flex: 1
      },
    ];
  }

  handleLoadData() {
    let url = window.root_url + `dt-package-mnf-ld/getInEx`;
    let dataSend = {
      BOOKING_FWD: this.state.inforComamd.BookingFWD,
      VOYAGEKEY: this.state.vessel.VOYAGEKEY,
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
            dataTable: temp,
            alert: {
              isOpen: true,
              duration: 3000,
              type: "success",
              message: response.Message
            }
          })
        } else {
          this.setState({
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

  handleSavedatainputorder() {
    let url = window.root_url + `dt-order/insertOrder`;
    let dataSend = this.state.dataTable.map(item => {
      let obj = {};
      obj['VOYAGEKEY'] = this.state.vessel.VOYAGEKEY;
      obj['CLASS_CODE'] = 2;
      obj['CUSTOMER_CODE'] = item.consigneeInfo_CUSTOMER_CODE;
      obj['ACC_TYPE'] = item.consigneeInfo_ACC_TYPE ? item.consigneeInfo_ACC_TYPE : null;
      obj['DELIVERY_ORDER'] = null;
      obj['CNTRNO'] = item.packageMNF_CNTRNO;
      obj['ITEM_TYPE_CODE'] = item.packageMNF_ITEM_TYPE_CODE;
      obj['ITEM_TYPE_CODE_CNTR'] = item.packageMNF_ITEM_TYPE_CODE_CNTR;
      obj['BOOKING_FWD'] = item.packageMNF_BOOKING_FWD ? item.packageMNF_BOOKING_FWD : null;
      obj['BOOKING_NO'] = item.packageMNF_BOOKING_NO ? item.packageMNF_BOOKING_NO : null;
      obj['METHOD_CODE'] = "NKX";
      obj['CARGO_PIECE'] = item.packageMNF_CARGO_PIECE;
      obj['UNIT_CODE'] = item.packageMNF_UNIT_CODE;
      obj['CARGO_WEIGHT'] = item.packageMNF_CARGO_WEIGHT;
      obj['CBM'] = item.packageMNF_CBM;
      obj['CREATE_BY'] = JSON.parse(localStorage.getItem("userInfo")).name;
      obj['NOTE'] = this.state.ownerInfor.desc;
      obj['COMMODITYDESCRIPTION'] = item.packageMNF_COMMODITYDESCRIPTION ? item.packageMNF_COMMODITYDESCRIPTION : null;
      obj['LOT_NO'] = item.packageMNF_LOT_NO;
      obj['OWNER'] = this.state.ownerInfor.owner;
      obj['OWNER_REPRESENT'] = this.state.ownerInfor.cusName;
      obj['OWNER_PHONE'] = this.state.ownerInfor.phone;
      return obj;
    })
    let arr = []
    Object.keys(this.state.ownerInfor).forEach((p) => {
      if (this.state.ownerInfor[p] === '' && p !== 'desc') {
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
          this.setState({
            code: response.Payload,
            activeStep: 2,
            type: 'save'
          });
          localStorage.setItem("loadOrderNo", this.state.code[0].ORDER_NO)
        }
        else {
          this.setState({
            alert: {
              isOpen: true,
              message: response.Message,
              type: 'error',
              duration: 2000,
            }
          });
        }
        this.setState({
          backdropLoad: false
        });
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

  selectedVessel(data) {
    this.setState({
      vessel: data
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
              <CardHeader title="Thông tin lệnh" sx={{ textAlign: 'center', height: 40 }}>
              </CardHeader>
              <CardContent style={{ marginTop: -10 }}>
                <Grid container rowSpacing={1} columnSpacing={1}>
                  <Grid item md={12}>
                    <SelectVessel
                      orientation="vertical"
                      handleSelected={(data) => this.selectedVessel(data)}
                      activeStep={this.state.activeStep}
                    >
                    </SelectVessel>
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      key="MM"
                      fullWidth
                      size="small"
                      label="số Booking_FWD"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          this.handleLoadData({ type: 2 });
                        }
                      }}
                      value={this.state.inforComamd.BookingFWD}
                      onChange={(e) => {
                        this.setState({
                          inforComamd: {
                            ...this.state.inforComamd,
                            BookingFWD: e.target.value.trim()
                          }
                        })
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardHeader
                title="Thông tin chủ hàng"
                sx={{ textAlign: 'center', height: 40 }}
              >
              </CardHeader>
              <CardContent>
                <Grid container rowSpacing={1} columnSpacing={1}>
                  <Grid item md={12}>
                    <TextField
                      key="boss"
                      fullWidth
                      label="Chủ hàng*"
                      size="small"
                      value={this.state.ownerInfor.owner}
                      onChange={(e) => {
                        this.setState({
                          ownerInfor: {
                            ...this.state.ownerInfor,
                            owner: e.target.value
                          }
                        })
                      }}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      key="Name"
                      fullWidth
                      size="small"
                      label="Tên người đại diện*"
                      value={this.state.ownerInfor.cusName}
                      onChange={(e) => {
                        this.setState({
                          ownerInfor: {
                            ...this.state.ownerInfor,
                            cusName: e.target.value
                          }
                        })
                      }}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      key="number"
                      fullWidth
                      size="small"
                      label="SĐT*"
                      value={this.state.ownerInfor.phone}
                      onChange={(e) => {
                        this.setState({
                          ownerInfor: {
                            ...this.state.ownerInfor,
                            phone: e.target.value
                          }
                        })
                      }}
                    />
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      key="note"
                      fullWidth
                      size="small"
                      label="Ghi chú"
                      value={this.state.ownerInfor.desc}
                      onChange={(e) => {
                        this.setState({
                          ownerInfor: {
                            ...this.state.ownerInfor,
                            desc: e.target.value
                          }
                        })
                      }}
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
                {
                  this.state.activeStep === 1 ?
                    <Grid container>
                      <Grid item xs={12}>
                        <Stack mb={1} direction="row" spacing={50}  >
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography sx={{ width: 80 }} >Tìm kiếm:</Typography >
                            <TextField
                              id="tim-kiem"
                              onChange={(e) => {
                                this.setState({
                                  tableFilter: {
                                    packageMNF_BOOKING_FWD: e.target.value,
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
                        </Stack>
                        <Grid item mt={1} md={12}>
                          <DataGrid
                            className="m-table"
                            rows={(this.state.dataTable)
                              .filter(data => data.packageMNF_BOOKING_FWD?.toUpperCase().includes(this.state.tableFilter.packageMNF_BOOKING_FWD?.toUpperCase()))
                            }
                            rowHeight={35}
                            columns={this.tableDetail}
                            sx={{ height: "63vh" }}
                          >
                          </DataGrid>
                          <Stack mt={2} direction='row-reverse' justifyContent='space-between'>
                            <Button
                              sx={{ mb: 1 }}
                              variant='contained'
                              color='success'
                              onClick={() => {
                                this.setState({
                                  backdropLoad: true
                                });
                                this.handleSavedatainputorder();
                              }}>Lưu lệnh</Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>
                    : ""
                }
                {
                  this.state.activeStep === 2 ?

                    <div>
                      <TaskAltIcon mt={1} mb={1} sx={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', color: '#53c41a', fontSize: 100 }} />
                      <div style={{ textAlign: 'center', marginTop: '2vh', fontSize: 20 }}>
                        <div >
                          <span >Giao dịch đã được thực hiện thành công!</span>
                        </div>
                        {
                          this.state.type === 'payment'
                            ?
                            <div style={{ marginTop: '1vh', color: '#8389a4' }}>
                              <span style={{ fontWeight: 700 }}>Mã giao dịch: </span>
                              <span>{this.state.code ?? 'PAYMENTGW-ITCSP-3LHKB6AR15032023'}</span>
                            </div>
                            :
                            ''
                        }
                      </div>
                      <div>
                        <QRCode
                          style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '2vh' }}
                          size={80} />
                      </div>
                      <div style={{ textAlign: 'center', marginTop: '2vh', fontSize: 15 }}>
                        <div>
                          <span style={{ fontSize: 20, color: '#1c8ffa', fontWeight: 700 }}>Lệnh Nhập kho </span>
                        </div>
                        <div>
                          <span style={{ color: '#898c87', fontWeight: 700 }}> {`Mã lệnh(ORDER_No):`} </span>
                          {
                            this.state.type === 'payment'
                              ?
                              <span> {this.state.code ?? 'ITC230315032023'} </span>
                              :
                              <span> {this.state.code[0].ORDER_NO ?? ''} </span>
                          }
                        </div>
                        {
                          this.state.type === 'payment'
                            ?
                            <div>
                              <span style={{ color: '#898c87', fontWeight: 700 }}> Số hoá đơn: </span>
                              <span>{this.state.code ?? 'CS23TSP0000030'} </span>
                            </div>
                            : ''
                        }
                        <div>
                          <Button
                            onClick={() => {
                              this.setState({
                                dialogExportOrder: {
                                  isOpen: true,
                                  dataTable: this.state.code,
                                  inforVessel: this.state.vessel,
                                  inforCus: this.state.cusInfor,
                                }
                              })
                            }}
                            variant='contained'
                            color='success'
                          >
                            Xem lệnh
                          </Button>
                        </div>
                        <div style={{ marginTop: '1vh' }}>
                          <Button
                            onClick={() => {
                              window.location.reload(true);
                            }}
                            variant='contained'>
                            Làm lệnh mới
                          </Button>
                        </div>
                      </div>
                    </div>
                    :
                    ''
                }
                {/* --------------------------------- end - Thanh toán ------------------------------ */}

              </CardContent>
            </Card>
          </Grid >
        </Grid >
        <ConfirmPopup
          dialog={this.state.confirmPopup}
          text={'XÁC NHẬN THANH TOÁN?'}
          handleCloseDialog={(value) => {
            if (value === 'agree') {
              this.setState({
                activeStep: 2,
                type: 'payment',
                confirmPopup: {
                  isOpen: false,
                }
              })
            } else {
              this.setState({
                confirmPopup: {
                  isOpen: false
                }
              })
              return;
            }
          }} />
        <ContNumberSelect
          dialog={this.state.dialogSelectCont}
          vessel={this.state.vessel}
          data={this.state.data}
          ref={(data) => this.selectContPopup = data}
          handleSelect={(data) => this.handleViewData(data)}
          handleCloseDialog={() => {
            this.setState({
              dialogSelectCont: {
                isOpen: false
              }
            })
          }} />
        <CustomerSelect
          dialog={this.state.dialogSelectCus}
          handleSelect={(data) => {
            if (Object.keys(data).length > 0) {
              this.setState({
                inputAccount: data.CUSTOMER_CODE,
                dialogSelectCus: {
                  isOpen: false
                }
              })
              this.handleLoadCustomer(data.CUSTOMER_CODE);
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
        <Backdrop
          open={this.state.backdropLoad}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
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
export default OutCreate;

