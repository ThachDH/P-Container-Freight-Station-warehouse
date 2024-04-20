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
} from "@mui/material";
import moment from "moment";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const columns = [
  { id: "No_", label: "Mã Phụ Lục", minWidth: 70 },
  { id: "DocumentDate", label: "Ngày Tạo PL", minWidth: 80 },
  {
    id: "EmployeeNo",
    label: "Nhân Viên",
    minWidth: 170,
  },
  {
    id: "FromDate",
    label: "Thời Hạn Từ Ngày",
    minWidth: 80,
  },
  {
    id: "ToDate",
    label: "Đến Ngày",
    minWidth: 80,
  },
  {
    id: "Description",
    label: "Diễn Giải",
    minWidth: 150,
  },
];

function createData(No_, DocumentDate, EmployeeNo, FromDate, ToDate, Description) {
  return { No_, DocumentDate, EmployeeNo, FromDate, ToDate, Description };
}

class ChonPhuLucHD extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
      dataTable: [],
      selected: {},
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
  }

  componentDidMount() {
    this.loadEmpContracts();
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
  // Thoilc(*Note)-Phụ lục hợp đồng
  loadEmpContracts() {
    let url = window.root_url + `customer-sub-contracts/view`;

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
        let arr = [];
        data.map(item => {
          let dataRows = createData(
            item.SubNo_,
            moment(item.DocumentDate).format("DD/MM/YYYY"),
            item.EmployeeNo,
            moment(item.FromDate).format("DD/MM/YYYY"),
            moment(item.ToDate).format("DD/MM/YYYY"),
            item.Description
          );
          return arr.push(dataRows);
        });
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
  //------------------------------------------
  render() {
    return (
      <Dialog
        open={this.props.dialog.isOpen}
        scroll="paper"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle variant="h5">Chọn Phụ Lục Hợp Đồng</DialogTitle>
        <Divider />
        <DialogContent>
          <div className="main-content">
            <TableContainer>
              <Table aria-label="table" className="select-table">
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
                              name="chon-phu-luc"
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
          </div>
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
export default ChonPhuLucHD;
