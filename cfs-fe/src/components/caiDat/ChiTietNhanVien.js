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
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import DateAdapter from "@mui/lab/AdapterMoment";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ChonMaNV from "../dialogs/ChonMaNV";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initalData = {
  id: -1,
  employee_No_: "",
  employee_No_2: "",
  employee_FullName: "",
  employee_Sex: "",
  employee_BirthDate: moment(),
  employee_Address: "",
  employee_City: "",
  employee_Status: "",
  employee_JobTitle: "",
  employee_Department: "",
  employee_Race: "",
  employee_IDCard: "",
  employee_DateOfIssue: moment(),
  employee_PlaceOfIssue: "",
  employee_Phone: "",
  employee_Email: "",
};

class ChiTietNhanVien extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: initalData,
      dialogChonMaNV: {
        isOpen: false,
      },
      danhSachTinhTP: [],
      danhSachPhBan: [],
      danhSachChVu: [],
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
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

  chonMaNV() {
    this.setState({
      dialogChonMaNV: {
        isOpen: true,
      },
    });
  }

  closeDialogChonMaNV() {
    this.setState({
      dialogChonMaNV: {
        isOpen: false,
      },
    });
  }

  //Thoilc(*Note)-Chọn danh sách nhân viên
  selectedMaNV(data) {
    let _number = ("00000" + String(data.LastNoUsed)).slice(-9);
    if (data.LastNoUsed <= parseInt(data.EndingNo)) {
      this.setState({
        data: {
          ...this.state.data,
          employee_No_: data.Code + "/" + _number,
          Code: data.Code,
          LastNoUsed: data.LastNoUsed,
        },
      });
    } else {
      alert('Số bắt đầu vượt số kết thúc, vui lòng tạo bộ mã mới ở mục dùng chung!');
    }
    this.closeDialogChonMaNV();
  }

  //Thoilc(*Note)-Lifecycle
  componentDidMount() {
    this.loadCity();
    this.loadDepartment();
    this.loadJobTitle();
  }

  //Thoilc(*Note)-view dữ liệu tỉnh/tp
  loadCity() {
    let url_city = window.root_url + `cities/view`;

    fetch(url_city, {
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
            Name: item.Name
          });
        })
        this.setState({ danhSachTinhTP: arr });
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

  //Thoilc(*Note)-view dữ liệu phòng ban
  loadDepartment() {
    let url_department = window.root_url + `departments/view`;
    fetch(url_department, {
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
        })
        this.setState({ danhSachPhBan: arr });
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

  //Thoilc(*Note)-Hiển thị danh sách chức vụ
  loadJobTitle() {
    let url_jobtitle = window.root_url + `job-titles/view`;

    fetch(url_jobtitle, {
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
        })
        this.setState({ danhSachChVu: arr });
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

  //Thoilc(*Note)-Kiểm tra trạng thái
  checkTrangthai(type) {
    switch (type) {
      case 0: this.insertEmployee(); break;
      case 1: this.updateEmployee(); break;
      default: return;
    }
  }

  //Thoilc(*Note)-Insert dữ liệu nhân viên
  insertEmployee() {
    let url = window.root_url + `employee/insert`;
    if (this.state.data.Code === "NV") {
      let dataSend = {
        No_: this.state.data.employee_No_,
        No_2: this.state.data.employee_No_2,
        FullName: this.state.data.employee_FullName,
        Sex: this.state.data.employee_Sex,
        BirthDate: moment.utc(this.state.data.employee_BirthDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
        Address: this.state.data.employee_Address,
        City: this.state.data.employee_City,
        JobTitle: this.state.data.employee_JobTitle,
        Department: this.state.data.employee_Department,
        IDCard: this.state.data.employee_IDCard,
        DateOfIssue: moment.utc(this.state.data.employee_DateOfIssue, "DD/MM/YYYY").format("YYYY-MM-DD"),
        PlaceOfIssue: this.state.data.employee_PlaceOfIssue,
        Phone: this.state.data.employee_Phone,
        Email: this.state.data.employee_Email,
      };

      let dataSend1 = {
        employee_No_: this.state.data.employee_No_,
        employee_No_2: this.state.data.employee_No_2,
        employee_FullName: this.state.data.employee_FullName,
        employee_Sex: this.state.data.employee_Sex,
        employee_BirthDate: moment.utc(this.state.data.employee_BirthDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
        employee_Address: this.state.data.employee_Address,
        employee_City: this.state.data.employee_City,
        employee_JobTitle: this.state.data.employee_JobTitle,
        employee_Department: this.state.data.employee_Department,
        employee_IDCard: this.state.data.employee_IDCard,
        employee_DateOfIssue: moment.utc(this.state.data.employee_DateOfIssue, "DD/MM/YYYY").format("YYYY-MM-DD"),
        employee_PlaceOfIssue: this.state.data.employee_PlaceOfIssue,
        employee_Phone: this.state.data.employee_Phone,
        employee_Email: this.state.data.employee_Email,
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
          this.setState({
            data: initalData,
            alert: {
              isOpen: true,
              duration: 2000,
              message: 'Lưu dữ liệu thành công!',
              type: 'success',
            }
          });
          this.props.handleCreate(dataSend1);
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
          message: 'Mã nhân viên *NV* chưa đúng, vui lòng chọn lại!',
          type: 'warning',
        }
      })
    }
  }

  //Thoilc(*Note)-Update dữ liệu nhân viên
  updateEmployee() {
    let url = window.root_url + `employee/update`;

    let dataSend = {
      No_: this.state.data.employee_No_,
      No_2: this.state.data.employee_No_2,
      FullName: this.state.data.employee_FullName,
      Sex: this.state.data.employee_Sex,
      BirthDate: moment.utc(this.state.data.employee_BirthDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]00:00:00"),
      Address: this.state.data.employee_Address,
      City: this.state.data.employee_City,
      JobTitle: this.state.data.employee_JobTitle,
      Department: this.state.data.employee_Department,
      IDCard: this.state.data.employee_IDCard,
      DateOfIssue: moment.utc(this.state.data.employee_DateOfIssue, "DD/MM/YYYY").format("YYYY-MM-DD[T]00:00:00"),
      PlaceOfIssue: this.state.data.employee_PlaceOfIssue,
      Phone: this.state.data.employee_Phone,
      Email: this.state.data.employee_Email,
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
            ? "Thêm Nhân Viên"
            : this.props.dialog.type === 1
              ? "Cập Nhật Thông Tin Nhân Viên"
              : "Chi Tiết Thông Tin Nhân Viên"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <TextField
                  id="dialog-ma-nv"
                  label="Mã Nhân Viên*"
                  value={this.state.data.employee_No_}
                  className={this.props.dialog.type !== 0 ? "read-only" : ""}
                  onClick={() => {
                    if (this.props.dialog.type !== 0) return;
                    this.chonMaNV();
                  }}
                  inputProps={{
                    readOnly: true,
                  }}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  id="dialog-ma-phu"
                  label="Mã Phụ"
                  value={this.state.data.employee_No_2}
                  className={this.props.dialog.type === 2 ? "read-only" : ""}
                  inputProps={{
                    readOnly: this.props.dialog.type === 2 ? true : false,
                  }}
                  onChange={(event) =>
                    this.setState({
                      data: {
                        ...this.state.data,
                        employee_No_2: event.target.value,
                      },
                    })
                  }
                />
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <TextField
                  id="dialog-ho-ten"
                  label="Họ và Tên*"
                  value={this.state.data.employee_FullName}
                  className={this.props.dialog.type === 2 ? "read-only" : ""}
                  inputProps={{
                    readOnly: this.props.dialog.type === 2 ? true : false,
                  }}
                  onChange={(event) =>
                    this.setState({
                      data: {
                        ...this.state.data,
                        employee_FullName: event.target.value,
                      },
                    })
                  }
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="gioi-tinh-label">Giới Tính*</InputLabel>
                <Select
                  labelId="gioi-tinh-label"
                  id="gioi-tinh"
                  label="Giới Tính"
                  value={this.state.data.employee_Sex}
                  onChange={(event) =>
                    this.setState({
                      data: {
                        ...this.state.data,
                        employee_Sex: event.target.value,
                      },
                    })
                  }
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Ngày Sinh*"
                    value={moment(this.state.data.employee_BirthDate, "DD/MM/YYYY")}
                    inputFormat="DD/MM/YYYY"
                    readOnly={this.props.dialog.type === 2 ? true : false}
                    onChange={(newValue) =>
                      this.setState({
                        data: {
                          ...this.state.data,
                          employee_BirthDate: moment(newValue).format("DD/MM/YYYY"),
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
              <FormControl fullWidth>
                {this.props.dialog.type !== 2 ? (
                  <Autocomplete
                    options={this.state.danhSachTinhTP || []}
                    id="dialog-tinh-tp"
                    value={this.state.data.employee_City}
                    onChange={(event, data) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          employee_City: data.No_
                        },
                      })
                    }
                    }
                    disableClearable
                    renderInput={(params) => (
                      <TextField {...params} label="Tỉnh/Thành Phố*" />
                    )}
                  />
                ) : (
                  <TextField
                    id="dialog-tinh-tp"
                    label="Tỉnh/Thành Phố"
                    className="read-only"
                    value={this.state.data.employee_City}
                    inputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <TextField
                  id="dialog-dia-chi"
                  label="Địa chỉ*"
                  multiline
                  value={this.state.data.employee_Address}
                  className={this.props.dialog.type === 2 ? "read-only" : ""}
                  onChange={(event) =>
                    this.setState({
                      data: { ...this.state.data, employee_Address: event.target.value },
                    })
                  }
                  inputProps={{
                    readOnly: this.props.dialog.type === 2 ? true : false,
                  }}
                />
              </FormControl>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <TextField
                    id="dialog-email"
                    label="Email*"
                    value={this.state.data.employee_Email}
                    className={this.props.dialog.type === 2 ? "read-only" : ""}
                    onChange={(event) =>
                      this.setState({
                        data: { ...this.state.data, employee_Email: event.target.value },
                      })
                    }
                    inputProps={{
                      type: "email",
                      readOnly: this.props.dialog.type === 2 ? true : false,
                    }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    id="dialog-dtdd"
                    label="ĐTDD*"
                    value={this.state.data.employee_Phone}
                    className={this.props.dialog.type === 2 ? "read-only" : ""}
                    onChange={(event) =>
                      this.setState({
                        data: { ...this.state.data, employee_Phone: event.target.value },
                      })
                    }
                    inputProps={{
                      type: "number",
                      readOnly: this.props.dialog.type === 2 ? true : false,
                    }}
                  />
                </FormControl>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <TextField
                  id="dialog-cmnd"
                  label="CMND*"
                  value={this.state.data.employee_IDCard}
                  className={this.props.dialog.type === 2 ? "read-only" : ""}
                  onChange={(event) =>
                    this.setState({
                      data: { ...this.state.data, employee_IDCard: event.target.value },
                    })
                  }
                  inputProps={{
                    type: "number",
                    readOnly: this.props.dialog.type === 2 ? true : false,
                  }}
                />
              </FormControl>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Ngày Cấp*"
                    value={moment(this.state.data.employee_DateOfIssue, "DD/MM/YYYY")}
                    inputFormat="DD/MM/YYYY"
                    readOnly={this.props.dialog.type === 2 ? true : false}
                    onChange={(newValue) =>
                      this.setState({
                        data: {
                          ...this.state.data,
                          employee_DateOfIssue: moment(newValue).format("DD/MM/YYYY"),
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
              <FormControl fullWidth>
                {this.props.dialog.type !== 2 ? (
                  <Autocomplete
                    options={this.state.danhSachTinhTP || []}
                    id="dialog-noi-cap"
                    value={this.state.data.employee_PlaceOfIssue}
                    onChange={(event, data) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          employee_PlaceOfIssue: data.No_
                        },
                      })
                    }}
                    disableClearable
                    renderInput={(params) => {
                      // console.log(params);
                      return <TextField {...params} label="Nơi Cấp*" />
                    }}
                  />
                ) : (
                  <TextField
                    id="dialog-noi-cap"
                    label="Nơi Cấp"
                    className="read-only"
                    value={this.state.data.employee_PlaceOfIssue}
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
                    options={this.state.danhSachChVu || []}
                    id="bo-phan"
                    value={this.state.data.employee_JobTitle}
                    onChange={(event, data) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          employee_JobTitle: data.No_
                        },
                      })
                    }}
                    disableClearable
                    renderInput={(params) => {
                      return <TextField {...params} label="Chức vụ*" />
                    }}
                  />
                ) : (
                  <TextField
                    id="bo-phan"
                    label="Chức Vụ"
                    className="read-only"
                    value={this.state.data.employee_JobTitle}
                    inputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              </FormControl>
              <FormControl fullWidth>
                {this.props.dialog.type !== 2 ? (
                  <Autocomplete
                    options={this.state.danhSachPhBan || []}
                    id="chuc-vu"
                    label="Bộ Phận*"
                    value={this.state.data.employee_Department}
                    onChange={(event, data) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          employee_Department: data.No_,
                        },
                      })
                    }}
                    disableClearable
                    renderInput={(params) => {
                      return <TextField {...params} label="Bộ Phận*" />
                    }}
                  />
                ) : (
                  <TextField
                    id="chuc-vu"
                    label="Bộ Phận"
                    className="read-only"
                    value={this.state.data.employee_Department}
                    inputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              </FormControl>
            </Stack>
          </Stack>
          <ChonMaNV
            dialog={this.state.dialogChonMaNV}
            handleselected={(data) => this.selectedMaNV(data)}
            handleCloseDialog={() => this.closeDialogChonMaNV()}
          />

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
      </Dialog >
    );
  }
}
export default ChiTietNhanVien;
