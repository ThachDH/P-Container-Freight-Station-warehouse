import {
  Card,
  CardContent,
  Dialog,
  Stack,
  TextField,
  Typography,
  Button,
  Divider,
  Box,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LoopIcon from '@mui/icons-material/Loop';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class PhieuHopDongSo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [
        { id: 1, RowID: '1', Code: 'LOG-SG-01', Name: 'Hàng loại 1' },
        { id: 2, RowID: '2', Code: 'LOG-SG-02', Name: 'Hàng loại 2' },
        { id: 3, RowID: '3', Code: 'LOG-SG-04', Name: 'Hàng loại 3' },
      ],
      selected: null,
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.columns = [
      { field: "RowID", headerName: "STT", width: 100 },
      { field: "Code", headerName: "Mã Hợp Đồng", width: 180 },
      { field: "Name", headerName: "Tên Hợp Đồng", width: 290 },
    ];
  }

  closeDialog() {
    this.props.handleCloseDialog();
    // this.setState({ data: initalData });
  }

  createRows = (data) => data.map((row, index) => ({
    id: index,
    RowID: row.RowID,
    Code: row.Code,
    Name: row.Name,
  }));

  handleSelect(handleSelect) {
    this.props.handleSelected(handleSelect);
  }

  handleRefesh() {
    this.setState({
      dataTable: this.state.dataTable,
      alert: {
        isOpen: true,
        message: 'Tải dữ liệu thành công',
        duration: 2000,
        type: 'success',
      }
    });
  }
  //-----------------------
  render() {
    return (
      <Dialog open={this.props.dialog.isOpen} scroll="paper">
        <Card sx={{
          minWidth: 600,
          minHeight: 400
        }}>
          <CardContent>
            <Stack direction="row" spacing={2} justifyContent={"space-between"} alignItems="center">
              <Typography variant="h5">Chọn Hợp Đồng Số</Typography>
              <TextField
                id="tim-kiem"
                label="Tìm kiếm"
                // onChange={(e) => { this.tableFilter.search = e.target.value }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }} />
            </Stack>
            <Divider textAlign="left" style={{ paddingTop: "10px" }}></Divider>
            <Stack direction="row" spacing={1} style={{ paddingTop: "20px" }}>
              <Box
                sx={{
                  height: 'auto',
                  width: '100%',
                  '& .MuiDataGrid-columnHeadersInner': {
                    backgroundColor: "#bddcef",
                  },
                }}>
                <DataGrid
                  rows={this.createRows(this.state.dataTable)}
                  onSelectionModelChange={(ids) => {
                    const selectedIDs = new Set(ids);
                    const selectedRows = this.createRows(this.state.dataTable).filter((row) =>
                      selectedIDs.has(row.id),
                    );
                    this.state.selected = selectedRows;
                  }}
                  columns={this.columns}
                  sx={{
                    height: "50vh"
                  }}
                />
              </Box>
            </Stack>
            <Divider textAlign="left" style={{ paddingTop: "20px" }}></Divider>
            <Grid container spacing={2} style={{ paddingTop: "10px" }}>
              <Grid item xs={4} >
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => this.handleRefesh()}
                  startIcon={<LoopIcon />}
                >
                  Tải lại
                </Button>
              </Grid>
              <Grid item xs={8} sm container justifyContent={"flex-end"} spacing={{ md: 2 }}>
                <Grid item>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => this.handleSelect(this.state.selected)}
                    startIcon={<CheckIcon />}
                  >
                    Chọn
                  </Button>

                </Grid>
                <Grid item>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => this.closeDialog()}
                    startIcon={<CloseIcon />}
                  >
                    Đóng
                  </Button>
                </Grid>
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
      </Dialog >
    );
  }
}
export default PhieuHopDongSo;