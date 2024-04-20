import * as moment from "moment";
import * as React from "react";
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Stack,
  Checkbox,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Autocomplete,
} from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import FixedPageName from "../../componentsCFS2/fixedPageName";
import ExportCSV from "../../components/caiDat/ExportCSV";
import { DataGrid } from '@mui/x-data-grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

class TruyVanKho extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lstUnit: ['Tất cả', 'A', 'B', 'C', 'D'],
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
      // Lọc trên lưới
    };
    this.rows = [
      { id: 1, stt: '1', locationNo: 'CFS1', block: 'A', location: '	A-01-01', status: '	Sẳn sàng', goodsStatus: '	Có hàng' },
      { id: 2, stt: '2', locationNo: 'CFS1', block: 'B', location: '	A-01-02', status: '	Sẳn sàng', goodsStatus: '	Có hàng' },
      { id: 3, stt: '3', locationNo: 'CFS2', block: 'C', location: '	A-03-04', status: '	Tạm', goodsStatus: '	Trống' },
      { id: 4, stt: '4', locationNo: 'CFS1', block: 'A', location: '	A-06-01', status: '	Sẳn sàng', goodsStatus: '	Có hàng' },
      { id: 5, stt: '5', locationNo: 'CFS5', block: 'D', location: '	A-07-02', status: '	Sẳn sàng', goodsStatus: '	Có hàng' },
    ]
    this.columns = [
      {
        field: "stt",
        headerName: "STT",
        width: 200,
      },
      { field: "locationNo", headerName: "Mã Kho", width: 200 },
      {
        field: "block",
        headerName: "Block",
        width: 200,
      },
      {
        field: "location",
        headerName: "Vị Trí",
        width: 216,
      },
      {
        field: "status",
        headerName: "Status",
        width: 220,
      },
      {
        field: "goodsStatus",
        headerName: "Tình Trạng",
        width: 220,
      }
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
            <Stack direction='row' spacing={8}>
              <Autocomplete
                sx={{ width: 230, mt: 2.5, ml: 2 }}
                options={this.state.lstUnit || []}
                id="selectBlock"
                disableClearable
                onChange={(event, data) => {
                  this.setState({
                    data: {
                      ...this.state.data,
                    },
                  })
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Chọn Block" />
                )}
              />
              <Stack >
                <span style={{ fontWeight: "bold", color: 'red' }}>Chọn trạng thái</span>
                <FormGroup row >
                  <FormControlLabel labelPlacement='end' label='Giữ' control={<Checkbox defaultChecked color="error" sx={{
                    '& .MuiSvgIcon-root': { fontSize: 26 }
                  }} />} />
                  <FormControlLabel labelPlacement='end' label='Tạm' control={<Checkbox defaultChecked color="warning" sx={{
                    '& .MuiSvgIcon-root': { fontSize: 26 }
                  }} />} />
                  <FormControlLabel labelPlacement='end' label='Sẵn Sàng' control={<Checkbox defaultChecked color="primary" sx={{
                    '& .MuiSvgIcon-root': { fontSize: 26 }
                  }} />} />
                </FormGroup>
              </Stack>
              <Stack>
                <span style={{ fontWeight: "bold", color: 'red' }}>Chọn Tình Trạng</span>
                <FormGroup row >
                  <FormControlLabel labelPlacement='end' label='Giữ' control={<Checkbox defaultChecked color="error" sx={{
                    '& .MuiSvgIcon-root': { fontSize: 26 }
                  }} />} />
                  <FormControlLabel labelPlacement='end' label='Tạm' control={<Checkbox defaultChecked color="warning" sx={{
                    '& .MuiSvgIcon-root': { fontSize: 26 }
                  }} />} />
                  <FormControlLabel labelPlacement='end' label='Sẵn Sàng' control={<Checkbox defaultChecked color="primary" sx={{
                    '& .MuiSvgIcon-root': { fontSize: 26 }
                  }} />} />
                </FormGroup>
              </Stack>
            </Stack>
            <Divider />
            <Stack direction='row' spacing={1} justifyContent='flex-end' marginTop={1}>
              <ExportCSV csvData={this.state.dataTable} fileName="DS-Bien-Dong-Kho"></ExportCSV>
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
                      <span className="m-filter-title">Dữ Liệu Truy Vấn</span>
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
export default TruyVanKho;