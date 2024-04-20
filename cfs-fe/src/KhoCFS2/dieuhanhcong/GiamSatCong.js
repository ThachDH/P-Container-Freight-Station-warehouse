import * as React from "react";
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  FormControl,
  Stack,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Snackbar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListSubheader,
  Checkbox,
  ListItemButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import FixedPageName from "../../componentsCFS2/fixedPageName";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MuiAlert from '@mui/material/Alert';
import { DataGrid } from '@mui/x-data-grid';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { DigitalClock } from "../../componentsCFS2/GeneralComponents";
import ChonSoLenh from "../../componentsCFS2/dialog/ChonSoLenh";
import moment from "moment";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { DoorSliding, Warehouse } from "@mui/icons-material";
import { socketServices } from "../../_services/socket.service";
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const { socket } = socketServices;

const initData = {
  ORDER_NO: "",
  PIN_CODE: "",
  CNTRNO: "",
  CNTRSZTP: "",
  METHOD_CODE: "",
  NOTE: "",
  CUSTOMER_CODE: "",
  CLASS_CODE: "",
  WAREHOUSE_CODE: "",
  DRIVER: "",
  TEL: "",
  VGM: false,
  TRUCK_NO: "",
  WEIGHT_REGIS: "",
  WEIGHT_REGIS_ALLOW: "",
  REMOOC_WEIGHT: "",
  REMOOC_WEIGHT_REGIS: "",
  REMOOC_NO: "",
  TRUCK_DATE_EXP: "",
  REMOOC_DATE_EXP: "",
};
const truckInput = {
  WEIGHT_REGIS: "",
  WEIGHT_REGIS_ALLOW: "",
  TRUCK_DATE_EXP: "",
}
const remoocInput = {
  REMOOC_WEIGHT_REGIS: "",
  REMOOC_WEIGHT: "",
  REMOOC_DATE_EXP: "",
}

class GiamSatCong extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDevice: {},
      dialogWareHouse: true,
      dialog: {
        isOpen: true,
        data: null,
        type: 0,
      },
      dialogLenh: {
        isOpen: false,
        data: null,
        type: 0,
      },
      dialogLoading: {
        isOpen: false,
      },
      dataStorage: [],
      dataTableGate: [],
      dataTable: [],
      selectedTruck: {},
      dataInput: initData,
      remoocInput: remoocInput,
      truckInput: truckInput,
      dataWareHouse: {},
      searchField: {
        PIN_CODE: '',
      },
      Gate: {},
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.columns = [
      {
        field: "IS_IN_OUT",
        headerName: "I/O",
        width: 40,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "TRUCK_NO",
        headerName: "Số Xe ",
        flex: 1,
        align: "center",
        headerAlign: "center"

      },
      {
        field: "Time",
        headerName: "Thời gian",
        flex: 1,
        width: 200,
        renderCell: (params) => {
          let TimeNew = new Date(params.row.TIME_IN)
          return [
            <DigitalClock data={TimeNew} />
          ]
        },

        align: "center",
        headerAlign: "center",
      },
    ];

    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.tempSelectedDevice = {};

    this.createRows = (data) => data.map((row, index) => ({
      id: index,
      ...row
    }),
    );
  }

  handleLoadDataInput(data) {
    if (this.state.Gate.GATE_CODE) {
      let url = window.root_url + `dt-order/view`;
      let dataSend = {
        PIN_CODE: data.PIN_CODE,
        ORDER_NO: data.ORDER_NO,
        CNTRNO: data.CNTRNO
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
            if (response.Payload.length) {
              this.PopupChonSoLenh.setDataSend(response.Payload)
              return;
            } else {
              this.setState({
                dataInput: response.Payload,
                alert: {
                  isOpen: true,
                  type: "success",
                  duration: 3000,
                  message: response.Message
                },
              });
            }
          } else {
            this.setState({
              dataInput: initData,
              alert: {
                isOpen: true,
                type: "warning",
                duration: 3000,
                message: response.Message
              },
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
                message: JSON.parse(err.message).error.message,
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
          message: "Vui lòng chọn cổng trước khi thao tác",
          type: 'warning'
        }
      });
    }
  }

  handleCheckMETHOD() {
    if (['NKN', 'NKX'].includes(this.state.dataInput.METHOD_CODE)) {
      this.handleSaveIn();
    } else {
      this.handleSaveOut()
    }
  }

  handleSaveIn() {
    let url = window.root_url + `job-gate/insert`;
    let dataSend = this.state.dataInput;
    Object.assign(dataSend, {
      DRIVER: this.state.dataInput.DRIVER,
      TEL: this.state.dataInput.TEL,
      VGM: this.state.dataInput.VGM,
      TRUCK_NO: this.state.dataInput.TRUCK_NO,
      WEIGHT_REGIS: parseInt(this.state.truckInput.WEIGHT_REGIS) ? parseInt(this.state.truckInput.WEIGHT_REGIS) : parseInt(this.state.dataInput.WEIGHT_REGIS),
      WEIGHT_REGIS_ALLOW: parseInt(this.state.truckInput.WEIGHT_REGIS_ALLOW) ? parseInt(this.state.truckInput.WEIGHT_REGIS_ALLOW) : parseInt(this.state.dataInput.WEIGHT_REGIS_ALLOW),
      REMOOC_WEIGHT: parseInt(this.state.remoocInput.REMOOC_WEIGHT) ? parseInt(this.state.remoocInput.REMOOC_WEIGHT) : parseInt(this.state.dataInput.REMOOC_WEIGHT),
      REMOOC_NO: this.state.dataInput.REMOOC_NO,
      REMOOC_WEIGHT_REGIS: parseInt(this.state.remoocInput.REMOOC_WEIGHT_REGIS) ? parseInt(this.state.remoocInput.REMOOC_WEIGHT_REGIS) : parseInt(this.state.dataInput.REMOOC_WEIGHT_REGIS),
      GATE_CODE: this.state.Gate.GATE_CODE,
      IS_IN_OUT: this.state.Gate.IS_IN_OUT,
      TIME_REGIS: this.state.truckInput.TRUCK_DATE_EXP ? moment(this.state.truckInput.TRUCK_DATE_EXP).format("DD/MM/YYYY") : moment(this.state.dataInput.TRUCK_DATE_EXP).format("DD/MM/YYYY"),
      TIME_REMOOC: this.state.remoocInput.REMOOC_DATE_EXP ? moment(this.state.remoocInput.REMOOC_DATE_EXP).format("DD/MM/YYYY") : moment(this.state.dataInput.REMOOC_DATE_EXP).format("DD/MM/YYYY"),
      CREATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
    });
    delete dataSend.BOOKING_NO;
    delete dataSend.TRUCK_DATE_EXP;
    delete dataSend.REMOOC_DATE_EXP;
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
          const { dataTable, dataInput } = this.state;
          const newTruck = {
            id: dataTable.length,
            IS_IN_OUT: "I",
            TRUCK_NO: dataInput.TRUCK_NO,
            PIN_CODE: dataInput.PIN_CODE,
            ORDER_NO: response.Payload.ORDER_NO,
            CLASS_CODE: response.Payload.CLASS_CODE,
            VOYAGEKEY: response.Payload.VOYAGEKEY,
            METHOD_CODE: response.Payload.METHOD_CODE,
            TIME_IN: moment(),
          };

          let truckList = [newTruck, ...dataTable];

          socket.emit('gate_server_savein', {
            storageCode: this.state.dataWareHouse.WAREHOUSE_CODE,
            socketId: socket.id,
            gateTruckItem: newTruck,
            tallyTruckItem: Object.assign(response.Payload, {
              INBOUND_VOYAGE: this.state.dataInput.INBOUND_VOYAGE,
              OUTBOUND_VOYAGE: this.state.dataInput.OUTBOUND_VOYAGE,
              ETA: this.state.dataInput.ETA,
              ETD: this.state.dataInput.ETD,
              VESSEL_NAME: this.state.dataInput.VESSEL_NAME,
              storageCode: this.state.dataWareHouse.WAREHOUSE_CODE
            }),
          });
          this.setState({
            dataTable: truckList,
            dataInput: initData,
            truckInput: truckInput,
            remoocInput: remoocInput,
            data: {
              ...this.state.Gate,
              GATE_CODE: "",
            },
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message,
              type: "success"
            }
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
        this.setState({
          dialogLoading: {
            isOpen: false
          }
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

  handleSaveOut() {
    let url = window.root_url + `job-gate/insertEx`;
    let dataSend = this.state.dataInput;
    Object.assign(dataSend, {
      VGM: this.state.dataInput.VGM,
      WEIGHT_REGIS: parseInt(this.state.truckInput.WEIGHT_REGIS) ? parseInt(this.state.truckInput.WEIGHT_REGIS) : parseInt(this.state.dataInput.WEIGHT_REGIS),
      WEIGHT_REGIS_ALLOW: parseInt(this.state.truckInput.WEIGHT_REGIS_ALLOW) ? parseInt(this.state.truckInput.WEIGHT_REGIS_ALLOW) : parseInt(this.state.dataInput.WEIGHT_REGIS_ALLOW),
      REMOOC_WEIGHT: parseInt(this.state.remoocInput.REMOOC_WEIGHT) ? parseInt(this.state.remoocInput.REMOOC_WEIGHT) : parseInt(this.state.dataInput.REMOOC_WEIGHT),
      REMOOC_NO: this.state.dataInput.REMOOC_NO,
      REMOOC_WEIGHT_REGIS: parseInt(this.state.remoocInput.REMOOC_WEIGHT_REGIS) ? parseInt(this.state.remoocInput.REMOOC_WEIGHT_REGIS) : parseInt(this.state.dataInput.REMOOC_WEIGHT_REGIS),
      GATE_CODE: this.state.Gate.GATE_CODE,
      IS_IN_OUT: this.state.Gate.IS_IN_OUT,
      TIME_REGIS: this.state.truckInput.TRUCK_DATE_EXP ? moment(this.state.truckInput.TRUCK_DATE_EXP).format("DD/MM/YYYY") : moment(this.state.dataInput.TRUCK_DATE_EXP).format("DD/MM/YYYY"),
      TIME_REMOOC: this.state.remoocInput.REMOOC_DATE_EXP ? moment(this.state.remoocInput.REMOOC_DATE_EXP).format("DD/MM/YYYY") : moment(this.state.dataInput.REMOOC_DATE_EXP).format("DD/MM/YYYY"),
      CREATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
    });
    // delete dataSend.BOOKING_NO;
    delete dataSend.TRUCK_DATE_EXP;
    delete dataSend.REMOOC_DATE_EXP;
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
          const { dataTable, dataInput } = this.state;
          const newTruck = {
            id: dataTable.length,
            IS_IN_OUT: "I",
            TRUCK_NO: dataInput.TRUCK_NO,
            PIN_CODE: dataInput.PIN_CODE,
            ORDER_NO: response.Payload.jobGateInfo.ORDER_NO,
            CLASS_CODE: response.Payload.jobGateInfo.CLASS_CODE,
            VOYAGEKEY: response.Payload.jobGateInfo.VOYAGEKEY,
            METHOD_CODE: response.Payload.jobGateInfo.METHOD_CODE,
            TIME_IN: moment(),
          };
          let dataSendSocketJobStock = response.Payload.jobStockInfo.length ? response.Payload.jobStockInfo : []
          let truckList = [newTruck, ...dataTable];

          socket.emit('che_operating_server_complete', {
            storageCode: this.state.dataWareHouse.WAREHOUSE_CODE,
            cheItem: dataSendSocketJobStock,
          })
          socket.emit('gate_server_savein', {
            storageCode: this.state.dataWareHouse.WAREHOUSE_CODE,
            socketId: socket.id,
            ...newTruck,
            cheItem: dataSendSocketJobStock,
            tallyTruckItem : Object.assign(response.Payload.jobGateInfo, {
              INBOUND_VOYAGE: this.state.dataInput.INBOUND_VOYAGE,
              OUTBOUND_VOYAGE: this.state.dataInput.OUTBOUND_VOYAGE,
              ETA: this.state.dataInput.ETA,
              ETD: this.state.dataInput.ETD,
              VESSEL_NAME: this.state.dataInput.VESSEL_NAME,
              storageCode: this.state.dataWareHouse.WAREHOUSE_CODE
            })
          });

          this.setState({
            dataTable: truckList,
            dataInput: initData,
            truckInput: truckInput,
            remoocInput: remoocInput,
            data: {
              ...this.state.Gate,
              GATE_CODE: "",
            },
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message,
              type: "success"
            }
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
        this.setState({
          dialogLoading: {
            isOpen: false
          }
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

  handleLoaddataGateOut(data) {
    let url = window.root_url + `job-gate/loadCar`;
    let dataSend = {
      VOYAGEKEY: data.VOYAGEKEY,
      ORDER_NO: data.ORDER_NO,
      PIN_CODE: data.PIN_CODE,
      METHOD_CODE: data.METHOD_CODE,
      TRUCK_NO: data.TRUCK_NO,
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
          let temp = response.Payload.map(item => {
            if (item.NOTE === null) {
              item.NOTE = ''
              return item;
            } else {
              return item;
            }
          })
          this.setState({
            dataInput: temp[0],
            alert: {
              isOpen: true,
              type: "success",
              duration: 3000,
              message: response.Message,
            }
          })
        } else {
          this.setState({
            dataInput: initData,
            alert: {
              isOpen: true,
              duration: 3000,
              type: "error",
              message: response.Message
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
              message: 'Lỗi ' + JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }

  handleConfirmPassGateIn() {
    let { dataInput } = this.state;
    let url = window.root_url + `job-gate/confirmOrderCar`;
    let dataSend = {
      VOYAGEKEY: dataInput.VOYAGEKEY,
      ORDER_NO: dataInput.ORDER_NO,
      PIN_CODE: dataInput.PIN_CODE,
      NOTE: dataInput.NOTE,
      CNTRNO: dataInput.CNTRNO,
      METHOD_CODE: dataInput.METHOD_CODE,
      QUANTITY_CHK: dataInput.QUANTITY_CHK === true ? true : false,
      UPDATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
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
          let temp = this.state.dataTable.filter(item => item.ORDER_NO !== this.state.dataInput.ORDER_NO);
          this.setState({
            dataTable: temp,
            dataInput: initData,
            alert: {
              isOpen: true,
              type: "success",
              duration: 3000,
              message: response.Message
            }
          })
        } else {
          this.setState({
            alert: {
              isOpen: true,
              type: "error",
              duration: 3000,
              message: response.Message
            }
          })
        }
        this.setState({
          dialogLoading: {
            isOpen: false
          }
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
              message: 'Lỗi ' + JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }

  handleConfirmPassGateOut() {
    // let { dataInput } = this.state;
    let url = window.root_url + `job-gate/confirmOrderCarEx`;
    let dataSend = {
      ...this.state.dataInput,
      UPDATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
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
          let temp = this.state.dataTable.filter(item => item.ORDER_NO !== this.state.dataInput.ORDER_NO);
          this.setState({
            dataTable: temp,
            dataInput: initData,
            alert: {
              isOpen: true,
              type: "success",
              duration: 3000,
              message: response.Message
            }
          })
        } else {
          this.setState({
            alert: {
              isOpen: true,
              type: "error",
              duration: 3000,
              message: response.Message
            }
          })
        }
        this.setState({
          dialogLoading: {
            isOpen: false
          }
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
              message: 'Lỗi ' + JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }

  handleLoadRemooc(data) {
    let url = window.root_url + `bs-romoocs/getItem`;
    let dataSend = {
      REMOOC_NO: data.REMOOC_NO
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
      .then(data => {
        if (data.Status) {
          let temp = this.createRows(data.Payload);
          this.setState({
            remoocInput: temp[0],
          });
        }
        else {
          this.setState({
            alert: {
              type: 'warning',
              message: data.Message,
              duration: 3000,
              isOpen: true
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
              message: JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }

  handleLoadTruck(data) {
    let url = window.root_url + `bs-trucks/getItem`;
    let dataSend = {
      TRUCK_NO: data.TRUCK_NO
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
      .then(data => {
        if (data.Status) {
          let temp = this.createRows(data.Payload);
          this.setState({
            truckInput: temp[0],
          });
        }
        else {
          this.setState({
            alert: {
              type: 'warning',
              message: data.Message,
              duration: 3000,
              isOpen: true
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
              message: JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }
  loadWarehouse() {
    let url = window.root_url + `bs-warehouse/view`;
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
        this.setState({
          dataStorage: data.Payload,
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
              message: 'Nạp dữ liệu không thành công',
              type: 'error'
            }
          });
        }
      });
  }

  handleLoadDataGate() {
    let url = window.root_url + `bs-gates/view`;
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
        this.setState({
          dataTableGate: data,
          alert: {
            isOpen: true,
            type: "success",
            duration: 3000,
            message: "Nạp dữ liệu thành công!"
          },
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
              message: JSON.parse(err.message).error.message,
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
        <Stack direction='row' spacing={2} >
          <Card sx={{ width: '60%' }}>
            <CardContent>
              <Stack>
                <Button
                  onClick={() => {
                    this.setState({
                      dialogWareHouse: true
                    });
                  }}
                  variant="contained"
                  startIcon={<AlignHorizontalLeftIcon />}
                  size="large"
                  sx={{ marginBottom: "12px" }}
                >
                  {`Tên kho: ${this.state.dataWareHouse?.WAREHOUSE_NAME ?? ""} / Tên cổng: ${this.state.Gate?.GATE_NAME ?? ""}`}
                </Button>
                <Grid container spacing={2} >
                  <Grid item xs={12}>
                    <span style={{ fontWeight: 'bold', fontSize: 14 }}>Thông tin lệnh</span>
                    <Divider />
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          sx={{ ml: 1 }}
                          key="ORDER_NO"
                          label="Số Lệnh"
                          value={(this.state.dataInput.ORDER_NO)}
                          onChange={(e) => {
                            this.setState({
                              dataInput: {
                                ...this.state.dataInput,
                                ORDER_NO: e.target.value
                              }
                            })
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              this.handleLoadDataInput({
                                PIN_CODE: "",
                                CNTRNO: "",
                                ORDER_NO: e.target.value
                              });
                            }
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {
                                  !this.state.dataInput.ORDER_NO ?
                                    <SearchIcon style={{ cursor: "default" }}
                                      onClick={() => {
                                        this.handleLoadDataInput({
                                          PIN_CODE: "",
                                          CNTRNO: "",
                                          ORDER_NO: this.state.dataInput.ORDER_NO
                                        })
                                      }}
                                    />
                                    :
                                    <HighlightOffIcon style={{ cursor: "default" }}
                                      onClick={() =>
                                        this.setState({
                                          dataInput: initData,
                                        })
                                      }
                                    />
                                }
                              </InputAdornment>
                            ),
                          }}
                          disabled={this.state.dataInput.PIN_CODE || this.state.dataInput.CNTRNO || this.state.Gate.IS_IN_OUT === "O" ? true : false}
                        />
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          sx={{ ml: 1 }}
                          key="PIN_CODE"
                          label="Mã Pin"
                          value={this.state.dataInput.PIN_CODE}
                          onChange={(e) => {
                            this.setState({
                              dataInput: {
                                ...this.state.dataInput,
                                PIN_CODE: e.target.value
                              }
                            })
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              this.handleLoadDataInput({
                                PIN_CODE: e.target.value,
                                ORDER_NO: "",
                                CNTRNO: "",
                              });
                            }
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {
                                  !this.state.dataInput.PIN_CODE ?
                                    <SearchIcon style={{ cursor: "default" }}
                                      onClick={() => {
                                        this.handleLoadDataInput({
                                          PIN_CODE: this.state.dataInput.PIN_CODE,
                                          ORDER_NO: "",
                                          CNTRNO: "",
                                        });
                                      }}
                                    />
                                    :
                                    <HighlightOffIcon style={{ cursor: "default" }}
                                      onClick={() =>
                                        this.setState({
                                          dataInput: initData,
                                        })
                                      }
                                    />
                                }
                              </InputAdornment>
                            ),
                          }}
                          disabled={this.state.dataInput.CNTRNO || this.state.dataInput.ORDER_NO || this.state.Gate.IS_IN_OUT === "O" ? true : false}
                        />
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Divider flexItem />
                  <Grid item xs={6}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          sx={{ ml: 1 }}
                          key="CNTRNO"
                          label="Container"
                          value={this.state.dataInput.CNTRNO}
                          onChange={(e) => {
                            this.setState({
                              dataInput: {
                                ...this.state.dataInput,
                                CNTRNO: e.target.value
                              }
                            })
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              this.handleLoadDataInput({
                                ORDER_NO: "",
                                PIN_CODE: "",
                                CNTRNO: e.target.value
                              });
                            }
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {
                                  !this.state.dataInput.CNTRNO ?
                                    <SearchIcon style={{ cursor: "default" }}
                                      onClick={() => {
                                        this.handleLoadDataInput({
                                          PIN_CODE: "",
                                          ORDER_NO: "",
                                          CNTRNO: this.state.dataInput.CNTRNO,
                                        });
                                      }}
                                    />
                                    :
                                    <HighlightOffIcon style={{ cursor: "default" }}
                                      onClick={() =>
                                        this.setState({
                                          dataInput: initData,
                                        })
                                      }
                                    />
                                }
                              </InputAdornment>
                            ),
                          }}
                          disabled={this.state.dataInput.ORDER_NO || this.state.dataInput.PIN_CODE || this.state.Gate.IS_IN_OUT === "O" ? true : false}
                        />
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          sx={{ ml: 1 }}
                          key="CNTRSZTP"
                          label="Kích Cỡ"
                          value={this.state.dataInput.CNTRSZTP}
                          disabled
                        />
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          sx={{ ml: 1 }}
                          key="CUSTOMER_CODE"
                          label="Chủ Hàng"
                          value={this.state.dataInput.CUSTOMER_CODE}
                          disabled
                        />
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          sx={{ ml: 1 }}
                          key="METHOD_CODE"
                          label="Phương Án"
                          value={this.state.dataInput.METHOD_CODE}
                          disabled
                        />
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          sx={{ ml: 1 }}
                          key="CLASS_CODE"
                          label="Hướng"
                          value={this.state.dataInput.CLASS_CODE}
                          disabled
                        />
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          sx={{ ml: 1 }}
                          key="NOTE"
                          label="Ghi Chú"
                          value={this.state.dataInput.NOTE}
                          onChange={(e) => {
                            this.setState({
                              dataInput: {
                                ...this.state.dataInput,
                                NOTE: e.target.value
                              }
                            })
                          }}

                        />
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item md={12}>
                    <span style={{ fontWeight: 'bold', fontSize: 14 }}>Thông tin tài xế</span>
                    <Divider />
                  </Grid>
                  <Grid item xs={4}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          sx={{ ml: 1 }}
                          key="DRIVER"
                          label="Tên Tài Xế"
                          value={(this.state.dataInput.DRIVER) ?? ''}
                          onChange={(e) => {
                            this.setState({
                              dataInput: {
                                ...this.state.dataInput,
                                DRIVER: e.target.value
                              }
                            })
                          }}
                          disabled={this.state.Gate.IS_IN_OUT === "O" ? true : false}
                        />
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          sx={{ ml: 1 }}
                          key="TEL"
                          label="Số Điện Thoại"
                          value={(this.state.dataInput.TEL) ?? ''}
                          onChange={(e) => {
                            this.setState({
                              dataInput: {
                                ...this.state.dataInput, TEL: e.target.value
                              }
                            })
                          }}
                          disabled={this.state.Gate.IS_IN_OUT === "O" ? true : false}
                        />
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack direction='row' alignItems='center' spacing={2} sx={{ ml: 1 }}>
                      <span>VGM:</span>
                      <Checkbox
                        disabled={this.state.Gate.IS_IN_OUT === 'O'}
                        checked={this.state.dataInput.VGM}
                        onChange={(e) => {
                          this.setState({
                            dataInput: {
                              ...this.state.dataInput, VGM: e.target.checked
                            }
                          })

                        }} />
                    </Stack>
                  </Grid>
                  <Divider flexItem />
                  <Grid item xs={3}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          sx={{ ml: 1 }}
                          key="TRUCK_NO"
                          label="Số Xe"
                          value={(this.state.dataInput.TRUCK_NO) ?? ''}
                          onChange={(e) => {
                            this.setState({
                              dataInput: {
                                ...this.state.dataInput,
                                TRUCK_NO: e.target.value
                              }
                            })
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              this.handleLoadTruck({
                                TRUCK_NO: e.target.value
                              })
                            }
                          }}
                          onBlur={(e) => {
                            this.handleLoadTruck({
                              TRUCK_NO: e.target.value
                            })
                          }}
                          disabled={this.state.Gate.IS_IN_OUT === "O" ? true : false}
                        />
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          sx={{ ml: 1 }}
                          key="WEIGHT_REGIS"
                          label="Trọng Lượng Đăng Kiểm"
                          value={(this.state.dataInput.WEIGHT_REGIS) || (this.state.truckInput.WEIGHT_REGIS)}
                          onChange={(e) => {
                            this.setState({
                              dataInput: {
                                ...this.state.dataInput,
                                WEIGHT_REGIS: e.target.value
                              }
                            })
                          }}
                          disabled={this.state.Gate.IS_IN_OUT === "O" ? true : false}
                        />
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          sx={{ ml: 1 }}
                          key="WEIGHT_REGIS_ALLOW"
                          label="Trọng lượng đăng kiểm đầu kéo"
                          value={(this.state.dataInput.WEIGHT_REGIS_ALLOW) || (this.state.truckInput.WEIGHT_REGIS_ALLOW)}
                          onChange={(e) => {
                            this.setState({
                              dataInput: {
                                ...this.state.dataInput,
                                WEIGHT_REGIS_ALLOW: e.target.value
                              }
                            })
                          }}
                          disabled={this.state.Gate.IS_IN_OUT === "O" ? true : false}
                        />
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          label="Hạn đăng kiểm đầu kéo"
                          inputFormat="DD/MM/YYYY"
                          value={this.state.dataInput.TRUCK_DATE_EXP || (this.state.truckInput.TRUCK_DATE_EXP)
                            ? (this.state.dataInput.TRUCK_DATE_EXP) || (this.state.truckInput.TRUCK_DATE_EXP)
                            : null
                          }
                          onChange={(newValue) => {
                            this.setState({
                              dataInput: {
                                ...this.state.dataInput,
                                TRUCK_DATE_EXP: newValue
                              }
                            })
                          }}
                          renderInput={(params) => <TextField key="TRUCK_DATE_EXP" fullWidth size="small" readOnly {...params} />}
                          disabled={this.state.Gate.IS_IN_OUT === "O" ? true : false}
                        />
                      </LocalizationProvider>

                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          sx={{ ml: 1 }}
                          key="REMOOC_NO"
                          label="Số mooc"
                          value={(this.state.dataInput.REMOOC_NO) ?? ''}
                          onChange={(e) => {
                            this.setState({
                              dataInput: {
                                ...this.state.dataInput,
                                REMOOC_NO: e.target.value
                              }
                            })
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              this.handleLoadRemooc({
                                REMOOC_NO: e.target.value
                              });
                            }
                          }}
                          onBlur={(e) => {
                            this.handleLoadRemooc({
                              REMOOC_NO: e.target.value
                            })
                          }}
                          disabled={this.state.Gate.IS_IN_OUT === "O" ? true : false}
                        />
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          sx={{ ml: 1 }}
                          key="REMOOC_WEIGHT"
                          label="Trọng lượng mooc"
                          value={(this.state.dataInput.REMOOC_WEIGHT) || (this.state.remoocInput.REMOOC_WEIGHT)}
                          onChange={(e) => {
                            this.setState({
                              dataInput: {
                                ...this.state.dataInput,
                                REMOOC_WEIGHT: e.target.value
                              }
                            })
                          }}
                          disabled={this.state.Gate.IS_IN_OUT === "O" ? true : false}
                        />
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <FormControl fullWidth>
                        <TextField
                          size="small"
                          sx={{ ml: 1 }}
                          key="REMOOC_WEIGHT_REGIS"
                          label="Trọng lượng đăng kiểm Remooc"
                          value={(this.state.dataInput.REMOOC_WEIGHT_REGIS) || (this.state.remoocInput.REMOOC_WEIGHT_REGIS)}
                          onChange={(e) => {
                            this.setState({
                              dataInput: {
                                ...this.state.dataInput,
                                REMOOC_WEIGHT_REGIS: e.target.value
                              }
                            })
                          }}
                          disabled={this.state.Gate.IS_IN_OUT === "O" ? true : false}
                        />
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack direction={{ sm: 'row' }} alignItems="center" >
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          label="Hạn đăng kiểm Remooc"
                          inputFormat="DD/MM/YYYY"
                          value={(this.state.dataInput.REMOOC_DATE_EXP) || (this.state.remoocInput.REMOOC_DATE_EXP)
                            ? (this.state.dataInput.REMOOC_DATE_EXP) || (this.state.remoocInput.REMOOC_DATE_EXP)
                            : null}
                          onChange={(newValue) => {
                            this.setState({
                              dataInput: {
                                ...this.state.dataInput,
                                REMOOC_DATE_EXP: newValue
                              }
                            })
                          }}
                          renderInput={(params) => <TextField key="REMOOC_DATE_EXP" fullWidth size="small" readOnly {...params} />}
                          disabled={this.state.Gate.IS_IN_OUT === "O" ? true : false}
                        />
                      </LocalizationProvider>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: 'end' }}>
                    <Button
                      type="button"
                      variant="outlined"
                      sx={{ marginTop: "5px", }}
                      startIcon={<DirectionsCarIcon />}
                      onClick={(e) => {
                        this.setState({
                          dialogLoading: {
                            isOpen: true
                          }
                        })
                        if (this.state.Gate.IS_IN_OUT === "O") {
                          if (this.state.selectedTruck.METHOD_CODE === 'XKX' || this.state.selectedTruck.METHOD_CODE === 'XKN') {
                            this.handleConfirmPassGateOut();
                          } else {
                            this.handleConfirmPassGateIn();
                          }
                        } else {
                          this.handleCheckMETHOD();
                        }
                      }}
                    >
                      Qua Cổng
                    </Button>
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>
          <Card style={{ width: "40%" }}>
            <CardContent>
              <span style={{ fontWeight: 'bold', fontSize: 14 }}>Danh Sách Xe</span>
              <Divider />
              <Stack spacing={2}>
                <Stack direction="row" spacing={15} sx={{ mt: 1 }}>
                  <Stack direction='row' spacing={1}>
                    <TextField
                      size="small"
                      sx={{ ml: 1 }}
                      key="tim-kiem"
                      label="Tìm"
                      onChange={(e) => {
                        this.setState({
                          searchField: {
                            PIN_CODE: e.target.value,
                          }
                        });
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                </Stack>
                <Box
                  sx={{
                    textAlign: 'center',
                    height: "auto",
                    width: '100%',
                    '& .MuiDataGrid-columnHeadersInner': {
                      backgroundColor: 'rgba(176,224,230, 0.55)',
                    },
                  }}
                >
                  <DataGrid
                    hideFooter={true}
                    onRowClick={(params) => {
                      if (this.state.Gate.IS_IN_OUT === "O") {
                        this.handleLoaddataGateOut(params.row);
                        this.setState({
                          selectedTruck: params.row,
                        });
                      }
                    }}
                    rows={(this.state.dataTable)
                      .filter(data => data.PIN_CODE.toUpperCase().includes(this.state.searchField.PIN_CODE.toUpperCase()))
                    }
                    columns={this.columns}
                    rowsPerPageOptions={[10, 25, 100]}
                    sx={{ height: "53vh" }}
                  >
                  </DataGrid>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
        <Backdrop
          open={this.state.dialogLoading.isOpen}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <ChonSoLenh
          ref={(data) => this.PopupChonSoLenh = data}
          dialog={this.state.dialogLenh}
          handleSelect={(data) => {
            if (Object.keys(data).length > 0) {
              this.setState({
                dataInput: data,
                dialogLenh: {
                  isOpen: false,
                  data: null,
                  type: 0,
                },
              })
            } else {
              this.setState({
                dialogLenh: {
                  isOpen: false,
                  data: null,
                  type: 0,
                }
              })
            }
          }}
          handleCloseDialog={(data) => {
            this.setState({
              dialogLenh: {
                isOpen: false,
                data: null,
                type: 0,
              }
            })
          }
          }
        >
        </ChonSoLenh>
        <Dialog
          open={this.state.dialogWareHouse}
          scroll="paper"
          fullWidth={true}
          maxWidth="sm"
        >
          <DialogTitle variant="h5" sx={{ textAlign: 'center' }}>Chọn thiết bị</DialogTitle>
          <DialogContent>
            <Card>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item md={6} sm={12}>
                    <List
                      component="nav"
                      sx={{
                        height: "30vh",
                        bgcolor: 'background.paper',
                        position: 'relative',
                        overflow: 'auto',
                        '& ul': { padding: 0 },
                      }}
                      subheader={
                        <>
                          <ListSubheader sx={{ lineHeight: "36px" }}>
                            Chọn kho tác nghiệp
                          </ListSubheader>
                          <Divider />
                        </>
                      }
                    >
                      {this.state.dataStorage.map((item, index) => {
                        return (
                          <>
                            <ListItem disablePadding divider={(this.state.dataStorage.length - 1) === index ? false : true}>
                              <ListItemButton
                                onClick={() => {
                                  this.handleLoadDataGate();
                                  this.setState({ dataWareHouse: item })
                                }}
                                selected={(item.WAREHOUSE_CODE === this.state.dataWareHouse.WAREHOUSE_CODE ? true : false)}
                              >
                                <ListItemIcon>
                                  <Warehouse />
                                </ListItemIcon>
                                <ListItemText component='b' primary={item.WAREHOUSE_NAME} />
                                <Typography variant="b" component="b"></Typography>
                              </ListItemButton>
                            </ListItem>
                          </>
                        );
                      })}
                    </List>
                  </Grid>
                  <Grid item md={6} sm={12}>
                    <List
                      component="nav"
                      sx={{
                        height: "30vh",
                        bgcolor: 'background.paper',
                        position: 'relative',
                        overflow: 'auto',
                        '& ul': { padding: 0 },
                      }}
                      subheader={
                        <>
                          <ListSubheader sx={{ lineHeight: "36px" }}>Chọn cổng tác nghiệp</ListSubheader>
                          <Divider />
                        </>
                      }
                    >
                      {this.state.dataTableGate.map((item, value, index) => {
                        return (
                          <>
                            <ListItem disablePadding>
                              <ListItemButton
                                onClick={() => {
                                  let deviceInfo = {
                                    deviceName: item.GATE_NAME,
                                    deviceCode: item.GATE_CODE,
                                    deviceType: "GATE",
                                    storageCode: this.state.dataWareHouse.WAREHOUSE_CODE,
                                    storageName: this.state.dataWareHouse.WAREHOUSE_NAME,
                                    userName: this.userInfo.name,
                                    socketId: socket.id
                                  };
                                  this.setState({
                                    dataDevice: deviceInfo
                                  })
                                  this.tempSelectedDevice = item;
                                  socket.emit("server_login", deviceInfo);
                                  socket.emit("server_get_device_list", [deviceInfo]);
                                }}
                              >
                                <ListItemIcon>
                                  <DoorSliding />
                                </ListItemIcon>
                                <ListItemText primary={item.GATE_NAME} />
                              </ListItemButton>
                            </ListItem>

                          </>
                        );
                      })}
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </DialogContent >
          <DialogActions>
            <Button onClick={() => { this.setState({ dialogWareHouse: false }) }} >Đóng</Button>
          </DialogActions>
        </Dialog>
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
      </Box>
    );
  }

  componentDidMount() {
    // ---------------- socket listener ----------------
    socket.on("client_login", (response) => {
      if (response.status) {
        this.setState({
          Gate: this.tempSelectedDevice,
          dialogWareHouse: false
        });
      } else {
        this.setState({
          alert: {
            isOpen: true,
            type: 'warning',
            duration: 2000,
            message: response.message
          }
        })
      }
    });

    socket.on("gate_client_savein", (response) => {
      const { dataTable } = this.state;
      this.setState({
        dataTable: [response, ...dataTable],
      });
    });

    socket.on("client_logout", (response) => {
      if (response.deviceType === 'GATE') {
        this.setState({
          alert: {
            isOpen: true,
            duration: 2000,
            type: "error",
            message: "Thiết bị của bạn đã bị ngắt kết nối"
          }
        })
        setTimeout(function () {
          window.location.href = window.location.href
        }, 2000);
      } else {
        return;
      }
    })
    // --------------------------------------------------
    this.loadWarehouse();
    let url = window.root_url + `job-gate/getTruckList`;

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
        if (data.Status) {
          let truckData = this.createRows(data.Payload);
          this.setState({
            dataTable: truckData
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
              message: 'Phát sinh lỗi!',
              type: 'error'
            }
          });
        }
      });
  }

  componentWillUnmount() {
    socket.emit('server_logout', [{
      deviceName: this.tempSelectedDevice.GATE_NAME,
      deviceCode: this.tempSelectedDevice.GATE_CODE,
      deviceType: "GATE",
      socketId: socket.id
    }]);
  }

}
export default GiamSatCong;

