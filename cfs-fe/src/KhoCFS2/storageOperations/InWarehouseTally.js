import moment from "moment";
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Stack,
  Card,
  CardContent,
  Checkbox,
  TextField,
  Typography,
  Grid,
  Accordion,
  Tabs,
  Tab,
  AccordionSummary,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  AccordionDetails,
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
// import DecodeJWT from '../login/DecodeJWT'
import FixedPageName from "../../componentsCFS2/fixedPageName";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { DoorSliding, ExpandMore, Warehouse } from "@mui/icons-material";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { socketServices } from "../../_services/socket.service";
import NotePopup from "../../componentsCFS2/dialog/NotePopup";
import EditIcon from '@mui/icons-material/Edit';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const { socket } = socketServices;
class TallySys extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFinish: false,
      changeValue: "",
      quantityCheck: false,
      isConfirmCheck: false,
      dataTableTruck: [],
      loadDataHousebillAndBooking: [],
      dataTablePallet: [],
      dataStorage: [],
      dataDevicesHeader: [],
      dataDevicesDetails: [],
      storageHeader: {
        CLASS_CODE: 0
      },
      selectedEquipment: {},
      truckHeader: {},
      orderHeader: {},
      isInOut: 1,
      numberOfTOTAL_CARGO_PIECE: '',
      wareHouseInfo: {},
      dialogPallet: {
        isOpen: false,
        data: null,
        type: 0,
      },
      dialogStorage: {
        isOpen: true,
        data: null,
        type: 0,
      },
      dialogLoading: {
        isOpen: false,
      },
      palletData: {
        ESTIMATED_CARGO_PIECE: parseInt(0),
        PALLET_NO: '',
        isChecked: '',
      },
      note: '',
      noteDialog: {
        isOpen: false
      },
      tempSelectedHouseBill: {},
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };

    this.SelectedDevice = {};
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));

    this.createRows = (data) => data.map((row, index) => ({
      stt: index + 1,
      id: index,
      ...row
    }),
    );
  }

  handleChange(type) {
    this.setState({
      actionStep: type
    })
  }

  handleFinish() {
    this.setState({
      isFinish: true
    })
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

  loadDevices(WAREHOUSE_CODE) {
    let url = window.root_url + `bs-equipments/getItem`;
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
      body: JSON.stringify({ WAREHOUSE_CODE: WAREHOUSE_CODE, EQU_TYPE: 'KD' })
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
          this.setState({
            dataDevicesDetails: data.Payload
          });
        } else {
          this.setState({
            alert: {
              isOpen: true,
              type: "warning",
              duration: 3000,
              message: data.Message
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
              message: 'Nạp dữ liệu không thành công',
              type: 'error'
            }
          });
        }
      });
  }

  handleSaveNote(value, params) {
    if (value !== null && value !== undefined) {
      let temp = this.state.loadDataHousebillAndBooking.map(item => {
        if (item.HOUSE_BILL === params) {
          item.note = value
        }
        return item;
      });
      this.setState({
        note: value,
        loadDataHousebillAndBooking: temp
      })
    }
  }

  loadTruck() {
    let url = window.root_url + `job-gate/getTruckViaWarehouse`;
    let dataSend = {
      CLASS_CODE: this.state.isInOut,
      METHOD_CODE: this.state.isInOut === 1 ? 'NKN' : 'NKX',
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
          temp.map(item => {
            item.isChecked = false;
            item.TIME_IN = moment(item.TIME_IN).format('DD/MM/YYYY HH:mm:ss:')
            return item;
          });
          this.setState({
            dataTableTruck: temp,
            actionStep: 'truck',
            alert: {
              isOpen: true,
              type: "success",
              duration: 3000,
              message: "Nạp dữ liệu thành công!"
            },
          })
        } else {
          this.setState({
            dataTableTruck: [],
            alert: {
              isOpen: true,
              type: "warning",
              duration: 3000,
              message: "không tìm thấy dữ liệu!"
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
  }

  handleLoadPalletAPI(item) {
    let url = window.root_url + `check-quantity/getHouseBillInfo`;
    this.setState({
      orderHeader: item
    })

    let dataSend = {
      ORDER_NO: item.ORDER_NO,
      HOUSE_BILL: item.HOUSE_BILL ? item.HOUSE_BILL : "",
      BOOKING_FWD: item.BOOKING_FWD ? item.BOOKING_FWD : "",
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
        let temp = this.createRows(data.Payload);
        if (item.CARGO_PIECE !== item.total_ACTUAL_CARGO_PIECE) {
          this.setState({
            dataTablePallet: temp,
            actionStep: 'detail',
            dialogPallet: {
              isOpen: true,
              data: item
            }
          })
        } else {
          this.setState({
            dataTablePallet: temp,
            actionStep: 'detail',

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

  handleAddNewPallet() {
    let updatePalletTable = this.state.dataTablePallet
    let sum = updatePalletTable.map(item => parseFloat(item.ACTUAL_CARGO_PIECE || 0)).reduce((a, b) => a + b, 0);
    let dataSend = {
      VOYAGEKEY: this.state.truckHeader.VOYAGEKEY,
      WAREHOUSE_CODE: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE,
      CLASS_CODE: this.state.isInOut,
      METHOD_CODE: this.state.truckHeader.METHOD_CODE,
      TRUCK_NO: this.state.truckHeader.TRUCK_NO,
      CNTRNO: this.state.truckHeader.CNTRNO,
      ORDER_NO: this.state.truckHeader.ORDER_NO,
      PIN_CODE: this.state.truckHeader.PIN_CODE,
      HOUSE_BILL: this.state.orderHeader.HOUSE_BILL ? this.state.orderHeader.HOUSE_BILL : "",
      BOOKING_FWD: this.state.orderHeader.BOOKING_FWD ? this.state.orderHeader.BOOKING_FWD : "",
      ESTIMATED_CARGO_PIECE: Number(this.state.orderHeader.CARGO_PIECE),
      ITEM_TYPE_CODE: this.state.orderHeader.ITEM_TYPE_CODE,
      ACTUAL_CARGO_PIECE: Number(this.state.numberOfTOTAL_CARGO_PIECE),
      ACTUAL_UNIT: this.state.orderHeader.UNIT_CODE,
      ACTUAL_CARGO_WEIGHT: this.state.orderHeader.CARGO_WEIGHT,
      START_DATE: moment().format("YYYY-MM-DD hh:mm:ss"),
      FINISH_DATE: this.state.tempSelectedHouseBill.CARGO_PIECE === sum ? moment().format("YYYY-MM-DD hh:mm:ss") : null,
      CREATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
    }
    let url = window.root_url + `check-quantity/insertJobQuantity`;
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
          if (this.state.dataTablePallet) {
            let { dataTablePallet, palletData } = this.state;
            let tempPalletData = palletData;
            tempPalletData = response.Payload;
            let newData = { ...tempPalletData, id: 0 };
            let temp = [...dataTablePallet];
            temp.unshift(newData);
            this.setState({
              dataTablePallet: temp
            })
          } else {
            let { dataTablePallet, palletData } = this.state;
            let tempPalletData = palletData;
            tempPalletData = response.Payload;
            let newData = { ...tempPalletData, id: dataTablePallet.at(-1).id + 1 };
            let temp = [...dataTablePallet];
            temp.unshift(newData);
            this.setState({
              dataTablePallet: temp
            })
          }
          socket.emit('quantity_server_complete', {
            storageCode: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE,
            ACTUAL_CARGO_PIECE: Number(this.state.numberOfTOTAL_CARGO_PIECE),
            CLASS_CODE: this.state.isInOut,
            CNTRNO: this.state.truckHeader.CNTRNO,
            ESTIMATED_CARGO_PIECE: Number(this.state.orderHeader.CARGO_PIECE),
            ETA: this.state.orderHeader?.vesselInfo.ETA,
            ETD: this.state.orderHeader?.vesselInfo.ETD,
            HOUSE_BILL: this.state.orderHeader.HOUSE_BILL ? this.state.orderHeader.HOUSE_BILL : "",
            BOOKING_FWD: this.state.orderHeader.BOOKING_FWD ? this.state.orderHeader.BOOKING_FWD : "",
            INBOUND_VOYAGE: this.state.orderHeader?.vesselInfo.INBOUND_VOYAGE,
            OUTBOUND_VOYAGE: this.state.orderHeader?.vesselInfo.OUTBOUND_VOYAGE,
            METHOD_CODE: this.state.truckHeader.METHOD_CODE,
            SEQ: response.Payload.SEQ,
            TRUCK_NO: this.state.truckHeader.TRUCK_NO,
            VESSEL_NAME: this.state.orderHeader?.vesselInfo.VESSEL_NAME,
            VOYAGEKEY: this.state.truckHeader.VOYAGEKEY,
            WAREHOUSE_CODE: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE
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

  showHousebillAndBookingList(params) {
    if (!(this.state.truckHeader.CNTRNO === params.CNTRNO && this.state.truckHeader.TRUCK_NO === params.TRUCK_NO)) {
      let url = window.root_url + `dt-order/getHousebillList`;
      this.setState({
        truckHeader: params
      });

      let dataSend = {
        CLASS_CODE: this.state.isInOut,
        ORDER_NO: params.ORDER_NO
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
          if (data.Payload.length > 0) {
            let tempVesselInfo = data.Payload[0]?.vesselInfo
            let temp = this.createRows(data.Payload);
            temp.map(item => {
              item.isChecked = false;
              Object.assign(temp, tempVesselInfo)
              return item;
            })
            let confirmCheck = temp.every(item => item.QUANTITY_CHK === true)
            if (confirmCheck === true) {
              this.setState({
                quantityCheck: true
              })
            } else {
              this.setState({
                quantityCheck: false
              });
            }
            this.setState({
              loadDataHousebillAndBooking: temp,
              dataTablePallet: [],
              actionStep: 'order',
              alert: {
                isOpen: true,
                type: "success",
                duration: 3000,
                message: "Nạp dữ liệu thành công!"
              },
            })

          } else {
            this.setState({
              loadDataHousebillAndBooking: [],
              alert: {
                isOpen: true,
                type: "warning",
                duration: 3000,
                message: "Không tìm thấy dữ liệu!"
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
        actionStep: "order"
      })
    }
  }

  handleInsertToJOB_STOCK(dataSend) {
    let url = window.root_url + `job-stock/insert`;
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
          let dataSend = {
            storageCode: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE,
            socketId: socket.id,
            selectedData: {
              HOUSE_BILL: data.Payload.HOUSE_BILL ? data.Payload.HOUSE_BILL : null,
              BOOKING_FWD: data.Payload.BOOKING_FWD ? data.Payload.BOOKING_FWD : null,
              PALLET_NO: data.Payload.PALLET_NO ? data.Payload.PALLET_NO : null,
              JOB_TYPE: data.Payload.JOB_TYPE ? data.Payload.JOB_TYPE : null,
              ACTUAL_CARGO_WEIGHT: data.Payload.ACTUAL_CARGO_WEIGHT ? data.Payload.ACTUAL_CARGO_WEIGHT : null,
              ACTUAL_CARGO_PIECE: data.Payload.ACTUAL_CARGO_PIECE ? data.Payload.ACTUAL_CARGO_PIECE : null,
              ORDER_NO: data.Payload.ORDER_NO ? data.Payload.ORDER_NO : null,
              WAREHOUSE_CODE: data.Payload.WAREHOUSE_CODE ? data.Payload.WAREHOUSE_CODE : null,
              ID: data.Payload.ID ? data.Payload.ID : null,
              PIN_CODE: data.Payload.PIN_CODE ? data.Payload.PIN_CODE : null,
              CLASS_CODE: data.Payload.CLASS_CODE ? data.Payload.CLASS_CODE : null,
            }
          }
          socket.emit('tally_server_complete', dataSend);
          socket.emit('che_operating_server_complete', {
            storageCode: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE,
            cheItem: [{
              ID: data.Payload.ID ? data.Payload.ID : null,
              CLASS_CODE: this.state.isInOut,
              CREATE_DATE: data.Payload.CREATE_DATE,
              HOUSE_BILL: this.state.orderHeader.HOUSE_BILL ? this.state.orderHeader.HOUSE_BILL : "",
              BOOKING_FWD: this.state.orderHeader.BOOKING_FWD ? this.state.orderHeader.BOOKING_FWD : "",
              JOB_TYPE: 'NK',
              PALLET_NO: data.Payload.PALLET_NO,
              WAREHOUSE_CODE: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE
            }]
          }
          );
        }
        return data
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

  //Thoilc(*Note)-Thêm mới lần đầu tiên khi xác nhận, lần 2 thì update
  handleInsertToDT_Package_Stock(dataSend, sum) {
    let obj = {
      VOYAGEKEY: dataSend.VOYAGEKEY,
      WAREHOUSE_CODE: dataSend.WAREHOUSE_CODE,
      CLASS_CODE: this.state.isInOut,
      METHOD_CODE: this.state.truckHeader.METHOD_CODE,
      ORDER_NO: dataSend.ORDER_NO,
      PIN_CODE: dataSend.PIN_CODE,
      CUSTOMER_CODE: this.state.orderHeader.CUSTOMER_CODE,
      HOUSE_BILL: dataSend.HOUSE_BILL ? dataSend.HOUSE_BILL : null,
      BOOKING_FWD: dataSend.BOOKING_FWD ? dataSend.BOOKING_FWD : null,
      CNTRNO: this.state.orderHeader.CNTRNO,
      LOT_NO: this.state.orderHeader.LOT_NO ? this.state.orderHeader.LOT_NO : null,
      CARGO_PIECE: sum,
      ITEM_TYPE_CODE: this.state.orderHeader.ITEM_TYPE_CODE,
      UNIT_CODE: dataSend.ACTUAL_UNIT,
      CARGO_WEIGHT: dataSend.ACTUAL_CARGO_WEIGHT,
      CBM: this.state.orderHeader.CBM,
      NOTE: dataSend.NOTE ? dataSend.NOTE : null,
      COMMODITYDESCRIPTION: dataSend.COMMODITYDESCRIPTION ? dataSend.COMMODITYDESCRIPTION : null,
      CREATE_BY: dataSend.CREATE_BY,
    };
    let url = window.root_url + `dt-package-stock/handleSave`;
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
      body: JSON.stringify(obj)
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(data => {
        return data;
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
  handleTally(event, newRowIndex, rowData) {
    if (event.target.checked) {
      let updatePalletTable = [...this.state.dataTablePallet].filter((p => p.PALLET_NO !== '' && p.PALLET_NO));
      let sum = updatePalletTable.map(item => parseFloat(item.ACTUAL_CARGO_PIECE || 0)).reduce((a, b) => a + b, 0);
      let isOverQty = this.state.tempSelectedHouseBill.CARGO_PIECE < sum;
      if (isOverQty) {
        updatePalletTable[newRowIndex].ACTUAL_CARGO_PIECE = 0;
        this.setState({
          numberOfTOTAL_CARGO_PIECE: 0,
          alert: {
            isOpen: true,
            message: 'Số lượng thực tế không được lớn hơn số lượng dự kiến!',
            type: 'error',
            duration: 2000
          }
        })
        return this.state.alert
      }
      let url = window.root_url + `check-quantity/confirmPackedPallet`;
      let dataSend = {
        CLASS_CODE: this.state.isInOut,
        HOUSE_BILL: this.state.orderHeader.HOUSE_BILL ? this.state.orderHeader.HOUSE_BILL : "",
        BOOKING_FWD: this.state.orderHeader.BOOKING_FWD ? this.state.orderHeader.BOOKING_FWD : "",
        ESTIMATED_CARGO_PIECE: this.state.orderHeader.CARGO_PIECE,
        ACTUAL_CARGO_PIECE: rowData.ACTUAL_CARGO_PIECE,
        SEQ: rowData.SEQ,
        ID: rowData.ID,
        UPDATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
      }
      if (this.state.isConfirmCheck) {
        return;
      }
      this.setState({
        isConfirmCheck: true
      })

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
          this.setState({
            dialogLoading: {
              isOpen: false
            }
          });

          let temp = this.state.dataTablePallet
          temp.map(item => {
            if (`${item.HOUSE_BILL}/${item.ACTUAL_CARGO_PIECE}/${item.ESTIMATED_CARGO_PIECE}/${item.SEQ}` === data.Payload.PALLET_NO) {
              item.PALLET_NO = data.Payload.PALLET_NO
              item.JOB_STATUS = data.Payload.JOB_STATUS
              item.ACTUAL_CARGO_PIECE = data.Payload.ACTUAL_CARGO_PIECE
              item.UPDATE_BY = data.Payload.UPDATE_BY
            }

            if (`${item.BOOKING_FWD}/${item.ACTUAL_CARGO_PIECE}/${item.ESTIMATED_CARGO_PIECE}/${item.SEQ}` === data.Payload.PALLET_NO) {
              item.PALLET_NO = data.Payload.PALLET_NO
              item.JOB_STATUS = data.Payload.JOB_STATUS
              item.ACTUAL_CARGO_PIECE = data.Payload.ACTUAL_CARGO_PIECE
              item.UPDATE_BY = data.Payload.UPDATE_BY
            }
            return item;
          });
          let checkPallet = [...temp].filter(e => e.PALLET_NO && e.PALLET_NO !== "".trim());
          let dataSendJobStock = {
            VOYAGEKEY: this.state.truckHeader.VOYAGEKEY,
            WAREHOUSE_CODE: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE,
            CLASS_CODE: this.state.isInOut,
            HOUSE_BILL: this.state.orderHeader.HOUSE_BILL ? this.state.orderHeader.HOUSE_BILL : "",
            BOOKING_FWD: this.state.orderHeader.BOOKING_FWD ? this.state.orderHeader.BOOKING_FWD : "",
            ORDER_NO: this.state.truckHeader.ORDER_NO,
            PIN_CODE: this.state.truckHeader.PIN_CODE,
            PALLET_NO: data.Payload.PALLET_NO,
            SEQ: data.Payload.SEQ,
            ACTUAL_CARGO_PIECE: Number(rowData.ACTUAL_CARGO_PIECE),
            ACTUAL_UNIT: this.state.orderHeader.UNIT_CODE,
            ACTUAL_CARGO_WEIGHT: this.state.orderHeader.CARGO_WEIGHT,
            NOTE: this.state.orderHeader.NOTE,
            COMMODITYDESCRIPTION: this.state.orderHeader.COMMODITYDESCRIPTION,
            JOB_STATUS: "A",
            CREATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
          };

          var totalActualCargoPiece = checkPallet.map(p => parseFloat(p.ACTUAL_CARGO_PIECE)).reduce((a, b) => a + b, 0);
          var { loadDataHousebillAndBooking } = this.state;
          loadDataHousebillAndBooking = loadDataHousebillAndBooking.map(p => {
            if (p.HOUSE_BILL === this.state.orderHeader.HOUSE_BILL) {
              p.total_ACTUAL_CARGO_PIECE = totalActualCargoPiece;
            }
            return p;
          })
          socket.emit('quantity_server_complete', {
            storageCode: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE,
            status: 'remove',
            ID: data.Payload.ID
          })
          socket.emit('che_operating_server_complete', {
            CLASS_CODE: this.state.isInOut,
            CREATE_DATE: data.Payload.CREATE_DATE,
            HOUSE_BILL: this.state.orderHeader.HOUSE_BILL ? this.state.orderHeader.HOUSE_BILL : "",
            BOOKING_FWD: this.state.orderHeader.BOOKING_FWD ? this.state.orderHeader.BOOKING_FWD : "",
            JOB_TYPE: 'NK',
            PALLET_NO: data.Payload.PALLET_NO,
            storageCode: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE,
            WAREHOUSE_CODE: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE
          });
          this.setState({
            isConfirmCheck: false,
            dataTablePallet: temp,
            orderHeader: {
              ...this.state.orderHeader,
              total_ACTUAL_CARGO_PIECE: totalActualCargoPiece
            },
            loadDataHousebillAndBooking: loadDataHousebillAndBooking
          });
          let tempTable = [...this.state.dataTablePallet];
          let totalCargoPiece = tempTable.map(item => parseFloat(item.ACTUAL_CARGO_PIECE || 0)).reduce((a, b) => a + b, 0)
          this.handleInsertToJOB_STOCK(dataSendJobStock);
          this.handleInsertToDT_Package_Stock(dataSendJobStock, totalCargoPiece);
          if (this.state.tempSelectedHouseBill.CARGO_PIECE === totalCargoPiece) {
            this.setState({
              isFinish: true,
              alert: {
                isOpen: true,
                message: 'Bạn đã kiểm đếm thành công!',
                type: 'success',
                duration: 2000
              }
            })
          } else {
            return;
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
  }

  handleConfirm() {
    let url = window.root_url + `dt-order/confirmOrder`;
    let dataSendHouseBill = {
      ORDER_NO: this.state.orderHeader.ORDER_NO,
      HOUSE_BILL: this.state.orderHeader.HOUSE_BILL ? this.state.orderHeader.HOUSE_BILL : "",
      BOOKING_FWD: this.state.orderHeader.BOOKING_FWD ? this.state.orderHeader.BOOKING_FWD : "",
      CLASS_CODE: this.state.isInOut,
      UPDATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
      CREATE_BY: JSON.parse(localStorage.getItem("userInfo")).name,
      WAREHOUSE_CODE: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE,
      NOTE: this.state.note,
    }
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
      body: JSON.stringify(dataSendHouseBill)
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
          let statusConfirm = this.state.loadDataHousebillAndBooking.map(item => {
            if (((item.HOUSE_BILL === response.Payload.HOUSE_BILL) || (item.BOOKING_FWD === response.Payload.BOOKING_FWD)) && item.ORDER_NO === response.Payload.ORDER_NO) {
              item.QUANTITY_CHK = true;
            };
            return item;
          });
          let confirmCheck = statusConfirm.every(item => item.QUANTITY_CHK === true)
          if (confirmCheck === true) {
            this.setState({
              quantityCheck: true
            })
          } else {
            this.setState({
              quantityCheck: false
            });
          }
          this.setState({
            dataTablePallet: [],
            loadDataHousebillAndBooking: statusConfirm,
            isFinish: false,
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message,
              type: "success"
            }
          });
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
        });
      })
      .catch(err => {

      });
  }

  handleConfirmCNTRNO() {
    let url = window.root_url + `job-gate/confirmOrder`;
    let dataSendCNTRNO = {
      ORDER_NO: this.state.truckHeader.ORDER_NO,
      TRUCK_NO: this.state.truckHeader.TRUCK_NO,
      CNTRNO: this.state.truckHeader.CNTRNO,
      CLASS_CODE: this.state.truckHeader.CLASS_CODE,
      CREATE_BY: JSON.parse(localStorage.getItem("userInfo")).name,
      WAREHOUSE_CODE: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE
    }
    let tempORDER_NO = this.state.truckHeader.ORDER_NO;
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
      body: JSON.stringify(dataSendCNTRNO)
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
          let tempTable = this.state.dataTableTruck.filter(p => p.ORDER_NO !== response.Payload.ORDER_NO)
          this.setState({
            dataTableTruck: tempTable,
            loadDataHousebillAndBooking: [],
            dataTablePallet: [],
            orderHeader: {},
            truckHeader: {},
            quantityCheck: false,
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message,
              type: "success"
            }
          });
          socket.emit('jobgate_server_complete', {
            ORDER_NO: tempORDER_NO,
            storageCode: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE
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
        });
      })
      .catch(err => {
        if (JSON.parse(err.message).error.statusCode === 401) {
          localStorage.clear();
          window.location.assign('/login');
        }
      });
  }

  //-----------------------------------
  render() {
    console.log(this.state.loadDataHousebillAndBooking);
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Grid container spacing={2} justifyContent="center">
          <Grid container item xs={12} justifyContent="center" >
            <Grid item xs={12} md={8}>
              <Card component="div">
                <CardContent>
                  <Stack component="div" direction="row" justifyContent="space-between">
                    <div style={{ display: "flex" }}>
                      <Typography component="b" variant="b">{this.state.storageHeader.storageInfo?.WAREHOUSE_NAME}</Typography>
                      <Divider sx={{ ml: 1, mr: 1 }} orientation="vertical" />
                      <Typography component="b" variant="b">{this.state.selectedEquipment.EQU_CODE_NAME}</Typography>
                      <Divider sx={{ ml: 1, mr: 1 }} orientation="vertical" />
                      <Typography component="b" variant="b">{this.state.isInOut === 1 ? "Hướng nhập" : "Hướng xuất"}</Typography>
                    </div>
                    <div style={{ display: "flex" }}>
                      <Divider sx={{ ml: 1, mr: 1 }} component="div" orientation="vertical" />
                      <Button
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          this.setState({
                            dialogStorage: {
                              isOpen: true
                            }
                          });
                        }}
                        variant="outlined" size="medium"
                      >Chọn Kho</Button>
                    </div>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Accordion expanded={this.state.actionStep === 'truck'} onChange={() => {
                  this.handleChange('truck')
                }}>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="truck-content"
                    id="truck-header"
                  >
                    <Grid container alignContent="center">
                      <Grid container justifyContent="space-between">
                        <Grid display="flex" item xs={8}>
                          <Grid item>
                            <Typography variant="span">
                              Số xe: {this.state.truckHeader.TRUCK_NO}
                            </Typography>
                          </Grid>
                          <Divider sx={{ mr: 1, ml: 1 }} orientation="vertical" flexItem />
                          {this.state.isInOut === 1
                            ? <Grid item>
                              <Typography variant="span">
                                Số Container: {this.state.truckHeader.CNTRNO}
                              </Typography>
                            </Grid>
                            : ""
                          }
                        </Grid>
                        {
                          this.state.quantityCheck === true &&
                          <Grid item xs={4} sx={{ display: 'contents' }}>
                            <Button
                              type="button"
                              variant="outlined"
                              sx={{ marginRight: "10px" }}
                              onClick={() => {
                                this.setState({
                                  dialogLoading: {
                                    isOpen: true
                                  }
                                });
                                this.handleConfirmCNTRNO();

                              }}
                            > Xác nhận</Button>
                          </Grid>
                        }
                      </Grid>
                      <Grid item xs={12}>
                        <Typography sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                          Thông tin xe vào cổng
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails sx={{ height: "40vh", overflowY: 'auto' }}>
                    <List component="nav" sx={{ bgcolor: 'background.paper' }}>
                      <ListSubheader>
                        <Grid container justifyItems="center">
                          {this.state.isInOut === 1
                            ? <Grid item xs={4} sx={{ textAlign: "center" }}>
                              <Typography variant="b" component="b">Số xe</Typography>
                            </Grid>
                            : <Grid item xs={6} sx={{ textAlign: "center" }}>
                              <Typography variant="b" component="b">Số xe</Typography>
                            </Grid>}
                          {this.state.isInOut === 1
                            ?
                            <Grid item xs={4} sx={{ textAlign: "center" }}>
                              <Typography variant="b" component="b">Số Container</Typography>
                            </Grid>
                            : ""}
                          {this.state.isInOut === 1
                            ?
                            <Grid item xs={4} sx={{ textAlign: "center" }}>
                              <Typography variant="b" component="b">Thời gian</Typography>
                            </Grid>
                            : <Grid item xs={6} sx={{ textAlign: "center" }}>
                              <Typography variant="b" component="b">Thời gian</Typography>
                            </Grid>
                          }
                        </Grid>
                      </ListSubheader>
                      {
                        this.state.dataTableTruck.map((item, i) => {
                          return (
                            <>
                              {i !== 0 ? <Divider /> : ""}
                              <ListItemButton
                                key={i}
                                selected={(
                                  Object.entries(this.state.truckHeader).length > 0 ?
                                    (this.state.truckHeader.CNTRNO === item.CNTRNO && this.state.truckHeader.TRUCK_NO === item.TRUCK_NO) : false
                                )}
                                onClick={() => {
                                  this.showHousebillAndBookingList(item);
                                }}
                              >
                                <Grid container spacing={1}>
                                  {this.state.isInOut === 1
                                    ? <Grid item xs={4} sx={{ textAlign: "center" }}>
                                      <Typography variant="b" component="b">{item.TRUCK_NO}</Typography>
                                    </Grid>
                                    : <Grid item xs={6} sx={{ textAlign: "center" }}>
                                      <Typography variant="b" component="b">{item.TRUCK_NO}</Typography>
                                    </Grid>
                                  }
                                  {this.state.isInOut === 1
                                    ? <Grid item xs={4} sx={{ textAlign: "center" }}>
                                      <Typography variant="b" component="b">{item.CNTRNO}</Typography>
                                    </Grid>
                                    : ""
                                  }

                                  {this.state.isInOut === 1
                                    ? <Grid item xs={4} sx={{ textAlign: "center" }}>
                                      <Typography variant="b" component="b">{item.TIME_IN}</Typography>
                                    </Grid>
                                    : <Grid item xs={6} sx={{ textAlign: "center" }}>
                                      <Typography variant="b" component="b">{item.TIME_IN}</Typography>
                                    </Grid>
                                  }
                                </Grid>
                              </ListItemButton>
                            </>
                          );
                        })
                      }
                    </List>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={this.state.actionStep === 'order'} onChange={() => {
                  this.handleChange('order')
                }}>
                  <AccordionSummary
                    sx={{ position: 'relative' }}
                    expandIcon={<ExpandMore />}
                    aria-controls="order-content"
                    id="order-header"
                  >
                    <Grid container alignContent="center" sx={{ marginTop: '1vh' }}>
                      <Grid container justifyContent="space-between" sx={{ position: 'relative' }}>
                        <Grid display="flex" item xs={7}>
                          {this.state.isInOut === 1
                            ? <Grid item>
                              <Typography variant="span">
                                House_Bill: {this.state.orderHeader.HOUSE_BILL}
                              </Typography>
                            </Grid>
                            : <Grid item>
                              <Typography variant="span">
                                Booking_FWD: {this.state.orderHeader.BOOKING_FWD}
                              </Typography>
                            </Grid>
                          }
                          <Divider sx={{ mr: 1, ml: 1, height: '2vh' }} orientation="vertical" flexItem />
                          <Grid item>
                            <Typography variant="span">
                              SL dự kiến: {this.state.orderHeader.CARGO_PIECE}
                            </Typography>
                          </Grid>
                          <Divider sx={{ mr: 1, ml: 1, height: '2vh' }} orientation="vertical" flexItem />
                          <Grid item>
                            <Typography variant="span">
                              SL thực tế: {this.state.orderHeader.total_ACTUAL_CARGO_PIECE}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={5}>
                          {
                            this.state.isFinish === true
                              ?
                              <Stack direction='row' spacing={1} sx={{ marginTop: '-1vh', marginRight: '10px', position: 'absolute', right: 0 }} alignItems='center'>
                                <Tooltip title={<p style={{ fontSize: '10px' }}>Ghi chú</p>} placement="top" sx={{ color: this.state.note && this.state.note.length > 0 ? '#0099ff' : '' }}>
                                  <EditIcon
                                    type="button"
                                    variant="outlined"
                                    onClick={() => {
                                      this.setState({
                                        noteDialog: {
                                          isOpen: true
                                        }
                                      })
                                    }}
                                  />
                                </Tooltip>
                                <Button
                                  sx={{ height: '100%' }}
                                  type="button"
                                  variant="outlined"
                                  onClick={() => {
                                    this.setState({
                                      dialogLoading: {
                                        isOpen: true
                                      }
                                    });
                                    this.handleConfirm();
                                  }}
                                > Xác nhận</Button>
                              </Stack>
                              : ''
                          }
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                          Thông tin hàng hóa
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails sx={{ height: "40vh", overflowY: 'auto' }}>
                    <List
                      component="nav"
                      sx={{ bgcolor: 'background.paper' }}
                      subheader={
                        <ListSubheader>
                          <Grid container justifyItems="center">
                            {this.state.isInOut === 1
                              ? <Grid item xs={4} sx={{ textAlign: "center" }}>
                                <Typography variant="b" component="b">House_Bill</Typography>
                              </Grid>
                              : <Grid item xs={4} sx={{ textAlign: "center" }}>
                                <Typography variant="b" component="b">Booking_FWD</Typography>
                              </Grid>
                            }
                            <Grid item xs={4} sx={{ textAlign: "center" }}>
                              <Typography variant="b" component="b">SL dự kiến</Typography>
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: "center" }}>
                              <Typography variant="b" component="b">SL thực</Typography>
                            </Grid>
                          </Grid>
                        </ListSubheader>
                      }
                    >
                      {
                        this.state.loadDataHousebillAndBooking.map((item, i) => {
                          return (
                            <>
                              {i !== 0 ? <Divider /> : ""}
                              {item.QUANTITY_CHK === true
                                ? <ListItemButton
                                  sx={{ backgroundColor: "#ccc" }}
                                  key={i}
                                  onClick={() => {
                                    const { tempSelectedHouseBill } = this.state;
                                    let dataSend;
                                    if (Object.keys(tempSelectedHouseBill).length > 0) {
                                      dataSend['unSelectData'] = {
                                        BOOKING_FWD: tempSelectedHouseBill.BOOKING_FWD,
                                        BOOKING_NO: tempSelectedHouseBill.BOOKING_NO,
                                        HOUSE_BILL: tempSelectedHouseBill.HOUSE_BILL,
                                        BILLOFLADING: tempSelectedHouseBill.BILLOFLADING,
                                        CNTRNO: tempSelectedHouseBill.CNTRNO,
                                        METHOD_CODE: tempSelectedHouseBill.METHOD_CODE,
                                        ORDER_NO: tempSelectedHouseBill.ORDER_NO,
                                        VOYAGEKEY: tempSelectedHouseBill.VOYAGEKEY,
                                      };

                                      socket.emit('tally_server_tallying', dataSend);
                                    };
                                    if (!item.inUse) {
                                      this.handleLoadPalletAPI(item);
                                      this.setState({
                                        isFinish: false
                                      });
                                    }
                                  }}
                                >
                                  <Grid container spacing={1}>
                                    {this.state.isInOut === 1
                                      ? <Grid item xs={4} sx={{ textAlign: "center" }}>
                                        <Typography variant="b" component="b">{item.HOUSE_BILL}</Typography>
                                      </Grid>
                                      : <Grid item xs={4} sx={{ textAlign: "center" }}>
                                        <Typography variant="b" component="b">{item.BOOKING_FWD}</Typography>
                                      </Grid>
                                    }
                                    <Grid item xs={4} sx={{ textAlign: "center" }}>
                                      <Typography variant="b" component="b">{item.CARGO_PIECE}</Typography>
                                    </Grid>
                                    <Grid item xs={4} sx={{ textAlign: "center" }}>
                                      <Typography variant="b" component="b">{item.total_ACTUAL_CARGO_PIECE}</Typography>
                                    </Grid>
                                  </Grid>
                                </ListItemButton>
                                : <ListItemButton
                                  key={i}
                                  selected={item.isChecked}
                                  onClick={() => {
                                    const { tempSelectedHouseBill, loadDataHousebillAndBooking } = this.state;
                                    const dataSend = {
                                      storageCode: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE,
                                      socketId: socket.id,
                                      selectedData: {
                                        BOOKING_FWD: item.BOOKING_FWD,
                                        BOOKING_NO: item.BOOKING_NO,
                                        HOUSE_BILL: item.HOUSE_BILL,
                                        BILLOFLADING: item.BILLOFLADING,
                                        CNTRNO: item.CNTRNO,
                                        METHOD_CODE: item.METHOD_CODE,
                                        ORDER_NO: item.ORDER_NO,
                                        VOYAGEKEY: item.VOYAGEKEY,
                                      },
                                    };

                                    if (Object.keys(tempSelectedHouseBill).length > 0) dataSend['unSelectData'] = {
                                      BOOKING_FWD: tempSelectedHouseBill.BOOKING_FWD,
                                      BOOKING_NO: tempSelectedHouseBill.BOOKING_NO,
                                      HOUSE_BILL: tempSelectedHouseBill.HOUSE_BILL,
                                      BILLOFLADING: tempSelectedHouseBill.BILLOFLADING,
                                      CNTRNO: tempSelectedHouseBill.CNTRNO,
                                      METHOD_CODE: tempSelectedHouseBill.METHOD_CODE,
                                      ORDER_NO: tempSelectedHouseBill.ORDER_NO,
                                      VOYAGEKEY: tempSelectedHouseBill.VOYAGEKEY,
                                    };

                                    socket.emit('tally_server_tallying', dataSend);
                                    let secondList = loadDataHousebillAndBooking.map(p => {
                                      if (
                                        p.BOOKING_FWD === item.BOOKING_FWD &&
                                        p.HOUSE_BILL === item.HOUSE_BILL &&
                                        p.ORDER_NO === item.ORDER_NO
                                      ) {
                                        p.isChecked = true;
                                      } else {
                                        p.isChecked = false;
                                      };
                                      return p;
                                    })
                                    this.setState({
                                      note: item.note,
                                      tempSelectedHouseBill: item,
                                      loadDataHousebillAndBooking: secondList
                                    })
                                    this.handleLoadPalletAPI(item);

                                    if (item.CARGO_PIECE === item.total_ACTUAL_CARGO_PIECE) {
                                      this.handleFinish();
                                    } else {
                                      this.setState({
                                        isFinish: false
                                      })
                                    }
                                  }}
                                  disabled={(item.inUse && !item.isChecked) ?? false}
                                >
                                  <Grid container spacing={1}>
                                    {this.state.isInOut === 1
                                      ? <Grid item xs={4} sx={{ textAlign: "center" }}>
                                        <Typography variant="b" component="b">{item.HOUSE_BILL}</Typography>
                                      </Grid>
                                      : <Grid item xs={4} sx={{ textAlign: "center" }}>
                                        <Typography variant="b" component="b">{item.BOOKING_FWD}</Typography>
                                      </Grid>
                                    }
                                    <Grid item xs={4} sx={{ textAlign: "center" }}>
                                      <Typography variant="b" component="b">{item.CARGO_PIECE}</Typography>
                                    </Grid>
                                    <Grid item xs={4} sx={{ textAlign: "center" }}>
                                      <Typography variant="b" component="b">{item.total_ACTUAL_CARGO_PIECE}</Typography>
                                    </Grid>
                                  </Grid>
                                </ListItemButton>
                              }
                            </>
                          );
                        })
                      }
                    </List>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={this.state.actionStep === 'detail'} onChange={() => {
                  this.handleChange('detail')
                }}>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="detail-content"
                    id="detail-header"
                  >
                    <Grid container alignContent="center">
                      <Grid container justifyContent="space-between">
                        <Grid display="flex">
                          <Grid item>
                            <Typography variant="span">
                              Kiểm đếm
                            </Typography>
                          </Grid>
                          <Divider sx={{ mr: 1, ml: 1 }} orientation="vertical" flexItem />
                          <Grid item>
                            <Typography variant="span">
                              SL thực tế: {this.state.orderHeader.total_ACTUAL_CARGO_PIECE}
                            </Typography>
                          </Grid>
                        </Grid>
                        {
                          this.state.orderHeader.total_ACTUAL_CARGO_PIECE !== this.state.orderHeader.CARGO_PIECE
                            ? <Grid>
                              <Button
                                type="button"
                                sx={{ marginRight: "10px" }}
                                onClick={() => {
                                  this.setState({
                                    dialogPallet: {
                                      isOpen: true,
                                    }
                                  })
                                }}
                                startIcon={<AddIcon />}
                              > Thêm số lượng</Button>
                            </Grid>
                            : ''
                        }
                      </Grid>
                      <Grid item xs={12}>
                        <Typography sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                          Thông tin kiểm đếm
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails sx={{ height: "40vh", overflowY: 'auto' }}>
                    <List component="nav" sx={{ bgcolor: 'background.paper' }}>
                      <ListSubheader>
                        <Grid container justifyItems="center">
                          <Grid item xs={6} sx={{ textAlign: "center" }}>
                            <Typography variant="b" component="b">Pallet</Typography>
                          </Grid>
                          <Grid item xs={2} sx={{ textAlign: "center" }}>
                            <Typography variant="b" component="b">Số lượng</Typography>
                          </Grid>
                          <Grid item xs={4} sx={{ textAlign: "center" }}>
                            <Typography variant="b" component="b">Xác nhận</Typography>
                          </Grid>
                        </Grid>
                      </ListSubheader>
                      {this.state.dataTablePallet.map((item, i) => {
                        return (
                          <>
                            {i !== 0 ? <Divider /> : ""}
                            <ListItemButton>
                              <Grid container spacing={1}>
                                <Grid item xs={6} sx={{ textAlign: "center" }}>
                                  <Typography variant="b" component="b">{item.PALLET_NO}</Typography>
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: "center" }} >
                                  <TextField
                                    id="so_luong"
                                    sx={{ width: "100px" }}
                                    size="small"
                                    value={item.ACTUAL_CARGO_PIECE}
                                    onChange={(e) => {
                                      if (item.IS_FINAL === true) {
                                        return;
                                      } else {
                                        let newValue = [...this.state.dataTablePallet]
                                        newValue[i].ACTUAL_CARGO_PIECE = Number(e.target.value)
                                        this.setState({
                                          numberOfTOTAL_CARGO_PIECE: Number(e.target.value),
                                        })
                                      }
                                    }}
                                  ></TextField>
                                </Grid>
                                <Grid item xs={4} sx={{ textAlign: "center" }}>
                                  <Checkbox
                                    checked={item.JOB_STATUS === 'C'}
                                    onChange={(e, value) => {
                                      if (item.JOB_STATUS === 'C') {
                                        return
                                      } else if (Number(item.ACTUAL_CARGO_PIECE) + (this.state.orderHeader.total_ACTUAL_CARGO_PIECE) > (this.state.orderHeader.CARGO_PIECE)) {
                                        this.setState({
                                          alert: {
                                            isOpen: true,
                                            message: 'Số lượng thực tế không được lớn hơn số lượng dự kiến!',
                                            duration: 5000,
                                            type: 'warning'
                                          },
                                        });
                                      } else if (Number(item.ACTUAL_CARGO_PIECE) === 0) {
                                        this.setState({
                                          alert: {
                                            isOpen: true,
                                            message: 'Số lượng nhập phải khác 0!',
                                            duration: 5000,
                                            type: 'warning'
                                          },
                                        })
                                      } else {
                                        this.setState({
                                          dialogLoading: {
                                            isOpen: true
                                          }
                                        })
                                        this.handleTally(e, i, item)
                                      }
                                    }}></Checkbox>
                                </Grid>
                              </Grid>
                            </ListItemButton>
                          </>
                        )
                      })}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* --------------- select storage dialog -------------- */}
        <Dialog
          open={this.state.dialogStorage.isOpen}
          scroll="paper"
          fullWidth={true}
          maxWidth="sm"
        >
          <DialogTitle variant="h5" sx={{ textAlign: 'center' }}>Chọn thiết bị</DialogTitle>
          <Divider />
          <DialogContent>
            <Card>
              <CardContent>
                <Grid item mt={1} md={12}>
                  <Tabs
                    sx={{ mb: 1 }}
                    value={this.state.isInOut}
                    onChange={(e, value) => {
                      this.setState({
                        storageHeader: {
                          CLASS_CODE: value,
                          ...this.state.storageHeader
                        },
                        isInOut: value,
                        dataTableTruck: [],
                        loadDataHousebillAndBooking: [],
                        dataTablePallet: []
                      });
                    }}
                    centered
                  >
                    <Tab key="methodIn" label="Hướng nhập" value={1} ></Tab>
                    <Tab key="methodOut" label="Hướng xuất" value={2}></Tab>
                  </Tabs>
                  <Divider />
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6}>
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
                        {this.state.dataStorage.map((item, indx) => {
                          return (
                            <>
                              <ListItem
                                key={item.WAREHOUSE_CODE + indx}
                                disablePadding
                                divider={(this.state.dataStorage.length - 1) === indx ? false : true}
                              >
                                <ListItemButton
                                  onClick={() => {
                                    const { storageHeader } = this.state;
                                    let storageHeaderTemp = storageHeader;
                                    storageHeaderTemp.storageInfo = item;
                                    this.setState({
                                      tempSelected: item.WAREHOUSE_CODE,
                                      storageHeader: storageHeaderTemp,

                                    })
                                    this.loadDevices(item.WAREHOUSE_CODE);
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
                    <Grid item xs={12} md={6} >
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
                              Chọn thiết bị
                            </ListSubheader>
                            <Divider />
                          </>
                        }
                      >
                        {this.state.dataDevicesDetails.map((item, index) => {
                          return (
                            <ListItem
                              key={item.EQU_CODE + index}
                              disablePadding
                              divider={(this.state.dataDevicesDetails.length - 1) === index ? false : true}
                            >
                              <ListItemButton
                                onClick={() => {
                                  let deviceInfo = {
                                    deviceName: item.EQU_CODE_NAME,
                                    deviceCode: item.EQU_CODE,
                                    deviceType: item.EQU_TYPE,
                                    storageCode: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE,
                                    storageName: this.state.storageHeader.storageInfo.WAREHOUSE_NAME,
                                    userName: this.userInfo.name,
                                    socketId: socket.id
                                  };
                                  this.SelectedDevice = item;
                                  socket.emit("server_login", deviceInfo);
                                  socket.emit("server_get_device_list", [deviceInfo])
                                }}
                                selected={item.EQU_CODE === this.state.selectedEquipment.EQU_CODE ? true : false}
                              >
                                <ListItemIcon>
                                  <DoorSliding />
                                </ListItemIcon>
                                <ListItemText primary={item.EQU_CODE_NAME} />
                              </ListItemButton>
                            </ListItem >
                          )
                        })}
                      </List>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </DialogContent >
          <DialogActions>
            <Button onClick={() => {
              this.setState({
                dialogStorage: {
                  isOpen: false,
                },
              })
            }}>Đóng</Button>
          </DialogActions>
        </Dialog>
        {/* ------------------------Enter the pallet data----------------------- */}
        <Backdrop
          sx={{ zIndex: 99 }}
          open={this.state.dialogLoading.isOpen}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Dialog
          open={this.state.dialogPallet.isOpen}
          scroll="paper"
          fullWidth={true}
          maxWidth="sm"
        >
          <Divider />
          <DialogContent>
            <Card>
              <CardContent>
                <Stack direction="column" spacing={2} >
                  <TextField
                    autoFocus
                    id="dialog-so-luong"
                    placeholder="Nhập số lượng..."
                    onChange={(event) => this.setState({
                      numberOfTOTAL_CARGO_PIECE: event.target.value > 0 ? event.target.value : 0,
                    })}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        if (Number(this.state.numberOfTOTAL_CARGO_PIECE) + (this.state.orderHeader.total_ACTUAL_CARGO_PIECE) > (this.state.orderHeader.CARGO_PIECE)) {
                          return;
                        } else {
                          this.handleAddNewPallet()
                          this.setState({ dialogPallet: { isOpen: false } })
                        }
                      }
                    }}
                  >
                  </TextField>
                </Stack>
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              this.setState({
                numberOfTOTAL_CARGO_PIECE: 0,
                dialogPallet: {
                  isOpen: false,
                },
              })
            }}>Đóng</Button>
            {(Number(this.state.numberOfTOTAL_CARGO_PIECE) + (this.state.orderHeader.total_ACTUAL_CARGO_PIECE) > (this.state.orderHeader.CARGO_PIECE))
              ? <Button disabled>Xác nhận</Button>
              : <Button onClick={() => {
                this.setState({
                  dialogPallet: {
                    isOpen: false,
                  },
                })
                this.handleAddNewPallet();
              }}>Xác nhận</Button>}
          </DialogActions>
        </Dialog>
        {
          this.state.noteDialog.isOpen
            ?
            <NotePopup
              dialog={this.state.noteDialog}
              preNote={this.state.loadDataHousebillAndBooking}
              data={this.state.tempSelectedHouseBill}
              handleSave={(value, params) => this.handleSaveNote(value, params)}
              handleCloseDialog={() => {
                this.setState({
                  noteDialog: {
                    isOpen: false
                  }
                })
              }}
            />
            : ''
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
      </Box >

    )
  }

  componentDidMount() {
    // ----------- socket listener --------------
    socket.on("client_login", (response) => {
      if (response.status) {
        this.loadTruck();
        this.setState({
          selectedEquipment: this.SelectedDevice,
          actionStep: 'truck',
          dialogStorage: {
            isOpen: false,
          }
        })
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

    socket.on("tally_client_savein", (response) => {
      const { dataTableTruck, isInOut } = this.state;
      if (response?.CLASS_CODE === isInOut) {
        response.isChecked = false;
        response.TIME_IN = moment(response.TIME_IN).format('DD/MM/YYYY HH:mm:ss:')
        let temp = this.createRows([response, ...dataTableTruck]);

        this.setState({
          dataTableTruck: temp
        });
      }
    });

    socket.on('tally_client_tallying', (response) => {
      const { loadDataHousebillAndBooking } = this.state;
      let temp = loadDataHousebillAndBooking.map(item => {
        if (response.includes(`${item.ORDER_NO}_${item.HOUSE_BILL ?? item.BOOKING_FWD}`)) {
          item.inUse = true;
        } else {
          item.inUse = false;
        };
        return item;
      });

      this.setState({
        loadDataHousebillAndBooking: temp
      })
    });

    // ------------------------------------------
    this.loadWarehouse();
  }

  componentWillUnmount() {
    const { tempSelectedHouseBill, storageHeader } = this.state;
    socket.emit('server_logout', {
      deviceName: this.state.selectedEquipment.EQU_CODE_NAME,
      deviceCode: this.state.selectedEquipment.EQU_CODE,
      deviceType: this.state.selectedEquipment.EQU_TYPE,
      socketId: socket.id
    });

    if (Object.keys(tempSelectedHouseBill).length > 0) {
      const dataSend = {
        storageCode: storageHeader.storageInfo?.WAREHOUSE_CODE,
        socketId: socket.id,
        unSelectData: {
          BOOKING_FWD: tempSelectedHouseBill.BOOKING_FWD,
          BOOKING_NO: tempSelectedHouseBill.BOOKING_NO,
          HOUSE_BILL: tempSelectedHouseBill.HOUSE_BILL,
          BILLOFLADING: tempSelectedHouseBill.BILLOFLADING,
          CNTRNO: tempSelectedHouseBill.CNTRNO,
          METHOD_CODE: tempSelectedHouseBill.METHOD_CODE,
          ORDER_NO: tempSelectedHouseBill.ORDER_NO,
          VOYAGEKEY: tempSelectedHouseBill.VOYAGEKEY,
        },
      };

      socket.emit('tally_server_tallying', dataSend);
    }
  }
}
export default TallySys;

