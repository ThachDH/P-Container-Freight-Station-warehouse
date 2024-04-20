import * as React from "react";
import * as moment from "moment";
import SearchIcon from '@mui/icons-material/Search';
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from '@mui/x-data-grid';
import ExportCSV from "../../components/caiDat/ExportCSV";
import {
  Box,
  Button,
  Stack,
  Checkbox,
  Card,
  FormControl,
  Autocomplete,
  Radio,
  FormControlLabel,
  RadioGroup,
  CardContent,
  Grid,
  TextField,
  Divider,
} from "@mui/material";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import MuiAlert from '@mui/material/Alert';
import SelectVessel from "../../componentsCFS2/dialog/SelectVessel"
import AddRows from "../../componentsCFS2/dialog/AddRows";
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const dataIn = {
  STT: "",
  BILLOFLADING: null,
  CNTRNO: "",
  SEALNO: null,
  STATUSOFGOOD: '',
  CLASS_CODE: '',
  CNTRSZTP: '',
  ITEM_TYPE_CODE: '',
  COMMODITYDESCRIPTION: null,
}

const dataOut = {
  STT: "",
  BOOKING_NO: null,
  CNTRNO: "",
  SEALNO: null,
  STATUSOFGOOD: '',
  CLASS_CODE: '',
  CNTRSZTP: '',
  ITEM_TYPE_CODE: '',
  COMMODITYDESCRIPTION: null,
}
class Manifest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmPopup: {
        isOpen: false,
      },
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
      },
      ItemTypeCode: [],
      type: 1,
      dataTable: [],
      value: 1,
      dataIn: dataIn,
      dataOut: dataOut,
      a: '',
      CNTRNO: '',
      vessel: {},
      tableFilter: {
        CNTRNO: '',
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
        width: 100,
      },
      {
        field: "BILLOFLADING",
        headerName: 'Số vận đơn (*)',
        flex: 1,
        editable: true,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "CNTRNO",
        headerName: "Số container (*)",
        flex: 1,
        editable: true,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "CNTRSZTP",
        headerName: "Size Type (*)",
        flex: 1,
        editable: true,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "SEALNO",
        headerName: "Số niêm chì (*)",
        flex: 1,
        editable: true,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "STATUSOFGOOD",
        headerName: "Full/Empty (*)",
        type: 'singleSelect',
        flex: 1,
        editable: true,
        valueOptions: [{ label: 'Full', value: true }, { label: 'Empty', value: false }],
        renderCell: (item) => {
          if (item.value === true) {
            item.value = 'Full'
          } else if (item.value === false) {
            item.value = 'Empty'
          }
          return item.value;
        }
      },
      {
        field: "ITEM_TYPE_CODE",
        headerName: "Loại hàng hoá (*)",
        flex: 1,
        editable: true,
        type: 'singleSelect',
        renderEditCell: (params) => {
          let CodeItem = '';
          return [
            <Autocomplete
              style={{ width: "100%" }}
              id="clear-on-escape"
              clearOnEscape
              options={this.state.ItemTypeCode || []}
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
        field: "COMMODITYDESCRIPTION",
        headerName: "Mô tả hàng hoá",
        flex: 1,
        editable: true,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "ID",
        headerName: "ID",
        editable: false,
      },
    ]

    this.columns1 = [
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
        width: 100,
      },
      {
        field: "BOOKING_NO",
        headerName: 'BOOKING_NO (*)',
        flex: 1,
        editable: true,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },

      {
        field: "CNTRNO",
        headerName: "Số container (*)",
        flex: 1,
        editable: true,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "CNTRSZTP",
        headerName: "Size Type (*)",
        flex: 1,
        editable: true,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "SEALNO",
        headerName: "Số niêm chì",
        flex: 1,
        editable: true,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "STATUSOFGOOD",
        headerName: "Full/Empty",
        type: 'singleSelect',
        flex: 1,
        editable: true,
        valueOptions: [{ label: 'Full', value: true }, { label: 'Empty', value: false }],
        renderCell: (item) => {
          if (item.value === true) {
            item.value = 'Full'
          } else if (item.value === false) {
            item.value = 'Empty'
          }
          return item.value;
        }
      },

      {
        field: "ITEM_TYPE_CODE",
        headerName: "Mã loại hàng hoá (*)",
        flex: 1,
        editable: true,
        type: 'singleSelect',
        renderEditCell: (params) => {
          let CodeItem = '';
          return [
            <Autocomplete
              style={{ width: "100%" }}
              id="clear-on-escape"
              clearOnEscape
              options={this.state.ItemTypeCode || []}
              onChange={(e, value) => {
                if (value) {
                  params.row.ITEM_TYPE_CODE = value;
                  CodeItem = value
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
        headerName: "Mô tả hàng hoá",
        flex: 1,
        editable: true,
        valueFormatter: params => {
          return params.value ? params.value.toUpperCase() : ''
        }
      },
      {
        field: "ID",
        headerName: "ID",
        editable: false,
      },
    ]
    this.createRows = (data) => data.map((row, index) => ({
      STT: index + 1,
      id: index,
      ...row
    }),
    );
  }

  rowSelectHandle(idx, status) {
    const { dataTable } = this.state;
    let updateData = dataTable;
    updateData[idx]['isChecked'] = status;
    this.setState({
      dataTable: updateData
    })
  }

  getTos() {
    if (!this.state.vessel.TOS_SHIPKEY) {
      this.setState({
        alert: {
          isOpen: true,
          duration: 2000,
          message: 'Vui lòng chọn tàu chuyến!',
          type: 'warning'
        }
      })
      return
    }
    if (!this.state.CNTRNO) {
      this.setState({
        alert: {
          isOpen: true,
          duration: 2000,
          message: 'Vui lòng nhập số Container!',
          type: 'warning'
        }
      })
      return
    }
    let url = window.root_url + `dt-cntr-mnf-ld/CFStoVTOS_getManifestCntr`;
    let dataSend = {
      CNTRNO: this.state.CNTRNO,
      TOS_SHIPKEY: this.state.vessel.TOS_SHIPKEY,
      CLASS_CODE: this.state.value === 1 ? 1 : 2,
      CREATE_BY: JSON.parse(localStorage.getItem("userInfo")).name
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
          if (response.Payload.length) {
            let newData = response.Payload.map((item, idx) => {
              item.status = 'insert';
              if (item.STATUSOFGOOD === 'F') {
                item.id = idx + 'tos'
                item.STATUSOFGOOD = true;
              } else {
                item.id = idx + 'tos'
                item.STATUSOFGOOD = false;
              }
              return item;
            })
            let temp = this.createRows(newData);
            this.setState({
              dataTable: temp,
              alert: {
                isOpen: true,
                type: "success",
                duration: 2000,
                message: response.Message
              },
            })
          } else {
            this.setState({
              alert: {
                isOpen: true,
                type: "warning",
                duration: 3000,
                message: response.Message
              },
            })
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

  handleAddRow(rowCount) {
    let { dataTable } = this.state;
    let newRow = [];
    let newData = {};
    if (this.state.vessel.VOYAGEKEY !== undefined) {
      for (let i = 0; i < rowCount; i++) {
        if (this.state.value === 'in') {
          newData = {
            ...this.state.dataIn,
            status: 'insert',
          }
        } else {
          newData = {
            ...this.state.dataOut,
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

  selectedVessel(data) {
    if (data) {
      let newData = { ...data }
      this.setState({
        vessel: newData,
        dataTable: []
      })
    }
  }

  componentDidMount() {
    this.LoadItemTypeCode();
  }

  handleViewData() {
    let url = window.root_url + `dt-cntr-mnf-ld/view`;
    let dataSend = {
      VOYAGEKEY: this.state.vessel.VOYAGEKEY,
      CLASS_CODE: this.state.value === 1 ? 1 : 2
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
          this.setState({
            dataTable: temp,
            alert: {
              isOpen: true,
              type: "success",
              duration: 3000,
              message: "Nạp dữ liệu thành công!"
            },
          })
        }
        else {
          this.setState({
            dataTable: [],
            alert: {
              type: 'warning',
              message: 'Không tìm thấy dữ liệu!',
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

  LoadItemTypeCode() {
    let url = window.root_url + `bs-item-types/view`;
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
        let arr = [];
        if (data) {
          data.map(item => {
            return arr.push(item.ITEM_TYPE_CODE);
          });
          this.setState({
            ItemTypeCode: arr,
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

  handleInsertOrUpdate() {
    let url = window.root_url + `dt-cntr-mnf-ld/insertAndUpdate`;
    let { dataTable } = this.state;
    let checkColumn = {
      CNTRNO: "Số container",
      CLASS_CODE: 'Hướng',
      CNTRSZTP: 'SizeType',
      SEALNO: "Số niệm chỉ",
      ITEM_TYPE_CODE: "Loại hàng hóa",
    }
    let checkEmptySend = true;
    let arr = [];
    let dataSend = dataTable.filter(p => p.status === 'insert' || p.status === 'update').map(data => {
      data[data.status === 'insert' ? 'CREATE_BY' : 'UPDATE_BY'] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
      data.VOYAGEKEY = this.state.vessel.VOYAGEKEY
      data.CLASS_CODE = this.state.value
      data.TRANSPORTIDENTITY = this.state.vessel.VESSEL_NAME
      data.NUMBEROFJOURNEY = this.state.value === 1 ? this.state.vessel.INBOUND_VOYAGE : this.state.vessel.OUTBOUND_VOYAGE;
      data.ARRIVALDEPARTURE = this.state.value === 1 ? moment(this.state.vessel.ETA, "DD/MM/YYYY HH:mm:ss").format('YYYY-MM-DD HH:mm:ss') : moment(this.state.vessel.ETD, "DD/MM/YYYY HH:mm:ss").format('YYYY-MM-DD HH:mm:ss');
      if (!(data.STATUSOFGOOD === true || data.STATUSOFGOOD === false)) {
        checkEmptySend = false;
      }
      Object.keys(data).map((key) =>{
        if (!data[key] && key!='STATUSOFGOOD') {
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
    if (!checkEmptySend) {
      this.setState({
        alert: {
          isOpen: true,
          duration: 3000,
          message: "Tình trạng không được phép để trống!",
          type: "error"
        }
      });
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
            let returnValue = response.Payload.find(p => p.CNTRNO === item.CNTRNO && p.CLASS_CODE === item.CLASS_CODE);
            item.id = index;
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
              duration: 3000,
              message: response.Message,
              type: "success"
            }
          })
        } else {
          let returnValue = [];
          response.Payload.map((item) => {
            returnValue = dataTable.filter(p => p.VOYAGEKEY !== item.VOYAGEKEY
              && p.CNTRNO !== item.CNTRNO
              && p.NUMBEROFJOURNEY !== item.NUMBEROFJOURNEY
              && p.CLASS_CODE !== item.CLASS_CODE);
            return returnValue;
          });
          let newData = returnValue.map((itm, idx) => {
            itm['STT'] = idx + 1;
            return itm;
          });
          this.setState({
            dataTable: newData,
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message !== '' ? response.Message : 'Không có dữ liệu',
              type: "warning"
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

  handleDelete() {
    let url = window.root_url + `dt-cntr-mnf-ld/delete`;
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
              duration: 3000,
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
            <Grid>
              <Divider textAlign="center">
                <span className="m-filter-title">Lọc dữ liệu</span>
              </Divider>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <SelectVessel
                  handleSelected={(data) => this.selectedVessel(data)}>
                </SelectVessel>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={1} sx={{ padding: "15px " }}>
                  <Stack direction="row" gap="12px" >
                    <Stack direction="row" alignItems="center">
                      <TextField
                        id="so-cnt"
                        size="small"
                        label="Số Container"
                        value={this.state.CNTRNO}
                        onChange={(newValue) => {
                          this.setState({
                            CNTRNO: newValue.target.value,
                          })
                        }}
                      />
                    </Stack>
                  </Stack>
                  <Divider orientation="vertical" flexItem />

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
                                value: 1,
                                type: 1,
                                dataTable: [],
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
                                value: 2,
                                dataTable: [],
                                type: 2,
                              })
                            }} />} label=" Hướng Xuất" />
                    </RadioGroup>
                  </FormControl>
                  <Divider orientation="vertical" flexItem />

                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => this.handleViewData()} >
                    Nạp dữ liệu
                  </Button>
                  <Button
                    size="small"
                    type="button"
                    variant="contained"
                    onClick={() => this.getTos()}
                  >
                    Lấy dữ liệu TOS
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card style={{ marginBottom: "12px" }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <Stack mb={1} direction="row" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>Tìm kiếm:</span>
                    <TextField
                      size="small"
                      id="tim-kiem"
                      label='Số Container'
                      onChange={(e) => {
                        this.setState({
                          tableFilter: {
                            CNTRNO: e.target.value,
                          }
                        });
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon
                              style={{ cursor: "default" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <ExportCSV csvData={this.state.dataTable} fileName="DS-khach-hang"></ExportCSV>
                    <Divider orientation="vertical" />
                    <Button
                      size="small"
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
                    >
                      Xóa dòng
                    </Button>

                  </Stack>
                </Stack>
                <Divider />
                <Grid item mt={1} md={12}>
                  <DataGrid
                    className="m-table"
                    rows={(this.state.dataTable)
                      .filter(data => data.CNTRNO.toUpperCase().includes(this.state.tableFilter.CNTRNO.toUpperCase()))
                    }
                    rowHeight={35}
                    columns={
                      this.state.value === 1
                        ? this.columns
                        : this.columns1
                    }
                    columnVisibilityModel={{
                      ID: false
                    }}
                    sx={{ height: "63vh" }}
                    onCellEditCommit={(params) => {
                      let temp = [...this.state.dataTable];
                      if (params.field === 'ITEM_TYPE_CODE') {
                        temp.map(data => {
                          if (params.id === data.id) {
                            data[params.value] = params.formattedValue;
                            if (data.status !== 'insert') {
                              data.status = 'update'
                            }
                          }
                          return true;
                        })
                      } else if (params.field === 'STATUSOFGOOD') {
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
                  >
                  </DataGrid>
                </Grid>
              </Grid>
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
          handleAddRows={(rowCount) => this.handleAddRow(rowCount)}
        >
        </AddRows>
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
Manifest.defaultProps = { multiple: true };
export default Manifest;