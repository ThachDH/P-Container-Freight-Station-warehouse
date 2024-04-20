import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Radio,
  Card,
  CardContent,
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const columns = [
  { id: "No_", label: "Mã KH", minWidth: 70 },
  { id: "No_2", label: "Mã Phụ", minWidth: 80 },
  {
    id: "Name",
    label: "Tên Khách Hàng",
    minWidth: 170,
  },
  {
    id: "SearchName",
    label: "Tên Tìm Nhanh",
    minWidth: 125,
  },
  {
    id: "Address",
    label: "Địa Chỉ",
    minWidth: 150,
  },
  {
    id: "Status",
    label: "Trạng thái",
    minWidth: 50,
  }
];

class TimKhachHang extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
      dataTable: [],
      // dataTable: [...rows],
      selected: null,
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.searchTable = {
      No_: '',
      No_2: '',
      Name: '',
      SearchName: '',
    };
  }
  handleChangePage(event, newPage) {
    this.setState({ page: newPage });
  }
  handleChangeRowsPerPage(event) {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  }
  closeDialog() {
    this.props.handleCloseDialog();
    this.clearData();
  }
  //Thoilc(*Note) - event Button Chọn
  selected() {
    this.props.handleselected(this.state.selected);
    this.clearData();
  }
  clearData() {
    this.setState({ selected: null });
  }

  //Thoilc(*Note) - Hàm 
  handleSelect(row) {
    //console.log(row.maKH);
    this.setState({ selected: row });
  }

  //Thoilc(*Note)-Lifecycle
  componentDidMount() {
    this.loadCustomer();
  }

  //Thoilc(*Note) -Load danh sách khách hàng đang sử dụng
  loadCustomer() {
    const url = window.root_url + `customers/view`;
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
        const arr = [];
        data.map(item => {
          return item.Status === 1 ? arr.push(item) : [];
        })
        this.setState({ dataTable: arr });
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

  //Thoilc(*Note)-Tìm kiếm khách hàng trên lưới Dialog
  filterGridView() {
    this.setState({ searchTable: Object.assign({}, this.searchTable) });
  }
  //-------------------------------------------------
  render() {
    return (
      <Dialog
        open={this.props.dialog.isOpen}
        scroll="paper"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle variant="h5">Chọn Khách Hàng</DialogTitle>
        <Divider />
        <DialogContent>
          <Card style={{ marginBottom: '12px' }}>
            <CardContent>
              <Stack direction="row" spacing={1}>
                <Stack direction="row" spacing={1}>
                  <FormControl>
                    <InputLabel htmlFor="ma-kh">Mã KH</InputLabel>
                    <OutlinedInput id="ma-kh" label="Mã KH"
                      onChange={(e) => {
                        this.searchTable.No_ = e.target.value
                      }} />
                  </FormControl>
                  <FormControl>
                    <InputLabel htmlFor="ma-phu">Mã phụ</InputLabel>
                    <OutlinedInput id="ma-phu" label="Mã phụ"
                      onChange={(e) => {
                        this.searchTable.No_2 = e.target.value
                      }} />
                  </FormControl>
                  <FormControl>
                    <InputLabel htmlFor="ten-kh">Tên khách hàng</InputLabel>
                    <OutlinedInput id="ten-kh" label="Tên khách hàng"
                      onChange={(e) => {
                        this.searchTable.Name = e.target.value
                      }} />
                  </FormControl>
                  <FormControl>
                    <InputLabel htmlFor="ten-tn">Tên tìm nhanh</InputLabel>
                    <OutlinedInput id="ten-tn" label="Tên tìm nhanh"
                      onChange={(e) => {
                        this.searchTable.SearchName = e.target.value
                      }} />
                  </FormControl>
                </Stack>
                <Button type="button" variant="contained" onClick={() => this.filterGridView()}>
                  Tìm kiếm
                </Button>
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <TableContainer sx={{ maxHeight: "54.5vh" }}>
                <Table stickyHeader aria-label="sticky table" className="select-table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Chọn</TableCell>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.dataTable
                      .filter(data => {
                        if (data.No_.includes(this.searchTable.No_)
                          && data.No_2.includes(this.searchTable.No_2)
                          && data.Name.includes(this.searchTable.Name)
                          && data.SearchName.includes(this.searchTable.SearchName)
                        ) {
                          return data;
                        } else {
                          return false;
                        }
                      })
                      .slice(
                        this.state.page * this.state.rowsPerPage,
                        this.state.page * this.state.rowsPerPage +
                        this.state.rowsPerPage
                      )
                      .map((row, index) => {
                        return (
                          <TableRow
                            hover
                            tabIndex={-1}
                            key={row.No_}
                            onClick={() => this.handleSelect(row)}
                          >
                            <TableCell align="center">
                              <Radio
                                checked={
                                  this.state.selected !== null &&
                                  this.state.selected.No_ === row.No_
                                }
                                name="chon-khach-hang"
                                inputProps={{ "aria-label": row.No_ }}
                              />
                            </TableCell>
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={(this.state.dataTable || []).length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onPageChange={(event, newPage) =>
                  this.handleChangePage(event, newPage)
                }
                onRowsPerPageChange={(event) =>
                  this.handleChangeRowsPerPage(event)
                }
              />
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.closeDialog()}>Đóng</Button>
          <Button onClick={() => this.selected()} variant="contained">
            Chọn
          </Button>
        </DialogActions>
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
export default TimKhachHang;
