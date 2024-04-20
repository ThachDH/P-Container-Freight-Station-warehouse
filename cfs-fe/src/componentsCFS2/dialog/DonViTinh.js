import {
  Card,
  CardContent,
  Dialog,
  Stack,
  TextField,
  Typography,
  Button,
  Divider,
  Radio,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CachedIcon from '@mui/icons-material/Cached';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

class DonViTinh extends React.Component {
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
      dataTable: [
        { id: 1, STT: 1, CUSTOMER_CODE: "LOG-SG", CUSTOMER_NAME: "CTY TNHH LOG SÀI GÒN" },
        { id: 2, STT: 2, CUSTOMER_CODE: "LOG-SG", CUSTOMER_NAME: "CTY TNHH LOG SÀI GÒN" },
      ],
    };
    this.columns = [
      {
        field: "Action",
        headerName: "Chọn",
        type: "actions",
        width: 80,
        getActions: (params) => [
          <Radio
            checked={
              this.state.dataTable !== [] &&
              this.state.selectedContract.id === params.row.id
            }
            onClick={() => {
              this.setState({
                selectedContract: params.row
              })
            }}
            name="select-vessel"
            inputProps={{ "aria-label": params.row.id }}
          />
        ]
      },
      { field: "STT", headerName: "STT", width: 100 },
      { field: "CUSTOMER_CODE", headerName: "Mã Khách Hàng", width: 200 },
      { field: "CUSTOMER_NAME", headerName: "Tên Khách Hàng", width: 200 },
    ];
  }

  closeDialog() {
    this.props.handleCloseDialog(this.state.selectedContract);
  }

  createRows = (data) => data.map((row, index) => ({
    id: index,

  }));

  render() {
    return (
      <Dialog open={this.props.dialog.isOpen} scroll="paper" fullWidth>
        <Card>
          <Stack direction="column" spacing={1}>
            <CardContent>
              <Stack direction="row" spacing={2} pt="inherit">
                <Typography variant="h4" pt="5px"> Danh sách đơn vị tính</Typography>
              </Stack>
              <Divider textAlign="center" style={{ paddingTop: "40px" }}></Divider>
              <Stack direction="row" spacing={1} style={{ paddingTop: "20px" }}>
                <DataGrid
                  rows={this.state.dataTable}
                  columns={this.columns}
                  sx={{
                    height: "50vh",
                    '& .MuiDataGrid-columnHeaders ': {
                      backgroundColor: 'rgba(176,224,230, 0.55)',
                    },
                  }}
                  onRowClick={(params) => {
                    this.setState({
                      selectedContract: params.row
                    });
                    console.log(this.state.selectedContract)
                  }}
                />
              </Stack>
              <Divider textAlign="center" style={{ paddingTop: "20px" }}></Divider>
              <Stack direction="row" style={{ paddingTop: "20px" }}>
                <Button
                  type="button"
                  variant="contained"
                  startIcon={<CachedIcon />}
                >
                  Tải lại
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<DoneIcon />}
                  style={{
                    position: "absolute",
                    right: "112px"
                  }}
                  onClick={() => this.closeDialog()}
                >
                  Chọn
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  style={{
                    position: "absolute",
                    right: "12px"
                  }}
                  onClick={() => this.closeDialog()}
                >
                  Đóng
                </Button>
              </Stack>
            </CardContent>
          </Stack>
        </Card>
      </Dialog>
    )
  }

}
DonViTinh.defaultProps = { multiple: true };
export default DonViTinh;

