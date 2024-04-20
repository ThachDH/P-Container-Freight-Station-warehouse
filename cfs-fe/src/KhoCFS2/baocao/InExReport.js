import * as moment from "moment";
import * as React from "react";
import {
  Box,
  Paper,
  Button,
  Autocomplete,
  Card,
  CardContent,
  Divider,
  Popper,
  Grid,
  FormControl,
  RadioGroup,
  Stack,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ExportCSV from "../../components/caiDat/ExportCSV";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class InExReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [],
      headerData: {
        CLASS_CODE: '',
        ITEM_TYPE: '',
        FROM_DATE: moment().subtract(1, "days"),
        TO_DATE: moment(),
        isInOut: 'S,D',
        NumberDays: "",
      },
      itemList: [],
      total: {
        SUM_CARGO_WEIGHT: 0,
        SUM_CARGO_PIECE: 0,
        SUM_CBM: 0,
      },
      showMore: {
        popper: false,
        cell: false,
        anchor: null,
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
        width: 70,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "CNTRNO",
        headerName: "Số container",
        align: "center",
        width: 150,
        headerAlign: "center",
      },
      {
        field: "CNTRSZTP",
        headerName: "Kích cỡ",
        align: "center",
        width: 100,
        headerAlign: "center",
      },
      {
        field: "VESSEL_NAME",
        headerName: "Tên tàu",
        width: 300,
        align: "center",
        headerAlign: "center",
      },
      {
        field: 'INBOUND_OUTBOUND',
        headerName: 'Chuyến ',
        align: "center",
        width: 100,
        headerAlign: "center",
      },
      {
        field: "CONSIGNEE",
        headerName: "Đại lý",
        width: 250,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "HB_BK",
        headerName: "House_Bill/Booking",
        width: 250,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "ITEM_TYPE_CODE",
        headerName: "Loại hàng",
        align: "center",
        headerAlign: "center",
      },
      {
        field: "COMMODITYDESCRIPTION",
        headerName: "Mô tả hàng hoá",
        align: "center",
        width: 250,
        headerAlign: "center",
      },
      {
        field: "CUSTOMER_NAME",
        headerName: "Chủ hàng",
        width: 250,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          return this.showMoreDetails(params);
        }
      },
      {
        field: "CARGO_PIECE",
        headerName: "Số lượng",
        align: "center",
        width: 80,
        headerAlign: "center",
      },
      {
        field: "UNIT_CODE",
        headerName: "Đơn vị tính",
        align: "center",
        width: 80,
        headerAlign: "center",
      },
      {
        field: "CARGO_WEIGHT",
        headerName: "Trọng lượng",
        align: "center",
        width: 100,
        headerAlign: "center",
      },
      {
        field: "CBM",
        headerName: " Số khối",
        align: "center",
        width: 100,
        headerAlign: "center",
      },
      {
        field: "WAREHOUSE_CODE",
        headerName: "Kho",
        width: 250,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "TIME_IN",
        headerName: "Ngày nhập kho",
        align: "center",
        width: 150,
        headerAlign: "center",
        renderCell: (params) => {
          if (params.value) {
            params.value = moment(params.value).format('DD/MM/YYYY')
          }
          return params.value
        }
      },
      {
        field: "TIME_OUT",
        headerName: "Ngày xuất kho",
        align: "center",
        width: 150,
        headerAlign: "center",
        renderCell: (params) => {
          if (params.value) {
            params.value = moment(params.value).format('DD/MM/YYYY')
          }
          return params.value
        }
      },
      {
        field: "TLHQ",
        headerName: "TLHQ",
        align: "center",
        width: 80,
        headerAlign: "center",
        renderCell: (params) => {
          if (params.value === true) {
            params.value = 'Đã thanh lý'
          } else {
            params.value = 'Chưa thanh lý'
          }
          return params.value
        }
      },
      {
        field: "TKHN_NO",
        headerName: "Số tờ khai",
        align: "center",
        width: 80,
        headerAlign: "center",
      },
      {
        field: "RECEIPT_NO",
        headerName: "Số phiếu nhập",
        align: "center",
        width: 150,
        headerAlign: "center",
      },
      {
        field: "ORDER_NO",
        headerName: "Số lệnh",
        width: 150,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "STOCK_TIME",
        headerName: "Tồn kho",
        width: 250,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          let b = String(params.value)
          if (b.charAt(0) === '-') {
            b.substring(1);
            params.value = b;
          }
          return params.value + ' ngày'
        }
      },
      {
        field: "NOTE",
        headerName: "Ghi chú",
        width: 250,
        align: "center",
        headerAlign: "center",
      },
    ];
    this.createRows = (data) => data.map((row, index) => ({
      id: index,
      STT: index + 1,
      INBOUND_OUTBOUND: this.state.headerData.CLASS_CODE === 1 ? row.INBOUND_VOYAGE : row.OUTBOUND_VOYAGE,
      HB_BK: this.state.headerData.CLASS_CODE === 1 ? row.HOUSE_BILL : row.BOOKING_FWD,
      ...row
    }),
    );
  }

  showMoreDetails(params) {
    return (
      <Box
        onMouseEnter={(e) => {
          this.setState({
            showMore: {
              text: params.value,
              anchor: e.currentTarget,
              popper: true,
              cell: true,
            }
          })
        }}
        onMouseLeave={() => {
          this.setState({
            showMore: {
              text: '',
              popper: false,
              cell: false,
              anchor: null
            }
          })
        }}
        sx={{
          alignItems: 'center',
          lineHeight: '24px',
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: params.colDef.computedWidth,
            display: 'block',
            position: 'absolute',
            top: 0,
          }}
        />
        <Box
          sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {params.value ?? ''}
        </Box>
        {this.state.showMore.popper && (
          <Popper
            open={this.state.showMore.cell && this.state.showMore.anchor !== null}
            anchorEl={this.state.showMore.anchor}
            style={{ width: params.colDef.computedWidth, marginLeft: -17 }}
          >
            <Paper
              elevation={1}
            >
              <Typography variant="body2" style={{ padding: 8 }}>
                {this.state.showMore.text ?? ''}
              </Typography>
            </Paper>
          </Popper>
        )
        }
      </Box>
    )
  }

  componentDidMount() {
    this.handleLoadItemType();
  }

  handleLoadItemType() {
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
        if (data) {
          let temp = data.map(item => item.ITEM_TYPE_CODE);
          this.setState({
            itemList: temp,
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

  handleViewData() {
    let dataSend = {
      NumberDays: this.state.headerData.isInOut === 'S' ? this.state.headerData.NumberDays : "",
      FROM_DATE: this.state.headerData.FROM_DATE,
      TO_DATE: this.state.headerData.TO_DATE,
      ITEM_TYPE_CODE: this.state.headerData.ITEM_TYPE,
      CLASS_CODE: this.state.headerData.CLASS_CODE,
      STATUS: this.state.headerData.isInOut,
    }
    let url = window.root_url + `report/inExWareHouse`;
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
        if (data.length > 0) {
          let obj = {
            SUM_CARGO_PIECE: 0,
            SUM_CARGO_WEIGHT: 0,
            SUM_CBM: 0,
          };
          let newTemp = data.map(item => {
            item.INBOUND_OUTBOUND = item.INBOUND_OUTBOUND ? item.INBOUND_OUTBOUND : '';
            item.BILLOFLADING = item.BILLOFLADING ? item.BILLOFLADING[0] : '';
            item.CLASS_CODE = item.CLASS_CODE ? item.CLASS_CODE[0] : '';
            item.CNTRNO = item.CNTRNO ? item.CNTRNO[0] : '';
            item.CNTRSZTP = item.CNTRSZTP ? item.CNTRSZTP[0] : '';
            item.COMMODITYDESCRIPTION = item.COMMODITYDESCRIPTION ? item.COMMODITYDESCRIPTION[0] : '';
            item.CONSIGNEE = item.CONSIGNEE ? item.CONSIGNEE[0] : '';
            item.CUSTOMER_NAME = item.CUSTOMER_NAME ? item.CUSTOMER_NAME[0] : '';
            item.ID = item.ID[0];
            item.ITEM_TYPE_CODE = item.ITEM_TYPE_CODE ? item.ITEM_TYPE_CODE[0] : '';
            item.ITEM_TYPE_CODE_CNTR = item.ITEM_TYPE_CODE_CNTR ? item.ITEM_TYPE_CODE_CNTR[0] : '';
            item.LOT_NO = item.LOT_NO ? item.LOT_NO[0] : '';
            item.ORDER_NO = item.ORDER_NO ? item.ORDER_NO[0] : '';
            item.RECEIPT_NO = item.RECEIPT_NO ? item.RECEIPT_NO[0] : '';
            item.TIME_IN = item.TIME_IN ? item.TIME_IN[0] : '';
            item.TIME_OUT = item.TIME_OUT ? item.TIME_OUT[0] : '';
            item.UNIT_CODE = item.UNIT_CODE ? item.UNIT_CODE[0] : '';
            item.CARGO_PIECE = item.CARGO_PIECE ? item.CARGO_PIECE[0] : '';
            item.CARGO_WEIGHT = item.CARGO_WEIGHT ? item.CARGO_WEIGHT[0] : '';
            item.CBM = item.CBM ? item.CBM[0] : '';
            item.VESSEL_NAME = item.VESSEL_NAME ? item.VESSEL_NAME[0] : '';
            item.VOYAGEKEY = item.VOYAGEKEY ? item.VOYAGEKEY[0] : '';
            item.WAREHOUSE_CODE = item.WAREHOUSE_CODE ? item.WAREHOUSE_CODE[0] : '';
            obj.SUM_CARGO_PIECE += Number(item.CARGO_PIECE);
            obj.SUM_CARGO_WEIGHT += Number(item.CARGO_WEIGHT);
            obj.SUM_CBM += Number(item.CBM);
            let timeIn = new Date(item.TIME_IN);
            let currentTime = new Date();
            item.STOCK_TIME = Math.ceil((currentTime.getTime() - timeIn.getTime()) / (1000 * 3600 * 24));
            return item;
          });
          let countCont = newTemp.map(item => item.CNTRNO + "-" + item.CNTRSZTP).filter((p, index, self) => self.indexOf(p) === index).map(f => f.split("-")[1]).map(e => e.charAt(0)).filter(k => k.split("-")[0]);
          let temp = this.createRows(newTemp);
          this.setState({
            totalCont: countCont,
            total: obj,
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
            totalCont: [],
            total: {},
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
        console.log(err)
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
            <Grid>
              <Divider textAlign="center">
                <span className="m-filter-title">Lọc dữ liệu</span>
              </Divider>
            </Grid>
            <Stack spacing={2}>
              <Stack direction='row' spacing={1}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Từ ngày"
                    inputFormat="DD/MM/YYYY"
                    value={this.state.headerData.FROM_DATE}
                    onChange={(newValue) => {
                      this.setState({
                        headerData: {
                          ...this.state.headerData,
                          FROM_DATE: moment(newValue)
                        }
                      })
                    }}
                    renderInput={(params) => <TextField size="small" {...params} />}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Đến ngày"
                    inputFormat="DD/MM/YYYY"
                    value={this.state.headerData.TO_DATE}
                    onChange={(newValue) => {
                      this.setState({
                        headerData: {
                          ...this.state.headerData,
                          TO_DATE: moment(newValue)
                        }
                      })
                    }}
                    renderInput={(params) => <TextField size="small" {...params} />}
                  />
                </LocalizationProvider>
                <Divider orientation='vertical' flexItem />
                <Autocomplete
                  sx={{ width: '200px' }}
                  id="tags-outlined"
                  options={["", 1, 2]}
                  defaultValue={''}
                  size="small"
                  onChange={(event, listSelected) => {
                    this.setState({
                      headerData: {
                        ...this.state.headerData,
                        CLASS_CODE: listSelected
                      }
                    })
                  }}
                  getOptionLabel={(params) => {
                    if (params === 1) {
                      params = 'Nhập'
                    } else if (params === 2) {
                      params = 'Xuất'
                    } else {
                      params = 'Tất cả'
                    }
                    return params
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      readOnly
                      label='Huớng'
                    />
                  )}
                />
                <Autocomplete
                  sx={{ width: '200px' }}
                  id="tags-outlined"
                  defaultValue={''}
                  options={this.state.itemList || []}
                  size="small"
                  onChange={(event, listSelected) => {
                    this.setState({
                      headerData: {
                        ...this.state.headerData,
                        ITEM_TYPE: listSelected
                      }
                    })
                  }}
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
                      label='Loại hàng'
                    />
                  )}
                />
                {/* <Autocomplete
                  disabled={this.state.headerData.isInOut === 'S' ? false : true}
                  sx={{ width: '200px' }}
                  id="tags-outlined"
                  defaultValue={30}
                  options={[30, 60, 90]}
                  size="small"
                  onChange={(event, days) => {
                    this.setState({
                      headerData: {
                        ...this.state.headerData,
                        NumberDays: days
                      }
                    })
                  }}
                  getOptionLabel={(params) => {
                    return params + ' ngày'
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      readOnly
                      label='Số ngày tồn'
                      onChange={(event, days) => {
                        this.setState({
                          headerData: {
                            ...this.state.headerData,
                            NumberDays: days
                          }
                        })
                      }}
                    />
                  )}
                /> */}
                <TextField
                  id="so-ngay-ton"
                  label='Số ngày tồn'
                  type={'number'}
                  disabled={this.state.headerData.isInOut === 'S' ? false : true}
                  sx={{ width: '200px' }}
                  size="small"
                  value={this.state.headerData.isInOut === 'S' ? this.state.headerData.NumberDays : ""}
                  onChange={(event) => {
                    this.setState({
                      headerData: {
                        ...this.state.headerData,
                        NumberDays: event.target.value
                      }
                    })
                  }}
                />
              </Stack>
              <Stack direction='row' spacing={1}>
                <FormControl>
                  <RadioGroup
                    sx={{ marginLeft: "2vh" }}
                    name="filterType"
                    defaultValue={'S,D'}
                    row
                    value={this.state.isInOut}
                  >
                    <FormControlLabel
                      value={'S,D'}
                      control={
                        <Radio />}
                      label="Nhập kho"
                      onChange={() => {
                        this.setState({
                          dataTable: [],
                          headerData: {
                            ...this.state.headerData,
                            isInOut: 'S,D',
                          }
                        })
                      }} />
                    <FormControlLabel
                      value={'D'}
                      control={
                        <Radio />} label="Xuất kho"
                      onChange={() => {
                        this.setState({
                          dataTable: [],
                          headerData: {
                            ...this.state.headerData,
                            isInOut: 'D',
                          }
                        })
                      }} />
                    <FormControlLabel
                      value={'S'}
                      control={
                        <Radio />} label="Tồn kho"
                      onChange={() => {
                        this.setState({
                          dataTable: [],
                          headerData: {
                            ...this.state.headerData,
                            isInOut: 'S',
                          }
                        })
                      }} />
                  </RadioGroup>
                </FormControl>
                <Divider flexItem orientation='vertical' />
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => this.handleViewData()} >
                  Nạp dữ liệu
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card >
        <Card style={{ marginBottom: "12px" }}>
          <CardContent>
            <Grid item mt={1} xs={12} style={{ flexGrow: 1 }}>
              <Stack mb={1} direction="row" spacing={1} justifyContent="end">
                <Stack direction="row" spacing={1} alignItems="center">
                  <ExportCSV isInOut={this.state.headerData.isInOut} csvData={this.state.dataTable.map((item, index) => {
                    if (this.state.headerData.isInOut === 'S') {
                      return {
                        'STT': index + 1,
                        'CNTRNO': typeof item.CNTRNO === 'string' ? item.CNTRNO : item.CNTRNO[0],
                        'CNTRSZTP': typeof item.CNTRSZTP === 'string' ? item.CNTRSZTP : item.CNTRSZTP[0],
                        'VESSEL_NAME': typeof item.VESSEL_NAME === 'string' ? item.VESSEL_NAME : item.VESSEL_NAME[0],
                        'INBOUND_OUTBOUND': typeof item.INBOUND_OUTBOUND === 'string' ? item.INBOUND_OUTBOUND : item.INBOUND_OUTBOUND[0],
                        'CONSIGNEE': typeof item.CONSIGNEE === 'string' ? item.CONSIGNEE : item.CONSIGNEE[0],
                        'HB_BK': typeof item.HB_BK === 'string' ? item.HB_BK : item.HB_BK[0],
                        'ITEM_TYPE_CODE': typeof item.ITEM_TYPE_CODE === 'string' ? item.ITEM_TYPE_CODE : item.ITEM_TYPE_CODE[0],
                        'COMMODITYDESCRIPTION': typeof item.COMMODITYDESCRIPTION === 'string' ? item.COMMODITYDESCRIPTION : item.COMMODITYDESCRIPTION[0],
                        'CUSTOMER_NAME': typeof item.CUSTOMER_NAME === 'string' ? item.CUSTOMER_NAME : item.CUSTOMER_NAME[0],
                        'CARGO_PIECE': typeof item.CARGO_PIECE === 'number' ? item.CARGO_PIECE : item.CARGO_PIECE[0],
                        'UNIT_CODE': typeof item.UNIT_CODE === 'string' ? item.UNIT_CODE : item.UNIT_CODE[0],
                        'CARGO_WEIGHT': typeof item.CARGO_WEIGHT === 'number' ? item.CARGO_WEIGHT : item.CARGO_WEIGHT[0],
                        'CBM': typeof item.CBM === 'number' ? item.CBM : item.CBM[0],
                        'WAREHOUSE_CODE': typeof item.WAREHOUSE_CODE === 'string' ? item.WAREHOUSE_CODE : item.WAREHOUSE_CODE[0],
                        'TIME_IN': typeof item.TIME_IN === 'string' ? moment(item.TIME_IN).format('DD/MM/YYYY') : moment(item.TIME_IN[0]).format('DD/MM/YYYY'),
                        'TLHQ': item.TLHQ ? "Đã thanh lý hải quan" : "Chưa thanh lý hải quan",
                        'DECLARE_NO': item.DECLARE_NO,
                        'RECEIPT_NO': typeof item.RECEIPT_NO === 'string' ? item.RECEIPT_NO : item.RECEIPT_NO[0],
                        'ORDER_NO': typeof item.ORDER_NO === 'string' ? item.ORDER_NO : item.ORDER_NO[0],
                        'STOCK_TIME': item.STOCK_TIME ? item.STOCK_TIME + " ngày" : "",
                        'NOTE': typeof item.NOTE === 'string' ? item.NOTE !== null ? item.NOTE : "" : item.NOTE !== null ? item.NOTE[0] : "",
                      };
                    } else {
                      return {
                        'STT': index + 1,
                        'CNTRNO': typeof item.CNTRNO === 'string' ? item.CNTRNO : item.CNTRNO[0],
                        'CNTRSZTP': typeof item.CNTRSZTP === 'string' ? item.CNTRSZTP : item.CNTRSZTP[0],
                        'VESSEL_NAME': typeof item.VESSEL_NAME === 'string' ? item.VESSEL_NAME : item.VESSEL_NAME[0],
                        'INBOUND_OUTBOUND': typeof item.INBOUND_OUTBOUND === 'string' ? item.INBOUND_OUTBOUND : item.INBOUND_OUTBOUND[0],
                        'CONSIGNEE': typeof item.CONSIGNEE === 'string' ? item.CONSIGNEE : item.CONSIGNEE[0],
                        'HB_BK': typeof item.HB_BK === 'string' ? item.HB_BK : item.HB_BK[0],
                        'ITEM_TYPE_CODE': typeof item.ITEM_TYPE_CODE === 'string' ? item.ITEM_TYPE_CODE : item.ITEM_TYPE_CODE[0],
                        'CUSTOMER_NAME': typeof item.CUSTOMER_NAME === 'string' ? item.CUSTOMER_NAME : item.CUSTOMER_NAME[0],
                        'CARGO_PIECE': typeof item.CARGO_PIECE === 'number' ? item.CARGO_PIECE : item.CARGO_PIECE[0],
                        'UNIT_CODE': typeof item.UNIT_CODE === 'string' ? item.UNIT_CODE : item.UNIT_CODE[0],
                        'CARGO_WEIGHT': typeof item.CARGO_WEIGHT === 'number' ? item.CARGO_WEIGHT : item.CARGO_WEIGHT[0],
                        'CBM': typeof item.CBM === 'number' ? item.CBM : item.CBM[0],
                        'WAREHOUSE_CODE': typeof item.WAREHOUSE_CODE === 'string' ? item.WAREHOUSE_CODE : item.WAREHOUSE_CODE[0],
                        'TIME_IN': typeof item.TIME_IN === 'string' ? moment(item.TIME_IN).format('DD/MM/YYYY') : moment(item.TIME_IN[0]).format('DD/MM/YYYY'),
                        'DECLARE_NO': item.DECLARE_NO,
                        'RECEIPT_NO': typeof item.RECEIPT_NO === 'string' ? item.RECEIPT_NO : item.RECEIPT_NO[0],
                        'ORDER_NO': typeof item.ORDER_NO === 'string' ? item.ORDER_NO : item.ORDER_NO[0],
                        'NOTE': typeof item.NOTE === 'string' ? item.NOTE !== null ? item.NOTE : "" : item.NOTE !== null ? item.NOTE[0] : "",
                      };
                    }
                  })} fileName="Báo cáo nhập xuất tồn kho" dataTemp={
                    {
                      'ITEM_TYPE_CODE': 'CONT 20: ' + this.state.totalCont?.filter(p => p === "2").length,
                      'CUSTOMER_NAME': 'CONT 40: ' + this.state.totalCont?.filter(p => p !== "2").length,
                      'CARGO_PIECE': 'TỔNG CỘNG: ' + this.state.total.SUM_CARGO_PIECE,
                      'CARGO_WEIGHT': 'TỔNG CỘNG: ' + (Math.round(this.state.total.SUM_CARGO_WEIGHT * 100) / 100),
                      'CBM': 'TỔNG CỘNG: ' + (Math.round(this.state.total.SUM_CBM * 100) / 100),
                    }
                  }></ExportCSV>
                </Stack>
              </Stack>
              <DataGrid
                columnVisibilityModel={
                  this.state.headerData.isInOut !== 'S'
                    ?
                    this.state.headerData.isInOut === 'D'
                      ? {
                        TIME_IN: false,
                        TLHQ: false,
                        STOCK_TIME: false,
                        TKHN_NO: false,
                        COMMODITYDESCRIPTION: false,
                      }
                      : {
                        TIME_OUT: false,
                        TLHQ: false,
                        STOCK_TIME: false,
                        TKHN_NO: false,
                        COMMODITYDESCRIPTION: false,
                      }
                    : {
                      TIME_OUT: false
                    }
                }
                className="m-table"
                rows={(this.state.dataTable)}
                rowHeight={35}
                columns={this.columns}
                sx={{ height: "50vh", appearance: 'textfield' }}
                disableSelectionOnClick
              >
              </DataGrid>
            </Grid>
            <Grid item>
              <Grid>
                <Stack direction='row' spacing={4} justifyContent='flex-end' mt={2} divider={<Divider orientation="vertical" flexItem />}>
                  <Stack direction='row' spacing={2}>
                    <Typography sx={{ fontSize: 18, color: '#005c99' }}>Cont 20:</Typography>
                    <Typography sx={{ fontSize: 18, color: 'red', textAlign: 'end', marginRight: '18px' }}> {this.state.totalCont ? this.state.totalCont?.filter(p => p === "2").length : 0} </Typography>
                  </Stack>
                  <Stack direction='row' spacing={2}>
                    <Typography sx={{ fontSize: 18, color: '#005c99' }}>Cont 40:</Typography>
                    <Typography sx={{ fontSize: 18, color: 'red', textAlign: 'end', marginRight: '18px' }}> {this.state.totalCont ? this.state.totalCont?.filter(p => p !== "2").length : 0} </Typography>
                  </Stack>
                  <Stack direction='row' spacing={2}>
                    <Typography sx={{ fontSize: 18, color: '#005c99' }}>Số lượng:</Typography>
                    <Typography sx={{ fontSize: 18, color: 'red', textAlign: 'end', marginRight: '18px' }}> {this.state.total.SUM_CARGO_PIECE} </Typography>
                  </Stack>
                  <Stack direction='row' spacing={2}>
                    <Typography sx={{ fontSize: 18, color: '#005c99' }}>Trọng lượng:</Typography>
                    <Typography sx={{ fontSize: 18, color: 'red', textAlign: 'end', marginRight: '18px' }}> {this.state.total.SUM_CARGO_WEIGHT ? (Math.round(this.state.total.SUM_CARGO_WEIGHT * 100) / 100) : 0} </Typography>
                  </Stack>
                  <Stack direction='row' spacing={2}>
                    <Typography sx={{ fontSize: 18, color: '#005c99' }}>Số khối:</Typography>
                    <Typography sx={{ fontSize: 18, color: 'red', textAlign: 'end', marginRight: '18px' }}> {this.state.total.SUM_CBM ? (Math.round(this.state.total.SUM_CBM * 100) / 100) : 0} </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

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
export default InExReport;