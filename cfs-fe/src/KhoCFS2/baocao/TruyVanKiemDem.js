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


class TruyVanKiemDem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.dataFilter = {
      //thêm các trường filter vào đây
    };
    this.rows = [
      { id: 1, stt: '1', DO: 'LOG-DO-01', productName: 'CHIP', description: 'CHIP', ImNumber: '1', unit: '	UNIT', Lot: 'CHIPLOT01', palletNo: 'PALET-01', saveDate: '2021-11-22 10:12:13.000', countingDate: '2021-11-22 10:12:13.000' },
      { id: 2, stt: '2', DO: 'DOCFS1-0004', productName: 'PDO', description: 'POD', ImNumber: '2', unit: '	KG', Lot: 'POCLO102', palletNo: 'PALET-01223', saveDate: '2021-11-22 10:12:13.000', countingDate: '2021-11-22 10:12:13.000' },
      { id: 3, stt: '3', DO: 'DOCFS1-0232', productName: 'HUM', description: 'CHHUMIP', ImNumber: '1', unit: '	HUM', Lot: 'HUMLOT01', palletNo: 'PALET-01232', saveDate: '2021-11-22 10:12:13.000', countingDate: '2021-11-22 10:12:13.000' },
      { id: 4, stt: '4', DO: 'LOG-DO-0322', productName: 'MEE', description: 'MEE', ImNumber: '1', unit: '	KG', Lot: 'MEELO102', palletNo: 'PALET-01', saveDate: '2021-11-22 10:12:13.000', countingDate: '2021-11-22 10:12:13.000' },
      { id: 5, stt: '5', DO: 'LOG-DO-01', productName: 'CHIP', description: 'CHIP', ImNumber: '1', unit: '	UNIT', Lot: 'CHIPLOT01', palletNo: 'PALET-01', saveDate: '2021-11-22 10:12:13.000', countingDate: '2021-11-22 10:12:13.000' }


    ]
    this.columns = [
      {
        field: "stt",
        headerName: "STT",
        width: 100,
      },
      { field: "DO", headerName: "Số DO", width: 150 },
      {
        field: "productName",
        headerName: "Mã Hàng",
        width: 100,
      },
      {
        field: "description",
        headerName: "Mô Tả",
        width: 100,
      },
      {
        field: "ImNumber",
        headerName: "Số Lượng Nhập",
        width: 150,
      },
      {
        field: "unit",
        headerName: "UNIT",
        width: 105,
      },
      {
        field: "Lot",
        headerName: "LOT",
        width: 130,
      },
      {
        field: "palletNo",
        headerName: "PalletNo",
        width: 120,
      },
      {
        field: "saveDate",
        headerName: "Hạn Lưu Hàng",
        width: 190,
      },
      {
        field: "countingDate",
        headerName: "Ngày Kiểm Đếm",
        width: 190,
      },
    ];
  }
  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Card style={{ marginBottom: '12px' }}>
          <CardContent>
            <Stack component="form" direction="column" spacing={2} marginBottom={2}>
              <Stack direction="row" spacing={1}>
                <FormControl fullWidth>
                  <TextField
                    id="form-ma-pin"
                    label="Mã PIN"
                    onChange={(event) => {
                      this.dataFilter.x = event.target.value
                    }} />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    id="form-ma-lenh"
                    label="Mã Lệnh"
                    onChange={(event) => {
                      this.dataFilter.x = event.target.value
                    }} />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    id="form-ma-san-pham"
                    label="Mã Sản Phẩm"
                    onChange={(event) => {
                      this.dataFilter.x = event.target.value
                    }} />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    id="form-so-lot"
                    label="Số LOT"
                    onChange={(event) => {
                      this.dataFilter.x = event.target.value
                    }} />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={1}>
                <div style={{ width: 309 }}>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterMoment} >
                      <DatePicker
                        label="Kiểm đếm ngày"
                        inputFormat="DD/MM/YYYY"
                        value={this.state.fromDate}
                        onChange={(newValue) => {
                          this.setState({
                            fromDateIn: moment(newValue),
                          })
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                <div style={{ width: 309 }}>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        label="Đến ngày"
                        inputFormat="DD/MM/YYYY"
                        value={this.state.toDate}
                        onChange={(newValue) => {
                          this.setState({
                            toDateIn: moment(newValue),
                          })
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
              </Stack>
            </Stack>
            <Divider></Divider>
            <Stack direction='row' spacing={1} justifyContent='flex-end' marginTop={1}>
              <ExportCSV csvData={this.state.dataTable} fileName="DS-Truy-Van-Kiem-Dem"></ExportCSV>
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
                      <span className="m-filter-title">Truy Vấn Kiểm Đếm</span>
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
      </Box >
    )
  }
}
export default TruyVanKiemDem;