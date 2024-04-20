import * as React from "react";
import * as moment from "moment";
import {
  FormControl,
  Stack,
  Card,
  Divider,
  Grid,
  Box,
  Typography,
  Autocomplete,
  TextField,
  CardContent,
  Button
} from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FixedPageName from "../../componentsCFS2/fixedPageName";
import FormGroup from '@mui/material/FormGroup';
import BarChart from "../../componentsCFS2/thongke/BarChart";
import LinearProgress from '@mui/material/LinearProgress';
import WarehouseIcon from '@mui/icons-material/Warehouse';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%' }}>
        <LinearProgress sx={{
          height: '40px', borderRadius: '30px', mr: 1,
          '& .css-5xe99f-MuiLinearProgress-bar1': { backgroundColor: props.value > 70 ? 'red' : ((props.value) > 20 ? 'orange' : 'green') },
          '& .css-16d8g8c-MuiLinearProgress-root': { backgroundColor: 'red' }
        }} variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${props.value}%`}</Typography>
      </Box>
    </Box >
  );
};

class ChiTietBangThongKe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFinish: false,
      timePeriod: "month",
      data: {},
      dataCont_Import: [],
      dataCont_Export: [],
      itemType: 'DG',
      quarter: Math.floor(new Date().getMonth() / 3 + 1),
      dataWarehouse: [],
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
      isCorrectTime: 'ngay',
      page: 0,
      rowsPerPage: 10,
      dataTable: [],
      count_PercentContract: 0,
      count_PercentJournalReceive: 0,
      count_TotalContract: 0,
      count_TotalNotApproveContract: 0,
      count_TotalApproveContract: 0,
      count_TotalWarningContract: 0,
      count_TotalJournalReceive: 0,
      count_TotalNotApproveJournalReceive: 0,
      count_TotalApproveJournalReceive: 0,
      count_TotalAllocateJournalReceive: 0,
      count_TotalSuccessJournalReceive: 0,
      count_TotalJournalExport: 0,
      count_TotalNotApproveJournalExport: 0,
      count_TotalApproveJournalExport: 0,
      count_TotalSuccessJournalExport: 0,
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
      tableFilter: {
        customer_CUSTOMER_TYPE: '',
        customer_Name: '',
        customer_TaxCode: '',
      },
    };
    this.dataFilter = {
      customer_No_: '',
    };
    window.ChiTietBangThongKe = this;
  }
  handleChangePage(event, newPage) {
    this.setState({ page: newPage });
  }
  handleChangeRowsPerPage(event) {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  }

  //.........................................................
  componentDidMount() {
    this.handleLoadItemType();
    this.loadDataWarehouse();
    if (this.state.itemType) {
      this.handleLoadDataCont();
    }
  }

  loadDataWarehouse() {
    let url = window.root_url + `dash-board/getCapacity`;
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      }
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
          this.setState({
            dataWarehouse: data.Payload,
            alert: {
              isOpen: true,
              type: "success",
              message: "Nạp dữ liệu thành công!"
            },
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

  handleCheckType(isCheckType) {
    if (isCheckType) {
      this.handleLoadDataCont(isCheckType);
    } else {
      this.setState({
        alert: {
          isOpen: true,
          duration: 4000,
          message: "Vui lòng chọn loại hàng",
          type: 'warning'
        }
      })
    }
  };

  handleCheckDate(isCheckDate) {
    if (isCheckDate && this.state.itemType) {
      this.handleLoadDataCont();
    } else {

      this.setState({
        alert: {
          isOpen: true,
          duration: 4000,
          message: "Vui lòng chọn loại hàng",
          type: 'warning'
        }
      })
    }
  };

  handleCheck() {
    this.setState({
      isFinish: true
    })
  }

  handleLoadDataCont(isCheckType) {
    let url = window.root_url + `dash-board/getStatictics`;
    let dataSend = {
      ITEM_TYPE_CODE: isCheckType ? isCheckType : "DG",
      month: this.state.month ? this.state.month : moment(),
      year: this.state.year ? this.state.year : moment(),
      quarter: this.state.year ? this.state.year : moment()
    }
    var that = this;
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
        if (response.length) {
          let dataCont20_import = response.filter(p => p.CLASS_CODE[0] === 1 && p.CNTRSZTP !== null ? p.CNTRSZTP[0].charAt(0) === '2' : '');
          let dataCont20_export = response.filter(p => p.CLASS_CODE[0] === 2 && p.CNTRSZTP !== null ? p.CNTRSZTP[0].charAt(0) === '2' : '');
          let dataCont40_import = response.filter(p => p.CLASS_CODE[0] === 1 && p.CNTRSZTP !== null ? p.CNTRSZTP[0].charAt(0) === '4' : '');
          let dataCont40_export = response.filter(p => p.CLASS_CODE[0] === 2 && p.CNTRSZTP !== null ? p.CNTRSZTP[0].charAt(0) === '4' : '');
          that.setState({
            dataCont_Import: [dataCont20_import, dataCont40_import],
            dataCont_Export: [dataCont20_export, dataCont40_export],
            alert: {
              isOpen: true,
              duration: 2000,
              message: 'Nạp dữ liệu thành công',
              type: 'success',
            }
          })
        } else {
          that.setState({
            dataCont_Import: [],
            dataCont_Export: [],
            alert: {
              isOpen: true,
              duration: 2000,
              message: "Không có dữ liệu",
              type: 'error',
            }
          })
        }

      })
      .catch(err => {
        console.log(err)
        if (JSON.parse(err.message).error.statusCode === 401) {
          localStorage.clear();
          window.location.assign('/login');
        } else {
          that.setState({
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

  //----------------------------------
  render() {
    return (
      <Box style={{ backgroundColor: '#E8E8E8' }}>
        <Box>
          <Card>
            <Grid >
              <CardContent>
                <Stack direction='row' justifyContent="space-between"  >
                  <Grid display="flex" gap="10px">
                    {this.state.dataWarehouse.map((data) => {
                      return (
                        <Button
                          type="btton"
                          variant="contained"
                          sx={{ padding: "0 30px" }}
                          onClick={() => { this.handleCheck() }}
                        >Kho:{data.WAREHOUSE_CODE}</Button>
                      )
                    })
                    }
                  </Grid>
                  <Divider orientation="vertical" marginRight="10px" />
                  <Grid sx={{ width: "70%" }} display="flex" justifyContent="end" gap="10px" >
                    <Grid>
                      <FormControl sx={{ width: "100%" }}>
                        <RadioGroup
                          row
                          value={this.state.timePeriod}
                          onChange={(e) => {
                            this.setState({
                              timePeriod: e.target.value,
                            })
                            this.handleCheckDate(e.target.value)
                          }}
                        >
                          <FormControlLabel value="month" control={<Radio />} label="Tháng" />
                          <FormControlLabel value="quarter" control={<Radio />} label="Quý" />
                          <FormControlLabel value="year" control={<Radio />} label="Năm" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid sx={{ width: "15%" }}>
                      <Autocomplete
                        sx={{ width: '100%' }}
                        id="tags-outlined"
                        defaultValue={this.state.itemType}
                        options={this.state.itemList || []}
                        size="small"
                        onChange={(event, listSelected) => {
                          this.setState({
                            itemType: listSelected,
                          })
                          this.handleCheckType(listSelected)
                        }}
                        getOptionLabel={(params) => {
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
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Grid>
            <Divider style={{ margin: "-15px" }} textAlign="center" >
              <span className="m-filter-title">Thống kê sản lượng của Kho</span>
            </Divider>
            <Grid>
              <CardContent
                style={{ display: "flex" }}
              >
                <Grid paddingBottom="40px " container spacing={2} width="100%" item>
                  <Grid item xs={3.5}>
                    <Grid >
                      <Divider textAlign="center" >
                        <span className="m-filter-title">Tình trạng kho</span>
                      </Divider>
                    </Grid>
                    {this.state.dataWarehouse && this.state.dataWarehouse.map((data) => {
                      let value = (data.UNAVAILABLE_CELL * 100) / data.CAPACITY
                      let PER_UNAVAILABLE_CELL = Math.round(value * 100) / 100;
                      return (
                        <Grid>
                          <Stack>
                            <FormGroup>
                              <Stack direction="row" spacing={1} justifyContent="end" alignItems="center" marginRight="10px">
                                <Typography> Đơn vị tính: Pallet</Typography>
                                <Switch defaultChecked inputProps={{ 'aria-label': 'controlled' }} />
                                <Typography>CBM</Typography>
                              </Stack>
                            </FormGroup>
                          </Stack>
                          <Stack direction="row" spacing={1} style={{ alignItems: 'center' }}>
                            <Grid display="flex" alignItems="center" gap="15px">
                              <Box>
                                <Grid display="flex" flexDirection="column" textAlign='center'>
                                  <WarehouseIcon sx={{ fontSize: '80px' }} color="primary"></WarehouseIcon>
                                  <Typography fontSize="14px" fontWeight="600" color="#5F9EA0">Kho {data.WAREHOUSE_CODE}</Typography>
                                </Grid>
                              </Box>
                              <Stack  >
                                <Grid >
                                  <Typography fontSize="15px" fontWeight="600" >Dung tích kho</Typography>
                                  <Stack direction="row" gap="10px">
                                    <Typography fontSize="14px">Số lượng tổng: </Typography>
                                    <Typography fontSize="14px">{data.CAPACITY} </Typography>
                                  </Stack>
                                  <Stack direction="row" gap="10px">
                                    <Typography fontSize="14px"> Đã sử dụng:  </Typography>
                                    <Typography fontSize="14px">{data.UNAVAILABLE_CELL} </Typography>
                                  </Stack>
                                  <Stack direction="row" gap="10px">
                                    <Typography fontSize="14px">Còn lại:</Typography>
                                    <Typography fontSize="14px">{data.AVAILABLE_CELL} </Typography>
                                  </Stack>
                                </Grid>
                              </Stack>
                            </Grid>
                          </Stack>
                          <Stack>
                            <Stack style={{ width: '95%', margin: " 0 auto" }}>
                              <LinearProgressWithLabel value={PER_UNAVAILABLE_CELL ?? 0} />
                            </Stack>
                          </Stack>
                          <Stack sx={{ margin: "10px 30px 0 10px" }} >
                            <Stack direction="row" justifyContent="space-between">
                              <Typography sx={{ fontSize: "15px" }}>Tổng sản lượng cont hướng nhập: { this.state.dataCont_Import.length > 0 ? (this.state.dataCont_Import[0]?.length + this.state.dataCont_Import[1]?.length) : 0}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography sx={{ fontSize: "15px" }}>Tổng sản lượng cont hướng xuất: {  this.state.dataCont_Export.length > 0 ?  (this.state.dataCont_Export[0]?.length + this.state.dataCont_Export[1]?.length) : 0}</Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                      )
                    })
                    }
                  </Grid>
                  <Divider sx={{ marginTop: "31px" }} orientation="vertical" />
                  <Grid item xs={8} >
                    <Box
                      width="90%"
                      margin="0 auto"
                    >
                      <Box height="100%" width="100%">
                        <BarChart
                          dataImport={ this.state.dataCont_Import.length > 0 ? [this.state.dataCont_Import[0]?.length, this.state.dataCont_Import[1]?.length] : [0,0]}
                          dataExport={ this.state.dataCont_Export.length > 0 ? [this.state.dataCont_Export[0]?.length, this.state.dataCont_Export[1]?.length] : [0,0]}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>
          </Card>
        </Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.MenuName}
        ></FixedPageName>
        <Box className="Thong-Ke" sx={{ paddingTop: 1, marginLeft: 1, marginRight: 1, marginBottom: "20px" }}>
        </Box >
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

export default ChiTietBangThongKe;