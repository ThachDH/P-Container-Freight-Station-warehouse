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
import DeleteIcon from '@mui/icons-material/Delete';

class MaHopDong extends React.Component {
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
        CONTRACT_CODE: "",
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
      { field: "CUSTOMER_CODE", headerName: "Mã khách hàng", flex: 1 },
      { field: "CONTRACT_CODE", headerName: "Mã hợp đồng", flex: 1 },
      { field: "CONTRACT_NAME", headerName: "Tên hợp đồng", flex: 1 },
      { field: "FROM_DATE", headerName: "Ngày bắt đầu", flex: 1 },
      { field: "TO_DATE", headerName: "Ngày hết hạn", flex: 1 },
      { field: "NOTE", headerName: "Ghi chú", flex: 1 },
    ];
    this.createRows = (data) => data.map((row, index) => ({
      STT: index + 1,
      id: index,
      ...row
    }),
    );
  }

  LoadDataDetail(params) {
    if (params) {
      this.props.handleLoadData(params.row);
    } else {
      this.props.handleLoadData(this.state.selectedContract);
    }
  }

  closeDialog() {
    this.props.handleCloseDialog();
  }

  componentDidMount() {
    this.handleTable();
  }

  handleTable() {
    let url = window.root_url + `bs-contracts/view`;
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
    let url = window.root_url + `bs-contracts/delete`;
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
                <Typography variant="h4" pt="5px">Mã Hợp Đồng</Typography>

              </Stack>
              <Divider textAlign="center" style={{ paddingTop: "15px" }}></Divider>
              <Stack direction="row" mt={1} spacing={1}>
                <TextField
                  size="small"
                  id="tim-kiem"
                  label="Tìm kiếm theo mã hợp đồng "
                  onChange={(e) => {
                    this.setState({ searchField: { CONTRACT_CODE: e.target.value } })
                  }}
                  value={this.state.searchField.CONTRACT_CODE}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }} />
              </Stack>
              <Stack direction="row" spacing={1} mt={1} >
                <DataGrid
                  onRowDoubleClick={(params) => this.LoadDataDetail(params)}
                  hideFooterSelectedRowCount={true}
                  rows={(this.state.dataTable)
                    .filter(data => data.CONTRACT_CODE.includes(this.state.searchField.CONTRACT_CODE.toUpperCase())
                      || data.CONTRACT_CODE.includes(this.state.searchField.CONTRACT_CODE.toLowerCase())
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
                  onClick={() => { this.handleTable() }}
                  startIcon={<CachedIcon />}
                >
                  Tải lại
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  style={{
                    marginLeft: "auto",
                  }}
                  onClick={() => this.handleDelete()}
                >
                  xóa
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<DoneIcon />}
                  // style={{
                  //   marginLeft: "auto"
                  // }}
                  onClick={() => this.LoadDataDetail()}
                >
                  Chọn
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  // style={{
                  //   marginLeft: "auto"
                  // }}
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
MaHopDong.defaultProps = { multiple: true };
export default MaHopDong;