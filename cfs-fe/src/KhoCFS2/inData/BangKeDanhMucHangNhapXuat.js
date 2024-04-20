import * as React from "react";
import { DataGrid } from '@mui/x-data-grid';
import * as moment from "moment";
import {
  Box,
  Button,
  Stack,
  Checkbox,
  CardContent,
  Grid,
  Divider,
  FormControl,
  Autocomplete,
  Radio,
  Card,
  FormControlLabel,
  RadioGroup,
  TextField,
  Popper,
  Paper,
  Typography,
} from "@mui/material";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import SelectVessel from "../../componentsCFS2/dialog/SelectVessel"
import PrintIcon from '@mui/icons-material/Print';
import AddRows from "../../componentsCFS2/dialog/AddRows";
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import ContainerSelect from "../../componentsCFS2/dialog/ContainerSelect";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from "@mui/icons-material/Delete";
import PrintingGoodsList from "../../assets/document/PrintingGoodsList";
import CustomerSelect from "../../componentsCFS2/dialog/CustomerSelect";
import ImportExcel from "../../components/caiDat/importExcel";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import StoreIcon from '@mui/icons-material/Store';
import InputAdornment from '@mui/material/InputAdornment';
import InCongVan from "../../assets/document/InCongVan";


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const dataIn = {
  HOUSE_BILL: null,
  LOT_NO: null,
  SHIPMARKS: null,
  CUSTOMER_NAME: null,
  COMMODITYDESCRIPTION: null,
  CARGO_PIECE: "",
  UNIT_CODE: "CT",
  CARGO_WEIGHT: "",
  CBM: "",
  DECLARE_NO: null,
  NOTE: null,
  CLASS_CODE: 1,
}
const dataOut = {
  BOOKING_NO: null,
  BOOKING_FWD: null,
  LOT_NO: null,
  SHIPMARKS: null,
  CUSTOMER_NAME: null,
  COMMODITYDESCRIPTION: null,
  CARGO_PIECE: 0,
  UNIT_CODE: "CT",
  CARGO_WEIGHT: 0,
  CBM: 0,
  DECLARE_NO: null,
  NOTE: null,
  CLASS_CODE: 2,
  CNTRNO: '',
}

class BangKeDanhMucHangHoaNhapXuat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogInCongVan: {
        isOpen: false,
      },
      confirmPopup: {
        isOpen: false,
      },
      dialog: {
        isOpen: false,
        data: null,
        type: 0
      },
      dialogSelect: {
        isOpen: false,
        data: null,
        type: 0,
      },
      dialogSelectCus: {
        isOpen: false,
      },
      dialogPrintGoodsList: {
        isOpen: false,
        data: null,
        type: 0,
      },
      total: {
        CARGO_WEIGHT: 0,
        CBM: 0,
      }
      ,
      CLASS_CODE: 1,
      dataIn: dataIn,
      dataOut: dataOut,
      dataTable: [],
      isChecked: false,
      vessel: {},
      container: {},
      CONSIGNEE: {},
      dataUnit: [],
      dataItemType: [],
      dataCustomer: [],
      showMore: {
        popper: false,
        cell: false,
        anchor: null,
      },
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
      isInOut: 'in' // filter radio group value - ['in', 'out']
    };
    this.columns_Xuat = [
      {
        field: "Action",
        headerName: "Chọn",
        align: "center",
        headerAlign: "center",
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
        field: "BOOKING_FWD",
        headerName: "Booking_FWD (*)",
        align: "center",
        headerAlign: "center",
        width: 150,
        editable: true,
      },
      {
        field: "LOT_NO",
        headerName: "Số LOT (*)",
        align: "center",
        headerAlign: "center",
        width: 80,
        editable: true,
      },
      {
        field: "SHIPMARKS",
        headerName: "Shipmarks",
        align: "center",
        headerAlign: "center",
        width: 200,
        editable: true,
      },
      {
        field: "CUSTOMER_NAME",
        headerName: "Chủ hàng (*)",
        align: "center",
        headerAlign: "center",
        width: 250,
        editable: true,
        renderCell: (params) => {
          return this.showMoreDetails(params);
        },
      },
      {
        field: "ITEM_TYPE_CODE",
        headerName: "Loại hàng (*)",
        align: "center",
        headerAlign: "center",
        width: 80,
        editable: true,
        type: 'singleSelect',
        renderEditCell: (params) => {
          let CodeItem = '';
          return [
            <Autocomplete
              style={{ width: "100%" }}
              id="clear-on-escape"
              clearOnEscape
              options={this.state.dataItemType || []}
              onChange={(e, value) => {
                if (value) {
                  params.row.ITEM_TYPE_CODE = value;
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
        field: 'COMMODITYDESCRIPTION',
        headerName: 'Mô tả hàng hoá (*)',
        align: "center",
        headerAlign: "center",
        width: 250,
        editable: true,
        renderCell: (params) => {
          return this.showMoreDetailsDescr(params);
        },

      },
      {
        field: "CARGO_PIECE",
        headerName: "Số lượng (*)",
        align: "center",
        headerAlign: "center",
        type: 'number',
        width: 80,
        editable: true,
      },
      {
        field: "UNIT_CODE",
        headerName: "Đơn vị tính",
        align: "center",
        headerAlign: "center",
        width: 80,
        editable: true,
        type: 'singleSelect',
        renderEditCell: (params) => {
          let CodeItem = '';
          return [
            <Autocomplete
              style={{ width: "100%" }}
              id="clear-on-escape"
              clearOnEscape
              autoHighlight
              disableClearable
              openOnFocus
              selectOnFocus
              options={this.state.dataUnit || []}
              onChange={(e, value) => {
                if (value) {
                  params.row.UNIT_CODE = value;
                  CodeItem = value;
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Tab') {
                  params.formattedValue = CodeItem;
                  params.row.ITEM_TYPE_CODE = CodeItem;
                }
              }}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  multiline
                  value={CodeItem}
                  autoFocus
                  {...params} variant="outlined" />
              )}
            />
          ]
        }
      },
      {
        field: "CARGO_WEIGHT",
        headerName: "Trọng lượng (*)",
        align: "center",
        headerAlign: "center",
        type: 'number',
        width: 100,
        editable: true,
      },
      {
        field: "CBM",
        headerName: "Số khối (*)",
        align: "center",
        headerAlign: "center",
        type: 'number',
        width: 80,
        editable: true
      },
      {
        field: "DECLARE_NO",
        headerName: "Số tờ khai",
        align: "center",
        headerAlign: "center",
        width: 150,
        editable: true,
      },
      {
        field: "NOTE",
        headerName: "Ghi chú",
        align: "center",
        headerAlign: "center",
        width: 150,
        editable: true,
      },
    ]
    this.columns_Nhap = [
      {
        field: "Action",
        headerName: "Chọn",
        align: "center",
        headerAlign: "center",
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
        field: "HOUSE_BILL",
        headerName: "Số House_Bill (*)",
        align: "center",
        headerAlign: "center",
        width: 150,
        editable: true,
      },
      {
        field: "LOT_NO",
        headerName: "Số LOT (*)",
        align: "center",
        headerAlign: "center",
        width: 80,
        editable: true,
      },
      {
        field: "SHIPMARKS",
        headerName: "Shipmarks",
        align: "center",
        headerAlign: "center",
        width: 200,
        editable: true,
      },
      {
        field: "CUSTOMER_NAME",
        headerName: "Chủ hàng (*)",
        align: "center",
        headerAlign: "center",
        width: 250,
        editable: true,
        renderCell: (params) => {
          return this.showMoreDetails(params);
        },

      },
      {
        field: "ITEM_TYPE_CODE",
        headerName: "Loại hàng (*)",
        align: "center",
        headerAlign: "center",
        width: 80,
        editable: true,
        type: 'singleSelect',
        renderEditCell: (params) => {
          let CodeItem = '';
          return [
            <Autocomplete
              style={{ width: "100%" }}
              id="clear-on-escape"
              clearOnEscape
              value={CodeItem}
              autoHighlight
              disableClearable
              openOnFocus
              selectOnFocus
              options={this.state.dataItemType || []}
              onChange={(e, value) => {
                if (value) {
                  params.row.ITEM_TYPE_CODE = value;
                  CodeItem = value;
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Tab') {
                  params.formattedValue = CodeItem;
                  params.row.ITEM_TYPE_CODE = CodeItem;
                }
              }}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  multiline
                  autoFocus
                  {...params} variant="outlined" />
              )}
            />
          ]
        }
      },
      {
        field: 'COMMODITYDESCRIPTION',
        headerName: 'Mô tả hàng hoá (*)',
        align: "center",
        headerAlign: "center",
        width: 250,
        editable: true,
        renderCell: (params) => {
          return this.showMoreDetailsDescr(params);
        },
      },
      {
        field: "CARGO_PIECE",
        headerName: "Số lượng (*)",
        align: "center",
        headerAlign: "center",
        width: 80,
        editable: true,
      },
      {
        field: "UNIT_CODE",
        headerName: "Đơn vị tính (*)",
        align: "center",
        headerAlign: "center",
        wdth: 80,
        editable: true,
        type: 'singleSelect',
        renderEditCell: (params) => {
          let CodeItem = '';
          return [
            <Autocomplete
              style={{ width: "100%" }}
              value={CodeItem}
              autoHighlight
              disableClearable
              openOnFocus
              selectOnFocus
              id="clear-on-escape"
              clearOnEscape
              options={this.state.dataUnit || []}
              onChange={(e, value) => {
                if (value) {
                  params.row.UNIT_CODE = value;
                  CodeItem = value;
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Tab') {
                  params.formattedValue = CodeItem;
                }
              }}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  autoFocus
                  multiline
                  {...params} variant="outlined" />
              )}
            />
          ]
        }
      },
      {
        field: "CARGO_WEIGHT",
        headerName: "Trọng lượng (*)",
        align: "center",
        headerAlign: "center",
        width: 100,
        editable: true
      },
      {
        field: "CBM",
        headerName: "Số khối (*)",
        align: "center",
        headerAlign: "center",
        width: 100,
        editable: true
      },
      {
        field: "DECLARE_NO",
        headerName: "Số tờ khai",
        align: "center",
        width: 150,
        headerAlign: "center",
        editable: true,
      },
      {
        field: "NOTE",
        headerName: "Ghi chú",
        align: "center",
        headerAlign: "center",
        width: 150,
        editable: true,
      },
    ];
    this.childRef = React.createRef();

    this.arrHeaderIn = Array(this.columns_Nhap.map(item => {
      return item.field + '-' + item.headerName;
    })).at(0);

    this.arrKeyIn = [];
    this.arrNameIn = [];
    for (let i = 0; i < this.arrHeaderIn.length; i++) {
      this.arrKeyIn.push(this.arrHeaderIn[i].split('-')[0]);
      this.arrNameIn.push(this.arrHeaderIn[i].split('-')[1]);
    }
    this.objDataIn = {};
    for (let i = 0; i < this.arrNameIn.length; i++) {
      this.objDataIn[`${this.arrNameIn[i]}`] = '';
    }

    this.arrHeaderOut = Array(this.columns_Xuat.map(item => {
      return item.field + '-' + item.headerName;
    })).at(0);

    this.arrKeyOut = [];
    this.arrNameOut = [];
    for (let i = 0; i < this.arrHeaderOut.length; i++) {
      this.arrKeyOut.push(this.arrHeaderOut[i].split('-')[0]);
      this.arrNameOut.push(this.arrHeaderOut[i].split('-')[1]);
    }
    this.objDataOut = {};
    for (let i = 0; i < this.arrNameOut.length; i++) {
      this.objDataOut[`${this.arrNameOut[i]}`] = '';
    }
  }

  rowSelectHandle(idx, status) {
    const { dataTable } = this.state;
    let updateData = dataTable;
    updateData[idx]['isChecked'] = status;
    this.setState({
      dataTable: updateData
    });
  }

  createRows = (data) => data.map((row, index) => ({
    id: index,
    STT: index + 1,
    ...row
  }));

  handlePrintGoodsList() {
    this.setState({
      dialogPrintGoodsList: {
        isOpen: true,
        data: null,
        type: 0
      }
    })
  }

  handleCloseDialogPrint() {
    this.setState({
      dialogPrintGoodsList: {
        isOpen: false,
      }
    })
  }

  handleSelectVessel() {
    this.setState({
      dialogSelect: {
        isOpen: true,
        data: null,
        type: 0
      }
    })
  }

  showMoreDetails(params) {
    return (
      <Box
        onMouseEnter={(e) => {
          this.setState({
            showMore: {
              text: params.value,
              anchor: e.currentTarget,
              popper: true,
              cell: true,
            }
          })
        }}
        onMouseLeave={() => {
          this.setState({
            showMore: {
              text: '',
              popper: false,
              cell: false,
              anchor: null
            }
          })
        }}
        sx={{
          alignItems: 'center',
          lineHeight: '24px',
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: params.colDef.computedWidth,
            display: 'block',
            position: 'absolute',
            top: 0,
          }}
        />
        <Box
          sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 'auto' }}
        >
          {params.value ?? ''}
        </Box>
        {this.state.showMore.popper && (
          <Popper
            open={this.state.showMore.cell && this.state.showMore.anchor !== null}
            anchorEl={this.state.showMore.anchor}
            style={{ width: params.colDef.computedWidth, marginLeft: -17 }}
          >
            <Paper
              elevation={1}
            >
              <Typography variant="body2" style={{ padding: 8 }}>
                {this.state.showMore.text ?? ''}
              </Typography>
            </Paper>
          </Popper>
        )
        }
      </Box>
    )
  }
  showMoreDetailsDescr(params) {
    return (
      <Box
        onMouseEnter={(e) => {
          this.setState({
            showMore: {
              text: params.value,
              anchor: e.currentTarget,
              popper: true,
              cell: true,
            }
          })
        }}
        onMouseLeave={() => {
          this.setState({
            showMore: {
              text: '',
              popper: false,
              cell: false,
              anchor: null
            }
          })
        }}
        sx={{
          alignItems: 'center',
          lineHeight: '24px',
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: params.colDef.computedWidth,
            display: 'block',
            position: 'absolute',
            top: 0,
          }}
        />
        <Box
          sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 'auto' }}
        >
          {params.value ?? ''}
        </Box>
        {this.state.showMore.popper && (
          <Popper
            open={this.state.showMore.cell && this.state.showMore.anchor !== null}
            anchorEl={this.state.showMore.anchor}
            style={{ width: params.colDef.computedWidth, marginLeft: -17 }}
          >
            <Paper
              elevation={1}
            >
              <Typography variant="body2" style={{ padding: 8 }}>
                {this.state.showMore.text ?? ''}
              </Typography>
            </Paper>
          </Popper>
        )
        }
      </Box>
    )
  }

  handleDelete() {
    let url = window.root_url + `dt-package-mnf-ld/delete`;
    let { dataTable } = this.state;
    let dataSend = dataTable.filter(p => p.isChecked === true && p.status !== "insert").map(item => {
      let obj = {};
      obj["ID"] = item.ID;
      obj['BOOKING_NO'] = item.BOOKING_NO;
      obj['HOUSE_BILL'] = item.HOUSE_BILL;
      obj['VOYAGEKEY'] = item.VOYAGEKEY;
      obj['CNTRNO'] = item.CNTRNO;
      obj['CLASS_CODE'] = item.CLASS_CODE;
      return obj;
    });

    if (!dataSend.length) {
      let clearedData = dataTable.filter(p => p.status === "insert" && p.isChecked !== true);
      clearedData = clearedData.map((item, i) => {
        // item.STT = i + 1;
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
            alert: {
              isOpen: true,
              message: response.Message,
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
    return true;
  }

  selectedContainer(data) {
    if (data) {
      let newData = { ...data }
      this.setState({
        container: newData,
        dataTable: []
      })
    }
  }

  inputContainer(data) {
    if (data) {
      let newData = { ...data }
      this.setState({
        container: newData,
      })
    }
  }

  selectedVessel(data) {
    if (data) {
      let newData = { ...data }
      this.setState({
        vessel: newData,
        dataTable: []
      });
    }
  }

  //Thoilc(*Note)-Thêm số dòng
  handleAddRow(rowCount) {
    let { dataTable } = this.state;
    let newRow = [];
    let newData = {};
    if (this.state.vessel.VOYAGEKEY !== undefined) {
      if (this.state.container.CNTRNO !== undefined || this.state.CLASS_CODE !== 1) {
        for (let i = 0; i < rowCount; i++) {
          if (this.state.CLASS_CODE === 1) {
            newData = {
              ...this.state.dataIn,
              ITEM_TYPE_CODE: this.state.container.ITEM_TYPE_CODE,
              status: 'insert',
            }
          } else {
            newData = {
              ...this.state.dataOut,
              ITEM_TYPE_CODE: this.state.container.ITEM_TYPE_CODE,
              status: 'insert',
            }
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
        });
      } else {
        this.setState({
          alert: {
            isOpen: true,
            duration: 3000,
            message: 'Vui lòng chọn container hoặc nhập thông tin container nếu chưa có!',
            type: 'warning'
          }
        });
      }
    } else {
      this.setState({
        alert: {
          isOpen: true,
          duration: 2000,
          message: 'Vui lòng chọn tàu chuyến!',
          type: 'warning'
        }
      });
    }
  }

  //Load data to view 
  handleTable() {
    let url = window.root_url + `dt-package-mnf-ld/view`;
    let dataSend = {
      CLASS_CODE: this.state.CLASS_CODE === 1 ? 1 : 2,
      VOYAGEKEY: this.state.vessel.VOYAGEKEY,
      CNTRNO: this.state.container.CNTRNO,
    }
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
      .then(data => {
        if (data.Status) {
          let obj = {
            SUM_CARGO_WEIGHT: 0,
            SUM_CBM: 0,
          };
          let temp = this.createRows(data.Payload);
          temp.map((data) => {
            obj.SUM_CARGO_WEIGHT += Number(data.CARGO_WEIGHT)
            obj.SUM_CBM += Number(data.CBM)
            return obj;
          })
          this.setState({
            total: {
              CARGO_WEIGHT: obj.SUM_CARGO_WEIGHT,
              CBM: obj.SUM_CBM,
            },
            CONSIGNEE: data.Payload[0].consigneeInfo ?? {},
            dataTable: temp,
            alert: {
              isOpen: true,
              type: "success",
              message: data.Message,
            },
          })
        }
        else {
          this.setState({
            dataTable: [],
            alert: {
              type: 'warning',
              message: data.Message,
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
              message: 'Bạn chưa chọn tàu chuyến ' + JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }

  //Binh(*note) - lifeCycle
  componentDidMount() {
    this.loadCode();
  }

  //Thoilc(*Note)-Hiển thị dữ liệu Code
  loadCode() {
    let url = window.root_url + `dt-package-mnf-ld/viewCode`;
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
          let arrUnit = [], arrItemType = [], arrCustomer = [];
          data.Payload.Unit.map(item => {
            return arrUnit.push(item.UNIT_CODE);
          });
          data.Payload.ItemType.map(item => {
            return arrItemType.push(item.ITEM_TYPE_CODE);
          });
          data.Payload.Customer.map(item => {
            return arrCustomer.push({
              CUSTOMER_CODE: item.CUSTOMER_CODE,
              label: item.CUSTOMER_NAME,
              CUSTOMER_NAME: item.CUSTOMER_NAME,
            });
          });
          this.setState({
            dataUnit: arrUnit,
            dataItemType: arrItemType,
            dataCustomer: arrCustomer,
          });
        } else {
          this.setState({
            alert: {
              isOpen: true,
              duration: 3000,
              message: "Vui lòng kiểm tra lại đường truyền mạng!",
              type: "error"
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
              message: 'Không có dữ liệu được cập nhật',
              type: 'error'
            }
          });
        }
      });
  }

  //Thoilc(*Note)-Thêm mới dữ liệu bảng kê
  handleSave() {
    if (!Object.keys(this.state.CONSIGNEE).length) {
      this.setState({
        alert: {
          isOpen: true,
          duration: 3000,
          message: "Vui lòng chọn đại lý",
          type: "warning"
        }
      });
      return;
    }
    let url = window.root_url + `dt-package-mnf-ld/insertAndUpdate`;
    let { dataTable, container, CLASS_CODE } = this.state;
    let arr = [];
    let checkColumn = {
      LOT_NO: "Số lot",
      ITEM_TYPE_CODE: "Loại hàng hoá",
      COMMODITYDESCRIPTION: "Mô tả",
      CUSTOMER_NAME: 'Chủ hàng',
      CARGO_PIECE: 'Số lượng',
      UNIT_CODE: 'Đơn vị tính',
      CARGO_WEIGHT: 'Trọng lượng',
      CBM: "Số khối",
    };
    let dataSend = dataTable.map(data => {
      data[data.status === 'insert' ? 'CREATE_BY' : 'UPDATE_BY'] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
      data.VOYAGEKEY = this.state.vessel.VOYAGEKEY;
      data.ITEM_TYPE_CODE_CNTR = this.state.container.ITEM_TYPE_CODE;
      data.CLASS_CODE = this.state.CLASS_CODE;
      data.TRANSPORTIDENTITY = this.state.vessel.VESSEL_NAME;
      data.NUMBEROFJOURNEY = this.state.CLASS_CODE === 1 ? this.state.vessel.INBOUND_VOYAGE : this.state.vessel.OUTBOUND_VOYAGE;
      data.ARRIVALDEPARTURE = this.state.CLASS_CODE === 1 ? moment(this.state.vessel.ETA, "DD/MM/YYYY HH:mm:ss").format('YYYY-MM-DD HH:mm:ss') : moment(this.state.vessel.ETD, "DD/MM/YYYY HH:mm:ss").format('YYYY-MM-DD HH:mm:ss');
      data.CNTRNO = this.state.CLASS_CODE === 1 ? this.state.container.CNTRNO : data.CNTRNO;
      data.CNTRSZTP = this.state.container.CNTRSZTP;
      data.CONSIGNEE = this.state.CONSIGNEE.CUSTOMER_CODE;
      data.BILLOFLADING = this.state.container.BILLOFLADING !== '' ? this.state.container.BILLOFLADING : null;
      Object.keys(data).map((key) => {
        if (!data[key]) {
          delete data[key];
        }
        return key;
      })
      Object.keys(checkColumn).map((key) => {
        return !data[key] ? arr.push(checkColumn[key]) : [];
      });
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
    if (Object.keys(container).length > 0 && (this.state.CLASS_CODE === 2 ? this.state.dataTable.filter(p => p.isChecked === true).length > 0 : this.state.dataTable.filter(p => p.status === 'insert').length > 0)) {
      let dataContainer = {};
      dataContainer = { ...this.state.container };
      dataContainer.status = "insert";
      dataContainer.CREATE_BY = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
      let tempTable = CLASS_CODE === 1 ? dataTable.filter(p => p.status === 'insert') : dataTable.filter(p => p.isChecked === true);
      let temp = [];
      if (this.state.CLASS_CODE === 1) {
        temp = tempTable.map(data => {
          return {
            ...dataContainer,
            [this.state.CLASS_CODE === 1 ? 'BILLOFLADING' : 'BOOKING_NO']: this.state.CLASS_CODE === 1 ? data.HOUSE_BILL : data.BOOKING_NO,
            CLASS_CODE: this.state.CLASS_CODE,
            VOYAGEKEY: this.state.vessel.VOYAGEKEY,
            TRANSPORTIDENTITY: this.state.vessel.VESSEL_NAME,
            STATUSOFGOOD: dataContainer.STATUSOFGOOD === "Full" ? true : false,
            NUMBEROFJOURNEY: this.state.vessel.INBOUND_VOYAGE,
            ARRIVALDEPARTURE: moment(this.state.vessel.ETA, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
          };
        });
      } else {
        temp = [dataContainer].map(item => {
          item.BOOKING_FWD = tempTable.map(p => { return p.BOOKING_FWD });
          item.CLASS_CODE = this.state.CLASS_CODE;
          item.VOYAGEKEY = this.state.vessel.VOYAGEKEY;
          item.TRANSPORTIDENTITY = this.state.vessel.VESSEL_NAME;
          item.NUMBEROFJOURNEY = this.state.vessel.OUTBOUND_VOYAGE;
          item.STATUSOFGOOD = dataContainer.STATUSOFGOOD
          item.ARRIVALDEPARTURE = moment(this.state.vessel.ETD, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
          return item;
        });
      }
      let urlCntrMnf = window.root_url + `dt-cntr-mnf-ld/insertAndUpdate`;
      fetch(urlCntrMnf, {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
        },
        body: JSON.stringify(temp)
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
              alert: {
                isOpen: true,
                duration: 2000,
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
            });
          }
        })
    }
    if (this.state.dataTable.filter(p => p.status === 'insert' || p.status === 'update').length === 0) {
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
          let obj = {
            SUM_CARGO_WEIGHT: 0,
            SUM_CBM: 0,
          }
          let newDatas = dataTable.map((item, index) => {
            let returnValue = response.Payload.find(p => p.HOUSE_BILL === item.HOUSE_BILL);
            item.id = index;
            if (returnValue !== undefined) {
              item.ID = returnValue.ID;
              delete item.status;
            }
            obj.SUM_CARGO_WEIGHT += Number(item.CARGO_WEIGHT)
            obj.SUM_CBM += Number(item.CBM)
            return item;
          });
          this.setState({
            dataTable: newDatas,
            total: {
              CARGO_WEIGHT: obj.SUM_CARGO_WEIGHT,
              CBM: obj.SUM_CBM,
            },
            alert: {
              isOpen: true,
              duration: 2000,
              message: response.Message,
              type: "success"
            }
          });
        } else {
          let temp = dataTable.map((item, idx) => {
            item.id = idx
            item.STT = idx + 1
            return item;
          });
          this.setState({
            dataTable: temp,
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message !== '' ? response.Message : 'Không có dữ liệu',
              type: "error"
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
              message: 'Không có dữ liệu được cập nhật',
              type: 'error'
            }
          });
        }
      });
  }

  //Thoilc(*Note)-Load dữ liệu file Excel
  loadDataExcel(data) {
    let convertData = [];
    if (this.state.CLASS_CODE === 1) {
      for (let i = 1; i < data.length; i++) {
        convertData.push({
          HOUSE_BILL: data[i].HOUSE_BILL,
          LOT_NO: data[i].LOT_NO,
          SHIPMARKS: data[i].SHIPMARKS,
          CUSTOMER_NAME: data[i].CUSTOMER_NAME,
          ITEM_TYPE_CODE: data[i].ITEM_TYPE_CODE,
          COMMODITYDESCRIPTION: data[i].COMMODITYDESCRIPTION,
          CARGO_PIECE: data[i].CARGO_PIECE,
          UNIT_CODE: data[i].UNIT_CODE,
          CARGO_WEIGHT: data[i].CARGO_WEIGHT,
          CBM: data[i].CBM,
          DECLARE_NO: data[i].DECLARE_NO,
          NOTE: data[i].NOTE
        });
      }

      if (convertData.length) {
        let newData = convertData.map(item => {
          item.status = 'insert';
          return item;
        })
        let dataImpExcel = this.createRows(newData);
        let obj = {
          SUM_CARGO_WEIGHT: 0,
          SUM_CBM: 0,
        };
        dataImpExcel.map((data) => {
          obj.SUM_CARGO_WEIGHT += Number(data.CARGO_WEIGHT)
          obj.SUM_CBM += Number(data.CBM)
          return obj;
        })
        this.setState({
          total: {
            CARGO_WEIGHT: obj.SUM_CARGO_WEIGHT,
            CBM: obj.SUM_CBM,
          },
          dataTable: dataImpExcel
        });
      } else {
        this.setState({
          alert: {
            isOpen: true,
            duration: 3000,
            message: 'Không có dữ liệu import hoặc file không đúng định dạng!',
            type: 'warning'
          }
        });
      }
    } else {
      for (let i = 1; i < data.length; i++) {
        convertData.push({
          BOOKING_NO: data[i].BOOKING_NO,
          BOOKING_FWD: data[i].BOOKING_FWD,
          LOT_NO: data[i].LOT_NO,
          SHIPMARKS: data[i].SHIPMARKS,
          CUSTOMER_NAME: data[i].CUSTOMER_NAME,
          ITEM_TYPE_CODE: data[i].ITEM_TYPE_CODE,
          COMMODITYDESCRIPTION: data[i].COMMODITYDESCRIPTION,
          CARGO_PIECE: data[i].CARGO_PIECE,
          UNIT_CODE: data[i].UNIT_CODE,
          CARGO_WEIGHT: data[i].CARGO_WEIGHT,
          CBM: data[i].CBM,
          DECLARE_NO: data[i].DECLARE_NO,
          NOTE: data[i].NOTE,
          CNTRNO: data[i].CNTRNO
        });
      }
      if (convertData.length) {
        let newData = convertData.map(item => {
          item.status = 'insert';
          return item;
        })
        let dataImpExcel = this.createRows(newData);
        let obj = {
          SUM_CARGO_WEIGHT: 0,
          SUM_CBM: 0,
        };
        dataImpExcel.map((data) => {
          obj.SUM_CARGO_WEIGHT += Number(data.CARGO_WEIGHT)
          obj.SUM_CBM += Number(data.CBM)
          return obj;
        })
        this.setState({
          total: {
            CARGO_WEIGHT: obj.SUM_CARGO_WEIGHT,
            CBM: obj.SUM_CBM,
          },
          dataTable: dataImpExcel
        });
      } else {
        this.setState({
          alert: {
            isOpen: true,
            duration: 3000,
            message: 'Không có dữ liệu import hoặc file không đúng định dạng!',
            type: 'warning'
          }
        });
      }
    }
  }

  inputContainer(data) {
    if (data) {
      let newData = { ...data }
      this.setState({
        container: newData,
      })
    }
  }

  //-----------------------------------
  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Card style={{ marginBottom: "12px" }} >
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SelectVessel
                  handleSelected={(data) => this.selectedVessel(data)}>
                </SelectVessel>
              </Grid>
              <Grid item xs={12}>
                <ContainerSelect
                  handleDeleteContainer={(params) => {
                    let temp = this.state.dataTable.filter(p => this.state.CLASS_CODE === 1 ? p.HOUSE_BILL !== params.BILLOFLADING : p.BOOKING_NO !== params.BOOKING_NO);
                    temp = temp.map((item, idx) => {
                      item.id = idx;
                      item.STT = idx + 1;
                      return item;
                    });
                    this.setState({
                      dataTable: temp,
                      container: {}
                    });
                  }}
                  ref={(data) => this.clearContData = data}
                  handleSelectContainer={(data) => this.selectedContainer(data)}
                  handleInputContainer={(data) => this.inputContainer(data)}
                  selectedVessel={this.state.vessel}
                  selectedClassCode={this.state.CLASS_CODE}>
                </ContainerSelect>
              </Grid>
            </Grid>
            <Stack direction="row" spacing={1} sx={{ padding: "10px 0" }}>
              <FormControl>
                <RadioGroup
                  sx={{ marginLeft: "2vh" }}
                  name="filterType"
                  row
                  value={this.state.isInOut}
                  onChange={(e) => {
                    this.clearContData.clearData(e)
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
                    label=" Hướng Nhập" />
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
                        }} />} label=" Hướng Xuất" />
                </RadioGroup>
              </FormControl>
              <Button
                // size="small"
                type="button"
                variant="contained"
                onClick={() => this.handleTable()} >
                Nạp dữ liệu
              </Button>
            </Stack>
            <Divider />
          </CardContent>
        </Card>
        <Card style={{ marginBottom: "12px" }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack mb={1} direction="row" justifyContent="space-between">
                  <TextField
                    variant="standard"
                    sx={{ width: 350 }}
                    value={Object.keys(this.state.CONSIGNEE).length ? this.state.CONSIGNEE.CUSTOMER_NAME : 'CHỌN ĐẠI LÝ'}
                    onClick={(e) => {
                      if (!(Object.keys(this.state.vessel).length || Object.keys(this.state.container).length)) {
                        this.setState({
                          alert: {
                            isOpen: true,
                            message: 'Vui lòng chọn tàu chuyến và chọn số container!',
                            duration: 2000,
                            type: 'warning'
                          }
                        });
                      } else {
                        this.setState({
                          dialogSelectCus: {
                            isOpen: true,
                          }
                        })
                      }
                    }}
                    InputProps={{
                      style: { fontSize: "15px" },
                      startAdornment: (
                        <InputAdornment position="start">
                          <StoreIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button
                      type="button"
                      variant="outlined"
                      startIcon={<PrintIcon />}
                      onClick={() => {
                        this.setState({
                          dialogInCongVan: {
                            isOpen: true,
                            dataTable: this.state.dataTable,
                            CUSTOMER_NAME: this.state.CONSIGNEE.CUSTOMER_NAME,
                            infoVessel: this.state.vessel,
                            infoCont: this.state.container
                          }
                        })

                      }}>
                      In Công Văn
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => this.handlePrintGoodsList()}
                      startIcon={<PrintIcon />}>
                      In Label
                    </Button>
                    <ImportExcel handleLoadImport={(data) => this.loadDataExcel(data)} />
                    <a href={this.state.CLASS_CODE === 1 ? "/templateExcel/Bảng kê danh mục hàng hoá_hướng nhập.xlsx" : "/templateExcel/Bảng kê danh mục hàng hoá_hướng xuất.xlsx"} download>
                      <Button
                        type="button"
                        variant="outlined"
                        startIcon={<CloudDownloadIcon />}
                      >Tải File Mẫu
                      </Button>
                    </a>
                    <Divider orientation="vertical" />
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
                    >Thêm dòng
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => this.handleSave()}
                      startIcon={<SaveIcon />}
                      color="success"
                    >Lưu
                    </Button>
                    <Divider orientation="vertical" />
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
                    >Xóa dòng</Button>
                  </Stack>
                </Stack>
                <Divider />
                <Grid item mt={1} md={12}>
                  <DataGrid
                    hideFooterSelectedRowCount={true}
                    className="m-table"
                    rows={this.state.dataTable}
                    isCellEditable={(params) => {
                      if (params.field === 'HOUSE_BILL' || params.field === "BOOKING_NO") {
                        if (params.row.status !== 'insert') {
                          return false;
                        } else {
                          return true;
                        }
                      } else {
                        return true;
                      }
                    }}
                    componentsProps={{
                      cell: {
                        tabIndex: 1
                      }
                    }}
                    onCellEditCommit={(params) => {
                      let temp = [...this.state.dataTable];
                      let checkLengthOfInput = false;
                      let flag = false;
                      this.state.dataTable.map((item, idx) => {
                        if (params.field === 'HOUSE_BILL' || params.field === 'BOOKING_FWD') {
                          if ((params.value === item.HOUSE_BILL || params.value === item.BOOKING_FWD) && params.id !== item.id) {
                            flag = true;
                          };
                        }
                        if (params.field === "COMMODITYDESCRIPTION" && params.value && params.value.length >= 255) {
                          flag = true;
                          checkLengthOfInput = true;
                        }
                        item.id = idx;
                        return true;
                      });
                      if (flag) {
                        this.setState({
                          dataTable: temp,
                          alert: {
                            isOpen: true,
                            message: checkLengthOfInput ? 'Mô tả hàng hóa không được nhập quá 255 ký tự!' : 'Số Housebill/Booking_FWD đã tồn tại!',
                            duration: 3000,
                            type: 'warning'
                          },
                          flag: false,
                          checkLengthOfInput: false
                        });
                        return

                      }
                      if (params.field === 'ITEM_TYPE_CODE') {
                        temp.map((data, idx) => {
                          if (params.id === data.id) {
                            data[params.value] = params.formattedValue;
                            if (data.status !== 'insert') {
                              data.status = 'update'
                            }
                          }
                          data.id = idx;
                          return true;
                        })
                      } else if (params.field === 'UNIT_CODE') {
                        temp.map((data, idx) => {
                          if (params.id === data.id) {
                            data[params.value] = params.formattedValue;
                            if (data.status !== 'insert') {
                              data.status = 'update'
                            }
                          }
                          data.id = idx;
                          return true;
                        })
                      } else {
                        temp.map((data, idx) => {
                          if (params.id === data.id) {
                            if (params.field === 'CBM') {
                              data[params.field] = params.value.replace(",", ".");
                            } else {
                              if (typeof params.value === 'string') {
                                data[params.field] = params.value.trim().toUpperCase();
                              } else {
                                data[params.field] = params.value;
                              }
                            }
                            if (data.status !== 'insert') {
                              data.status = 'update'
                            }
                          }
                          data.id = idx;
                          return data;
                        });
                      }
                      this.setState({ dataTable: temp })
                    }}
                    columns={
                      this.state.CLASS_CODE === 1 ? this.columns_Nhap
                        : this.columns_Xuat
                    }
                    sx={{ height: "63vh" }}
                    rowHeight={35}
                  />
                </Grid>
                <Grid item>
                  <Grid>
                    <Stack direction='row' spacing={4} justifyContent='flex-end' mt={2} divider={<Divider orientation="vertical" flexItem />}>
                      <Stack direction='row' spacing={2}>
                        <Typography sx={{ fontSize: 18, color: '#005c99' }}>Trọng lượng:</Typography>
                        <Typography sx={{ fontSize: 18, color: 'red', textAlign: 'end', marginRight: '18px' }}>{Number.parseFloat(this.state.total.CARGO_WEIGHT).toFixed(3)} </Typography>
                      </Stack>
                      <Stack direction='row' spacing={2}>
                        <Typography sx={{ fontSize: 18, color: '#005c99' }}>Số khối:</Typography>
                        <Typography sx={{ fontSize: 18, color: 'red', textAlign: 'end', marginRight: '18px' }}> {Number.parseFloat(this.state.total.CBM).toFixed(3)}</Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {
          this.state.dialogPrintGoodsList.isOpen
            ? <PrintingGoodsList
              dialog={this.state.dialogPrintGoodsList}
              handleCloseDialog={() => this.handleCloseDialogPrint()}
              dataPrint={this.state.dataTable.filter(p => p.isChecked === true)}
              container={this.state.container}
              value={this.state.CLASS_CODE}
            >
            </PrintingGoodsList>
            : ""
        }
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
          handleAddRows={(rowCount) => this.handleAddRow(rowCount)}
        >
        </AddRows>
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
        <CustomerSelect
          dialog={this.state.dialogSelectCus}
          handleSelect={(data) => {
            if (Object.keys(data).length > 0) {
              let temp = [...this.state.dataTable];
              if (this.state.dataTable.length) {
                temp.map(data => {
                  if (data.status !== 'insert') {
                    data.status = 'update'
                  }
                  return data;
                });
              }
              this.setState({
                dataTable: temp,
                CONSIGNEE: data,
                dialogSelectCus: {
                  isOpen: false
                }
              })
            } else {
              this.setState({
                alert: {
                  isOpen: true,
                  message: 'Không có dữ liệu!',
                  duration: 2000,
                  type: 'error'
                }
              })
              return;
            }
          }}
          handleCloseDialog={() => {
            this.setState({
              dialogSelectCus: {
                isOpen: false
              }
            })
          }} />
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
        {this.state.dialogInCongVan.isOpen === true
          ?
          <InCongVan
            dialog={this.state.dialogInCongVan}
            handleCloseDialog={() => {
              this.setState({
                dialogInCongVan: {
                  isOpen: false
                }
              })
            }}
          />
          : ''
        }
      </Box >
    );
  }
}
BangKeDanhMucHangHoaNhapXuat.defaultProps = { multiple: true };
export default BangKeDanhMucHangHoaNhapXuat;
