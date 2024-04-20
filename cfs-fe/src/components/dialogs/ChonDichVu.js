import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const columns = [
  { id: "service_No_", label: "Mã Dịch Vụ", minWidth: 80 },
  { id: "service_Name", label: "Tên Dịch Vụ", minWidth: 100 },
  {
    id: "service_UnitOfMeasure",
    label: "Đơn Vị Tính",
    minWidth: 70,
  },
  {
    id: "service_CurrencyNo",
    label: "Tiền Tệ",
    minWidth: 70,
  },
  {
    id: "service_UnitPrice",
    label: "Đơn Giá",
    minWidth: 100,
  },
  {
    id: "service_Description",
    label: "Diễn Giải",
    minWidth: 100,
  },
];

class ChonDichVu extends React.Component {
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
    this.dataFilter = {
      service_No_: '',
      service_Name: 'null'
    }
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

  //Thoilc(*Note)-View dữ liệu dịch vụ
  loadDichVu() {
    let url = window.root_url + `services/getService`;
    let dataSend = {
      No_: this.dataFilter.service_No_,
      Name: this.dataFilter.service_Name
    };

    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
      body: JSON.stringify(dataSend),
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
  //--------------------------------------
  render() {
    return (
      <Dialog
        open={this.props.dialog.isOpen}
        scroll="paper"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle variant="h5">Chọn Dịch Vụ</DialogTitle>
        <Divider />
        <DialogContent>
          <div className="search-container">
            <Stack direction="row" spacing={1}>
              <Stack direction="row" spacing={1}>
                <TextField id="search-ma-dv" label="Mã Dịch Vụ"
                  onChange={(e) => {
                    this.dataFilter.service_No_ = e.target.value
                  }} />
                <TextField id="search-ten-dv" label="Tên Dịch Vụ"
                  onChange={(e) => {
                    this.dataFilter.service_Name = e.target.value
                  }} />
              </Stack>
              <Button type="button" variant="contained"
                onClick={() => this.loadDichVu()}>
                Tìm kiếm
              </Button>
            </Stack>
          </div>
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
                          key={row.service_No_}
                          onClick={() => this.handleSelect(row)}
                        >
                          <TableCell align="center">
                            <Radio
                              checked={
                                this.state.selected !== null &&
                                // this.state.selected.id === row.id
                                this.state.selected.service_No_ === row.service_No_
                              }
                              name="chon-dich-vu"
                              inputProps={{ "aria-label": row.id }}
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
              // count={rows.length}
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
export default ChonDichVu;
