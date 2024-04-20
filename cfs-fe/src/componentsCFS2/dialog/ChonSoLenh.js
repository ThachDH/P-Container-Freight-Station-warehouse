import {
  Card,
  CardContent,
  Dialog,
  Stack,
  TextField,
  Typography,
  Button,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CachedIcon from '@mui/icons-material/Cached';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

class ChonSoLenh extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: {
        isOpen: false,
        message: 'lỗi không xác định!',
        duration: 5000,
        type: "info"
      },
      selectedContract: {},
      dataTable: [],
      searchField: {
        PIN_CODE: "",
      }
    };
    this.columns = [
      { field: "STT", headerName: "STT", width: 80, textAlign: "center", },
      { field: "PIN_CODE", headerName: "Số Pin", flex: 1 },
      { field: "CNTRNO", headerName: "Số Container", flex: 1 },
    ];
    this.createRows = (data) => data.map((row, index) => ({
      STT: index + 1,
      id: index,
      ...row
    }),
    );
  }

  selectContract() {
    this.props.handleSelect(this.state.selectedContract);
  }

  closeDialog() {
    this.props.handleCloseDialog(this.state.selectedContract);
  }

  setDataSend(data) {
    let temp = this.createRows(data);
    this.setState({
      dataTable: temp,
    });
  }

  render() {
    return (
      <Dialog open={this.props.dialog.isOpen} scroll="paper" fullWidth maxWidth="sm">
        <Card>
          <Stack direction="column" spacing={1}>
            <CardContent>
              <Stack direction="row" spacing={1} pt="inherit">
                <Typography variant="h4" pt="5px">Chọn Số Lệnh</Typography>
              </Stack>
              <Divider textAlign="center" style={{ paddingTop: "15px" }}></Divider>
              <Stack direction="row" spacing={1} mt={1}>
                <TextField
                  size="small"
                  id="tim-kiem"
                  label="Tìm kiếm"
                  onChange={(e) => {
                    this.setState({ searchField: { PIN_CODE: e.target.value } })
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }} />
              </Stack>
              <Stack direction="row" spacing={1} mt={1}>
                <DataGrid
                  hideFooterSelectedRowCount={true}
                  rows={(this.state.dataTable)
                    .filter(data => data.PIN_CODE.includes(this.state.searchField.PIN_CODE.toUpperCase())
                      || data.PIN_CODE.includes(this.state.searchField.PIN_CODE.toLowerCase())
                    )
                  }
                  columns={this.columns}
                  sx={{
                    height: "50vh",
                    '& .MuiDataGrid-columnHeaders ': {
                      backgroundColor: 'rgba(176,224,230, 0.55)',
                    },
                  }}
                  onRowClick={(params) => {
                    this.props.multiple === true
                      ? (params.row.isChecked = !params.row.isChecked)
                      : (params.row.isChecked = true);
                    this.setState({
                      selectedContract: params.row
                    });
                  }}
                />
              </Stack>
              <Divider textAlign="center" style={{ paddingTop: "20px" }}></Divider>
              <Stack direction="row" style={{ paddingTop: "20px", gap: "10px" }}>
                <Button
                  type="button"
                  variant="contained"
                  startIcon={<CachedIcon />}
                >
                  Tải lại
                </Button>
                <Button
                  style={{
                    marginLeft: "auto",
                  }}
                  type="button"
                  variant="outlined"
                  startIcon={<DoneIcon />}
                  onClick={() => this.selectContract()}
                >
                  Chọn
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={() => this.closeDialog()}
                >
                  Đóng
                </Button>
              </Stack>
            </CardContent>
          </Stack>
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
      </Dialog>
    )
  }
}
ChonSoLenh.defaultProps = { multiple: true };
export default ChonSoLenh;