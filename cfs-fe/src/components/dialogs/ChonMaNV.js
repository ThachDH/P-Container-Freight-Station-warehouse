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
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const columns = [
  { id: "Code", label: "Số Serial", minWidth: 70 },
  { id: "Description", label: "Diễn Giải", minWidth: 150 },
  {
    id: "StartingNo",
    label: "Số Bắt Đầu",
    minWidth: 100,
  },
  {
    id: "EndingNo",
    label: "Mã Kết Thúc",
    minWidth: 105,
  },
  {
    id: "ImcrementNo",
    label: "Tăng Theo Số",
    minWidth: 100,
  },
  {
    id: "LastNoUsed",
    label: "Số Dùng Gần Nhất",
    minWidth: 100,
  },
];

class ChonMaNV extends React.Component {
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
      Code: '',
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
  selected() {
    this.props.handleselected(this.state.selected);
    this.clearData();
  }
  clearData() {
    this.setState({ selected: null });
  }
  handleSelect(row) {
    let dataSelected = {
      ...row,
      LastNoUsed: (parseInt(row.LastNoUsed) + parseInt(row.ImcrementNo)),
    };
    this.setState({ selected: dataSelected });
  }
  //Thoilc(*Note)-Lifecycle
  componentDidMount() {
    this.loadNoSerialLine();
  }
  //Thoilc(*Note)-load dữ liệu danh sách nhân viên
  loadNoSerialLine() {
    let url = window.root_url + `no-series-lines/view`;

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
  //-------------------------------------------------
  render() {
    return (
      <Dialog
        open={this.props.dialog.isOpen}
        scroll="paper"
        fullWidth={true}
        maxWidth="lg"
        data={this.state.data}
      >
        <DialogTitle variant="h5">Chọn bảng cấu hình</DialogTitle>
        <Divider />
        <DialogContent>
          <Card style={{ marginBottom: '12px' }}>
            <CardContent>
              <Stack direction="row" spacing={1}>
                <Stack spacing={2}>
                  <FormControl>
                    <InputLabel htmlFor="ma-serial">Số Serial</InputLabel>
                    <OutlinedInput id="ma-serial" label="Số Serial"
                      onChange={(e) => {
                        this.tableFilter.Code = e.target.value
                      }} />
                  </FormControl>
                  <span>&nbsp;&nbsp;</span>
                  <Button type="button" variant="contained" onClick={() => this.filterGridView()}>
                    Tìm kiếm
                  </Button>
                </Stack>
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
                      {columns.map((column, idx) => (
                        <TableCell
                          key={column.id + idx}
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
                        if (data.Code.includes(this.tableFilter.Code)) {
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
                            key={row.Code}
                            onClick={() => this.handleSelect(row, index)}
                          >
                            <TableCell align="center">
                              <Radio
                                checked={
                                  this.state.selected !== null &&
                                  this.state.selected.Code === row.Code
                                }
                                name="chon-ma-hop-dong"
                                inputProps={{ "aria-label": row.Code }}
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
export default ChonMaNV;
