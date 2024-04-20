
import * as React from "react";
import * as moment from "moment";
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from '@mui/icons-material/Save';
import ExportCSV from "../../components/caiDat/ExportCSV";
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Stack,
  Card,
  CardContent,
  Autocomplete,
  Divider,
  Grid,
  Checkbox,
  TextField,
  Radio,
  FormControl,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import SelectVessel from "../../componentsCFS2/dialog/SelectVessel"
import AddRows from "../../componentsCFS2/dialog/AddRows";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class FluctuateContainerInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmPopup: {
        isOpen: false,
      },
      data: {
        Cnt: '',
        CLASS_CODE: 1,
        GET_IN: '',
        GET_OUT: '',
      },
      isInOut: "in",
      dataTable: [],
      ItemMethodCodeIn: [],
      ItemMethodCodeOut: [],
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
      },
      vessel: {},
      newRowData: {
        MT_OR_BK: null,
        CNTRNO: '',
        CNTRSZTP: '',
        SEALNO: null,
        CHK_FE: null,
        GET_IN: null,
        JOBMODE_IN: null,
        CLASS_CODE: '',
        NATUREOFTRANSPORT: null,
        VOYAGEKEY: '',
        GET_OUT: null,
        JOBMODE_OUT: null,
        COMMODITYDESCRIPTION: null,
        CONTAINERLOCATION: null,
        TLHQ: null,
        CHK_LCL: null,
        CARGO_WEIGHT: null,
        GETOUT_TRUCK: null,
      },
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    }
    this.columns = [
      {
        field: "Action",
        headerName: "Chọn",
        type: "actions",
        width: 80,
        getActions: (params) => {
          return [
            <Checkbox onChange={(e) => {
              this.rowSelectHandle(params.row.STT - 1, e.target.checked);
            }}
              checked={
                params.row.isChecked
              } ></Checkbox>
          ];
        }
      },
      {
        field: "STT",
        headerName: "STT",
        editable: true,
        width: 80,
        align: "center",
        headerAlign: "center"
      },
      {
        field: 'MT_OR_BK',
        headerName: 'Số vận đơn / Booking(*)',
        editable: true,
        width: 200,
        align: "center",
        headerAlign: "center",
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: 'CNTRNO',
        headerName: 'Số container',
        editable: true,
        width: 100,
        align: "center",
        headerAlign: "center",
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: 'CLASS_CODE',
        headerName: 'Hướng (*)',
        editable: true,
        width: 80,
        align: 'center',
        headerAlign: 'center',
        type: 'singleSelect',
        valueOptions: [{ label: 'Nhập', value: 1 }, { label: 'Xuất', value: 2 }],
        renderCell: (item) => {
          if (item.value === 1) {
            item.value = 'Nhập'
          } else if (item.value === 2) {
            item.value = 'Xuất'
          }
          return item.value
        }
      },
      {
        field: "CNTRSZTP",
        headerName: "Size Type (*)",
        editable: true,
        width: 150,
        align: "center",
        headerAlign: "center",
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "SEALNO",
        headerName: "Số niêm chì (*)",
        editable: true,
        width: 150,
        align: "center",
        headerAlign: "center",
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "CHK_FE",
        headerName: "Hàng / Rỗng (*)",
        editable: true,
        width: 80,
        align: "center",
        headerAlign: "center",
        type: 'singleSelect',
        valueOptions: [{ label: 'Hàng', value: true }, { label: 'Rỗng', value: false }],
        renderCell: (item) => {
          if (item.value === true) {
            item.value = 'Hàng'
          } else if (item.value === false) {
            item.value = 'Rỗng'
          }
          return item.value;
        }
      },
      {
        field: "GET_IN",
        headerName: "Ngày vào bãi",
        editable: true,
        width: 150,
        type: 'dateTime',
        align: "center",
        headerAlign: "center"
      },
      {
        field: "JOBMODE_IN",
        headerName: "Phương án vào (*)",
        editable: true,
        type: 'singleSelect',
        width: 120,
        align: "center",
        headerAlign: "center",
        renderEditCell: (params) => {
          let CodeItem = '';
          return [
            <Autocomplete
              style={{ width: "100%" }}
              id="clear-on-escape"
              clearOnEscape
              options={this.state.ItemMethodCodeIn || []}
              onChange={(e, value) => {
                if (value) {
                  params.row.JOBMODE_IN = value;
                  CodeItem = value;
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  params.formattedValue = CodeItem;
                }
              }}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  multiline
                  {...params} variant="outlined" />
              )}
            />
          ]
        }
      },
      {
        field: "NATUREOFTRANSPORT",
        headerName: "Loại hình vận chuyển",
        type: 'singleSelect',
        editable: true,
        valueOptions: [{ label: 'TI', value: 'TI' }, { label: 'TO', value: 'TO' }, { label: 'TS', value: 'TS' }],
        width: 150,
        align: "center",
        headerAlign: "center",
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "GET_OUT",
        type: 'dateTime',
        headerName: "Ngày ra bãi",
        editable: true,
        width: 150,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "JOBMODE_OUT",
        headerName: "Phương án ra",
        editable: true,
        type: 'singleSelect',
        width: 120,
        align: "center",
        headerAlign: "center",

        renderEditCell: (params) => {
          let CodeItem = '';
          return [
            <Autocomplete
              style={{ width: "100%" }}
              id="clear-on-escape"
              clearOnEscape
              options={this.state.ItemMethodCodeOut || []}
              onChange={(e, value) => {
                if (value) {
                  params.row.JOBMODE_OUT = value;
                  CodeItem = value;
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  params.formattedValue = CodeItem;
                }
              }}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  multiline
                  {...params} variant="outlined" />
              )}
            />
          ]
        }
      },
      {
        field: "COMMODITYDESCRIPTION",
        headerName: "Mô tả hàng hoá (*)",
        editable: true,
        width: 200,
        align: "center",
        headerAlign: "center",
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "CONTAINERLOCATION",
        headerName: "Vị trí Container (*)",
        editable: true,
        width: 100,
        align: "center",
        headerAlign: "center",
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "ISLOCALFOREIGN",
        headerName: "Nội/Ngoại (*)",
        editable: true,
        width: 80,
        align: "center",
        headerAlign: "center",
        type: 'singleSelect',
        valueOptions: [{ label: 'Nội', value: 'L' }, { label: 'Ngoại', value: 'F' }],
        renderCell: (item) => {
          if (item.value === 0) {
            item.value = 'L'
          } else if (item.value === 1) {
            item.value = 'F'
          }
          return item.value;
        }
      },
      {
        field: "CHK_LCL",
        headerName: "LCL",
        type: 'boolean',
        editable: true,
        getActions: (params) => {
          return params.value;
        },
        width: 80,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "CARGO_WEIGHT",
        headerName: "Trọng lượng (*)",
        editable: true,
        width: 80,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "GETOUT_TRUCK",
        headerName: "BKS Phương tiện vận chuyển ",
        editable: true,
        width: 200,
        align: "center",
        headerAlign: "center",
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
    ];

    this.createRows = (data) => data.map((row, index) => {
      if (row.CLASS_CODE === 1) {
        return ({
          MT_OR_BK: row.BILLOFLADING,
          id: index,
          STT: index + 1,
          ...row
        })
      } else {
        return ({
          MT_OR_BK: row.BOOKING_NO,
          id: index,
          STT: index + 1,
          ...row
        })
      }
    }
    );
  }

  selectedVessel(data) {
    if (data) {
      let newData = { ...data }
      this.setState({
        vessel: newData,
        dataTable: []
      })
    }
  }

  rowSelectHandle(idx, status) {
    const { dataTable } = this.state;
    let updateData = dataTable;
    updateData[idx]['isChecked'] = status;
    this.setState({
      dataTable: updateData
    })
  }

  handleAddRow(rowCount) {
    let { dataTable } = this.state;
    let newRow = [];
    if (this.state.vessel.VOYAGEKEY) {
      for (let i = 0; i < rowCount; i++) {
        let newData = {
          ...this.state.newRowData,
          status: 'insert',
        }
        newRow.push(newData);
      }
      let mergeDataTable = [...newRow, ...dataTable];
      mergeDataTable.map((item, index) => {
        item.id = index;
        item.STT = index + 1;
        return item;
      });
      this.setState({
        dataTable: mergeDataTable,
        alert: {
          isOpen: true,
          type: "success",
          duration: 2000,
          message: "Thêm dòng thành công",
        }
      })
    } else {
      this.setState({
        alert: {
          isOpen: true,
          duration: 2000,
          message: 'Vui lòng chọn tàu chuyến!',
          type: 'warning'
        }
      })
    }
  }

  componentDidMount() {
    this.handleLoadVessel();
    this.LoadMethodCode();
  }

  handleLoadVessel() {
    let url = window.root_url + `dt-vessel-visits/view`;
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
        let arr = []
        data.map(item => {
          return arr.push({
            VESSEL_NAME: item.VESSEL_NAME,
            VOYAGEKEY: item.VOYAGEKEY,
          })
        })
        this.setState({
          vessel: arr
        })
      })
      .catch(err => {
        console.log(err)
      });
  }

  handleDelete() {
    let url = window.root_url + `dt-cntr-stocks/delete`;
    let { dataTable } = this.state;
    let dataSend = dataTable.filter(p => p.isChecked === true && p.status !== "insert").map(item => {
      let obj = {};
      obj["ID"] = item.ID;
      return obj;
    });

    if (!dataSend.length) {
      let clearedData = dataTable.filter(p => p.status === "insert" && p.isChecked !== true);
      clearedData = clearedData.map((item, i) => {
        item.STT = i + 1;
        return item;
      });
      this.setState({ dataTable: clearedData });
      return;
    }
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
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
      .then(response => {
        if (response.Status) {
          let temp = dataTable.filter(p => p.isChecked !== true);
          temp = temp.map((item, idx) => {
            item.STT = idx + 1;
            return item;
          });
          this.setState({
            dataTable: temp,
            alert: {
              isOpen: true,
              message: response.Message,
              duration: 2000,
              type: 'success',
            }
          })
        } else {
          this.setState({
            dataTable: dataTable,
            alert: {
              isOpen: true,
              message: response.Message ? response.Message : 'Vui lòng cung cấp ID trước khi xoá',
              duration: 2000,
              type: 'warning',
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

  handleInsertOrUpdate() {
    let url = window.root_url + `dt-cntr-stocks/insertAndUpdate`;
    let { dataTable } = this.state;
    let checkColumn = {
      VOYAGEKEY: "Key tàu",
      MT_OR_BK: "Số vận đơn",
      CNTRSZTP: "Size Type",
      CNTRNO: "Số cont",
      SEALNO: "Số niệm chỉ",
      CLASS_CODE: "Hướng",
      JOBMODE_IN: "Phương án vào",
      COMMODITYDESCRIPTION: "Mô tả hàng hóa",
      CONTAINERLOCATION: "Vị trí",
      ISLOCALFOREIGN: "Nội ngoại",
      CARGO_WEIGHT: "Trọng lượng",
    };
    let arr = [];
    let dataSend = dataTable.filter(p => p.status === 'insert' || p.status === 'update').map(data => {
      data[data.status === 'insert' ? 'CREATE_BY' : 'UPDATE_BY'] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
      data[data.CLASS_CODE === 1 ? 'BILLOFLADING' : 'BOOKING_NO'] = data.MT_OR_BK;
      data['GET_IN'] = data.GET_IN ? moment(data.GET_IN, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : null;
      data['GET_OUT'] = data.GET_OUT ? moment(data.GET_OUT, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : null;
      data.VOYAGEKEY = this.state.vessel.VOYAGEKEY
      Object.keys(data).map((key) =>{
        if (!data[key]) {
          delete data[key];
        }
        return key;
      })
      if (arr.length === 0) {
        Object.keys(checkColumn).map((key) => {
          return !data[key] ? arr.push(checkColumn[key]) : [];
        });
      }
      return data;
    });
    if (arr.length > 0) {
      this.setState({
        alert: {
          isOpen: true,
          duration: 3000,
          message: arr.join(', ') + " không được để trống",
          type: "error"
        }
      })
      return;
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
          let newDatas = dataTable.map((item, index) => {
            item['GET_IN'] = item.GET_IN ? moment(item.GET_IN, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY HH:mm:ss') : '';
            item['GET_OUT'] = item.GET_OUT ? moment(item.GET_OUT, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY HH:mm:ss') : '';
            item.id = index;
            let returnValue = response.Payload.find(p => p.CNTRNO === item.CNTRNO
              && (p.BILLOFLADING === item.MT_OR_BK || p.BOOKING_NO === item.MT_OR_BK));
            if (returnValue !== undefined) {
              item.ID = returnValue.ID
              delete item.status;
            }
            return item;
          });
          this.setState({
            dataTable: newDatas,
            alert: {
              isOpen: true,
              message: response.Message,
              type: 'success',
              duration: 2000,
            }
          })
        } else {
          let returnValue = [];
          response.Payload.map((item) => {
            returnValue = dataTable.filter(p => p.VESSEL_NAME !== item.VESSEL_NAME
              && p.INBOUND_VOYAGE !== item.INBOUND_VOYAGE
              && p.OUTBOUND_VOYAGE !== item.OUTBOUND_VOYAGE
              && p.CallSign !== item.CallSign
              && p.IMO !== item.IMO);
            return returnValue;
          });
          let dataNews = returnValue.map((itm, idx) => {
            itm['STT'] = idx + 1;
            itm['id'] = idx.id;
            itm['MT_OR_BK'] = itm.CLASS_CODE === 1 ? itm.BILLOFLADING : itm.BOOKING_NO;
            itm['GET_IN'] = itm.GET_IN ? moment(itm.GET_IN, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY HH:mm:ss') : '';
            itm['GET_OUT'] = itm.GET_OUT ? moment(itm.GET_OUT, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY HH:mm:ss') : '';
            itm['CLASS_CODE'] = itm.CLASS_CODE === 1 ? 'Nhập' : 'Xuất';
            itm['ISLOCALFOREIGN'] = itm.ISLOCALFOREIGN === 'F' ? 'Ngoại' : 'Nội';
            return itm;
          });
          this.setState({
            dataTable: dataNews,
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message,
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

  handleViewData() {
    let url = window.root_url + `dt-cntr-stocks/getItem`;
    let dataSend = {
      VOYAGEKEY: this.state.vessel.VOYAGEKEY,
      CLASS_CODE: this.state.CLASS_CODE ? this.state.CLASS_CODE : 1,
      CNTRNO: this.state.data.Cnt,
      // _from: this.state.data.fromDate,
      // _to: this.state.data.toDate,
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
      .then(response => {
        if (response.Status) {
          let newTemp = response.Payload.map(item => {
            item.GET_IN = item.GET_IN ? moment(item.GET_IN, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY HH:mm:ss') : '';
            item.GET_OUT = item.GET_OUT ? moment(item.GET_OUT, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/YYYY HH:mm:ss') : '';
            return item;
          })
          let temp = this.createRows(newTemp);
          this.setState({
            dataTable: temp,
            alert: {
              isOpen: true,
              type: "success",
              duration: 3000,
              message: response.Message,
            },
          })
        }
        else {
          this.setState({
            dataTable: [],
            alert: {
              type: 'warning',
              message: response.Message,
              duration: 3000,
              isOpen: true
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
              message: JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }

  LoadMethodCode() {
    let url = window.root_url + `bs-method/view`;
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
      .then(response => {
        if (response.Status) {
          let arrIn = [];
          let arrOut = [];
          if (response.Payload.length) {
            response.Payload.map(item => {
              if (item.IS_IN_OUT === "Vào") {
                 arrIn.push(item.METHOD_CODE);
              }
              return arrIn;
            });
            response.Payload.map(item => {
              if (item.IS_IN_OUT === "Ra") {
                arrOut.push(item.METHOD_CODE);
              }
              return arrOut;
            });
            this.setState({
              ItemMethodCodeIn: arrIn,
              ItemMethodCodeOut: arrOut,
            })
          } else {
            return;
          }
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

  //Thoilc(*Note)-Lấy dữ liệu từ TOS
  handleTos() {
    let url = window.root_url + `dt-cntr-stocks/CFStoVTOS_getCntrStock`;
    let dataSend = {
      VOYAGEKEY: this.state.vessel.VOYAGEKEY,
      TOS_SHIPKEY: this.state.vessel.TOS_SHIPKEY,
      CLASS_CODE: this.state.CLASS_CODE ? this.state.CLASS_CODE : 1,
      CNTRNO: this.state.data.Cnt,
      // fromDate: moment(this.state.data.fromDate, "DD/MM/YYYY").format('YYYY-MM-DD'),
      // toDate: moment(this.state.data.toDate, "DD/MM/YYYY").format('YYYY-MM-DD'),
      CREATE_BY: JSON.parse(localStorage.getItem("userInfo")).name,
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
      .then(response => {
        if (response.Status) {
          if (response.Payload.length) {
            let newTemp = response.Payload.map(item => {
              item.status = "insert";
              item.GET_IN = item.GET_IN ? moment(item.GET_IN).format('DD/MM/YYYY HH:mm:ss') : '';
              item.GET_OUT = item.GET_OUT ? moment(item.GET_OUT).format('DD/MM/YYYY HH:mm:ss') : '';
              return item;
            })
            let temp = this.createRows(newTemp);
            this.setState({
              dataTable: temp,
              alert: {
                isOpen: true,
                type: "success",
                duration: 2000,
                message: response.Message,
              },
            });
          } else {
            this.setState({
              dataTable: [],
              alert: {
                isOpen: true,
                duration: 3000,
                message: response.Message,
                type: 'warning',
              }
            });
          }
        }
        else {
          this.setState({
            dataTable: [],
            alert: {
              type: 'warning',
              message: response.Message,
              duration: 3000,
              isOpen: true
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
              message: JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }
  //----------------------------------------
  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Card >
          <CardContent >
            <Grid>
              <Divider textAlign="center">
                <span className="m-filter-title">Lọc dữ liệu</span>
              </Divider>
            </Grid>
            <Stack>
              <Grid container>
                <Grid item xs={12}>
                  <SelectVessel
                    handleSelected={(data) => this.selectedVessel(data)}>
                  </SelectVessel>
                </Grid>
                <Grid >
                  <Stack direction="row" spacing={1} style={{ margin: "15px" }} >
                    <Stack direction="row" gap="12px" >
                      <Stack direction="row" alignItems="center">
                        <TextField
                          id="so-cnt"
                          size="small"
                          label="Số Container"
                          value={this.state.data.Cnt}
                          onChange={(newValue) => {
                            this.setState({
                              data: {
                                ...this.state.data,
                                Cnt: newValue.target.value,
                              }
                            })
                          }}
                        />
                      </Stack>
                      {/* <Divider orientation="vertical" /> */}
                      {/* <Stack direction="row" alignItems="center">
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            label="Từ ngày"
                            inputFormat="DD/MM/YYYY"
                            value={this.state.data.fromDate}
                            onChange={(newValue) => {
                              this.setState({
                                data: {
                                  ...this.state.data,
                                  fromDate: newValue,
                                }
                              })
                            }}
                            renderInput={(params) => <TextField
                              size="small"
                              {...params} />}
                          />
                        </LocalizationProvider>
                      </Stack> */}
                      {/* <Stack direction="row" alignItems="center" >
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            label="Đến ngày"
                            inputFormat="DD/MM/YYYY"
                            value={this.state.data.toDate}
                            onChange={(newValue) => {
                              this.setState({
                                data: {
                                  ...this.state.data,
                                  toDate: newValue,
                                }
                              })
                            }}
                            renderInput={(params) => <TextField
                              size="small"
                              {...params} />}
                          />
                        </LocalizationProvider>
                      </Stack> */}
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack direction="row" alignItems="center">
                      <FormControl>
                        <RadioGroup
                          sx={{ marginLeft: "2vh" }}
                          name="filterType"
                          row
                          value={this.state.isInOut}
                          onChange={(e) => {
                            this.setState({
                              isInOut: e.target.value
                            })
                          }} >
                          <FormControlLabel
                            value="in"
                            control={
                              <Radio
                                onChange={(event) => {
                                  this.setState({
                                    CLASS_CODE: 1,
                                    dataTable: [],
                                    container: {},
                                  })
                                }}
                              />}
                            label="Hướng nhập" />
                          <FormControlLabel
                            value="out"
                            control={
                              <Radio
                                onChange={(event) => {
                                  this.setState({
                                    CLASS_CODE: 2,
                                    dataTable: [],
                                    container: {},
                                  })
                                }} />} label="Hướng xuất" />
                        </RadioGroup>
                      </FormControl>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack direction="row" spacing={1}>
                      <Button
                        type="button"
                        size="small"
                        variant="contained"
                        onClick={() => this.handleViewData()}
                      >Nạp dữ liệu</Button>
                      <Button
                        type="button"
                        size="small"
                        variant="contained"
                        onClick={() => this.handleTos()}
                      >Lấy dữ liệu từ TOS</Button>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card >
        <Card style={{ marginTop: "10px" }}>
          <CardContent>
            <Stack direction="row" spacing={1} justifyContent='flex-end'>
              <ExportCSV csvData={this.state.dataTable} fileName="DM-Don-Vi-Tinh" ></ExportCSV>
              <Divider orientation="vertical" flexItem />
              <Button
                className="m-btn m-secondary"
                type="button"
                variant="outlined"
                onClick={() => {
                  this.setState({
                    dialog: {
                      isOpen: true,
                      data: null,
                      type: 0,
                    },
                  });
                }}
                startIcon={<AddIcon />}
              >
                Thêm dòng
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => this.handleInsertOrUpdate()}
                startIcon={<SaveIcon />}
                color="success"
              >
                Lưu
              </Button>
              <Divider orientation="vertical" flexItem />
              <Button
                type="button"
                variant="outlined"
                onClick={() => {
                  this.setState({
                    confirmPopup: {
                      isOpen: true,
                      message: 'Bạn có muốn xóa dữ liệu?'
                    }
                  })
                }
                }
                startIcon={<DeleteIcon />}
                color="error"
              >
                Xóa dòng
              </Button>
            </Stack>
            <Divider style={{ marginTop: "10px" }} flexItem />
            <Grid item mt={1}>
              <DataGrid
                className="m-table"
                disableSelectionOnClick
                rowHeight={35}
                rows={this.state.dataTable}
                columns={this.columns}
                rowsPerPageOptions={[10, 25, 100]}
                onCellEditCommit={(params) => {
                  console.log(params)
                  let temp = [...this.state.dataTable];
                  let flag = false;
                  this.state.dataTable.map(item => {
                    if (params.value === item.CNTRNO && params.id !== item.id) {
                      flag = true;
                    };
                    return true;
                  });

                  if (flag) {
                    this.setState({
                      dataTable: temp,
                      alert: {
                        isOpen: true,
                        message: 'Số CNTRNO đã tồn tại!',
                        duration: 3000,
                        type: 'error'
                      }
                    });
                    return
                  }
                  if (params.field === "JOBMODE_IN") {
                    temp.map(data => {
                      if (params.id === data.id) {
                        data[params.value] = params.formattedValue;
                        if (data.status !== 'insert') {
                          data.status = 'update'
                        }
                      }
                      return true;
                    })
                  } else if (params.field === "JOBMODE_OUT") {
                    temp.map(data => {
                      if (params.id === data.id) {
                        data[params.value] = params.formattedValue;
                        if (data.status !== 'insert') {
                          data.status = 'update'
                        }
                      }
                      return true;
                    })
                  } else if (params.field === "CLASS_CODE") {
                    temp.map(data => {
                      if (params.id === data.id) {
                        data[params.field] = params.value;
                        if (data.status !== 'insert') {
                          data.status = 'update'
                        }
                      }
                      return true;
                    });
                  } else if (params.field === "CHK_FE") {
                    temp.map(data => {
                      if (params.id === data.id) {
                        data[params.field] = params.value;
                        if (data.status !== 'insert') {
                          data.status = 'update'
                        }
                      }
                      return true;
                    });
                  } else if (params.field === "GET_IN") {
                    temp.map(data => {
                      if (params.id === data.id) {
                        data[params.field] = params.value;
                        if (data.status !== 'insert') {
                          data.status = 'update'
                        }
                      }
                      return true;
                    });
                  } else if (params.field === "GET_OUT") {
                    temp.map(data => {
                      if (params.id === data.id) {
                        data[params.field] = params.value;
                        if (data.status !== 'insert') {
                          data.status = 'update'
                        }
                      }
                      return true;
                    });
                  }
                  else {
                    temp.map(data => {
                      if (params.id === data.id) {
                        if (typeof params.value === 'string') {
                          data[params.field] = params.value.trim().toUpperCase();
                        } else {
                          data[params.field] = params.value;
                        }
                        if (data.status !== 'insert') {
                          data.status = 'update'
                        }
                      }
                      return true;
                    });
                  }

                  this.setState({ dataTable: temp })
                }}
                sx={{ height: "53vh" }}
              >
              </DataGrid>
            </Grid>
          </CardContent>
        </Card>
        <ConfirmPopup
          dialog={this.state.confirmPopup}
          text={'XÁC NHẬN'}
          handleCloseDialog={(type) => {
            if (type === "agree") {
              this.setState({
                confirmPopup: {
                  isOpen: false
                }
              })
              this.handleDelete();
            } else {
              this.setState({
                confirmPopup: {
                  isOpen: false
                }
              })
            }
          }
          }
        />
        <AddRows
          dialog={this.state.dialog}
          handleCloseDialog={() => {
            this.setState({
              dialog: {
                isOpen: false,
                data: null,
                type: 0,
              },
            });
          }}
          handleAddRows={(rowCount) => this.handleAddRow(rowCount)} />
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
}
export default FluctuateContainerInfo;