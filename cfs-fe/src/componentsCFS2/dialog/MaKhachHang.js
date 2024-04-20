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

class MaKhachHang extends React.Component {
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
        CUSTOMER_CODE: "",
      }
    };
    this.columns = [
      // {
      //   field: "Action",
      //   headerName: "Chọn",
      //   type: "actions",
      //   width: 80,
      //   getActions: (params) => [
      //     <Checkbox
      //       onChange={() => {
      //         this.props.multiple === true
      //           ? (params.row.isChecked = !params.row.isChecked)
      //           : (params.row.isChecked = true);
      //       }}
      //       checked={
      //         params.row.isChecked === true ? true : false
      //       }
      //     >
      //     </Checkbox>
      //   ]
      // },
      { field: "STT", headerName: "STT", width: 100 },
      { field: "CUSTOMER_CODE", headerName: "Mã Khách Hàng", flex: 1 },
      { field: "CUSTOMER_NAME", headerName: "Tên Khách Hàng", flex: 1 },
    ];
    this.createRows = (data) => data.map((row, index) => ({
      STT: index + 1,
      id: index,
      ...row
    }),
    );
  }

  closeDialog(params) {
    if (params) {
      this.props.handleCloseDialog(params.row);
    } else {
      this.props.handleCloseDialog(this.state.selectedContract);
    }
  }

  componentDidMount() {
    this.handleTable();
  }

  rowSelectHandle(idx, status) {
    const { dataTable } = this.state;
    let updateData = dataTable;
    updateData[idx]['isChecked'] = status;
    this.setState({
      dataTable: updateData
    })
  }

  handleTable() {
    let url = window.root_url + `bs-customer/viewCode`;
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
        let temp = this.createRows(data);
        this.setState({
          dataTable: temp,
        });

      }).catch(err => {
        console.log(err)
      });
  }

  handleDelete() {
    let url = window.root_url + `bs-customer/delete`;
    let { dataTable } = this.state;
    let dataSend = dataTable.filter(p => p.isChecked === true).map(item => {
      let obj = {};
      obj["ID"] = item.ID;
      return obj;
    });
    if (dataSend.length === 0) return;
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
        let temp = dataTable.filter(p => p.isChecked !== true);
        temp = temp.map((item, idx) => {
          item.STT = idx + 1;
          return item;
        });
        this.setState({
          dataTable: temp,
          alert: {
            isOpen: true,
            message: "Xóa dữ liệu thành công",
            duration: 2000,
            type: 'success',
          }
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
              message: 'Xóa dữ liệu không thành công',
              type: 'error'
            }
          });
        }
      });
  }

  render() {
    return (
      <Dialog open={this.props.dialog.isOpen} scroll="paper" fullWidth maxWidth="lg">
        <Card>
          <Stack direction="column" spacing={1}>
            <CardContent>
              <Stack direction="row" spacing={1} pt="inherit">
                <Typography variant="h4" pt="5px">Chọn chủ hàng</Typography>
              </Stack>
              <Divider textAlign="center" style={{ paddingTop: "15px" }}></Divider>
              <Stack direction="row" spacing={1} mt={1}>
                <TextField
                  size="small"
                  id="tim-kiem"
                  label="Tìm kiếm"
                  onChange={(e) => {
                    this.setState({ searchField: { CUSTOMER_CODE: e.target.value } })
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
                  onRowDoubleClick={(e) => this.closeDialog(e)}
                  hideFooterSelectedRowCount={true}
                  rows={(this.state.dataTable)
                    .filter(data => data.CUSTOMER_CODE.includes(this.state.searchField.CUSTOMER_CODE.toUpperCase())
                      || data.CUSTOMER_CODE.includes(this.state.searchField.CUSTOMER_CODE.toLowerCase())
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
                  onClick={() => this.closeDialog()}
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
MaKhachHang.defaultProps = { multiple: true };
export default MaKhachHang;