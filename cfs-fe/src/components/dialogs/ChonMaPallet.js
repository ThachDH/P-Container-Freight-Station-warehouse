import * as React from "react";
import * as moment from "moment";
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
  Card,
  CardContent,
  FormControl,
} from "@mui/material";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const columns = [
  { id: "pallet_ProductCode", label: "Mã Mặt Hàng", minWidth: 110 },
  { id: "pallet_ProductName", label: "Tên Mặt Hàng", minWidth: 150 },
  {
    id: "pallet_PalletCode",
    label: "Mã Pallet",
    minWidth: 90,
  },
  {
    id: "pallet_StorageCode",
    label: "Mã Kho",
    minWidth: 80,
  },
  {
    id: "pallet_ImportCode",
    label: "Phiếu Nhập Kho",
    minWidth: 120,
    align: "center",
  },
  {
    id: "pallet_Quantity",
    label: "Số lượng",
    minWidth: 130,
    align: "center",
  },
  {
    id: "pallet_UnitCode",
    label: "Đơn vị tính",
    minWidth: 140,
    align: "center",
  },
  {
    id: "pallet_NetWeight",
    label: "Trọng lượng",
    minWidth: 150,
    align: "center",
  },
  {
    id: "pallet_CustomerName",
    label: "Tên Khách Hàng",
    minWidth: 75,
    align: "center",
  },
  {
    id: "pallet_Location",
    label: "Vị Trí Ô",
    minWidth: 120,
    align: "center",
  },
  {
    id: "pallet_CreateTime",
    label: "Ngày Tạo",
    minWidth: 75,
    align: "center",
  },
  {
    id: "pallet_Description",
    label: "Ghi Chú",
    minWidth: 125,
  },
];

class ChonMaPallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
      dataTable: [],
      selectedPallet: [],
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.dataFilter = {
      pallet_PalletCode: '',
      pallet_ImportCode: '',
      pallet_Location: '',
      pallet_CustomerName: ''
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



  //Thoilc(*Note)-Chọn những phần tử đã được tick
  selected() {
    this.props.handleselected(this.state.selectedPallet);
    this.clearData();

  }

  //Thoilc(*Note)-Clear dữ liệu sau khi chọn
  clearData() {
    this.setState({ selected: [] });
    let data = [...this.state.dataTable];
    data.map((item) => (item.isChecked = false));
    this.setState({ data });
  }

  //Thoilc(*Note)-Chọn nhiều phần tử
  handleSelect(row) {
    this.setState({
      selectedPallet: row
    })
  }

  //Thoilc(*Note)-View ds pallet
  loadPallet() {
    let url = window.root_url + `pallets/getPallet`;
    let dataSend = {
      PalletCode: this.dataFilter.pallet_PalletCode,
      ImportCode: this.dataFilter.pallet_ImportCode,
      Location: this.dataFilter.pallet_Location,
      CustomerName: this.dataFilter.pallet_CustomerName,
      CreateTime: [this.state.fromDate, this.state.toDate],
    };
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
        if (data.length > 0) {
          this.setState({
            dataTable: data,
            alert: {
              isOpen: true,
              duration: 2000,
              message: 'Load dữ liệu thành công',
              type: 'success'
            }
          });
        } else {
          this.setState({
            alert: {
              isOpen: true,
              duration: 3000,
              message: 'Không tìm thấy dữ liệu',
              type: 'warning'
            }
          });
        }
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
  //-----------------------------------
  render() {
    return (
      <Dialog
        open={this.props.dialog.isOpen}
        scroll="paper"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle variant="h5">Chọn Pallet</DialogTitle>
        <Divider />
        <DialogContent>
          <Card sx={{ mb: 1 }}>
            <CardContent>
              <Stack direction="row" spacing={1}>
                <Stack direction="row" spacing={0.5}>
                  <FormControl fullWidth>
                    <TextField
                      id="dialog-ma-pallet"
                      label="Mã Pallet"
                      onChange={(event) => {
                        this.dataFilter.pallet_PalletCode = event.target.value
                      }} />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField id="dialog-ma-kho" label="Mã Kho"
                      onChange={(event) => {
                        this.dataFilter.pallet_Location = event.target.value
                      }} />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={0.5}>
                  <FormControl>
                    <TextField id="dialog-ten-kh" label="Tên Khách Hàng"
                      onChange={(event) => {
                        this.dataFilter.pallet_CustomerName = event.target.value
                      }} />
                  </FormControl>
                  <FormControl>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        label="Từ Ngày"
                        inputFormat="DD/MM/YYYY"
                        value={this.state.fromDate}
                        onChange={(newValue) =>
                          this.setState({
                            fromDate: moment(newValue),
                          })
                        }
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </FormControl>
                  <FormControl>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        label="Đến Ngày"
                        inputFormat="DD/MM/YYYY"
                        value={this.state.toDate}
                        onChange={(newValue) =>
                          this.setState({
                            toDate: moment(newValue),
                          })
                        }
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </FormControl>
                  <Divider orientation="vertical" />
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => this.loadPallet()}>
                    Tìm kiếm
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <TableContainer>
                <Table aria-label="table" className="select-table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Chọn</TableCell>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth, }}
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
                            key={row.pallet_PalletCode + index}
                            onClick={() => {
                              this.handleSelect(row, index)
                            }}
                          >
                            <TableCell align="center">
                              <Radio
                                checked={
                                  this.state.selectedPallet !== [] &&
                                  this.state.selectedPallet.pallet_PalletCode === row.pallet_PalletCode
                                }
                                name="chon-pallet"
                                inputProps={{ "aria-label": row.pallet_PalletCode }}
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
                showFirstButton
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
                showLastButton
              />
            </CardContent>
          </Card>
        </DialogContent >
        <DialogActions>
          <Button onClick={() => this.closeDialog()}>Đóng</Button>
          <Button onClick={() => this.selected()} variant="contained">
            Lưu
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

ChonMaPallet.defaultProps = { multiple: true };
export default ChonMaPallet;
