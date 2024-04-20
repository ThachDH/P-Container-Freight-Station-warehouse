import * as React from "react";
import CustomerSelect from "../../componentsCFS2/dialog/CustomerSelect";
import ContNumberSelect from "../../componentsCFS2/dialog/ContNumberSelect";
import * as moment from "moment";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { DataGrid } from '@mui/x-data-grid';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from "@mui/material/CircularProgress";
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
  CardHeader,
  Tooltip,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@mui/material";
import QRCode from 'qrcode.react';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SearchIcon from '@mui/icons-material/Search';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FixedPageName from "../../componentsCFS2/fixedPageName";
import DialogExportOrder from "../../componentsCFS2/dialog/dialogExportOrder";
import SelectVessel from "../../componentsCFS2/dialog/SelectVessel";
import DialogConfirmPayment from "../../componentsCFS2/dialog/DialogConfirmPayMent";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class InExportOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogConfirmPayment: {
        isOpen: false,
      },
      backdropLoad: false,
      listMethodService: [],
      accorStatus: 'expanded',
      allServices: [],
      activeStep: 1,
      feeTariff: {},
      dialogFeeTariff: {
        isOpen: false,
        data: null,
        type: 0,
      },
      type: '',
      discountFee: '',
      totalTime: '',
      lstCD: [],
      vessel: {},
      contInfo: {},
      lstMethod: [],
      selectMethod: '',
      dataTableGoods: [],
      selectedCD: '',
      tableTariff: [],
      inputAccount: '',
      TotalDate: "",
      spendAccount: '',
      code: [],
      cusInfor: {},
      ownerInfor: {
        phone: '',
        cusName: '',
        desc: '',
        owner: ''
      },
      servicesTable: [],
      dialogExportOrder: {
        isOpen: false,
      },
      dialogSelectCont: {
        isOpen: false,
        type: 1,
      },
      confirmPopup: {
        isOpen: false,
        type: 1,
      },
      money: [],
      data: {
        HOUSE_BILL: '',
        DO: '',
        EXP_DATE: moment()
      },
      dialogSelectCus: {
        isOpen: false,
      },
      tableFilter: {
        CNTRNO: '',
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
    this.createTariffRows = (data) => data.map((row, index) => ({
      STT: index + 1,
      id: index,
      ...row
    }),
    );
    this.inforGoods = [
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
        flex: 1
      },
      {
        field: "ITEM_TYPE_CODE",
        headerName: "Loại hàng hóa",
        flex: 1
      },
      {
        field: "CARGO_PIECE",
        headerName: "Số lượng",
        flex: 1
      },
      {
        field: "UNIT_CODE",
        headerName: "ĐVT",
        flex: 1
      },
      {
        field: "CARGO_WEIGHT",
        headerName: "Trọng Lượng",
        flex: 1
      },
      {
        field: "CBM",
        headerName: "Số khối",
        flex: 1
      },
      {
        field: "ID",
        headerName: "ID",
        editable: false,
      },
    ];

    this.tariff = [
      {
        field: "TRF_DESC",
        headerName: "Diễn giải",
        align: 'center',
        flex: 3,
        headerAlign: 'center',
      },

      {
        field: "ITEM_TYPE_CODE",
        headerName: "Loại hàng hóa",
        flex: 1
      },
      {
        field: "QTY",
        headerName: "Số lượng",
        type: 'number',
        flex: 1
      },
      {
        field: "UNIT_RATE",
        headerName: "Đơn giá",
        type: 'number',
        flex: 1
      },
      {
        field: "AMOUNT",
        headerName: "Thành tiền",
        type: 'number',
        flex: 1
      },
      {
        field: "VAT",
        headerName: "VAT(%)",
        flex: 1
      },
      {
        field: "VAT_PRICE",
        headerName: "Tiền thuế",
        flex: 1
      },
      {
        field: "TAMOUNT",
        headerName: "Tổng tiền",
        type: 'number',
        flex: 1
      },
      {
        field: "cntr_mnf_ID",
        headerName: "ID",
        editable: false,
      },
    ];
  }

  handleLoadCustomer(data) {
    let url = window.root_url + `trf-stds/getCustomerInfo`;
    let dataSend = {
      CUSTOMER_CODE: this.state.inputAccount ? this.state.inputAccount : data
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
          this.handleLoadTariff(data.Payload);
          this.setState({
            cusInfor: data.Payload,
          })
        } else {
          this.setState({
            alert: {
              isOpen: true,
              duration: 3000,
              message: data.Message,
              type: 'error'
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

  componentDidMount() {
    this.handleLoadPayment();
  }

  handleSaveTariff(type) {
    let url, dataSend;
    let invDraft = {
      // ACC_TYPE: this.state.cusInfor.ACC_TYPE,
      // CUSTOMER_CODE: this.state.cusInfor.CUSTOMER_CODE,
      // UNIT_RATE: this.state.tableTariff[0].UNIT_RATE,
      // VAT_RATE: this.state.money.VAT_RATE,
      // TAMOUNT: this.state.money.TAMOUNT,
      // QTY: this.state.tableTariff[0].QTY,
      // CURRENCY_CODE: this.state.tableTariff[0].CURRENCY_CODE,
      vat_amount: parseFloat(this.state.money.VAT),
      sum_amount: parseFloat(this.state.money.AMOUNT),
      total_amount: parseFloat(this.state.money.TAMOUNT),
    };
    let datainvDraft = {
      ACC_TYPE: this.state.cusInfor.ACC_TYPE,
      CUSTOMER_CODE: this.state.cusInfor.CUSTOMER_CODE,
      UNIT_RATE: this.state.tableTariff[0].UNIT_RATE,
      VAT: this.state.money.VAT,
      AMOUNT: this.state.money.AMOUNT,
      TAMOUNT: this.state.money.TAMOUNT,
      QTY: this.state.tableTariff[0].QTY,
      CURRENCY_CODE: this.state.tableTariff[0].CURRENCY_CODE,
    };
    let detailDraft = this.state.tableTariff.map(item => {
      let obj = {};
      obj['UnitName'] = item.TRF_CODE === 'LK' ? "Ngày" : "Tấn doanh thu";
      obj['UnitRate'] = (item.UNIT_RATE).toLocaleString().replace(/\D/g, '');
      obj['Amount'] = (item.AMOUNT).toLocaleString().replace(/\D/g, '');
      obj['Qty'] = item.QTY;
      obj['TariffName'] = item.TRF_DESC;
      // obj['VAT_CHK'] = item.INCLUDE_VAT;
      // obj['TRF_CODE'] = item.TRF_CODE;
      // obj['UNIT_RATE'] = item.UNIT_RATE;
      // obj['CLASS_CODE'] = item.CLASS_CODE;
      // obj['ITEM_TYPE_CODE'] = item.ITEM_TYPE_CODE;
      // obj['QTY'] = item.QTY;
      // obj['AMOUNT'] = item.AMOUNT;
      // obj['VAT'] = item.VAT;
      // obj['VAT_RATE'] = item.VAT_RATE;
      // obj['TAMOUNT'] = item.TAMOUNT;
      // // obj['CNTRSZTP'] = this.state.tableOrder[0].CNTRSZTP;
      // obj['TRF_DESC'] = item.TRF_DESC;
      // obj['METHOD_CODE'] = item.METHOD_CODE;
      // obj['INCLUDE_VAT'] = item.INCLUDE_VAT;
      // obj['UNIT_CODE'] = this.state.dataTableGoods[0].UNIT_CODE;
      // obj['CREATE_BY'] = JSON.parse(localStorage.getItem("userInfo")).name;
      return obj;
    });
    let dataDraft = this.state.tableTariff.map(item => {
      let obj = {};
      obj['VAT_CHK'] = item.INCLUDE_VAT;
      obj['TRF_CODE'] = item.TRF_CODE;
      obj['UNIT_RATE'] = item.UNIT_RATE;
      obj['CLASS_CODE'] = item.CLASS_CODE;
      obj['ITEM_TYPE_CODE'] = item.ITEM_TYPE_CODE;
      obj['QTY'] = item.QTY;
      obj['AMOUNT'] = item.AMOUNT;
      obj['VAT_RATE'] = item.VAT;
      obj['VAT'] = item.VAT_PRICE;
      obj['TAMOUNT'] = item.TAMOUNT;
      // obj['CNTRSZTP'] = this.state.tableOrder[0].CNTRSZTP;
      obj['TRF_DESC'] = item.TRF_DESC;
      obj['METHOD_CODE'] = item.METHOD_CODE;
      obj['INCLUDE_VAT'] = item.INCLUDE_VAT;
      obj['UNIT_CODE'] = this.state.dataTableGoods[0].UNIT_CODE;
      obj['CREATE_BY'] = JSON.parse(localStorage.getItem("userInfo")).name;
      return obj;
    });
    let data = this.state.dataTableGoods.map(item => {
      let obj = {};
      obj['VOYAGEKEY'] = item.VOYAGEKEY;
      obj['CLASS_CODE'] = item.CLASS_CODE;
      obj['CUSTOMER_CODE'] = this.state.cusInfor.CUSTOMER_CODE ? this.state.cusInfor.CUSTOMER_CODE : null;
      obj['ACC_TYPE'] = this.state.cusInfor.ACC_TYPE ? this.state.cusInfor.ACC_TYPE : null;
      obj['ACC_CD'] = this.state.selectedCD.split(' : ')[0].trim() ? this.state.selectedCD.split(' : ')[0].trim() : null;
      obj['DELIVERY_ORDER'] = this.state.data.DO ? this.state.data.DO : null;
      obj['BILLOFLADING'] = null;
      obj['CNTRNO'] = item.CNTRNO;
      obj['ITEM_TYPE_CODE'] = item.ITEM_TYPE_CODE;
      obj['CNTRSZTP'] = null;
      obj['METHOD_CODE'] = "XKN";
      obj['EXP_DATE'] = moment(this.state.data.EXP_DATE);
      obj['HOUSE_BILL'] = item.HOUSE_BILL;
      obj['CARGO_PIECE'] = item.CARGO_PIECE;
      obj['UNIT_CODE'] = item.UNIT_CODE;
      obj['CARGO_WEIGHT'] = item.CARGO_WEIGHT;
      obj['CBM'] = item.CBM;
      obj['OWNER'] = this.state.ownerInfor.owner;
      obj['OWNER_REPRESENT'] = this.state.ownerInfor.cusName;
      obj['OWNER_PHONE'] = this.state.ownerInfor.phone;
      obj['RT'] = item.CBM / 1.5;
      obj['CREATE_BY'] = JSON.parse(localStorage.getItem("userInfo")).name;
      obj['NOTE'] = this.state.ownerInfor.desc;
      obj['TAX_CODE'] = this.state.cusInfor.TAX_CODE;
      obj['ADDRESS'] = this.state.cusInfor.ADDRESS;
      obj['CUSTOMER_NAME'] = this.state.cusInfor.CUSTOMER_NAME;
      obj['COMMODITYDESCRIPTION'] = item.COMMODITYDESCRIPTION ? item.COMMODITYDESCRIPTION : null;
      obj['INV_DRAFT'] = Object.assign({ datainvDraft, DETAIL_DRAFT: dataDraft });
      return obj;
    });
    if (type === 1) {
      dataSend = data;
      url = window.root_url + `dt-order/insertOrder`;
    } else {
      dataSend = { orderReq: data, invVatReq: Object.assign(invDraft, { datas: detailDraft }) };
      url = window.root_url + `vat-invoice/publicVATInvoice`;
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
        this.setState({
          backdropLoad: false
        })
        if (response.Status) {
          this.setState({
            dialogConfirmPayment: { isOpen: false },
            code: response.Payload.order_noInfo,
            activeStep: 3,
            type: type,
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
        data.map(item => {
          arr.push(item.value = `${item.ACC_TYPE} : ${item.ACC_NO}`);
          return item;
        })
        this.setState({
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

  selectedVessel(data) {
    this.setState({
      vessel: data
    })
  }
  handleLoadTariff(params) {
    let url = window.root_url + `trf-stds/getToBillExOrder`;
    if (this.state.inputAccount === '') {
      this.setState({
        alert: {
          isOpen: true,
          message: 'Vui lòng nhập mã khách hàng!',
          duration: 2000,
          type: 'error'
        }
      })
      return;
    }
    let dataSend = this.state.dataTableGoods.map(item => {
      item['EXP_DATE'] = this.state.data.EXP_DATE;
      item['CUSTOMER_CODE'] = params.CUSTOMER_CODE;
      return item;
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
        if (data.Status) {
          if (data.Payload[0].QTY === 0) {
            this.setState({
              alert: {
                isOpen: true,
                type: "warning",
                duration: 3000,
                message: "Không phát sinh phí lưu kho"
              }
            })
          }
          let obj = {
            TAMOUNT: 0,
            AMOUNT: 0,
            VAT: 0
          }
          data.Payload.map(item => {
            obj.TAMOUNT += Number(item.TAMOUNT)
            obj.AMOUNT += Number(item.AMOUNT)
            obj.VAT += Number(item.VAT_PRICE)
            return obj;
          });
          data.Payload.map(e => {
            e.AMOUNT = Number(e.AMOUNT).toLocaleString()
            e.TAMOUNT = Number(e.TAMOUNT).toLocaleString()
            e.UNIT_RATE = Number(e.UNIT_RATE).toLocaleString()
            e.VAT_PRICE = Number(e.VAT_PRICE).toLocaleString()
            return e;
          })
          let temp = this.createTariffRows(data.Payload);
          this.setState({
            spendAccount: this.state.inputAccount,
            tableTariff: temp,
            money: obj,

          })
        } else {
          this.setState({
            alert: {
              type: 'warning',
              message: data.Message,
              duration: 3000,
              isOpen: true
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

  handleLoadData() {
    let url = window.root_url + `dt-package-stock/get`;
    let dataSend = {
      HOUSE_BILL: this.state.data.HOUSE_BILL,
      VOYAGEKEY: this.state.vessel.VOYAGEKEY,
      CNTRNO: this.state.vessel.CNTRNO,
    }
    if (this.state.vessel.VOYAGEKEY === undefined) {
      this.setState({
        alert: {
          isOpen: true,
          type: "warning",
          duration: 3000,
          message: "Vui lòng chọn tàu chuyến"
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
      .then(data => {
        if (data.Status) {
          let temp = this.createRows(data.Payload);
          this.setState({
            dataTableGoods: temp,
          });
        }
        else {
          this.setState({
            alert: {
              type: 'warning',
              message: data.Message,
              duration: 3000,
              isOpen: true
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

  handleCheckData() {
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
    if (this.state.dataTableGoods.length === 0) {
      this.setState({
        alert: {
          isOpen: true,
          message: 'Chưa có thông tin chi tiết lệnh!',
          type: 'warning',
          duration: 2000,
        }
      })
      return;
    } else {
      this.setState({
        activeStep: 2
      })
    }
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
                      disabled={this.state.activeStep !== 1 ? true : false}
                      key="HB"
                      fullWidth
                      size="small"
                      label="Số House_Bill"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          this.handleLoadData({ type: 1 });
                        }
                      }}
                      value={this.state.data.HOUSE_BILL}
                      onChange={(e) => {
                        this.setState({
                          data: {
                            ...this.state.data,
                            HOUSE_BILL: e.target.value.trim()
                          }
                        })
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon onClick={(e) => {
                            }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      disabled={this.state.activeStep !== 1 ? true : false}
                      key="DO"
                      fullWidth
                      label="DO"
                      value={this.state.data.DO}
                      size="small"
                      onChange={(e) => {
                        this.setState({
                          data: {
                            ...this.state.data,
                            DO: e.target.value
                          }
                        })
                      }} />
                  </Grid>
                  <Grid item md={6}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        disabled={this.state.activeStep !== 1 ? true : false}
                        label="Hạn lệnh"
                        inputFormat="DD/MM/YYYY"
                        value={this.state.data.EXP_DATE}
                        onChange={(newValue) => {
                          this.setState({
                            data: {
                              ...this.state.data,
                              EXP_DATE: moment(newValue)
                            }
                          })
                        }}
                        renderInput={(params) => <TextField fullWidth size="small" readOnly {...params} />}
                      />
                    </LocalizationProvider>
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
                      disabled={this.state.activeStep !== 1 ? true : false}
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
                      disabled={this.state.activeStep !== 1 ? true : false}
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
                      disabled={this.state.activeStep !== 1 ? true : false}
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
                      disabled={this.state.activeStep !== 1 ? true : false}
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
              <CardContent>
                <Stepper activeStep={this.state.activeStep} style={{ marginBottom: "20px" }}>
                  <Step key="detail">
                    <StepLabel>
                      Chi tiết lệnh
                    </StepLabel>
                  </Step>
                  <Step key="tarif">
                    <StepLabel>
                      Tính cước
                    </StepLabel>
                  </Step>
                  <Step key="payment">
                    <StepLabel>
                      Thanh toán
                    </StepLabel>
                  </Step>
                </Stepper>
                {/* ------------------------------- start - Chi tiết lệnh ---------------------------- */}
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
                                    CNTRNO: e.target.value,
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
                        <Divider />
                        <Grid item mt={1} md={12}>
                          <DataGrid
                            hideFooter={true}
                            className="m-table"
                            rows={(this.state.dataTableGoods)}
                            rowHeight={35}
                            columns={this.inforGoods}
                            columnVisibilityModel={{
                              ID: false
                            }}
                            sx={{ height: "63vh" }}
                          >
                          </DataGrid>
                          <Stack mt={1} direction='row-reverse' justifyContent='space-between'>
                            <Button
                              sx={{ mb: 1 }}
                              variant='contained'
                              color='success'
                              onClick={() => {
                                this.handleCheckData();
                                if (this.state.spendAccount !== '') {
                                  this.handleLoadCustomer();
                                }
                              }}>Tiếp tục</Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>
                    : ""
                }
                {/* --------------------------------- end - Chi tiết lệnh ------------------------------ */}

                {/* --------------------------------- start - Tính cước ------------------------------ */}
                {
                  this.state.activeStep === 2
                    ?
                    this.state.spendAccount === ''
                      ?
                      /* --------------------------------- Nhập mã khách hàng ------------------------------ */
                      <div >
                        <InboxOutlinedIcon mt={1} mb={1} sx={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', fontSize: 100, color: '#66d9ff' }} />
                        <div style={{ textAlign: 'center', marginTop: '2vh', fontSize: 15 }}>
                          <span>Vui lòng nhập mã khách hàng để nạp dữ liệu</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <TextField
                            sx={{ width: 500, mt: 1 }}
                            placeholder="Tìm theo mã khách hàng..."
                            value={this.state.inputAccount}
                            onClick={(e) => {
                              this.setState({
                                dialogSelectCus: {
                                  isOpen: true,
                                }
                              })
                            }}
                          />
                        </div>
                        <Button
                          sx={{ marginTop: '5vh' }}
                          variant='contained'
                          onClick={() => {
                            this.setState({
                              activeStep: 1
                            })
                          }}>Quay lại</Button>
                      </div>
                      :

                      /* --------------------------------- Thông tin khách hàng ------------------------------ */
                      <>
                        <Grid>
                          <Grid item xs={2} sx={{ position: "absolute", right: "40px" }}>
                            <Autocomplete
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
                                  sx={{ width: "200px" }}

                                  {...params}
                                  readOnly
                                  placeholder="Hình thức thanh toán"
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                        <Grid container sx={{ mt: 7 }} spacing={2}>
                          <Stack>

                          </Stack>
                          <Grid item xs={8} justifyContent="space-between">
                            <Stack divider={<Divider flexItem />} spacing={2}>
                              <Stack spacing={2} divider={<Divider orientation="vertical" flexItem />} direction='row' alignItems='center'>
                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                  <span>
                                    Mã số thuế
                                  </span>
                                </Grid>
                                <Grid item xs={10} display="flex" justifyContent="space-between">
                                  <span style={{ color: '#2f82c1' }}>
                                    {this.state.cusInfor.TAX_CODE ?? ''}
                                  </span>
                                  <Tooltip title='Thay đổi đối tượng thanh toán!' placement="top" arrow>
                                    <PersonSearchIcon
                                      sx={{ color: '#fbca84', cursor: "pointer" }}
                                      onClick={() => {
                                        this.setState({
                                          spendAccount: '',
                                          inputAccount: '',
                                        })
                                      }} />
                                  </Tooltip>
                                </Grid>
                              </Stack><Stack spacing={2} divider={<Divider orientation="vertical" flexItem />} direction='row' alignItems='center'>
                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                  <span>
                                    Khách hàng
                                  </span>
                                </Grid>
                                <Grid item xs={10}>
                                  <span style={{ color: '#2f82c1' }}>
                                    {this.state.cusInfor.CUSTOMER_NAME ?? ''}
                                  </span>
                                </Grid>
                              </Stack>
                              <Stack spacing={2} divider={<Divider orientation="vertical" flexItem />} direction='row' alignItems='center'>
                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                  <span>
                                    Địa chỉ
                                  </span>
                                </Grid>
                                <Grid item xs={10}>
                                  <span style={{ color: '#2f82c1' }}>
                                    {this.state.cusInfor.ADDRESS ?? ''}
                                  </span>
                                </Grid>
                              </Stack>
                            </Stack>
                          </Grid>
                          <Divider sx={{ mr: -1, ml: 1 }} orientation="vertical" flexItem textAlign="center" />
                          <Grid item xs={3.5} justifyContent="space-between" >
                            <Stack divider={<Divider flexItem />} spacing={2}  >
                              <Stack spacing={2} divider={<Divider orientation="vertical" flexItem />} direction='row' alignItems='center'>
                                <Grid item xs={5} sx={{ textAlign: 'center' }} width="150px">
                                  <span>
                                    Thành tiền
                                  </span>
                                </Grid>
                                <Grid item xs={7}>
                                  <span style={{ color: '#2f82c1' }}>
                                    {Number(this.state.money.AMOUNT ?? '').toLocaleString()}
                                  </span>
                                </Grid>
                              </Stack>
                              <Stack spacing={2} divider={<Divider orientation="vertical" flexItem />} direction='row' alignItems='center'>
                                <Grid item xs={5} sx={{ textAlign: 'center' }} width="150px">
                                  <span>
                                    Tiền thuế
                                  </span>
                                </Grid>
                                <Grid item xs={7}>
                                  <span style={{ color: '#2f82c1' }}>
                                    {Number(this.state.money.VAT ?? '').toLocaleString()}
                                  </span>
                                </Grid>
                              </Stack>
                              <Stack spacing={2} divider={<Divider orientation="vertical" flexItem />} direction='row' alignItems='center'>
                                <Grid item xs={5} sx={{ textAlign: 'center' }} width="150px">
                                  <span>
                                    Tổng tiền
                                  </span>
                                </Grid>
                                <Grid item xs={7}>
                                  <span style={{ color: '#2f82c1' }}>
                                    {Number(this.state.money.TAMOUNT ?? '').toLocaleString()}
                                  </span>
                                </Grid>
                              </Stack>
                            </Stack>
                          </Grid>
                        </Grid>
                        <Grid container sx={{ mt: 2 }}>
                          <Grid item xs={12} >

                            {/* --------------------------------- Lưới Details ------------------------------ */}
                            <Grid item mt={1} md={12} sx={{ mt: 3 }}>
                              <DataGrid
                                hideFooter={true}
                                className="m-table"
                                rows={(this.state.tableTariff)}
                                rowHeight={35}
                                columns={this.tariff}
                                columnVisibilityModel={{
                                  cntr_mnf_ID: false
                                }}
                                sx={{ height: "40vh" }}

                              >
                              </DataGrid>
                              <Stack mt={1} direction='row' justifyContent='space-between'>
                                <Button
                                  variant='contained'
                                  onClick={() => {
                                    this.setState({
                                      activeStep: 1
                                    })
                                  }}>Quay lại</Button>
                                <Stack direction='row' spacing={1} alignItems='center'>
                                  <Button
                                    variant='contained'
                                    color='success'
                                    onClick={() => {
                                      this.setState({
                                        // backdropLoad: true,
                                        dialogConfirmPayment: {
                                          isOpen: true,
                                          dataPay: this.state.selectedCD.split(' : ')[0].trim(),
                                          dataBill: this.state.money,
                                          dataCus: this.state.cusInfor,
                                        }
                                      })
                                    }}>Xác nhận thanh toán</Button>
                                </Stack>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    :
                    ''
                }
                {/* --------------------------------- end - Tính cước ------------------------------ */}

                {/* --------------------------------- start - Thanh toán ------------------------------ */}
                {
                  this.state.activeStep === 3 ?

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
                          <span style={{ fontSize: 20, color: '#1c8ffa', fontWeight: 700 }}>Lệnh Xuất kho</span>
                        </div>
                        <div>
                          <span style={{ color: '#898c87', fontWeight: 700 }}> {`Mã lệnh(ORDER_No):`} </span>
                          {
                            this.state.type === 'payment'
                              ?
                              <span> {this.state.code ?? 'ITC230315032023'} </span>
                              :
                              <span> {this.state.code[0]?.ORDER_NO ?? ''} </span>
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
                        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                          <Button
                            onClick={() => {
                              window.location.reload(true);
                            }}
                            variant='contained'>
                            Làm lệnh mới
                          </Button>
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
                          {
                            this.state.type === 2
                              ?
                              <Button
                                component='a'
                                href={window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ?
                                  `http://${window.location.hostname}:3000/vat-invoice/downloadInvPDF/${this.state.code[0].ORDER_NO}` :
                                  `https://${window.location.hostname}/api/vat-invoice/downloadInvPDF/${this.state.code[0].ORDER_NO}`
                                }
                                variant='contained'
                                sx={{ marginLeft: 1 }}
                                target="_blank"
                              >
                                Xem hoá đơn
                              </Button>
                              : ''
                          }
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
        {/* ---------------------------------dialog - thông tin cước ------------------------------ */}
        {/* <ConfirmPopup
          dialog={this.state.confirmPopup}
          text={'XÁC NHẬN THANH TOÁN?'}
          handleCloseDialog={(value) => {
            if (value === 'agree') {
              this.setState({
                activeStep: 3,
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
          }} /> */}
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
        <DialogConfirmPayment
          dialog={this.state.dialogConfirmPayment}
          handleCloseDialog={() => {
            this.setState({ dialogConfirmPayment: { isOpen: false } })
          }}
          handleSaveOrder={(type) => this.handleSaveTariff(type)}
        >
        </DialogConfirmPayment>
        <Backdrop
          sx={{ color: "#fff", zIndex: 99 }}
          open={this.state.backdropLoad}
        >
          < CircularProgress color="inherit" />
        </Backdrop>
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

export default InExportOrder;