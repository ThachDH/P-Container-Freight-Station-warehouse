import * as React from "react";
import * as moment from "moment";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Autocomplete,
  Grid,
  Button,
  TextField,
  Divider,
  Tabs,
  Tab,
  CardHeader,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemIcon,
  FormGroup,
} from "@mui/material";
import ListItem from '@mui/material/ListItem';
import { Warehouse } from "@mui/icons-material";
import ListItemText from '@mui/material/ListItemText';
import FixedPageName from "../../componentsCFS2/fixedPageName";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { DataGrid } from "@mui/x-data-grid";
import { DigitalClock } from "../../componentsCFS2/GeneralComponents";
import { socketServices } from "../../_services/socket.service";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const { socket } = socketServices;

const initaldata = {
  CNTRNO: '',
  TRUCK_NO: '',
  CLASS_CODE: '',
  IS_IN_OUT: '',
  METHOD_CODE: '',
  WAREHOUSE_CODE: '',
  PALLET_NO: '',
  HOUSE_BILL: '',
  BOOKING_FWD: '',
  BLOCK: '',
  ORDER_NO: '',
  JOB_STATUS: ''
}

class Operating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempSelected: '',
      selectedStorage: {},
      isLogoutGate: true,
      isLogoutCheck: true,
      isLogoutForkl: true,
      dataTableGate: [],
      dataTableTally: [],
      dataTableStock: [],
      dataItem: [],
      type: 1,
      gateDevice: [],
      connectedGate: [],
      connectedCheck: [],
      connectedForkl: [],
      tallyDevice: [],
      forkLiftDevice: [],
      operate: true,
      operateGate: true,
      operateCheck: true,
      operateForkl: true,
      dataInput: initaldata,
      inputGateCode: '',
      wareHouse: [],
      quatityCheck: "all",
      dataMETHOD_CODE: [],
      dataWAREHOUSE_CODE: [],
      dataIS_IN_OUT: [],
      dataBlock: [],
      dialogItem: {
        isOpen: true
      },
      storageList: [],

      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.columnGate = [
      {
        field: "STT",
        headerName: "STT",
        editable: false,
        align: "center",
        headerAlign: "center",
        width: 80,
      },
      {
        field: "GATE_CODE",
        headerName: "Cổng vào",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "ORDER_NO",
        headerName: "Số Lệnh",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "CNTRNO",
        headerName: "Số Container",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "BILL",
        headerName: "Số vận đơn",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "METHOD_CODE",
        headerName: "Phương án",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "VESSEL_NAME",
        headerName: "Tên tàu",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "BOUND_VOYAG",
        headerName: "Chuyến nhập/Xuất",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "CLASS_CODE",
        headerName: "Hướng",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "TIME_IN",
        headerName: "Thời Gian Vào",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "STATUS",
        headerName: "Trạng thái",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
        renderCell: (item) => {
          if (item.row.QUANTITY_CHK === true) {
            return "Đã kiểm đếm"
          } else {
            return "Chưa kiểm đếm"
          }
        }
      },
      {
        field: "NOTE",
        headerName: "Ghi chú",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
    ];
    this.columnTally = [
      {
        field: "STT",
        headerName: "STT",
        editable: false,
        align: "center",
        headerAlign: "center",
        width: 80,
      },
      {
        field: "WAREHOUSE_CODE",
        headerName: "Kho",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "TRUCK_NO",
        headerName: "Số xe",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "CNTRNO",
        headerName: "Số container",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "BILL",
        headerName: "Số vận đơn",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "ACTUAL_CARGO_PIECE",
        headerName: "Số lượng dự kiến",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "ESTIMATED_CARGO_PIECE",
        headerName: "Số lượng thực tế",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "SEQ",
        headerName: "Lần",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "METHOD_CODE",
        headerName: "Phương án",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "VESSEL_NAME",
        headerName: "Tên tàu",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "BOUND_VOYAG",
        headerName: "Chuyến nhập/Xuất",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "DATE",
        headerName: "Ngày tàu đến/đi",
        editable: false,
        type: 'dateTime',
        align: "center",
        headerAlign: "center",
        flex: 1,
      }
    ];
    this.columnStock = [
      {
        field: "STT",
        headerName: "STT",
        editable: false,
        align: "center",
        headerAlign: "center",
        width: 80,
      },
      {
        field: "WAREHOUSE_CODE",
        headerName: "Kho",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "BLOCK",
        headerName: "Block",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "BILL",
        headerName: "Số vận đơn",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "PALLET_NO",
        headerName: "Pallet",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "JOB_TYPE",
        headerName: "Phương án",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: "EXPDATE",
        headerName: "Thời gian",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
        renderCell: (params) => {
          let TimeNew = moment(params.row.CREATE_DATE).format('MM/DD/YYYY HH:mm:ss');
          return [
            <DigitalClock data={TimeNew} />
          ]
        }
      }
    ];

    this.columnCheck = [
      {
        field: "STT",
        headerName: "STT",
        align: "center",
        headerAlign: "center",
        width: 80,
      },
      {
        field: "userName",
        headerName: "Người dùng",
        align: "center",
        headerAlign: "center",
        flex: 1,
        renderCell: (params) => {
          const newData = this.state.connectedCheck.find(item => item.deviceCode === params.row.EQU_CODE)
          if (newData !== undefined && this.state.isLogoutCheck) {
            params.value = newData.userName
          }
          return params.value;
        }
      },
      {
        field: "EQU_CODE_NAME",
        headerName: "Tên Thiết bị",
        align: "center",
        headerAlign: "center",
        flex: 1
      },
      {
        field: "status",
        headerName: "Trạng thái",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
        renderCell: (params) => {
          return this.checkStatus(params);
        }
      },
    ];

    this.columnFolk = [
      {
        field: "STT",
        headerName: "STT",
        align: "center",
        headerAlign: "center",
        width: 80,
      },
      {
        field: "userName",
        headerName: "Người dùng",
        align: "center",
        headerAlign: "center",
        flex: 1,
        renderCell: (params) => {
          const newData = this.state.connectedForkl.find(item => item.deviceCode === params.row.EQU_CODE)
          if (newData !== undefined && this.state.isLogoutForkl) {
            params.value = newData.userName
          }
          return params.value;
        }
      },
      {
        field: "EQU_CODE_NAME",
        headerName: "Tên Thiết bị",
        align: "center",
        headerAlign: "center",
        flex: 1
      },
      {
        field: "status",
        headerName: "Trạng thái",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
        renderCell: (params) => {
          return this.folkStatus(params);
        }
      },
    ];

    this.columnGates = [
      {
        field: "STT",
        headerName: "STT",
        align: "center",
        headerAlign: "center",
        width: 80,
      },
      {
        field: "userName",
        headerName: "Người dùng",
        align: "center",
        headerAlign: "center",
        flex: 1,
        renderCell: (params) => {
          const newData = this.state.connectedGate.find(item => item.deviceName === params.row.GATE_NAME)
          if (newData !== undefined && this.state.isLogoutGate) {
            params.value = newData.userName
          }
          return params.value;
        }
      },
      {
        field: "GATE_NAME",
        headerName: "Tên Thiết bị",
        align: "center",
        headerAlign: "center",
        flex: 1
      },
      {
        field: "status",
        headerName: "Trạng thái",
        editable: false,
        align: "center",
        headerAlign: "center",
        flex: 1,
        renderCell: (params) => {
          return this.gateStatus(params);
        }
      },
    ];

    this.tempSelectedWareHouse = {};
    this.createRows = (data) => data.map((row, idx) => ({
      STT: idx + 1,
      id: idx,
      BILL: row.CLASS_CODE === 1 ? row.HOUSE_BILL : row.BOOKING_FWD,
      BOUND_VOYAG: row.CLASS_CODE === 1 ? row.INBOUND_VOYAGE : row.OUTBOUND_VOYAGE,
      DATE: row.CLASS_CODE === 1 ? row.ETA : row.ETD,
      ...row
    }),
    );
  };

  addStatus(arr) {
    let status = true;
    let countContinus = 0;
    let temparr = [...new Set(arr.map(e => e.CNTRNO))]
    for (let i = 0; i < temparr.length; i++) {
      for (let j = countContinus; j < arr.length; j++) {
        if (arr[j].CNTRNO === temparr[i]) {
          countContinus++
          arr[j].status = !status
        } else {
          break;
        }
      }
      status = !status;
    }
    return arr;
  }

  gateStatus(params) {
    const checkData = this.state.connectedGate.find(item => item.deviceCode === params.row.GATE_CODE)
    return (
      <Switch
        checked={checkData !== undefined && this.state.isLogoutGate ? this.state.operateGate : false}
        onChange={(e) => {
          this.setState({
            operateGate: e.target.checked,
            isLogoutGate: false
          })
          if (this.state.isLogoutGate) {
            socket.emit('server_logout', checkData);
          }
        }}

      />
    )
  }

  checkStatus(params) {
    const checkData = this.state.connectedCheck.find(item => item.deviceCode === params.row.EQU_CODE)
    return (
      <Switch
        checked={checkData !== undefined && this.state.isLogoutCheck ? this.state.operateCheck : false}
        onChange={(e) => {
          this.setState({
            operateCheck: e.target.checked,
            isLogoutCheck: false
          })
          if (this.state.isLogoutCheck) {
            socket.emit('server_logout', checkData);
          }
        }}
      />
    )
  }

  folkStatus(params) {
    const checkData = this.state.connectedForkl.find(item => item.deviceCode === params.row.EQU_CODE)
    return (
      <Switch
        checked={checkData !== undefined && this.state.isLogoutForkl ? this.state.operateForkl : false}
        onChange={(e) => {
          this.setState({
            operateForkl: e.target.checked,
            isLogoutForkl: false
          })
          if (this.state.isLogoutForkl) {
            socket.emit('server_logout', checkData);
          }
        }}
      />
    )
  }

  handleLoadDataGate() {
    let url = window.root_url + `executive-supervision/filterportControl`;
    let dataSend = {
      CNTRNO: this.state.dataInput.CNTRNO,
      TRUCK_NO: this.state.dataInput.TRUCK_NO,
      CLASS_CODE: this.state.dataInput.CLASS_CODE,
      IS_IN_OUT: this.state.dataInput.IS_IN_OUT,
      GATE_CODE: this.state.inputGateCode,
      METHOD_CODE: this.state.dataInput.METHOD_CODE,
      ORDER_NO: this.state.dataInput.ORDER_NO,
      HOUSE_BILL: this.state.dataInput.CLASS_CODE === 1 ? this.state.dataInput.HOUSE_BILL : '',
      BOOKING_FWD: this.state.dataInput.CLASS_CODE === 2 ? this.state.dataInput.BOOKING_FWD : '',
    }
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
      .then(response => {
        if (response.Status) {
          let temp = this.createRows(response.Payload);
          this.setState({
            dataTableGate: temp,
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message,
              type: "success"
            }
          })
        } else {
          this.setState({
            dataTableGate: [],
            dataInput: initaldata,
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message !== '' ? response.Message : 'Không có dữ liệu',
              type: "error"
            }
          })
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
              message: 'Không có dữ liệu được cập nhật',
              type: 'error'
            }
          });
        }
      });
  }

  handleLoadDataTally() {
    let url = window.root_url + `executive-supervision/filterCheck`;
    let dataSend = {
      CNTRNO: this.state.dataInput.CNTRNO,
      TRUCK_NO: this.state.dataInput.TRUCK_NO,
      CLASS_CODE: this.state.dataInput.CLASS_CODE,
      PALLET_NO: this.state.dataInput.PALLET_NO,
      HOUSE_BILL: this.state.dataInput.CLASS_CODE === 1 ? this.state.dataInput.HOUSE_BILL : '',
      BOOKING_FWD: this.state.dataInput.CLASS_CODE === 2 ? this.state.dataInput.BOOKING_FWD : '',
      WAREHOUSE_CODE: this.state.selectedStorage.storageCode
    }
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
      .then(response => {
        if (response.Status) {
          let temp = this.createRows(response.Payload);
          this.setState({
            dataTableTally: this.addStatus(temp),
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message,
              type: "success"
            }
          })
        } else {
          this.setState({
            dataTableTally: [],
            // dataInput: {
            //   METHOD_CODE: '',
            //   IS_IN_OUT: '',
            // },
            dataInput: initaldata,
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message !== '' ? response.Message : 'Không có dữ liệu',
              type: "error"
            }
          })
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
              message: 'Không có dữ liệu được cập nhật',
              type: 'error'
            }
          });
        }
      });
  }

  handleLoadDataStock() {
    let url = window.root_url + `executive-supervision/filterJobStock`;
    let dataSend = {
      WAREHOUSE_CODE: this.state.dataInput.WAREHOUSE_CODE,
      TRUCK_NO: this.state.dataInput.TRUCK_NO,
      PALLET_NO: this.state.dataInput.PALLET_NO,
      BLOCK: this.state.dataInput.BLOCK,
      JOB_TYPE: this.state.dataInput.METHOD_CODE,
    }
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
      .then(response => {
        if (response.Status) {
          let temp = this.createRows(response.Payload);
          this.setState({
            dataTableStock: temp,
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message,
              type: "success"
            }
          })
        } else {
          this.setState({
            dataTableStock: [],
            dataInput: initaldata,
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message !== '' ? response.Message : 'Không có dữ liệu',
              type: "error"
            }
          })
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
              message: 'Không có dữ liệu được cập nhật',
              type: 'error'
            }
          });
        }
      });

  }

  handleLoadBlock(WAREHOUSE_CODE) {
    let url = window.root_url + `executive-supervision/filterBlock`;
    let dataSend = {
      WAREHOUSE_CODE: WAREHOUSE_CODE
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
      .then(response => {
        if (response.Status) {
          this.setState({
            dataBlock: response.Payload,
          })
        } else {
          this.setState({
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message !== '' ? response.Message : 'Không có dữ liệu',
              type: "error"
            }
          })
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
              message: 'Không có dữ liệu được cập nhật',
              type: 'error'
            }
          });
        }
      });
  }

  handleLoadinforData() {
    let url = window.root_url + `executive-supervision/viewData`;
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
      body: JSON.stringify()
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(response => {
        if (response.Status) {
          this.setState({
            dataIS_IN_OUT: response.Payload.bsGate,
            dataMETHOD_CODE: response.Payload.bsMethod,
            dataWAREHOUSE_CODE: response.Payload.bsWarehouse,
          })
        } else {
          this.setState({
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message !== '' ? response.Message : 'Không có dữ liệu',
              type: "error"
            }
          })
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
              message: 'Không có dữ liệu được cập nhật',
              type: 'error'
            }
          });
        }
      });
  }

  handleLoadDeviceAndGate() {
    let url = window.root_url + `executive-supervision/viewAllDevice`;
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
      body: JSON.stringify()
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(response => {
        let tempGate = this.createRows(response.gate);
        let tempTally = this.createRows(response.device.filter(p => p.EQU_TYPE === 'KD'));
        let tempForkLift = this.createRows(response.device.filter(p => p.EQU_TYPE === 'XN'));
        this.setState({
          gateDevice: tempGate,
          tallyDevice: tempTally,
          forkLiftDevice: tempForkLift,
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
              message: 'Không có dữ liệu được cập nhật',
              type: 'error'
            }
          });
        }
      });

  }

  //-----------------------------------
  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        {
          this.state.operate === true
            ?
            <Grid container spacing={1}>
              <Grid item xs={3} >
                <Card style={{ marginBottom: "12px" }} >
                  <Stack direction='row' justifyContent="space-between" sx={{ padding: '10px' }}>
                    <CardHeader title={`Giám sát công việc ${this.state.selectedStorage.storageName || ''}`} sx={{ textAlign: 'left', height: 40 }}></CardHeader>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        this.setState({
                          dialogItem: {
                            isOpen: !this.state.dialogItem.isOpen,
                          }
                        })
                      }}>
                      Chọn kho
                    </Button>
                  </Stack>
                  <CardContent style={{ marginTop: -10 }}>
                    <Grid >
                      <Grid>
                        <Tabs
                          value={this.state.type}
                          onChange={(e, value) => {
                            this.setState({
                              type: value,
                              dataTableGate: [],
                              dataTableStock: [],
                              dataTableTally: [],
                              dataInput: initaldata,
                            })
                          }} centered>
                          <Tab label="Giám sát cổng" value={1} />
                          <Tab label="Kiểm đếm" value={2} />
                          <Tab label="Xe nâng" value={3} />
                        </Tabs>
                      </Grid>
                      <Divider textAlign="center" sx={{ mt: "11px" }}> Lọc dữ liệu</Divider>
                      {
                        this.state.type === 1
                          ?
                          <Grid marginTop="10px">
                            <Grid container rowSpacing={1} columnSpacing={1}>
                              <Grid item md={6}>
                                <TextField
                                  key="ORDER"
                                  fullWidth
                                  size="small"
                                  label="Số lệnh"
                                  value={this.state.dataInput.ORDER_NO}
                                  onChange={(e) => {
                                    this.setState({
                                      dataInput: {
                                        ...this.state.dataInput,
                                        ORDER_NO: e.target.value.trim()
                                      }
                                    })
                                  }}
                                />
                              </Grid>
                              <Grid item md={6}>
                                <TextField
                                  key="CNTRNO"
                                  fullWidth
                                  size="small"
                                  label="Số Container"
                                  value={this.state.dataInput.CNTRNO}
                                  onChange={(e) => {
                                    this.setState({
                                      dataInput: {
                                        ...this.state.dataInput,
                                        CNTRNO: e.target.value.trim()
                                      }
                                    })
                                  }}
                                />
                              </Grid>
                              <Grid item md={6}>
                                <TextField
                                  key="TRUCKNO"
                                  fullWidth
                                  label="Số Xe"
                                  size="small"
                                  value={this.state.dataInput.TRUCK_NO}
                                  onChange={(e) => {
                                    this.setState({
                                      dataInput: {
                                        ...this.state.dataInput,
                                        TRUCK_NO: e.target.value.trim()
                                      }
                                    })
                                  }}
                                />
                              </Grid>
                              <Grid item md={6}>
                                <TextField
                                  key="so-van-don"
                                  disabled={this.state.dataInput.CLASS_CODE === '' ? true : false}
                                  fullWidth
                                  readOnly
                                  label="Số vận đơn"
                                  size="small"
                                  value={this.state.dataInput.CLASS_CODE === 1 ? this.state.dataInput.HOUSE_BILL : this.state.dataInput.BOOKING_FWD}
                                  onChange={(e, value) => {
                                    if (this.state.dataInput.CLASS_CODE === 1) {
                                      this.setState({
                                        dataInput: {
                                          ...this.state.dataInput,
                                          HOUSE_BILL: e.target.value.trim()
                                        }
                                      })
                                    } else {
                                      this.setState({
                                        dataInput: {
                                          ...this.state.dataInput,
                                          BOOKING_FWD: e.target.value.trim()
                                        }
                                      })
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item md={6}>
                                <Autocomplete
                                  sx={{ width: '100%' }}
                                  id="CLASS_CODE"
                                  defaultValue={''}
                                  options={[1, 2, '']}
                                  onChange={(e, value) => {
                                    this.setState({
                                      dataInput: {
                                        ...this.state.dataInput,
                                        CLASS_CODE: value
                                      }
                                    })
                                  }}
                                  size="small"
                                  getOptionLabel={(params) => {
                                    if (params === 1) {
                                      params = 'Nhập'
                                    } else if (params === 2) {
                                      params = 'Xuất'
                                    }
                                    else {
                                      params = 'Tất cả'
                                    };
                                    return params
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      readOnly
                                      size="small"
                                      label='Hướng'
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item md={6}>
                                <Autocomplete
                                  sx={{ width: '100%' }}
                                  // id="a"
                                  options={this.state.dataMETHOD_CODE || []}
                                  onChange={(e, value) => {
                                    this.setState({
                                      dataInput: {
                                        ...this.state.dataInput,
                                        METHOD_CODE: value.METHOD_CODE
                                      }
                                    })
                                  }}
                                  size="small"
                                  getOptionLabel={(option) => option ? option.METHOD_NAME : ''}
                                  renderOption={(props, option) => (
                                    <Box
                                      {...props}
                                    >
                                      {option.METHOD_CODE} : {option.METHOD_NAME}
                                    </Box>
                                  )}
                                  renderInput={(params) => (
                                    < TextField
                                      {...params}
                                      readOnly
                                      label='Phương án'
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item md={12}>
                                <Autocomplete
                                  sx={{ width: '100%' }}
                                  id="GATE_CODE"
                                  options={this.state.dataIS_IN_OUT || []}
                                  onChange={(e, value) => {
                                    this.setState({
                                      inputGateCode: value.GATE_CODE
                                    })
                                  }}
                                  size="small"
                                  getOptionLabel={(option) => option.GATE_NAME}
                                  renderOption={(props, option) => (
                                    <Box
                                      {...props}
                                    >
                                      {option.GATE_NAME}
                                    </Box>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      readOnly
                                      label='Cổng vào'
                                    />
                                  )}
                                />
                              </Grid>
                            </Grid>
                            <Grid item marginTop="10px" textAlign="end" >
                              <Button
                                variant='contained'
                                onClick={() => this.handleLoadDataGate()}>
                                Nạp dữ liệu
                              </Button>
                            </Grid>
                          </Grid>
                          : this.state.type === 2
                            ?
                            <Grid marginTop="10px">
                              <Grid container rowSpacing={1} columnSpacing={1}>
                                <Grid item md={6}>

                                  <Autocomplete
                                    sx={{ width: '100%' }}
                                    id="WAREHOUSE_CODE"
                                    options={this.state.dataWAREHOUSE_CODE || []}
                                    onChange={(e, value) => {
                                      this.setState({
                                        dataInput: {
                                          ...this.state.dataInput,
                                          WAREHOUSE_CODE: value.WAREHOUSE_CODE
                                        }
                                      })
                                    }}
                                    size="small"
                                    getOptionLabel={(option) => option ? option.WAREHOUSE_NAME : ''}
                                    renderOption={(props, option) => (
                                      <Box
                                        {...props}
                                      >
                                        {option.WAREHOUSE_CODE}
                                      </Box>
                                    )}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        readOnly
                                        label='Kho'
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item md={6}>
                                  <TextField
                                    key="CNTRNO"
                                    fullWidth
                                    label="Số Container"
                                    size="small"
                                    value={this.state.dataInput.CNTRNO}
                                    onChange={(e) => {
                                      this.setState({
                                        dataInput: {
                                          ...this.state.dataInput,
                                          CNTRNO: e.target.value.trim()
                                        }
                                      })
                                    }}
                                  />
                                </Grid>
                                <Grid item md={6}>
                                  <TextField
                                    key="TRUCK_NO"
                                    fullWidth
                                    label="Số Xe"
                                    size="small"
                                    value={this.state.dataInput.TRUCK_NO}
                                    onChange={(e) => {
                                      this.setState({
                                        dataInput: {
                                          ...this.state.dataInput,
                                          TRUCK_NO: e.target.value.trim()
                                        }
                                      })
                                    }}
                                  />
                                </Grid>
                                <Grid item md={6}>
                                  <Autocomplete
                                    sx={{ width: '100%' }}
                                    id="CLASS_CODE"
                                    defaultValue={''}
                                    options={[1, 2, '']}
                                    onChange={(e, value) => {
                                      this.setState({
                                        dataInput: {
                                          ...this.state.dataInput,
                                          CLASS_CODE: value
                                        }
                                      })
                                    }}
                                    size="small"
                                    getOptionLabel={(params) => {
                                      if (params === 1) {
                                        params = 'Nhập'
                                      } else if (params === 2) {
                                        params = 'Xuất'
                                      }
                                      else {
                                        params = 'Tất cả'
                                      };
                                      return params
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        readOnly
                                        label='Hướng'
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item md={6}>
                                  <Autocomplete
                                    sx={{ width: '100%' }}
                                    id="a"
                                    options={this.state.dataMETHOD_CODE || []}
                                    onChange={(e, value) => {
                                      this.setState({
                                        dataInput: {
                                          ...this.state.dataInput,
                                          METHOD_CODE: value.METHOD_CODE
                                        }
                                      })
                                    }}
                                    size="small"
                                    getOptionLabel={(option) => option ? option.METHOD_NAME : ''}
                                    renderOption={(props, option) => (
                                      <Box
                                        {...props}
                                      >
                                        {option.METHOD_CODE} : {option.METHOD_NAME}
                                      </Box>
                                    )}
                                    renderInput={(params) => (
                                      < TextField
                                        {...params}
                                        readOnly
                                        label='Phương án'
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item md={6}>
                                  <TextField
                                    key="so-van-don"
                                    disabled={this.state.dataInput.CLASS_CODE === '' ? true : false}
                                    fullWidth
                                    readOnly
                                    label="Số vận đơn"
                                    size="small"
                                    value={this.state.dataInput.CLASS_CODE === 1 ? this.state.dataInput.HOUSE_BILL : this.state.dataInput.BOOKING_FWD}
                                    onChange={(e, value) => {
                                      if (this.state.dataInput.CLASS_CODE === 1) {
                                        this.setState({
                                          dataInput: {
                                            ...this.state.dataInput,
                                            HOUSE_BILL: e.target.value.trim()
                                          }
                                        })
                                      } else {
                                        this.setState({
                                          dataInput: {
                                            ...this.state.dataInput,
                                            BOOKING_FWD: e.target.value.trim()
                                          }
                                        })
                                      }
                                    }}
                                  />
                                </Grid>
                                <Grid item md={12}>
                                  <TextField
                                    key="PALLET_NO"
                                    fullWidth
                                    readOnly
                                    label="Số Pallet"
                                    size="small"
                                    value={this.state.dataInput.PALLET_NO}
                                    onChange={(e) => {
                                      this.setState({
                                        dataInput: {
                                          ...this.state.dataInput,
                                          PALLET_NO: e.target.value.trim()
                                        }
                                      })
                                    }}
                                  />
                                </Grid>
                              </Grid>
                              <Grid item marginTop="10px" textAlign="end" >
                                <Button
                                  variant='contained'
                                  onClick={(e) => this.handleLoadDataTally()}>
                                  Nạp dữ liệu
                                </Button>
                              </Grid>
                            </Grid>
                            :
                            <Grid marginTop="10px" width="100%">
                              <Grid container rowSpacing={1} columnSpacing={1}>
                                <Grid item md={6}>
                                  <Autocomplete
                                    sx={{ width: '100%' }}
                                    id="WAREHOUSE_CODE"
                                    options={this.state.dataWAREHOUSE_CODE || []}
                                    onChange={(e, value) => {
                                      this.setState({
                                        dataInput: {
                                          ...this.state.dataInput,
                                          WAREHOUSE_CODE: value.WAREHOUSE_CODE
                                        }
                                      })
                                      this.handleLoadBlock(value);
                                    }}
                                    size="small"
                                    getOptionLabel={(option) => option ? option.WAREHOUSE_NAME : ''}
                                    renderOption={(props, option) => (
                                      <Box
                                        {...props}
                                      >
                                        {option.WAREHOUSE_CODE}
                                      </Box>
                                    )}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        readOnly
                                        label='Kho'
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item md={6}>
                                  <Autocomplete
                                    sx={{ width: '100%' }}
                                    id="BLOCK"
                                    options={this.state.dataBlock || []}
                                    onChange={(e, value) => {
                                      this.setState({
                                        dataInput: {
                                          ...this.state.dataInput,
                                          BLOCK: value
                                        }
                                      })
                                    }}
                                    size="small"
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        readOnly
                                        label='Block'
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item md={6}>
                                  <TextField
                                    key="PALLET_NO"
                                    fullWidth
                                    label="Số Pallet"
                                    size="small"
                                    value={this.state.dataInput.PALLET_NO}
                                    onChange={(e) => {
                                      this.setState({
                                        dataInput: {
                                          ...this.state.dataInput,
                                          PALLET_NO: e.target.value.trim()
                                        }
                                      })
                                    }}
                                  />
                                </Grid>
                                <Grid item md={6}>
                                  <TextField
                                    key="so-van-don"
                                    disabled={this.state.dataInput.CLASS_CODE === '' ? true : false}
                                    fullWidth
                                    readOnly
                                    label="Số vận đơn"
                                    size="small"
                                    value={this.state.dataInput.CLASS_CODE === 1 ? this.state.dataInput.HOUSE_BILL : this.state.dataInput.BOOKING_FWD}
                                    onChange={(e, value) => {
                                      if (this.state.dataInput.CLASS_CODE === 1) {
                                        this.setState({
                                          dataInput: {
                                            ...this.state.dataInput,
                                            HOUSE_BILL: e.target.value.trim()
                                          }
                                        })
                                      } else {
                                        this.setState({
                                          dataInput: {
                                            ...this.state.dataInput,
                                            BOOKING_FWD: e.target.value.trim()
                                          }
                                        })
                                      }
                                    }}
                                  />
                                </Grid>
                                <Grid item md={6}>
                                  <Autocomplete
                                    sx={{ width: '100%' }}
                                    id="a"
                                    options={this.state.dataMETHOD_CODE || []}
                                    onChange={(e, value) => {
                                      this.setState({
                                        dataInput: {
                                          ...this.state.dataInput,
                                          METHOD_CODE: value.METHOD_CODE
                                        }
                                      })
                                    }}
                                    size="small"
                                    getOptionLabel={(option) => option ? option.METHOD_NAME : ''}
                                    renderOption={(props, option) => (
                                      <Box
                                        {...props}
                                      >
                                        {option.METHOD_CODE} : {option.METHOD_NAME}
                                      </Box>
                                    )}
                                    renderInput={(params) => (
                                      < TextField
                                        {...params}
                                        readOnly
                                        label='Phương án'
                                      />
                                    )}
                                  />
                                </Grid>

                              </Grid>
                              <Grid item marginTop="10px" textAlign="end" >
                                <Button
                                  variant='contained'
                                  onClick={(e) => this.handleLoadDataStock()}>
                                  Nạp dữ liệu
                                </Button>
                              </Grid>
                            </Grid>
                      }
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item md={9}>
                <Card >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <CardHeader
                      title={this.state.type === 1
                        ? "Danh Sách Công Việc Giám Sát Cổng"
                        : this.state.type === 2
                          ? "Danh Sách Công Việc Kiểm Đếm"
                          : "Danh Sách Công Việc Xe Nâng"
                      }>
                    </CardHeader>
                    <FormGroup>
                      <FormControlLabel control={<Switch
                        sx={{ margin: "10px" }}
                        checked={this.state.operate}
                        onChange={(e) => {
                          this.setState({
                            operate: e.target.checked,
                          })
                        }}
                      />} label="Chuyển đổi màn hình giám sát" />
                    </FormGroup>


                  </div>
                  <CardContent>
                    <DataGrid
                      getRowClassName={(params) => params.row.status ? `super-app-theme--Open` : ''}
                      className="m-table"
                      rowHeight={53}
                      sx={{ height: "63vh" }}
                      columns={this.state.type === 1 ? this.columnGate : this.state.type === 2 ? this.columnTally : this.columnStock}
                      rows={this.state.type === 1 ? this.state.dataTableGate : this.state.type === 2 ? this.state.dataTableTally : this.state.dataTableStock}
                    ></DataGrid>
                  </CardContent>
                </Card>
              </Grid >
            </Grid >
            :
            <Grid>
              <Grid >
                <Card >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <CardHeader
                      title={"Danh sách công việc Thiết bị"}>
                    </CardHeader>
                    <FormGroup>
                      <FormControlLabel control={<Switch
                        sx={{ margin: "10px" }}
                        checked={this.state.operate}
                        onChange={(e) => {
                          this.setState({
                            operate: e.target.checked
                          })
                        }}
                      />} label="Chuyển đổi màn hình giám sát" />
                    </FormGroup>
                  </div>
                  <CardContent>
                    <Grid item md={12} container spacing={1}>
                      <Grid item md={4} >
                        <Stack spacing={1} alignItems='center' sx={{ height: '63vh' }}>
                          <span style={{ fontSize: '20px' }}>Cổng</span>
                          <DataGrid
                            className="m-table"
                            rowHeight={53}
                            sx={{ height: "63vh", width: '100%' }}
                            columns={this.columnGates}
                            hideFooter={true}
                            rows={this.state.gateDevice}
                          ></DataGrid>
                        </Stack>
                      </Grid>
                      <Grid item md={4}>
                        <Stack spacing={1} alignItems='center' sx={{ height: '63vh' }}>
                          <span style={{ fontSize: '20px' }}>Kiểm Đếm</span>
                          <DataGrid
                            className="m-table"
                            rowHeight={53}
                            sx={{ height: "63vh", width: '100%' }}
                            columns={this.columnCheck}
                            hideFooter={true}
                            rows={this.state.tallyDevice}
                          ></DataGrid>
                        </Stack>
                      </Grid>
                      <Grid item md={4}>
                        <Stack spacing={1} alignItems='center' sx={{ height: '63vh' }}>
                          <span style={{ fontSize: '20px' }}>Xe Nâng</span>
                          <DataGrid
                            className="m-table"
                            rowHeight={53}
                            sx={{ height: "63vh", width: '100%' }}
                            columns={this.columnFolk}
                            hideFooter={true}
                            rows={this.state.forkLiftDevice}
                          ></DataGrid>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
        }
        {/* -------------------- global alert -------------------- */}
        <Dialog
          open={this.state.dialogItem.isOpen}
          scroll="paper"
          fullWidth={true}
          maxWidth="xs"
        >
          <DialogTitle variant="h5" align="center">Chọn kho tác nghiệp</DialogTitle>
          <DialogContent >
            <Card>
              <CardContent>
                <Grid item xs={12} md={6}>
                  <List
                    component="nav"
                    sx={{
                      height: "20vh",
                      bgcolor: 'background.paper',
                      position: 'relative',
                      overflow: 'auto',
                      '& ul': { padding: 0 },
                    }}
                  >
                    {this.state.storageList.map((item, indx) => {
                      return (
                        <>
                          <ListItem
                            key={item.WAREHOUSE_CODE}
                            divider={(this.state.storageList.length - 1) === indx ? false : true}
                          >
                            <ListItemButton
                              onClick={() => {
                                let wareHouseInfo = {
                                  storageCode: item.WAREHOUSE_CODE,
                                  storageName: item.WAREHOUSE_NAME,
                                  socketId: socket.id,
                                  userName: JSON.parse(localStorage.getItem("userInfo")).name
                                }
                                this.tempSelectedWareHouse = item;
                                socket.emit("server_join_room", wareHouseInfo);
                              }}
                              selected={(item.WAREHOUSE_CODE === this.state.tempSelected ? true : false)}
                            >
                              <ListItemIcon>
                                <Warehouse />
                              </ListItemIcon>
                              <ListItemText component='b' primary={item.WAREHOUSE_NAME} />
                            </ListItemButton>
                          </ListItem>
                        </>
                      );
                    })}
                  </List>
                </Grid>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
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
      </Box >
    )
  }
  componentDidMount() {
    //--------socket--------//
    socket.on("client_join_room", (response) => {
      if (response.status) {
        this.setState({
          tempSelected: this.tempSelectedWareHouse.WAREHOUSE_CODE,
          selectedStorage: {
            storageCode: this.tempSelectedWareHouse.WAREHOUSE_CODE,
            storageName: this.tempSelectedWareHouse.WAREHOUSE_NAME
          },
          dialogItem: {
            isOpen: false,
          }
        })
      }
    });

    socket.on('che_operating_client_complete', (response) => {
      let tempdataTableStock = this.state.dataTableStock;
      if (response[0].status === 'remove') {
        let tempCheck = tempdataTableStock.filter(item => item.PALLET_NO !== response[0].PALLET_NO)
        this.setState({
          dataTableStock: tempCheck
        })
        return;
      }
      tempdataTableStock.map(e => {
        delete e.STT
        delete e.id
        delete e.BILL
        delete e.BOUND_VOYAG
        delete e.DATE
        return e;
      })
      let temp = this.createRows([...response, ...tempdataTableStock])
      this.setState({
        dataTableStock: temp
      })
    })

    socket.on('jobgate_client_complete', (response) => {
      let temp = this.state.dataTableGate;
      temp.map(item => {
        if (item.ORDER_NO === response.ORDER_NO) {
          item['QUANTITY_CHK'] = true;
        }
        return item;
      })
      this.setState({
        dataTableGate: temp
      })
    });

    socket.on('quantity_client_complete', (response) => {
      let tempDataTableTally = this.state.dataTableTally;
      if (response.status === 'remove') {
        let tempCheck = tempDataTableTally.filter(item => item.ID !== response.ID)
        this.setState({
          dataTableTally: this.addStatus(tempCheck)
        })
        return;
      }
      tempDataTableTally.map(e => {
        delete e.STT
        delete e.id
        delete e.BILL
        delete e.BOUND_VOYAG
        delete e.DATE
        return e;
      });
      let temp = this.createRows([{
        ID: response.ID,
        ACTUAL_CARGO_PIECE: response.ACTUAL_CARGO_PIECE,
        CLASS_CODE: response.CLASS_CODE,
        CNTRNO: response.CNTRNO,
        ESTIMATED_CARGO_PIECE: response.ESTIMATED_CARGO_PIECE,
        ETA: response.ETA,
        ETD: response.ETD,
        HOUSE_BILL: response.HOUSE_BILL,
        BOOKING_FWD: response.BOOKING_FWD,
        INBOUND_VOYAGE: response.INBOUND_VOYAGE,
        OUTBOUND_VOYAGE: response.OUTBOUND_VOYAGE,
        METHOD_CODE: response.METHOD_CODE,
        TRUCK_NO: response.TRUCK_NO,
        VESSEL_NAME: response.VESSEL_NAME,
        VOYAGEKEY: response.VOYAGEKEY,
        WAREHOUSE_CODE: response.WAREHOUSE_CODE,
        SEQ: response.SEQ
      }, ...tempDataTableTally])
      this.setState({
        dataTableTally: temp
      })
    })

    socket.on("operating_gate", (response) => {
      let tempDataTableGate = this.state.dataTableGate;
      tempDataTableGate.map(e => {
        delete e.STT
        delete e.id
        delete e.BILL
        delete e.BOUND_VOYAG
        delete e.DATE
        return e;
      });
      let temp = this.createRows([{
        CLASS_CODE: response.CLASS_CODE,
        CNTRNO: response.CNTRNO,
        GATE_CODE: response.GATE_CODE,
        IS_IN_OUT: response.IS_IN_OUT,
        METHOD_CODE: response.METHOD_CODE,
        NOTE: response.NOTE,
        ORDER_NO: response.ORDER_NO,
        QUANTITY_CHK: response.QUANTITY_CHK,
        TIME_IN: response.TIME_IN,
        [response.CLASS_CODE === 1 ? 'INBOUND_VOYAGE' : 'OUTBOUND_VOYAGE']: response.CLASS_CODE === 1 ? response.INBOUND_VOYAGE : response.OUTBOUND_VOYAGE,
        [response.CLASS_CODE === 1 ? 'ETA' : 'ETD']: response.CLASS_CODE === 1 ? response.ETA : response.ETD,
        VESSEL_NAME: response.VESSEL_NAME,
      }, ...tempDataTableGate])
      this.setState({
        dataTableGate: temp
      })
    });

    socket.emit("server_get_device_list", {
      socketId: socket.id
    });

    socket.on("client_get_device_list", (response) => {
      if (response) {
        let tempGate = this.createRows(response.filter(p => p.deviceType === 'GATE'));
        let deviceCkeck = this.createRows(response.filter(p => p.deviceType === 'KD'));
        let deviceForkl = this.createRows(response.filter(p => p.deviceType === 'XN'));
        this.setState({
          isLogoutGate: true,
          isLogoutCheck: true,
          isLogoutForkl: true,
          operateCheck: true,
          operateForkl: true,
          operateGate: true,
          connectedGate: tempGate,
          connectedCheck: deviceCkeck,
          connectedForkl: deviceForkl
        });

      }
    });

    socket.on("client_logout", (response) => {
      if (response) {
        let tempGate = this.createRows(response.filter(p => p.deviceType === 'GATE'));
        let deviceCkeck = this.createRows(response.filter(p => p.deviceType === 'KD'));
        let deviceForkl = this.createRows(response.filter(p => p.deviceType === 'XN'));
        if (tempGate.length) {
          this.setState({
            isLogoutGate: false,
            connectedGate: tempGate,
          })
        } else if (deviceCkeck.length) {
          this.setState({
            isLogoutCheck: false,
            connectedCheck: deviceCkeck,
          })
        } else {
          this.setState({
            isLogoutForkl: false,
            connectedForkl: deviceForkl
          })
        }
        return;
      }
    })
    //--------load gate and device and lưới giám sát--------//
    this.handleLoadDeviceAndGate();
    this.handleLoadinforData();

    // ----------- get warehouse list -----------
    fetch(window.root_url + `bs-warehouse/view`, {
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
        if (data.Status) {
          let temp = data.Payload.map((item, idx) => {
            item.id = idx
            return item;
          })
          this.setState({
            storageList: temp
          })
        }
      }).catch(err => {
        console.log(err)
      });
  }
}
export default Operating;

