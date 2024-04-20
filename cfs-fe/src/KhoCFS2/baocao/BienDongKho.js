import * as moment from "moment";
import * as React from "react";
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  FormControl,
  Stack,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import FixedPageName from "../../componentsCFS2/fixedPageName";
import ExportCSV from "../../components/caiDat/ExportCSV";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DataGrid } from '@mui/x-data-grid';
import QrCode2Icon from '@mui/icons-material/QrCode2';

class BienDongKho extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbs: [
        {
          text: "Home",
          href: "/",
        },
        {
          text: "Báo Cáo Biến Động Kho",
          href: "/rept/warehouse-volatility",
        },
      ],
      dataTable: [],
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
      },
      dialogAlert: {
        isOpen: false,
        data: null,
        type: 0,
      },
      confirmPopup: {
        isOpen: false,
        message: "",
      },
      closePopup: {
        isOpen: false,
      },
      fromDateIn: moment().subtract(1, "days"),
      toDateIn: moment(),
      fromDateOut: moment().subtract(1, "days"),
      toDateOut: moment(),
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.dataFilter = {
      constractNo: '',
      customerNo: '',
      productCode: '',
      productName: '',
    };
    this.rows = [
      { id: 1, stt: '1', contractNo: 'LOG-SG-01', customer_No_: 'CTY TNHH LOG SÀI GÒN', productCode: 'CHIP', productName: 'CHIP', palletNo: 'PALET-01	', QtyC: '2', CPallet: '1', TQty: '2', location: 'A-01-05', DIn: '2021-11-22 10:12:23.000	', DOut: '2021-11-22 10:16:14.000', DocDate: '1' },
      { id: 2, stt: '2', contractNo: 'LOG-SG-02', customer_No_: 'CTY TNHH LOG SÀI GÒN', productCode: 'POA', productName: 'POA', palletNo: 'PALET-03	', QtyC: '2', CPallet: '1', TQty: '2', location: 'B-01-05', DIn: '2021-11-22 10:12:23.000	', DOut: '2021-11-22 10:16:14.000', DocDate: '1' },
      { id: 3, stt: '3', contractNo: 'LOG-SG-04', customer_No_: 'CTY TNHH LOG SÀI GÒN', productCode: 'SAS', productName: 'SAS', palletNo: 'PALET-02	', QtyC: '2', CPallet: '1', TQty: '2', location: 'A-01-05', DIn: '2021-11-22 10:12:23.000	', DOut: '2021-11-22 10:16:14.000', DocDate: '1' }

    ]
    this.columns = [
      {
        field: "stt",
        headerName: "STT",
        width: 70,
      },
      {
        field: "contractNo",
        headerName: "Mã Hợp Đồng",
        width: 140,
      },
      { field: "customer_No_", headerName: "Chủ Hàng", width: 150 },
      {
        field: "productCode",
        headerName: "Mã Hàng",
        width: 120,
      },
      {
        field: "productName",
        headerName: "Tên Hàng",
        width: 120,
      },
      {
        field: "palletNo",
        headerName: "PalletNo",
        width: 150,
      },
      {
        field: "QtyC",
        headerName: "Qty/C",
        width: 100,
      },
      {
        field: "CPallet",
        headerName: "C/Pallet",
        width: 105,
      },
      {
        field: "TQty",
        headerName: "T.Qty",
        width: 150,
      },
      {
        field: "location",
        headerName: "Vị Trí",
        width: 120,
      },
      {
        field: "DIn",
        headerName: "D.In",
        width: 150,
      },
      {
        field: "DOut",
        headerName: "D.Out",
        width: 150,
      },
      {
        field: "DocDate",
        headerName: "Ngày Lưu Trữ",
        width: 106,
      },
      {
        field: "ED",
        headerName: "E.D",
        width: 100,
      },
      {
        field: "status",
        headerName: "Status",
        width: 100,
      },
      {
        field: "receive",
        headerName: "Lệnh Nhập Kho",
        width: 100,
      },
      {
        field: "ex",
        headerName: "Lệnh Xuất Kho",
        width: 100,
      },
    ];
  }

  render() {
    return (
      <Box>
        <FixedPageName
          pageName="Biến Động Kho"
          breadcrumbs={this.state.breadcrumbs}
        ></FixedPageName>
        <Card style={{ marginBottom: '12px' }}>
          <CardContent>
            <Stack component="form" direction="column" spacing={2} marginBottom={2}>
              <Stack direction="row" spacing={1}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      label="Nhập hàng ngày"
                      inputFormat="DD/MM/YYYY"
                      value={this.state.fromDateIn}
                      onChange={(newValue) => {
                        this.setState({
                          fromDateIn: moment(newValue),
                        })
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      label="Đến ngày"
                      inputFormat="DD/MM/YYYY"
                      value={this.state.toDateIn}
                      onChange={(newValue) => {
                        this.setState({
                          toDateIn: moment(newValue),
                        })
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    id="form-ma-hd"
                    label="Mã Hợp Đồng"
                    onChange={(event) => {
                      this.dataFilter.constractNo = event.target.value
                    }} />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    id="form-ma-kh"
                    label="Mã Khách Hàng"
                    onChange={(event) => {
                      this.dataFilter.customerNo = event.target.value
                    }} />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={1}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      label="Xuất hàng ngày"
                      inputFormat="DD/MM/YYYY"
                      value={this.state.fromDateOut}
                      onChange={(newValue) => {
                        this.setState({
                          fromDateOut: moment(newValue),
                        })
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      label="Đến ngày"
                      inputFormat="DD/MM/YYYY"
                      value={this.state.toDateOut}
                      onChange={(newValue) => {
                        this.setState({
                          toDateOut: moment(newValue),
                        })
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    id="form-ma-sp"
                    label="Mã Sản Phẩm"
                    onChange={(event) => {
                      this.dataFilter.productCode = event.target.value
                    }} />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    id="form-ten-sp"
                    label="Tên Sản Phẩm"
                    onChange={(event) => {
                      this.dataFilter.productName = event.target.value
                    }} />
                </FormControl>
              </Stack>
            </Stack>
            <Divider />
            <Stack direction='row' spacing={1} justifyContent='flex-end' marginTop={1}>
              <Button
                type="button"
                variant="outlined"
                startIcon={<QrCode2Icon />}
                onClick={() => { }}
              >
                In QR
              </Button>
              <ExportCSV csvData={this.state.dataTable} fileName="DS-Bien-Dong-Kho"></ExportCSV>
              <Divider orientation="vertical" flexItem />
              <Button
                type="button"
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={() => { }}
              >
                Truy vấn
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <div className="main-content1">
          <Card>
            <CardContent>
              <Stack direction='column' spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                  <Grid item xs={6}>
                    <Divider textAlign="left">
                      <span className="m-filter-title">Dữ Liệu Biến Động</span>
                    </Divider>
                  </Grid>
                  <TextField
                    id="tim-kiem"
                    label="Tìm kiếm trên lưới"
                    onChange={(e) => { }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
                <Divider />
                <Box
                  sx={{
                    textAlign: 'center',
                    height: "auto",
                    width: '100%',
                    '& .MuiDataGrid-columnHeadersInner': {
                      backgroundColor: 'rgba(176,224,230, 0.55)',
                    },
                  }}

                >
                  <DataGrid
                    rows={this.rows}
                    columns={this.columns}
                    rowsPerPageOptions={[10, 25, 100]}
                    sx={{ height: "63vh" }}
                  >
                  </DataGrid>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </div>
      </Box>
    )
  }
}
export default BienDongKho;
