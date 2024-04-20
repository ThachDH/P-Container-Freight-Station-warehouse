import * as React from "react";
import {
  Box,
  Button,
  Stack,
  Card,
  CardContent,
  Divider,
  Grid,
  Checkbox,
  Paper,
  DialogActions,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { DoorSliding, Warehouse } from "@mui/icons-material";
import Typography from '@mui/material/Typography';
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ArchiveSharpIcon from '@mui/icons-material/ArchiveSharp';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import AssignmentReturnedOutlinedIcon from '@mui/icons-material/AssignmentReturnedOutlined';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import UnarchiveSharpIcon from '@mui/icons-material/UnarchiveSharp';
import { socketServices } from "../../_services/socket.service";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const { socket } = socketServices;

/* --------------------------------- Start - Render các ô trong BLOCK  ------------------------------ */
const RenderStorage = (props) => {
  const { dataSource, selectedCell, selectedBlock } = props;
  const renderRows = (rowData) => {
    let bigestLine = 0;
    for (let i = 0; i < Object.entries(rowData).length; i++) {
      if (bigestLine < rowData[i].wareHouse_SLOT) {
        bigestLine = rowData[i].wareHouse_SLOT;
      }
    };
    let wareHouse_BLOCK = [];
    let Row = [];
    rowData.map((item, idx) => {
      item.id = idx;
      let cell = <Paper
        key={'Cell' + idx}
        id={item.wareHouse_PALLET_NO}
        elevation={6}
        sx={{ position: 'relative', borderStyle: 'outset', marginBottom: "5px", marginLeft: "5px", width: "208px", height: "110px", borderRadius: "10px", userSelect: 'none', cursor: "pointer", "&:hover": { backgroundColor: '#CFE8F3' } }}
        onClick={() => {
          if (selectedCell.isExport) {
            if (`${item.wareHouse_PALLET_NO}-${item.wareHouse_BLOCK}-${item.wareHouse_TIER}-${item.wareHouse_SLOT}` === `${selectedCell.PALLET_NO}-${selectedCell.BLOCK}-${selectedCell.TIER}-${selectedCell.SLOT}`) {
              props.handleExportJobs(item)
            }
          } else {
            props.handleMoveJobToBlock(item, `${item.wareHouse_BLOCK}-${item.wareHouse_TIER}-${item.wareHouse_SLOT}`);
          }
        }}
      >
        <Stack sx={{ width: '208px' }}>
          <Stack direction='row' spacing={0.5} sx={{ marginTop: 0.5, marginLeft: 0.5 }}>
            {
              item.wareHouse_STATUS === 0
                ?
                <AssignmentTurnedInOutlinedIcon fontSize="inherit" sx={{ fontSize: 24, color: '#18c5a9' }} />
                :
                item.wareHouse_STATUS === 1
                  ?
                  <AssignmentReturnOutlinedIcon fontSize="inherit" sx={{ fontSize: 24, color: '#b3b3b3' }} />
                  :
                  <AssignmentReturnedOutlinedIcon fontSize="inherit" sx={{ fontSize: 24, color: '#ff5c33' }} />
            }
            <Stack justifyContent={'center'} alignItems='end'>
              <Typography sx={{ fontSize: 13, marginTop: '-6px', fontWeight: 600, marginRight: '2px' }}>{`${item.wareHouse_BLOCK}-${item.wareHouse_TIER}-${item.wareHouse_SLOT}`}</Typography>
              <Divider orientation="horizontal" flexItem sx={{ width: '164px', borderBottomWidth: 2, backgroundColor: '#5c75c7' }} />
            </Stack>
          </Stack>
          {
            (item.wareHouse_HOUSE_BILL && item.wareHouse_HOUSE_BILL !== '') || (item.wareHouse_BOOKING_FWD && item.wareHouse_BOOKING_FWD !== '')
              ?
              <div style={{ color: `${item.wareHouse_PALLET_NO}-${item.wareHouse_BLOCK}-${item.wareHouse_TIER}-${item.wareHouse_SLOT}` === `${selectedCell.PALLET_NO}-${selectedCell.BLOCK}-${selectedCell.TIER}-${selectedCell.SLOT}` ? '#3399ff' : 'black', fontSize: 14 }}>
                <Stack style={{ marginLeft: 8 }}>
                  {
                    selectedCell.isExport && `${item.wareHouse_PALLET_NO}-${item.wareHouse_BLOCK}-${item.wareHouse_TIER}-${item.wareHouse_SLOT}` === `${selectedCell.PALLET_NO}-${selectedCell.BLOCK}-${selectedCell.TIER}-${selectedCell.SLOT}`
                      ?
                      <>
                        <ArrowCircleUpIcon className='blink-icon' sx={{ color: '#66ff99', display: 'block', top: '50%', left: '50%', position: 'absolute', marginTop: '-25px', marginLeft: '-24px', fontSize: '50px' }} />
                      </>
                      : ''
                  }
                  <Typography sx={{ fontWeight: 'bold' }}>HB: {item.wareHouse_HOUSE_BILL}</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>BK: {item.wareHouse_BOOKING_FWD}</Typography>
                  <Stack direction='row' spacing={2} justifyContent='space-between'>
                    <Typography sx={{ fontWeight: 'bold' }}>Số lượng: {item.wareHouse_CARGO_PIECE}</Typography>
                    {
                      item.wareHouse_JOB_TYPE ?
                        <Stack direction='row'>
                          <Divider orientation='vertical' flexItem sx={{ borderRightWidth: 2, backgroundColor: '#5c75c7', marginBottom: '2px' }} />
                          <Typography sx={{ marginLeft: '5px', marginRight: '10px', fontWeight: 'bold' }}>{item.wareHouse_JOB_TYPE}</Typography>
                        </Stack>
                        : ''
                    }
                  </Stack>
                </Stack>
                <Divider orientation="horizontal" flexItem sx={{ width: '200px', borderBottomWidth: 2, backgroundColor: '#5c75c7' }} />
                <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>{item.wareHouse_PALLET_NO}</Typography>
              </div>
              : ''
          }
        </Stack>
      </Paper>;
      Row = [
        ...Row, cell
      ];
      if (item.wareHouse_SLOT === bigestLine) {
        wareHouse_BLOCK = [
          <Stack spacing={1} direction="row" key={'wareHouse_BLOCK' + idx}>
            {Row}
          </Stack>
          , ...wareHouse_BLOCK
        ];
        Row = [];
      }
      return item;
    });
    return wareHouse_BLOCK;
  }

  return (
    <>
      <Card sx={{ border: 1, borderColor: "#c1dcf7", overflow: "auto", height: "calc(100vh - 150px)", marginTop: '10px' }} >
        <CardContent>
          {
            selectedBlock.map(block => {
              const data = dataSource.filter(x => x.wareHouse_BLOCK === block.BLOCK);
              return (
                <>
                  <Stack key={block.BLOCK}>
                    <Typography variant="h5"
                      sx={{ textAlign: "center", alignItems: "center", mt: "10px", mb: "10px", color: "#ff9800" }}
                    >
                      BLOCK {block.BLOCK} - SLOT : {data.length} -
                      CÒN: {data.filter(p =>
                        (p.wareHouse_HOUSE_BILL === '' || p.wareHouse_BOOKING_FWD === '')
                        && p.wareHouse_CARGO_PIECE === ''
                        && p.wareHouse_PALLET_NO === ''
                      ).length}
                    </Typography>
                  </Stack>
                  {renderRows(data)}
                </>
              )
            })
          }

        </CardContent>
      </Card>
    </>
  )
}
/* --------------------------------- END  ------------------------------ */

class ForkLift extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boxContainer: [],
      dataHolder: [],
      selectedJobs: {},
      selectedCell: {},
      tempSelected: '',
      dialogStep: 1,
      selectedItem: {},
      itemGroup: [],
      storageList: [],
      selectedStorage: {},
      selectedwareHouse_BLOCK: [],
      itemList: [],
      blockData: [],
      jobList: [],
      dialogItem: {
        isOpen: true
      },
      confirmPopup: {
        isOpen: false,
      },
      searchField: {
        PALLET_NO: '',
      },
      storageHeader: {},
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };

    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.tempSelectedDevice = {};

    this.createRows = (data) => {
      let returnData = [];
      let stt = 0;
      for (let i = 0; i < data.length; i++) {
        let checkIsset = returnData.findIndex(e => e.wareHouse_WAREHOUSE_CODE === data[i].wareHouse_WAREHOUSE_CODE && e.wareHouse_BLOCK === data[i].wareHouse_BLOCK);
        if (checkIsset > -1) {
          if (data[i].wareHouse_TIER > returnData[checkIsset]["wareHouse_TIER"]) {
            returnData[checkIsset]["wareHouse_TIER"] = data[i].wareHouse_TIER;
          }

          if (data[i].wareHouse_SLOT > returnData[checkIsset]["wareHouse_SLOT"]) {
            returnData[checkIsset]["wareHouse_SLOT"] = data[i].wareHouse_SLOT;
          }
        } else {
          stt++;
          returnData.push({
            STT: stt,
            wareHouse_WAREHOUSE_CODE: data[i].wareHouse_WAREHOUSE_CODE,
            wareHouse_BLOCK: data[i].wareHouse_BLOCK,
            wareHouse_TIER: 1,
            wareHouse_SLOT: 1,
            STATUS: 1,
            ID: data[i].wareHouse_WAREHOUSE_CODE + '-' + data[i].wareHouse_BLOCK,
            id: data[i].wareHouse_WAREHOUSE_CODE + '-' + data[i].wareHouse_BLOCK
          });
        }
      }
      return returnData;
    };
  }

  handleSelect(jobData) {
    let exportJobs = {
      ...jobData,
      isExport: true,
    };
    const elements = document.getElementById(jobData.PALLET_NO);
    console.log(elements);
    elements.scrollIntoView({behavior: 'auto', block:"center", inline: 'center'});
    this.setState({
      selectedCell: exportJobs,
    })
  }

  handleRowSelect(idx, status) {
    let { storageList } = this.state;
    let updateStatus = storageList;
    updateStatus[idx]['isChecked'] = status;
    this.setState({
      storageList: updateStatus,
    })
  }

  handleSelectItem(item) {
    let temp = item.BLOCK.split(",");
    let tempArr = []
    if (temp.length) {
      temp.map(e => {
        return tempArr.push({ BLOCK: e })
      })
    }
    this.setState({
      blockData: tempArr,
      selectedItem: item
    })
  }

  handleSave(temp, newData) {
    let { jobList, selectedJobs } = this.state;
    let dataSend = {
      ...this.state.selectedJobs,
      CLASS_CODE: Number(selectedJobs.CLASS_CODE),
      SLOT: newData.wareHouse_SLOT,
      TIER: newData.wareHouse_TIER,
      BLOCK: newData.wareHouse_BLOCK,
      CREATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
    };
    fetch(window.root_url + `pallet-stock/pushToWareHourse`, {
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
          let hideJobs = jobList.filter(p => p.PALLET_NO !== selectedJobs.PALLET_NO);
          let updated = temp.map(item => {
            if ((`${item.wareHouse_HOUSE_BILL}-${item.wareHouse_PALLET_NO}` === `${data.Payload.HOUSE_BILL}-${data.Payload.PALLET_NO}`) || `${item.wareHouse_BOOKING_FWD}-${item.wareHouse_PALLET_NO}` === `${data.Payload.BOOKING_FWD}-${data.Payload.PALLET_NO}`) {
              item.wareHouse_ID = data.Payload.ID;
            }
            return item;
          });
          this.setState({
            boxContainer: updated,
            selectedJobs: {},
            jobList: hideJobs,
            alert: {
              isOpen: true,
              message: data.Message,
              type: 'success',
              duration: 2000,
            }
          });
          socket.emit('che_operating_server_complete', {
            storageCode : this.state.storageHeader.storageInfo?.WAREHOUSE_CODE,
            cheItem : [{
              status : 'remove',
              PALLET_NO : data.Payload.PALLET_NO
            }]
          })
        } else {
          this.setState({
            alert: {
              isOpen: true,
              message: data.Message,
              duration: 2000,
              type: 'error',
            }
          });
          return;
        }
      }).catch(err => {
        console.log(err);
      });
  }

  handleLoadCell() {
    let dataSend = {
      WAREHOUSE_CODE: this.state.selectedItem.WAREHOUSE_CODE,
      BLOCK: this.state.blockData.filter(p => p.isChecked === true).map(item => item.BLOCK),
    };
    fetch(window.root_url + `bs-blocks/viewCell`, {
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
            boxContainer: response.Payload
          });
          this.handleLoadGoods();
        }
      }).catch(err => {
        console.log(err);
      });
  }

  handleLoadDevice(item) {
    let dataSend = {
      WAREHOUSE_CODE: item,
      EQU_TYPE: 'XN'
    };
    fetch(window.root_url + `/bs-equipments/getItem`, {
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
          this.setState({
            itemList: data.Payload,
          });
        }
      }).catch(err => {
        console.log(err)
      });
  }

  handleLoadGoods() {
    let dataSend = {
      WAREHOUSE_CODE: this.state.selectedItem.WAREHOUSE_CODE,
      BLOCK: this.state.blockData.filter(p => p.isChecked === true).map(item => item.BLOCK)
    }
    fetch(window.root_url + `job-stock/viewJobStock`, {
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
          let temp = data.Payload.map((item, idx) => {
            item.id = idx;
            return item;
          })
          this.setState({
            jobList: temp
          })
        } else {
          this.setState({
            jobList: [],
          })
        }
      }).catch(err => {
        console.log(err);
      });
  }

  handleMoveJobToBlock(data, cellName) {
    let { boxContainer, selectedJobs, selectedCell } = this.state;
    if (Object.keys(selectedJobs).length > 0) {
      let temp = [...boxContainer]
      if (data.wareHouse_HOUSE_BILL || data.wareHouse_BOOKING_FWD) {
        this.setState({
          alert: {
            isOpen: true,
            message: 'Ô bạn chọn không còn chổ trống!',
            type: 'error',
            duration: 2000,
          }
        })
        return;
      } else {
        temp.map(item => {
          if (`${item.wareHouse_BLOCK}-${item.wareHouse_TIER}-${item.wareHouse_SLOT}` === cellName) {
            item.wareHouse_HOUSE_BILL = selectedJobs.HOUSE_BILL;
            item.wareHouse_JOB_TYPE = selectedJobs.JOB_TYPE;
            item.wareHouse_PALLET_NO = selectedJobs.PALLET_NO;
            item.wareHouse_CARGO_PIECE = selectedJobs.ACTUAL_CARGO_PIECE;
            item.wareHouse_BOOKING_FWD = selectedJobs.BOOKING_FWD;
          }
          return item;
        });
      }
      this.handleSave(temp, data);
    } else {
      if (data.wareHouse_index === selectedCell.wareHouse_index) {
        this.setState({
          selectedCell: {},
        })
        return;
      };
      if (Object.keys(selectedCell).length > 0) {
        this.handleChangeCell(data);
      } else if (data.wareHouse_HOUSE_BILL !== undefined || data.wareHouse_BOOKING_FWD !== undefined) {
        if (data.wareHouse_HOUSE_BILL !== '' || data.wareHouse_BOOKING_FWD !== '') {
          let formatedData = {
            ...data,
            HOUSE_BILL: data.wareHouse_HOUSE_BILL,
            JOB_TYPE: data.wareHouse_JOB_TYPE,
            PALLET_NO: data.wareHouse_PALLET_NO,
            CARGO_PIECE: data.wareHouse_CARGO_PIECE,
            BOOKING_FWD: data.wareHouse_BOOKING_FWD,
            SLOT: data.wareHouse_SLOT,
            TIER: data.wareHouse_TIER,
            BLOCK: data.wareHouse_BLOCK,
            ID: data.wareHouse_ID,
          }
          this.setState({
            selectedCell: formatedData,
          })
        }
      }
    }
  }

  handleChangeCell(newData) {
    let { selectedCell, boxContainer } = this.state;
    if (newData.wareHouse_HOUSE_BILL || newData.wareHouse_BOOKING_FWD) {
      this.setState({
        alert: {
          isOpen: true,
          message: 'Ô bạn chọn không còn chổ trống!',
          type: 'error',
          duration: 2000,
        }
      });
      return;
    }
    let dataSend = {
      NewCell: {
        UPDATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
        BLOCK: newData.wareHouse_BLOCK,
        SLOT: newData.wareHouse_SLOT,
        TIER: newData.wareHouse_TIER,
        ID: selectedCell.ID,
      },
      OldCell: {
        UPDATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
        BLOCK: selectedCell.wareHouse_BLOCK,
        SLOT: selectedCell.wareHouse_SLOT,
        TIER: selectedCell.wareHouse_TIER,
        ID: selectedCell.ID,
      },
    };
    fetch(window.root_url + `pallet-stock/update`, {
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
          let temp = boxContainer.map(item => {
            if (item.wareHouse_index === newData.wareHouse_index) {
              item.wareHouse_JOB_TYPE = selectedCell.wareHouse_JOB_TYPE;
              item.wareHouse_BOOKING_FWD = selectedCell.wareHouse_BOOKING_FWD;
              item.wareHouse_HOUSE_BILL = selectedCell.wareHouse_HOUSE_BILL;
              item.wareHouse_PALLET_NO = selectedCell.wareHouse_PALLET_NO;
              item.wareHouse_CARGO_PIECE = selectedCell.wareHouse_CARGO_PIECE;
              item.wareHouse_ID = data.Payload.ID;
              item.wareHouse_STATUS = 1;
            }
            if (item.wareHouse_index === selectedCell.wareHouse_index) {
              item.wareHouse_JOB_TYPE = '';
              item.wareHouse_BOOKING_FWD = '';
              item.wareHouse_HOUSE_BILL = '';
              item.wareHouse_PALLET_NO = '';
              item.wareHouse_CARGO_PIECE = '';
              item.wareHouse_STATUS = 0;
            }
            return item;
          });
          this.setState({
            boxContainer: temp,
            selectedCell: {},
            alert: {
              isOpen: true,
              message: data.Message,
              type: 'success',
              duration: 2000,
            }
          });
          let changedCell = {
            storageCode: this.state.selectedStorage.storageCode,
            socketId: socket.id,
            data: temp,
          };
          socket.emit('che_server_change_position', changedCell);
        } else {
          this.setState({
            alert: {
              isOpen: true,
              message: data.Message,
              type: 'error',
              duration: 2000,
            }
          })
        }
      }).catch(err => {
        console.log(err);
      });
  }

  handleExportJobs(exportData) {
    let dataSend = {
      ID: exportData.wareHouse_ID,
      IDREF_STOCK: exportData.wareHouse_IDREF_STOCK,
      HOUSE_BILL: exportData.wareHouse_HOUSE_BILL,
      BOOKING_FWD: exportData.wareHouse_BOOKING_FWD,
      PALLET_NO: exportData.wareHouse_PALLET_NO,
      CARGO_PIECE: exportData.wareHouse_CARGO_PIECE,
      UNIT_CODE: exportData.wareHouse_UNIT_CODE,
      WAREHOUSE_CODE: exportData.wareHouse_WAREHOUSE_CODE,
      BLOCK: exportData.wareHouse_BLOCK,
      SLOT: exportData.wareHouse_SLOT,
      TIER: exportData.wareHouse_TIER,
      CREATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
    }
    fetch(window.root_url + `pallet-stock/confirmJobStock`, {
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
          let temp = this.state.boxContainer;
          temp.map(item => {
            if (item.id === exportData.id) {
              item.wareHouse_BOOKING_FWD = ''
              item.wareHouse_CARGO_PIECE = ''
              item.wareHouse_HOUSE_BILL = ''
              item.wareHouse_ID = ''
              item.wareHouse_JOB_TYPE = ''
              item.wareHouse_PALLET_NO = ''
              item.wareHouse_STATUS = 0
            }
            return item;
          });
          let hideExportedJobs = this.state.jobList.filter(p => p.PALLET_NO !== response.Payload.PALLET_NO);
          this.setState({
            jobList: hideExportedJobs,
            selectedCell: {},
            selectedJobs: {},
            alert: {
              isOpen: true,
              message: response.Message,
              duration: 2000,
              type: 'success',
            },
          });
          let job = {
            ACTUAL_CARGO_PIECE: response.Payload.ACTUAL_CARGO_PIECE,
            BOOKING_FWD: response.Payload.BOOKING_FWD,
            CLASS_CODE: response.Payload.CLASS_CODE,
            HOUSE_BILL: response.Payload.HOUSE_BILL,
            ORDER_NO: response.Payload.ORDER_NO,
            PALLET_NO: response.Payload.PALLET_NO,
          }
          let exportedJobs = {
            socketId: socket.id,
            storageCode: this.state.selectedStorage.storageCode,
            jobList: hideExportedJobs,
            jobFromForkLiftToTally: job,
            boxContainer: temp,
          };
          
          socket.emit('che_operating_server_complete', {
            storageCode : this.state.storageHeader.storageInfo?.WAREHOUSE_CODE,
            cheItem : [{
              status : 'remove',
              PALLET_NO : response.Payload.PALLET_NO
            }]
          })
          socket.emit("che_server_complete", exportedJobs);
          socket.emit("quantity_server_complete",{
            storageCode: this.state.storageHeader.storageInfo?.WAREHOUSE_CODE,
            ID : response.Payload.ID,
            ACTUAL_CARGO_PIECE: response.Payload.ACTUAL_CARGO_PIECE,
            CLASS_CODE: response.Payload.CLASS_CODE,
            CNTRNO: response.Payload.CNTRNO,
            ESTIMATED_CARGO_PIECE: response.Payload.ESTIMATED_CARGO_PIECE,
            ETA: response.Payload.ETA,
            ETD: response.ETD,
            HOUSE_BILL: response.Payload.HOUSE_BILL,
            BOOKING_FWD: response.Payload.BOOKING_FWD,
            INBOUND_VOYAGE: response.Payload.INBOUND_VOYAGE,
            OUTBOUND_VOYAGE: response.Payload.OUTBOUND_VOYAGE,
            METHOD_CODE: response.Payload.METHOD_CODE,
            SEQ : response.Payload.SEQ,
            TRUCK_NO: response.Payload.TRUCK_NO,
            VESSEL_NAME: response.Payload.VESSEL_NAME,
            VOYAGEKEY: response.Payload.VOYAGEKEY,
            WAREHOUSE_CODE :this.state.storageHeader.storageInfo?.WAREHOUSE_CODE
          })
        } else {
          this.setState({
            alert: {
              isOpen: true,
              message: response.Message,
              duration: 2000,
              type: 'error',
            }
          });
          return;
        }
      })
      .catch(err => {
        console.log(err);
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
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent='space-between' alignItems='center'>
                  <Stack spacing={2} direction='row' >
                    <Stack direction='row' spacing={0.5}>
                      <Typography variant="h5">
                        Tên kho:
                      </Typography>
                      <Typography variant="h5" sx={{ color: 'orange' }}>
                        {this.state.storageHeader.storageInfo?.WAREHOUSE_NAME}
                      </Typography>
                    </Stack>
                    <Stack direction='row' spacing={0.5}>
                      <Typography variant="h5">
                        Tên thiết bị:
                      </Typography>
                      <Typography variant="h5" sx={{ color: 'orange' }}>
                        {this.state.selectedItem.EQU_CODE_NAME}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction='row' spacing={2}>
                    <Button
                      type="button"
                      variant="outlined"
                      color='success'
                      startIcon={<ViewModuleIcon />}
                      onClick={() => {
                        this.setState({
                          dialogItem: {
                            isOpen: true
                          }
                        })
                      }}>
                      Chọn kho
                    </Button>
                  </Stack>
                </Stack>
                <Divider sx={{ marginTop: "6px" }} />
                {
                  this.state.boxContainer.length > 0
                    ?
                    <RenderStorage
                      handleExportJobs={(exportData) => {
                        this.setState({
                          confirmPopup: {
                            isOpen: true,
                            data: exportData,
                            type: 2,
                            message: 'Bạn có muốn hoàn tất công việc !?'
                          }
                        })
                      }}
                      selectedBlock={this.state.selectedwareHouse_BLOCK}
                      selectedCell={this.state.selectedCell}
                      handleMoveJobToBlock={(data, cellName) => this.handleMoveJobToBlock(data, cellName)}
                      dataSource={this.state.boxContainer}
                    />
                    : ''
                }
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card style={{ height: "76vh", position: "fixed", width: '32%', overflow: 'auto' }} >
              <CardContent>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant="h5">
                    Bảng danh sách công việc
                  </Typography>
                  <TextField
                    label='Tìm kiếm'
                    size='small'
                    onChange={(e) => {
                      this.setState({
                        searchField: {
                          PALLET_NO: e.target.value,
                        }
                      })
                    }} />
                </Stack>
                <Divider sx={{ marginTop: "6px" }} />
                {
                  this.state.jobList.length > 0
                    ?
                    this.state.jobList.filter(data => data.PALLET_NO?.toUpperCase()?.includes(this.state.searchField.PALLET_NO.toUpperCase())).map(item => {
                      return (
                        <Box>
                          <Card
                            sx={{ border: 1, borderColor: item.JOB_TYPE === 'XK' ? "#ff9800" : '#00ace6', "&:hover": { backgroundColor: '#CFE8F3', cursor: 'pointer' }, userSelect: 'none' }}
                            onClick={() => {
                              if (item.id === this.state.selectedJobs.id) {
                                this.setState({ selectedJobs: {}, selectedCell: {} });
                                return;
                              } else {
                                this.setState({ selectedJobs: item });
                              }
                              if (item.JOB_TYPE === 'XK') {
                                this.handleSelect(item);
                              }
                            }}
                          >
                            <CardContent sx={{ p: 0, '&:last-child': { padding: 0 } }}>
                              <Stack direction='row' spacing={2} alignItems='center'>
                                <Box sx={{ backgroundColor: item.id === this.state.selectedJobs.id ? '#80ff80' : item.JOB_TYPE === 'XK' ? "#ff9800" : '#00ace6' }}>
                                  {
                                    item.JOB_TYPE === 'XK'
                                      ? <UnarchiveSharpIcon sx={{ fontSize: "55px", color: 'white' }} />
                                      : <ArchiveSharpIcon sx={{ fontSize: "55px", color: 'white' }} />
                                  }
                                </Box>
                                <Stack >
                                  <Stack direction='row' alignItems='center' spacing={4}>
                                    {
                                      item.CLASS_CODE === 2
                                        ?
                                        <Typography variant="h6" fontWeight='bold'>
                                          Số Booking_FWD: {item.BOOKING_FWD}
                                        </Typography>
                                        :
                                        <Typography variant="h6" fontWeight='bold'>
                                          Số House_Bill: {item.HOUSE_BILL}
                                        </Typography>
                                    }
                                    <Typography variant="h6" fontWeight='bold'>
                                      {
                                        item.JOB_TYPE === 'NK'
                                          ? 'Nhập Kho'
                                          : 'Xuất Kho'
                                      }
                                    </Typography>
                                  </Stack>
                                  <Stack direction='row' spacing={2}>
                                    <Typography variant="h6" fontWeight='bold'>
                                      Số Pallet: {item.PALLET_NO}
                                    </Typography>
                                    {
                                      item.JOB_TYPE === 'XK'
                                        ?
                                        <Typography variant="h6" fontWeight='bold'>
                                          {`${item.BLOCK}-${item.TIER}-${item.SLOT}`}
                                        </Typography>
                                        : ''
                                    }
                                  </Stack>
                                </Stack>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Box>
                      )
                    })
                    : ''
                }
              </CardContent>
            </Card>
          </Grid >
        </Grid >
        {/* --------------------------------- Dialog chọn kho và BLOCK  ------------------------------ */}
        {
          this.state.dialogItem.isOpen
            ?
            <Dialog
              open={this.state.dialogItem.isOpen}
              scroll="paper"
              fullWidth={true}
              maxWidth="sm"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  this.setState({
                    dialogItem: {
                      isOpen: false,
                    }
                  })
                }
              }}
            >
              {
                <div>
                  <DialogTitle variant="h5" align="center">Chọn Kho</DialogTitle>
                  <DialogContent >
                    <Card>
                      <CardContent>
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
                              {this.state.storageList.map((item, indx) => {
                                return (
                                  <>
                                    <ListItem
                                      key={item.WAREHOUSE_CODE}
                                      disablePadding
                                      divider={(this.state.storageList.length - 1) === indx ? false : true}
                                    >
                                      <ListItemButton
                                        onClick={() => {
                                          const { storageHeader } = this.state;
                                          let storageHeaderTemp = storageHeader;
                                          storageHeaderTemp.storageInfo = item;
                                          this.setState({
                                            tempSelected: item.WAREHOUSE_CODE,
                                            storageHeader: storageHeaderTemp,
                                            selectedStorage: {
                                              storageCode: item.WAREHOUSE_CODE,
                                              storageName: item.WAREHOUSE_NAME,
                                            }
                                          })
                                          this.handleLoadDevice(item.WAREHOUSE_CODE);
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
                              {this.state.itemList.map((item, index) => {
                                return (
                                  <ListItem
                                    key={item.EQU_CODE}
                                    disablePadding
                                    divider={(this.state.itemList.length - 1) === index ? false : true}
                                  >
                                    <ListItemButton
                                      onClick={() => {
                                        let deviceInfo = {
                                          deviceName: item.EQU_CODE_NAME,
                                          deviceCode: item.EQU_CODE,
                                          deviceType: item.EQU_TYPE,
                                          storageCode: this.state.selectedStorage.storageCode,
                                          storageName: this.state.selectedStorage.storageName,
                                          userName: this.userInfo.name,
                                          socketId: socket.id
                                        };
                                        this.tempSelectedDevice = item;
                                        socket.emit("server_login", deviceInfo);
                                        socket.emit("server_get_device_list", [deviceInfo]);
                                      }}
                                      selected={item.EQU_CODE === this.state.selectedItem.EQU_CODE ? true : false}
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
                        <Divider flexItem sx={{ marginBottom: 2 }}> Danh sách dãy </Divider>
                        <div style={{ display: 'flex', flexWrap: "wrap", gap: '10px 20px', justifyContent: this.state.blockData.length <= 4 ? 'center' : '' }}>
                          {
                            this.state.blockData.map((item, index) => {
                              return (
                                <Paper
                                  key={'wareHouse_BLOCK' + index}
                                  align="center"
                                  sx={{ width: "90px", height: '40px', cursor: "pointer", "&:hover": { backgroundColor: '#CFE8F3' } }}
                                >
                                  <Stack direction='row' alignItems='center' justifyContent='center'>
                                    <Checkbox
                                      onChange={() => {
                                        item.isChecked === undefined
                                          ? (item.isChecked = true)
                                          : (item.isChecked = !item.isChecked);
                                        this.setState({
                                          blockData: this.state.blockData
                                        });
                                      }}
                                      checked={item.isChecked}
                                    ></Checkbox>
                                    {item.BLOCK}
                                  </Stack>
                                </Paper>
                              )
                            })
                          }
                        </div>
                      </CardContent>
                    </Card>
                  </DialogContent >
                </div>
              }
              <DialogActions>
                <Button
                  disabled={(Object.keys(this.state.selectedItem).length && this.state.blockData?.filter(p => p.isChecked === true).length) === 0 ? true : false}
                  variant="contained"
                  color='success'
                  onClick={() => {
                    let temp = this.state.blockData.filter(p => p.isChecked === true)
                    this.setState({
                      selectedwareHouse_BLOCK: temp,
                      dialogItem: {
                        isOpen: false
                      }
                    })
                    this.handleLoadCell();
                  }}>Chọn</Button>
                <Button onClick={() => {
                  this.setState({
                    dialogItem: {
                      isOpen: false,
                    }
                  })
                }}>Đóng</Button>
              </DialogActions>
            </Dialog >
            : ''

        }
        <ConfirmPopup
          dialog={this.state.confirmPopup}
          text={'XÁC NHẬN CÔNG VIỆC'}
          handleCloseDialog={(type, newData) => {
            if (type === "agree") {
              this.setState({
                confirmPopup: {
                  isOpen: false
                }
              });
              this.handleExportJobs(newData.data);
            } else {
              this.setState({
                confirmPopup: {
                  isOpen: false
                },
                selectedJobs: {},
                selectedCell: {},
              });
            }
          }}
        />
        {/* --------------------------------- End - Dialog chọn kho và BLOCK ------------------------------ */}
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
    );
  }

  componentDidMount() {
    // ----------- socket listener --------------
    socket.on("client_login", (response) => {
      if (response.status) {
        this.handleSelectItem(this.tempSelectedDevice);
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

    socket.on("tally_client_complete", (data) => {
      if (data) {
        let temp = this.state.jobList;
        temp.push(data.selectedData);
        let newTemp = temp.map((item, idx) => {
          item.id = idx;
          return item;
        });
        this.setState({
          jobList: newTemp,
          selectedJobs: {},
        });
      }
    });

    socket.on("che_client_change_position", (responses) => {
      if (responses) {
        this.setState({
          boxContainer: responses.data,
        });
      }
    });

    socket.on("che_client_complete", (response) => {
      if (response) {
        this.setState({
          jobList: response.jobList,
          boxContainer: response.boxContainer,
          selectedJobs: {},
          selectedCell: {},
        });
      }
    });

    socket.on("che_client_savein", (res) => {
      if (res) {
        let temp = [
          ...this.state.jobList,
          ...res,
        ]
        let newTemp = temp.map((item, idx) => {
          item.id = idx;
          return item;
        })
        this.setState({
          jobList: newTemp,
        })
      }
    })

    socket.on("client_logout", (response) => {
      if (response.deviceType === 'XN') {
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
      }
    })

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

  componentWillUnmount() {
    socket.emit('server_logout', [{
      deviceName: this.state.selectedItem.EQU_CODE_NAME,
      deviceCode: this.state.selectedItem.EQU_CODE,
      socketId: socket.id
    }]);
  }
}
export default ForkLift;