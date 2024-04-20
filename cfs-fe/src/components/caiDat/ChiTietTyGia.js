import * as React from "react";
import * as moment from "moment";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Divider,
  FormControl,
  Autocomplete,
} from "@mui/material";import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const initalData = {
  id: -1,
  exchrate_CurrencyCode: "",
  exchrate_StartingDate: moment().format("DD/MM/YYYY"),
  exchrate_RelationCurrencyCode: "",
  exchrate_ExchRateAmount: "",
  exchrate_UserID: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class ChiTietTyGia extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: initalData,
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
      lstRentType: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.dialog.data !== null &&
      prevState.data.id !== nextProps.dialog.data.id
    ) {
      return { data: JSON.parse(JSON.stringify(nextProps.dialog.data)) };
    } else return null;
  }

  closeDialog(dataSend) {
    this.props.handleCloseDialog(dataSend);
    this.setState({ data: initalData });
  }

  //Thoilc(*Note)-update state của component trước khi nó render lại
  componentWillUpdate(nextProps, nextState) {
    let check = (this.updateExchRate === true) ? true : false;
    return check;
  }

  //Thoilc(*Note)-Lifecycle
  componentDidMount() {
    this.loadRentType();
  }

  //Thoilc(*Note)-Load dữ liệu tiền tệ
  loadRentType() {
    let url = window.root_url + `rent-types/view`;

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
      .then((data) => {
        const arr = [];
        data.map(item => {
          return arr.push({
            Code: item.Code,
            label: item.Name,
            Name: item.Name,
          });
        });
        this.setState({
          lstRentType: arr,
        });
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

  //Thoilc(*Note)-Kiểm tra trạng khi click vào nút button thái tỷ giá
  checkTrangthai(type) {
    switch (type) {
      case 0: this.insertExchRate(); break;
      case 1: this.updateExchRate(); break;
      default: return;
    }
  }

  //Thoilc(*Note)-Insert dữ liệu tỷ giá
  insertExchRate() {
    let url = window.root_url + `exchange-rates/insert`;

    let dataSend = {
      CurrencyCode: this.state.data.exchrate_CurrencyCode,
      StartingDate: moment.utc(this.state.data.exchrate_StartingDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]00:00:00"),
      RelationCurrencyCode: this.state.data.exchrate_RelationCurrencyCode,
      ExchRateAmount: parseFloat(this.state.data.exchrate_ExchRateAmount),
      UserID: this.state.data.exchrate_UserID,
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
      .then((data) => {
        this.setState({
          data: initalData,
          alert: {
            isOpen: true,
            duration: 2000,
            message: 'Lưu dữ liệu thành công!',
            type: 'success',
          }
        });
        this.props.handleCreate(data);
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

  //Thoilc(*Note)-Update dữ liệu tỷ giá
  updateExchRate() {
    if (this.props.dialog.data.exchrate_StartingDate === this.state.data.exchrate_StartingDate) {
      let url = window.root_url + `exchange-rates/update`;
      let dataSend = {
        CurrencyCode: this.state.data.exchrate_CurrencyCode,
        StartingDate: moment(this.state.data.exchrate_StartingDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]00:00:00"),
        RelationCurrencyCode: this.state.data.exchrate_RelationCurrencyCode,
        ExchRateAmount: parseFloat(this.state.data.exchrate_ExchRateAmount),
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
        .then(() => {
          this.props.handleCloseDialog({ type: 'update', data: dataSend });
        })
        .catch(err => {
          if (JSON.parse(err.message).error.statusCode === 401) {
            localStorage.clear();
            window.location.assign('/login');
          } else {
            this.setState({
              isOpen: true,
              duration: 3000,
              message: 'Lỗi ' + JSON.parse(err.message).error.message,
              type: 'error'
            });
          }
        });
    } else {
      this.setState({
        alert: {
          isOpen: true,
          duration: 3000,
          message: 'Không thể sửa do ngày khác ngày tạo trước đó!',
          type: 'warning',
        }
      });
    }
  }
  //-----------------------------------------------------
  render() {
    return (
      <Dialog open={this.props.dialog.isOpen} scroll="paper">
        <DialogTitle variant="h5">
          {this.props.dialog.type === 0
            ? "Thêm Cài Đặt Tỷ Giá"
            : this.props.dialog.type === 1
              ? "Cập Nhật Tỷ Giá"
              : "Chi Tiết Tỷ Giá"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <Autocomplete
                  options={this.state.lstRentType || []}
                  id="ma-tien-te"
                  label="Mã Tiền Tệ"
                  value={this.state.data.exchrate_CurrencyCode}
                  readOnly={this.props.dialog.type === 1 ? true : false}
                  onChange={(event, data) => {
                    this.setState({
                      data: {
                        ...this.state.data,
                        exchrate_CurrencyCode: data.Code
                      }
                    })
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Mã tiền tệ*"
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Ngày Bắt Đầu*"
                    value={moment(this.state.data.exchrate_StartingDate, "DD/MM/YYYY")}
                    inputFormat="DD/MM/YYYY"
                    readOnly={this.props.dialog.type !== 2 ? true : false}
                    onChange={(newValue) =>
                      this.setState({
                        data: {
                          ...this.state.data,
                          exchrate_StartingDate: moment(newValue).format("DD/MM/YYYY"),
                        },
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        className={
                          this.props.dialog.type === 2 ? "read-only" : ""
                        }
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <Autocomplete
                  options={this.state.lstRentType || []}
                  id="ma-tien-te-qui-doi"
                  label="Mã Tiền Tệ Qui Đổi"
                  value={this.state.data.exchrate_RelationCurrencyCode}
                  readOnly={this.props.dialog.type === 1 ? true : false}
                  onChange={(event, data) => {
                    this.setState({
                      data: {
                        ...this.state.data,
                        exchrate_RelationCurrencyCode: data.Code
                      }
                    })
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Mã Tiền Tệ Qui Đổi*"
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  id="dialog-ti-gia"
                  label="Tỷ Giá Qui Đổi*"
                  type="number"
                  value={this.state.data.exchrate_ExchRateAmount}
                  className={this.props.dialog.type === 2 ? "read-only" : ""}
                  inputProps={{
                    readOnly: this.props.dialog.type === 2 ? true : false,
                  }}
                  onChange={(event) =>
                    this.setState({
                      data: {
                        ...this.state.data,
                        exchrate_ExchRateAmount: event.target.value,
                      },
                    })
                  }
                />
              </FormControl>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          {this.props.dialog.type === 2 ? (
            <Button onClick={() => this.closeDialog()}>Đóng</Button>
          ) : (
            <>
              <Button onClick={() => this.closeDialog()}>Huỷ</Button>
              <Button onClick={() => this.checkTrangthai(this.props.dialog.type)} variant="contained">
                Lưu
              </Button>
            </>
          )}
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
export default ChiTietTyGia;
