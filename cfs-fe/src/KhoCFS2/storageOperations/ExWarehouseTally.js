import moment from "moment";
import React from 'react';
import {
  Box,
  Button,
  Stack,
  Card,
  CardContent,
  Checkbox,
  Typography,
  Grid,
  ListItemIcon,
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
  Tooltip,
} from "@mui/material";
// import DecodeJWT from '../login/DecodeJWT'
import { DoorSliding, Warehouse } from "@mui/icons-material";
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import MuiAlert from '@mui/material/Alert';
import NotePopup from "../../componentsCFS2/dialog/NotePopup";
import Snackbar from '@mui/material/Snackbar';
import { ExpandMore } from "@mui/icons-material";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { socketServices } from "../../_services/socket.service";
import EditIcon from '@mui/icons-material/Edit';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const { socket } = socketServices;

class ExWarehouseTally extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFinish: false,
      isConfirmCheck: false,
      dataTableTruck: [],
      loadDataHousebillAndBooking: [],
      dataTablePallet: [],
      dataStorage: [],
      dataDevices: [],
      dataDevicesHeader: [],
      dataDevicesDetails: [],
      storageHeader: {
        CLASS_CODE: 0
      },
      selectedEquipment: {},
      note: '',
      noteDialog: {
        isOpen: false
      },
      truckHeader: {},
      orderHeader: {},
      isInOut: 1,
      numberOfTOTAL_CARGO_PIECE: '',
      wareHouseInfo: {},
      dialogStorage: {
        isOpen: true,
        data: null,
        type: 0,
      },
      palletData: {
        ESTIMATED_CARGO_PIECE: parseInt(0),
        PALLET_NO: '',
        isChecked: '',
      },
      confirmPopup: {
        isOpen: false,
      },
      dialogLoading: {
        isOpen: false,
      },
      tempSelectedHousebill: {},
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
      id: index,
      STT: index + 1,
      ...row
    }),
    );
  }

  handleChange(type) {
    this.setState({
      actionStep: type
    })
  }

  handleSaveNote(value, params) {
    if (value !== null && value !== undefined) {
      let temp = this.state.loadDataHousebillAndBooking.map(item => {
        if (item.HOUSE_BILL === params) {
          item.NOTE = value
        }
        return item;
      });
      this.setState({
        note: value,
        loadDataHousebillAndBooking: temp
      })
    }
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
          let grpData = data.Payload.map((p) => p.EQU_TYPE + "," + p.equimentTypeInfo.EQU_TYPE_NAME);
         [...new Set(grpData)].map((p) => {
            let dataSplt = p.split(',');
            let obj = {
              EQU_TYPE: dataSplt[0],
              EQU_TYPE_NAME: dataSplt[1],
            };
            return obj;
          })
          this.setState({
            dataDevicesDetails: data.Payload
          })
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


  handleAddNewPallet() {
    if (this.state.dataTablePallet) {
      let { dataTablePallet, palletData } = this.state;
      let tempPalletData = palletData
      tempPalletData.ACTUAL_CARGO_PIECE = Number(this.state.numberOfTOTAL_CARGO_PIECE)
      let newData = { ...tempPalletData, id: 0 }
      let temp = [...dataTablePallet]
      temp.push(newData)
      this.setState({
        dataTablePallet: temp
      })
    } else {
      let { dataTablePallet, palletData } = this.state;
      let tempPalletData = palletData
      tempPalletData.ACTUAL_CARGO_PIECE = Number(this.state.numberOfTOTAL_CARGO_PIECE)
      let newData = { ...tempPalletData, id: dataTablePallet.at(-1).id + 1 }
      let temp = [...dataTablePallet]
      temp.push(newData)
      this.setState({
        dataTablePallet: temp
      })
    }
  }

  showHousebillList(params) {
    if (!(this.state.truckHeader.CNTRNO === params.CNTRNO && this.state.truckHeader.TRUCK_NO === params.TRUCK_NO)) {
      let url = window.root_url + `dt-package-stock/viewEx`;
      this.setState({
        truckHeader: params
      });
      let dataSend = {
        ORDER_NO: params.ORDER_NO,
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
            let temp = this.createRows(data.Payload);
            temp.map(item => {
              item.isChecked = false;
              return item;
            })
            let confirmCheck = temp.every(item => item.QUANTITY_CHK === true)
            if (confirmCheck === true) {
              this.setState({
                quantityCheck: true
              })
            }
            this.setState({
              loadDataHousebillAndBooking: temp,
              dataTablePallet: [],
              actionStep: 'order',
              alert: {
                isOpen: true,
                type: "success",
                duration: 3000,
                message: data.Message
              },
            })

          } else {
            this.setState({
              loadDataHousebillAndBooking: [],
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

  showBookingFWD(params) {
    if (!(this.state.truckHeader.CNTRNO === params.CNTRNO && this.state.truckHeader.TRUCK_NO === params.TRUCK_NO)) {
      let url = window.root_url + `dt-package-stock/viewExExportWarehouse`;
      this.setState({
        truckHeader: params
      });
      let dataSend = {
        ORDER_NO: params.ORDER_NO,
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
            let temp = this.createRows(data.Payload);
            temp.map(item => {
              item.isChecked = false;
              return item;
            })
            let confirmCheck = temp.every(item => item.QUANTITY_CHK === true)
            if (confirmCheck === true) {
              this.setState({
                quantityCheck: true
              })
            }
            this.setState({
              loadDataHousebillAndBooking: temp,
              dataTablePallet: [],
              actionStep: 'order',
              alert: {
                isOpen: true,
                type: "success",
                duration: 3000,
                message: data.Message
              },
            })

          } else {
            this.setState({
              loadDataHousebillAndBooking: [],
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

  handleConfirmHouseBill() {
    let url = window.root_url + `dt-order/confirmOrderEx`;
    let dataSendHouseBill = {
      ORDER_NO: this.state.orderHeader.ORDER_NO,
      HOUSE_BILL: this.state.orderHeader.HOUSE_BILL ? this.state.orderHeader.HOUSE_BILL : "",
      BOOKING_FWD: this.state.orderHeader.BOOKING_FWD ? this.state.orderHeader.BOOKING_FWD : "",
      CLASS_CODE: this.state.orderHeader.CLASS_CODE === 1 ? 1 : 2,
      UPDATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
      CNTRNO: this.state.orderHeader.CNTRNO,
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
            if (item.ORDER_NO === response.Payload.ORDER_NO) {
              if ((item.HOUSE_BILL === response.Payload.HOUSE_BILL) || (item.BOOKING_FWD === response.Payload.BOOKING_FWD)) {
                item.QUANTITY_CHK = true;
              }
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

  handleLoadPalletHousebill(item) {
    let url = window.root_url + `check-quantity/viewEx`;
    this.setState({
      orderHeader: item
    })
    let dataSend = {
      VOYAGEKEY: item.VOYAGEKEY,
      HOUSE_BILL: item.HOUSE_BILL,
      CLASS_CODE: 1,
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
          })
        } else {
          this.setState({
            dataTablePallet: temp,
            actionStep: 'detail',
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
              message: JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }
  handleLoadPalletBooking(item) {
    let url = window.root_url + `check-quantity/viewExExportWarehouse`;
    this.setState({
      orderHeader: item
    })
    let dataSend = {
      VOYAGEKEY: item.VOYAGEKEY,
      BOOKING_FWD: item.BOOKING_FWD,
      CLASS_CODE: 2,
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

  loadTruck() {
    let url = window.root_url + `job-gate/getTruckViaWarehouse`;
    let dataSend = {
      CLASS_CODE: this.state.isInOut,
      METHOD_CODE: this.state.isInOut === 1 ? 'XKN' : 'XKX',
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
          })
          this.setState({
            dataTableTruck: temp,
            actionStep: 'truck',
            alert: {
              isOpen: true,
              type: "success",
              duration: 3000,
              message: data.Message
            },
          })
        } else {
          this.setState({
            dataTableTruck: [],
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
              message: JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }

  handleTally(event, newValue) {
    let { loadDataHousebillAndBooking, dataTablePallet } = this.state
    let url = window.root_url + `check-quantity/confirmPackedPalletEx`;
    let dataSend = {
      ID : newValue.ID,
      CLASS_CODE: newValue.CLASS_CODE,
      IS_FINAL: true,
      ORDER_NO: newValue.ORDER_NO,
      PALLET_NO: newValue.PALLET_NO,
      HOUSE_BILL: newValue.HOUSE_BILL,
      BOOKING_FWD: newValue.BOOKING_FWD,
      UPDATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
    };

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
      .then(response => {
        if (response.Status) {
          let tempHB = loadDataHousebillAndBooking;
          if (response.Payload.CLASS_CODE === 1) {
            tempHB.map(item => {
              dataTablePallet.map(newData => {
                if (item.HOUSE_BILL === newData.HOUSE_BILL && newData.ID === newValue.ID) {
                  if (item.total_ACTUAL_CARGO_PIECE === 0) {
                    item.total_ACTUAL_CARGO_PIECE = newData.ACTUAL_CARGO_PIECE;
                  } else {
                    item.total_ACTUAL_CARGO_PIECE += newData.ACTUAL_CARGO_PIECE;
                  }
                }
                return newData;
              });
              if (item.total_ACTUAL_CARGO_PIECE === item.CARGO_PIECE) {
                this.setState({
                  isFinish: true
                })
              }
              return item;
            });
          } else {
            tempHB.map(item => {
              dataTablePallet.map(newData => {
                if (item.BOOKING_FWD === newData.BOOKING_FWD && newData.ID === newValue.ID) {
                  if (item.total_ACTUAL_CARGO_PIECE === 0) {
                    item.total_ACTUAL_CARGO_PIECE = newData.ACTUAL_CARGO_PIECE;
                  } else {
                    item.total_ACTUAL_CARGO_PIECE += newData.ACTUAL_CARGO_PIECE;
                  }
                }
                return newData;
              });
              if (item.total_ACTUAL_CARGO_PIECE === item.CARGO_PIECE) {
                this.setState({
                  isFinish: true
                })
              }
              return item;
            });
          }
          let tempPallet = this.state.dataTablePallet;
          tempPallet.map(palletData => {
            if (palletData.ID === newValue.ID) {
              palletData.IS_FINAL = true;
            };
            return palletData;
          })
          this.setState({
            isConfirmCheck: false,
            loadDataHousebillAndBooking: tempHB,
            dataTablePallet: tempPallet,
            alert: {
              isOpen: true,
              message: response.Message
            }
          })
          socket.emit('quantity_server_complete', {
            storageCode: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE,
            status: 'remove',
            ID : newValue.ID
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

  handleConfirmCNTRNO() {
    let url = window.root_url + `job-gate/confirmOrder`;
    let dataSendCNTRNO = {
      ORDER_NO: this.state.truckHeader.ORDER_NO,
      VOYAGEKEY: this.state.truckHeader.VOYAGEKEY,
      CLASS_CODE: this.state.truckHeader.CLASS_CODE,
      HOUSE_BILL: this.state.truckHeader.HOUSE_BILL,
      BOOKING_NO: this.state.truckHeader.BOOKING_NO,
      TRUCK_NO: this.state.truckHeader.TRUCK_NO,
      CNTRNO: this.state.truckHeader.CNTRNO,
      CREATE_BY: JSON.parse(localStorage.getItem("userInfo")).name,
      WAREHOUSE_CODE: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE
    }
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
          let temp = this.state.dataTableTruck.filter(p => p.ORDER_NO !== this.state.truckHeader.ORDER_NO);
          this.setState({
            dataTableTruck: temp,
            quantityCheck: false,
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
        })
      })
      .catch(err => {
        if (JSON.parse(err.message).error.statusCode === 401) {
          localStorage.clear();
          window.location.assign('/login');
        }
      });
  }

  handleFinish() {
    this.setState({
      isFinish: true,
    })
  }

  //--------------------------
  render() {
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
                        <Grid display="flex">
                          <Grid item>
                            <Typography variant="span">
                              Số xe: {this.state.truckHeader.TRUCK_NO}
                            </Typography>
                          </Grid>

                          <Divider sx={{ mr: 1, ml: 1 }} orientation="vertical" flexItem />
                          <Grid item>
                            <Typography variant="span">
                              Số Container: {this.state.truckHeader.CNTRNO}
                            </Typography>
                          </Grid>
                        </Grid>
                        {
                          this.state.quantityCheck === true &&
                          <Grid>
                            <Button
                              type="button"
                              variant="outlined"
                              sx={{ marginRight: "10px" }}
                              onClick={() => {
                                this.setState({
                                  dialogLoading: {
                                    isOpen: true
                                  }
                                })
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
                          <Grid item xs={this.state.isInOut === 1 ? 6 : 4} sx={{ textAlign: "center" }}>
                            <Typography variant="b" component="b">Số xe</Typography>
                          </Grid>
                          {
                            this.state.isInOut === 2
                              ?
                              <Grid item xs={this.state.isInOut === 1 ? 6 : 4} sx={{ textAlign: "center" }}>
                                <Typography variant="b" component="b">Số container</Typography>
                              </Grid>
                              : ''
                          }
                          <Grid item xs={this.state.isInOut === 1 ? 6 : 4} sx={{ textAlign: "center" }}>
                            <Typography variant="b" component="b">Thời gian</Typography>
                          </Grid>
                        </Grid>
                      </ListSubheader>
                      {
                        this.state.dataTableTruck.map((item, i) => {
                          return (
                            <>
                              {i !== 0 ? <Divider /> : ""}
                              <ListItemButton
                                key={'truck' + i}
                                selected={(
                                  Object.entries(this.state.truckHeader).length > 0 ?
                                    (this.state.truckHeader.CNTRNO === item.CNTRNO && this.state.truckHeader.TRUCK_NO === item.TRUCK_NO) : false
                                )}
                                onClick={() => {
                                  if (this.state.isInOut === 1) {
                                    this.showHousebillList(item);
                                  } else {
                                    this.showBookingFWD(item);
                                  }
                                }}
                              >
                                <Grid container spacing={1}>
                                  <Grid item xs={this.state.isInOut === 1 ? 6 : 4} sx={{ textAlign: "center" }}>
                                    <Typography variant="b" component="b">{item.TRUCK_NO}</Typography>
                                  </Grid>
                                  {
                                    this.state.isInOut === 2
                                      ?
                                      <Grid item xs={this.state.isInOut === 1 ? 6 : 4} sx={{ textAlign: "center" }}>
                                        <Typography variant="b" component="b">{item.CNTRNO}</Typography>
                                      </Grid>
                                      : ''
                                  }
                                  <Grid item xs={this.state.isInOut === 1 ? 6 : 4} sx={{ textAlign: "center" }}>
                                    <Typography variant="b" component="b">{item.TIME_IN}</Typography>
                                  </Grid>
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
                      <Grid container justifyContent="space-between"  sx={{ position: 'relative' }}>
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
                                  type="button"
                                  variant="outlined"
                                  sx={{ marginRight: "10px", height: '100%' }}
                                  onClick={() => {
                                    this.setState({
                                      dialogLoading: {
                                        isOpen: true
                                      }
                                    });
                                    this.handleConfirmHouseBill();
                                  }}
                                > Xác nhận</Button>
                              </Stack>
                              : ''
                          }
                        </Grid>
                        <Grid item xs={12}>
                          <Typography sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                            Thông tin hàng hóa
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails sx={{ height: "40vh", overflowY: 'auto' }}>
                    <Box sx={{ backgroundColor: 'blue' }}>
                      <List component="nav" sx={{ bgcolor: 'background.paper' }}>
                        <ListSubheader>
                          <Grid container justifyItems="center">
                            {this.state.isInOut === 1
                              ? <Grid item xs={4} sx={{ textAlign: "center" }}>
                                <Typography variant="b" component="b">House_Bill</Typography>
                              </Grid>
                              : <Grid item xs={4} sx={{ textAlign: "center" }}>
                                <Typography variant="b" component="b">Booking_FWB</Typography>
                              </Grid>
                            }
                            <Grid item xs={4} sx={{ textAlign: "center" }}>
                              <Typography variant="b" component="b">SL tồn kho</Typography>
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: "center" }}>
                              <Typography variant="b" component="b">SL thực</Typography>
                            </Grid>
                          </Grid>
                        </ListSubheader>
                        {
                          this.state.loadDataHousebillAndBooking.map((item, i) => {
                            return (
                              <>
                                {i !== 0 ? <Divider /> : ""}
                                {item.QUANTITY_CHK === true
                                  ?
                                  <ListItemButton
                                    sx={{ backgroundColor: "#ccc" }}
                                    key={i}
                                    onClick={() => {
                                      if (this.state.isInOut === 1) {
                                        this.handleLoadPalletHousebill(item);
                                      } else {
                                        this.handleLoadPalletBooking(item);
                                      }
                                      this.setState({
                                        isFinish: false
                                      })
                                    }
                                    }
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
                                    selected={(
                                      Object.entries(this.state.orderHeader).length > 0 ?
                                        (this.state.orderHeader.HOUSE_BILL === item.HOUSE_BILL) : false
                                    )}
                                    onClick={() => {
                                      if (this.state.isInOut === 1) {
                                        this.handleLoadPalletHousebill(item)
                                      } else {
                                        this.handleLoadPalletBooking(item)
                                      }
                                      this.setState({
                                        note: item.NOTE,
                                        tempSelectedHousebill: item
                                      })
                                      if (item.CARGO_PIECE === item.total_ACTUAL_CARGO_PIECE) {
                                        this.handleFinish();
                                      } else {
                                        this.setState({
                                          isFinish: false
                                        })
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
                                }
                              </>
                            );
                          })
                        }
                      </List>
                    </Box>
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
                    <Grid container spacing={1}>
                      <Grid item >
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
                  </AccordionSummary>
                  <AccordionDetails sx={{ height: "40vh", overflowY: 'auto' }}>
                    <List component="nav" sx={{ bgcolor: 'background.paper' }}>
                      <ListSubheader>
                        <Grid container justifyItems="center">
                          <Grid item xs={4} sx={{ textAlign: "center" }}>
                            <Typography variant="b" component="b">Pallet</Typography>
                          </Grid>
                          <Grid item xs={4} sx={{ textAlign: "center" }}>
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
                            <ListItemButton key={i}>
                              <Grid container spacing={1}>
                                <Grid item xs={4} sx={{ textAlign: "center" }}>
                                  <Typography variant="b" component="b">{item.PALLET_NO}</Typography>
                                </Grid>
                                <Grid item xs={4} sx={{ textAlign: "center" }}>
                                  <Typography variant="b" component="b">{item.ACTUAL_CARGO_PIECE}</Typography>
                                </Grid>
                                <Grid item xs={4} sx={{ textAlign: "center" }}>
                                  <Checkbox
                                    disabled={item.IS_FINAL === true ? true : false}
                                    checked={item.IS_FINAL === true}
                                    onChange={(e, value) => {
                                      this.setState({
                                        confirmPopup: {
                                          isOpen: true,
                                          data: value,
                                          newValue: item,
                                          type: 2,
                                          message: 'Bạn có muốn xác nhận kiểm đếm ?'
                                        }
                                      })
                                    }}
                                  >
                                  </Checkbox>
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
        <Backdrop
          sx={{ zIndex: 99 }}
          open={this.state.dialogLoading.isOpen}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Dialog
          open={this.state.dialogStorage.isOpen}
          scroll="paper"
          fullWidth={true}
          maxWidth="sm"
        >
          <DialogTitle variant="h5">Chọn thiết bị</DialogTitle>
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
                    <Tab key="methodIn" label="Hướng nhập" value={1}></Tab>
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
                                key={item.WAREHOUSE_CODE}
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
                              key={item.WAREHOUSE_CODE}
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
                                  this.setState({
                                    dialogStorage: {
                                      isOpen: false,
                                    },
                                  })
                                  socket.emit("server_login", deviceInfo);
                                  socket.emit("server_get_device_list", [deviceInfo]);
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
        <ConfirmPopup
          dialog={this.state.confirmPopup}
          text={'XÁC NHẬN KIỂM ĐẾM'}
          handleCloseDialog={(type, newData) => {
            if (type === "agree") {
              this.setState({
                confirmPopup: {
                  isOpen: false
                }
              });
              this.handleTally(newData.data, newData.newValue);
            } else {
              this.setState({
                confirmPopup: {
                  isOpen: false
                }
              })
            }
          }}
        />
        {/* -------------------- global alert -------------------- */}
        {
          this.state.noteDialog.isOpen ?
            <NotePopup
              dialog={this.state.noteDialog}
              preNote={this.state.loadDataHousebillAndBooking}
              data={this.state.tempSelectedHousebill}
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

    socket.on("che_client_complete", (response) => {
      if (Object.keys(response.jobFromForkLiftToTally)) {
        if (response.jobFromForkLiftToTally.HOUSE_BILL) {
          if (response.jobFromForkLiftToTally.HOUSE_BILL === this.state.orderHeader.HOUSE_BILL) {
            let temp = this.state.dataTablePallet
            temp.push(response.jobFromForkLiftToTally)
            this.setState({
              dataTablePallet: temp,
            })
          }
        } else {
          if (response.jobFromForkLiftToTally.BOOKING_FWD === this.state.orderHeader.BOOKING_FWD) {
            let temp = this.state.dataTablePallet
            temp.push(response.jobFromForkLiftToTally)
            this.setState({
              dataTablePallet: temp,
            })
          }
        }
      }
    });
    // ------------------------------------------

    this.loadWarehouse();
  }

  componentWillUnmount() {
    socket.emit('server_logout', {
      deviceName: this.state.selectedEquipment.EQU_CODE_NAME,
      deviceCode: this.state.selectedEquipment.EQU_CODE,
      deviceType: this.state.selectedEquipment.EQU_TYPE,
      socketId: socket.id
    });
  }
}
export default ExWarehouseTally;

