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
import DateTimePicker from "@mui/lab/DateTimePicker";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import ChonSoPhieu from "../dialogs/ChonSoPhieu";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initalData = {
  id: -1,
  service_No_: "",
  service_Name: "",
  service_UnitOfMeasure: "",
  service_CurrencyNo: "",
  service_UnitPrice: "",
  service_ServiceType: "",
  service_Description: "",
  service_PostingDate: moment(),
  service_UserID: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
};

class ChiTietGiaDichVu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: initalData,
      lstUnit: [],
      lstRentType: [],
      lstServiceType: [],
      lstNoSeriesLine: [],
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
      dialogChonSoPhieuDichvu: {
        isOpen: false,
      },
    };
  }

  selectedSoPhieuDichvu(data) {
    if (data) {
      let number = ("00000" + String(data.LastNoUsed)).substr(-5);
      if (data.LastNoUsed <= parseInt(data.EndingNo)) {
        this.setState({
          data: {
            ...this.state.data,
            service_No_: data.Code + '-' + moment(new Date()).format("YYYYMMDD") + '-' + number,
            Code: data.Code,
            LastNoUsed: data.LastNoUsed,
          }
        });
      } else {
        this.setState({
          alert: {
            isOpen: true,
            message: 'Số bắt đầu vượt số kết thúc, vui lòng tạo bộ mã mới ở mục dùng chung',
            type: 'warning',
          }
        });
      }
      this.closeDialogChonSoPhieuDichVu();
    } else {
      this.setState({
        alert: {
          isOpen: true,
          message: 'Bạn chưa chọn mã',
          type: 'warning',
        }
      });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.dialog.data !== null &&
      prevState.data.id !== nextProps.dialog.data.id
    ) {
      return { data: JSON.parse(JSON.stringify(nextProps.dialog.data)) };
    } else return null;
  }

  chonSoPhieuDichvu() {
    this.setState({
      dialogChonSoPhieuDichvu: {
        isOpen: true,
      },
    });
  }

  closeDialogChonSoPhieuDichVu() {
    this.setState({
      dialogChonSoPhieuDichvu: {
        isOpen: false,
      },
    });
  }

  closeDialog(dataSend) {
    this.props.handleCloseDialog(dataSend);
    this.setState({ data: initalData });
  }

  //Thoilc(*Note)-Lifecycle
  componentDidMount() {
    this.loadUnitOfMeasure();
    this.loadServiceType();
    this.loadRentType();
    this.loadItem_NoSeriesLine();
  }

  //Thoilc(*Note)-Kiểm tra trạng thái
  checkTrangthai(type) {
    switch (type) {
      case 0: this.insertServicePrice(); break;
      case 1: this.updateServicePrice(); break;
      default: return;
    }
  }

  //Thoilc(*Note)-Hiển thị dữ liệu danh sách cấu hình
  loadItem_NoSeriesLine() {
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
        this.setState({ lstNoSeriesLine: data });
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

  //Thoilc(*Note)-View dữ liệu đơn vị tính
  loadUnitOfMeasure() {
    let url = window.root_url + `unit-of-measures/view`;

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
        const arr = [];
        data.map(item => {
          return arr.push({
            No_: item.No_,
            label: item.Name,
            Name: item.Name,
          });
        });
        this.setState({ lstUnit: arr });
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

  //Thoilc(*Note)-Load dữ liệu loại dịch vụ
  loadServiceType() {
    let url = window.root_url + `service-types/view`;

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
        const arr = [];
        data.map(item => {
          return arr.push({
            No_: item.No_,
            label: item.Name,
            Name: item.Name,
          });
        });
        this.setState({ lstServiceType: arr });
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

  //Thoilc(*Note)-Load dữ liệu loại tiền tệ
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

  //Thoilc(*Note)-Insert dữ liệu giá dịch vụ
  insertServicePrice() {
    if (this.state.data.Code === 'DV') {
      let url = window.root_url + `services/insert`;
      let dataSend = {
        No_: this.state.data.service_No_,
        Name: this.state.data.service_Name,
        UnitOfMeasure: this.state.data.service_UnitOfMeasure,
        CurrencyNo: this.state.data.service_CurrencyNo,
        UnitPrice: parseFloat(this.state.data.service_UnitPrice),
        ServiceType: this.state.data.service_ServiceType,
        Description: this.state.data.service_Description,
        PostingDate: moment.utc(this.state.data.service_PostingDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]00:00:00"),
        UserID: this.state.data.service_UserID,
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
          if (data) {
            this.setState({
              data: initalData,
              alert: {
                isOpen: true,
                duration: 2000,
                message: 'Lưu dữ liệu thành công',
                type: 'success',
              }
            });
            this.loadItem_NoSeriesLine();
            this.props.handleCreate(data);
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
    } else {
      this.setState({
        alert: {
          isOpen: true,
          duration: 3000,
          message: 'Mã phiếu dịch vụ *DV* không đúng, vui lòng chọn lại',
          type: 'warning',
        }
      });
    }
  }

  //Thoilc(*Note)-Update dữ liệu giá dịch vụ
  updateServicePrice() {
    let url = window.root_url + `services/update`;
    let dataSend = {
      No_: this.state.data.service_No_,
      Name: this.state.data.service_Name,
      UnitOfMeasure: this.state.data.service_UnitOfMeasure,
      CurrencyNo: this.state.data.service_CurrencyNo,
      UnitPrice: parseFloat(this.state.data.service_UnitPrice),
      ServiceType: this.state.data.service_ServiceType,
      Description: this.state.data.service_Description,
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
        if (data) {
          this.props.handleCloseDialog(dataSend);
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
  //-----------------------------------------------------
  render() {
    return (
      <Dialog open={this.props.dialog.isOpen} scroll="paper">
        <DialogTitle variant="h5">
          {this.props.dialog.type === 0
            ? "Thêm Dịch Vụ"
            : this.props.dialog.type === 1
              ? "Cập Nhật Dịch Vụ"
              : "Chi Tiết Dịch Vụ"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <TextField
                  id="dialog-ma-dv"
                  label="Mã Dịch Vụ*"
                  value={this.state.data.service_No_}
                  inputProps={{
                    readOnly: true,
                  }}
                  onClick={() => {
                    if (this.props.dialog.type !== 0) return;
                    this.chonSoPhieuDichvu();
                  }}
                  className={this.props.dialog.type !== 0 ? "read-only" : ""}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  id="dialog-ten-dv"
                  label="Tên Dịch Vụ*"
                  value={this.state.data.service_Name}
                  onChange={(event) =>
                    this.setState({
                      data: {
                        ...this.state.data,
                        service_Name: event.target.value,
                      },
                    })
                  }
                />
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                {this.props.dialog.type !== 2 ? (
                  <Autocomplete
                    options={this.state.lstUnit || []}
                    id="dvt"
                    disableClearable
                    value={this.state.data.service_UnitOfMeasure}
                    onChange={(event, data) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          service_UnitOfMeasure: data.No_,
                        },
                      })
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Đơn Vị Tính*" />
                    )}
                  />
                ) : (
                  <TextField
                    id="dvt"
                    label="dvt-label"
                    className="read-only"
                    value={this.state.data.service_UnitOfMeasure}
                    inputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              </FormControl>
              <FormControl fullWidth>
                {this.props.dialog.type !== 2 ? (
                  <Autocomplete
                    options={this.state.lstServiceType || []}
                    id="loai-dv"
                    disableClearable
                    value={this.state.data.service_ServiceType}
                    onChange={(event, data) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          service_ServiceType: data.No_,
                        },
                      })
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Loại Dịch Vụ*" />
                    )}
                  />
                ) : (
                  <TextField
                    id="loai-dv"
                    label="Loại Dịch Vụ"
                    className="read-only"
                    value={this.state.data.service_ServiceType}
                    inputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                {this.props.dialog.type !== 2 ? (
                  <Autocomplete
                    options={this.state.lstRentType || []}
                    id="tien-te"
                    disableClearable
                    value={this.state.data.service_CurrencyNo}
                    onChange={(event, data) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          service_CurrencyNo: data.Code,
                        },
                      })
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Tiền Tệ*" />
                    )}
                  />
                ) : (
                  <TextField
                    id="tien-te"
                    label="Tiền Tệ"
                    className="read-only"
                    value={this.state.data.service_CurrencyNo}
                    inputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  id="dialog-don-gia"
                  label="Đơn Giá*"
                  type={"number"}
                  value={this.state.data.service_UnitPrice}
                  onChange={(event) =>
                    this.setState({
                      data: {
                        ...this.state.data,
                        service_UnitPrice: event.target.value,
                      },
                    })
                  }
                />
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    label="Ngày Thực Hiện"
                    value={moment(
                      this.state.data.service_PostingDate,
                      "DD/MM/YYYY HH:mm:ss"
                    )}
                    inputFormat="DD/MM/YYYY"
                    ampm={false}
                    readOnly={true}
                    onChange={(newValue) =>
                      this.setState({
                        data: {
                          ...this.state.data,
                          service_PostingDate: moment(newValue),
                        },
                      })
                    }
                    renderInput={(params) => (
                      <TextField className="read-only" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <TextField
                  id="dialog-dien-giai"
                  label="Diễn Giải"
                  multiline
                  value={this.state.data.service_Description}
                  onChange={(event) =>
                    this.setState({
                      data: {
                        ...this.state.data,
                        service_Description: event.target.value,
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
        {
          this.state.lstNoSeriesLine.length === -1
            ? <span></span>
            :
            <ChonSoPhieu
              dialog={this.state.dialogChonSoPhieuDichvu}
              handleselected={(data) => this.selectedSoPhieuDichvu(data)}
              handleCloseDialog={() => this.closeDialogChonSoPhieuDichVu()}
              dataSrouce={this.state.lstNoSeriesLine}
            ></ChonSoPhieu>
        }
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
export default ChiTietGiaDichVu;
