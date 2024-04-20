import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Stack,
  FormControl,
  TextField,
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const columns = [
  { id: "contract_No_", label: "Mã HĐ", minWidth: 70 },
  { id: "contract_Name", label: "Nội Dung", minWidth: 120 },
  {
    id: "contract_DocumentNo",
    label: "Số Chứng từ",
    minWidth: 110,
  },
  {
    id: "contract_DocumentDate",
    label: "Ngày Lập",
    minWidth: 70,
  },
  {
    id: "contract_EmployeeNo",
    label: "Nhân Viên",
    minWidth: 110,
  },
  {
    id: "contract_CustomerNo",
    label: "Mã Khách Hàng",
    minWidth: 90,
  },
  {
    id: "getCustomer_Name",
    label: "Tên Khách Hàng",
    minWidth: 100,
  },
  {
    id: "getCustomer_Contact",
    label: "Đại Diện Khách Hàng",
    minWidth: 105,
  },
  {
    id: "getCustomer_CustomerPostingGroup",
    label: "Chức Vụ Khách Hàng",
    minWidth: 105,
  },
  {
    id: "contract_DocumentType",
    label: "Loại Hợp Đồng",
    minWidth: 125,
  },
  {
    id: "contract_FromDate",
    label: "Từ Ngày",
    minWidth: 70,
  },
  {
    id: "contract_ToDate",
    label: "Đến Ngày",
    minWidth: 70,
  },
  {
    id: "contract_Description",
    label: "Diễn Giải",
    minWidth: 100,
  },
];

class ChonHopDongKhachHang extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
      dataTable: [],
      selected: null,
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.tableFilter = {
      contract_No_: '',
    };
  }

  //Thoilc(*Note)-Lifecycle
  componentDidMount() {
    this.loadData_CusContract();
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
  selected() {
    this.props.handleselected(this.state.selected);
    this.clearData();
  }
  clearData() {
    this.setState({ selected: null });
  }
  handleSelect(row) {
    this.setState({ selected: row });
  }
  //Thoilc(*Note)-view hợp đồng khách hàng
  loadData_CusContract() {
    let url = window.root_url + `customer-contract/view`;

    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
      body: JSON.stringify({}),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(data => {
        this.setState({ dataTable: data });
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

  //Thoilc(*Note)-Lọc dữ liệu trên lưới
  filterGridView() {
    this.setState({ tableFilter: Object.assign({}, this.tableFilter) });
  }
  //---------------------------
  render() {
    return (
      <Dialog
        open={this.props.dialog.isOpen}
        scroll="paper"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle variant="h5">Chọn Hợp Đồng Khách Hàng</DialogTitle>
        <Divider />
        <DialogContent>
          <Card style={{ marginBottom: '12px' }}>
            <CardContent>
              <Stack component="form" direction="row" spacing={1}>
                <Stack direction="row" spacing={1}>
                  <FormControl>
                    <TextField
                      id="ma-hd" label="Mã Hợp Đồng"
                      onChange={(e) => {
                        this.tableFilter.contract_No_ = e.target.value
                      }}
                    />
                  </FormControl>
                  <Divider orientation="vertical" />
                  <Button type="button" variant="contained" onClick={() => this.filterGridView()}>
                    Tìm kiếm
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <TableContainer>
                <Table stickyHeader aria-label="table" className="select-table">
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
                    {(this.state.dataTable)
                      .filter(data => {
                        if (data.contract_No_.includes(this.tableFilter.contract_No_)) {
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
                      .map((row) => {
                        return (
                          <TableRow
                            hover
                            tabIndex={-1}
                            key={row.contract_No_}
                            onClick={() => this.handleSelect(row)}
                          >
                            <TableCell align="center">
                              <Radio
                                checked={
                                  this.state.selected !== null &&
                                  this.state.selected.contract_No_ === row.contract_No_
                                }
                                name="chon-hop-dong"
                                inputProps={{ "aria-label": row.contract_No_ }}
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
      </Dialog>
    );
  }
}
export default ChonHopDongKhachHang;
