
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import * as React from "react";
import * as moment from "moment";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from '@mui/x-data-grid';
import ExportCSV from "../../components/caiDat/ExportCSV";
import {
  Box,
  Button,
  FormControlLabel,
  Autocomplete,
  Radio,
  Select,
  ListItemText,
  RadioGroup,
  DialogActions,
  Checkbox,
  Dialog,
  MenuItem,
  DialogTitle,
  DialogContent,
  FormControl,
  Stack,
  Card,
  Paper,
  CardContent,
  Grid,
  TextField,
  Divider,

} from "@mui/material";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import MuiAlert from '@mui/material/Alert';
import AddRows from "../../componentsCFS2/dialog/AddRows";
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class ItemsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmPopup: {
        isOpen: false,
      },
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
      equipTypeCode: [],
      isOpen: false,
      dataTable: [],
      BlockItem: [],
      selectedBlock: [],
      storageList: [],
      selectedStorage: {},
      blockData: [],
      data: {
        STT: "",
        EQU_TYPE: "",
        EQU_CODE: "",
        EQU_CODE_NAME: '',
      },
      tableFilter: {
        EQU_TYPE: '',
      },
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
      },
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.columns = [
      {
        field: "STT",
        headerName: "STT",
        width: 100,
        headerAlign: 'center',
        align: 'center',
      },
      {
        field: "EQU_TYPE",
        headerName: 'Mã loại thiết bị',
        width: 100,
        editable: true,
        headerAlign: 'center',
        align: 'center',
        type: 'singleSelect',
        renderEditCell: (params) => {
          let CodeItem = '';
          return [
            <Autocomplete
              style={{ width: "100%" }}
              id="clear-on-escape"
              clearOnEscape
              options={this.state.equipTypeCode || []}
              onChange={(e, value) => {
                if (value) {
                  params.row.EQU_TYPE = value;
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
        field: "EQU_CODE",
        headerName: "Mã thiết bị",
        width: 100,
        headerAlign: 'center',
        align: 'center',
        editable: true
      },
      {
        field: "EQU_CODE_NAME",
        headerName: 'Tên thiết bị',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        editable: true,
      },
      {
        field: 'WAREHOUSE_CODE',
        headerName: 'Mã kho',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
      },
      {
        field: 'BLOCK',
        headerName: 'Block',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        editable: true,
        renderEditCell: (data) => {
          return (
            this.customEditCell(data)
          )
        },
      },
      {
        field: "ID",
        headerName: "ID",
        editable: false,
      },
    ]

    this.columnGroupingModel = [
      {
        groupId: 'Phân bổ',
        children: [{ field: 'WAREHOUSE_CODE' }, { field: 'BLOCK' }],
        headerClassName: 'b-column-group',
        headerAlign: 'center'
      }
    ]

    this.createBlocks = (data) => {
      let returnData = [];
      let stt = 0;
      for (let i = 0; i < data.length; i++) {
        let checkIsset = returnData.findIndex(e => e.WAREHOUSE_CODE === data[i].WAREHOUSE_CODE && e.BLOCK === data[i].BLOCK);
        if (checkIsset > -1) {
          if (data[i].TIER_COUNT > returnData[checkIsset]["TIER_COUNT"]) {
            returnData[checkIsset]["TIER_COUNT"] = data[i].TIER_COUNT;
          }

          if (data[i].SLOT_COUNT > returnData[checkIsset]["SLOT_COUNT"]) {
            returnData[checkIsset]["SLOT_COUNT"] = data[i].SLOT_COUNT;
          }
        } else {
          stt++;
          returnData.push({
            STT: stt,
            WAREHOUSE_CODE: data[i].WAREHOUSE_CODE,
            BLOCK: data[i].BLOCK,
            TIER_COUNT: 1,
            SLOT_COUNT: 1,
            STATUS: 1,
            ID: data[i].ID,
            id: data[i].WAREHOUSE_CODE + '-' + data[i].BLOCK
          });
        }
      }
      console.log(returnData)

      return returnData;
    };
    this.createRows = (data) => data.map((row, index) => ({
      STT: index + 1,
      id: index,
      ...row
    }),
    );
  }

  customEditCell(data, p) {
    if (data.value) {
      let selectedBlocks = data.value.split(',');
      return (
        <Select
          id="multiple-checkbox"
          multiple
          value={this.state.selectedBlock}
          sx={{ width: '100%' }}
          onChange={(e) => {
            let eventValue = e.target.value;
            let newValue = typeof eventValue === 'string' ? data.value.split(',') : eventValue;
            data.value = newValue.filter((x) => x !== '');
            data.row.BLOCK = data.value.toString();
            this.setState({
              selectedBlock: e.target.value
            })
          }}
          renderValue={(selected) => selected.join(', ')}
        >
          {this.state.blockData.map((item, index) => (
            <MenuItem key={item.BLOCK} value={item.BLOCK}>
              <Checkbox checked={selectedBlocks.includes(item.BLOCK) || this.state.selectedBlock.indexOf(item.BLOCK) > -1} />
              <ListItemText primary={item.BLOCK} />
            </MenuItem>
          ))}
        </Select>
      )
    } else {
      return (
        <Select
          id="multiple-checkbox"
          multiple
          value={this.state.selectedBlock}
          sx={{ width: '100%' }}
          onChange={(e) => {
            let eventValue = e.target.value;
            let newValue = typeof eventValue === 'string' ? data.value.split(',') : eventValue;
            data.value = newValue.filter((x) => x !== '');
            data.row.BLOCK = data.value.toString();
            this.setState({
              selectedBlock: e.target.value
            })
          }}
          renderValue={(selected) => selected.join(', ')}
        >
          {this.state.blockData.map((item) => (
            <MenuItem key={item.BLOCK} value={item.BLOCK}>
              <Checkbox checked={this.state.selectedBlock.indexOf(item.BLOCK) > -1} />
              <ListItemText primary={item.BLOCK} />
            </MenuItem>
          ))}
        </Select>
      )
    }
  }

  handleAddRow(rowCount) {
    let { dataTable } = this.state;
    let newRow = [];
    for (let i = 0; i < rowCount; i++) {
      let newData = {
        ...this.state.data,
        id: dataTable.length + i,
        STT: dataTable.length + i + 1,
        status: 'insert',
      }
      newRow.push(newData);
    }
    let mergeDataTable = [...newRow, ...dataTable].map((item, idx) => {
      item.id = idx;
      item.STT = idx + 1;
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
  }

  componentDidMount() {
    this.handleViewData();
    this.loadEquipType();
    this.handleLoadWareHouse();
  }

  loadEquipType() {
    let url = window.root_url + `bs-equipments-types/view`;
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
            return arr.push(item.EQU_TYPE);
          });
          this.setState({
            equipTypeCode: arr,
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

  handleSelectBLOCK(item) {
    let dataSend = {
      WAREHOUSE_CODE: item.WAREHOUSE_CODE,
    }
    fetch(window.root_url + `bs-blocks/view`, {
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
        let tempData = this.createBlocks(data.Payload);
        let temp = this.state.dataTable;
        temp.map(data => {
          if (data.isChecked === true) {
            if (!data.status) {
              data.status = 'update'
            }
            data.WAREHOUSE_CODE = item.WAREHOUSE_CODE
          }
          return item;
        });
        this.setState({
          blockData: tempData,
          dataTable: temp,
          isOpen: false
        });
      }).catch(err => {
        console.log(err);
      });
  }

  handleLoadWareHouse() {
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

  handleViewData() {
    let url = window.root_url + `bs-equipments/view`;
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
        if (data.length > 0) {
          let temp = this.createRows(data);
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

  handleSave() {
    let url = window.root_url + `bs-equipments/InsertAndUpdate`;
    let { dataTable } = this.state;
    let checkColumn = {
      EQU_TYPE: "Mã loại thiết bị",
      EQU_CODE: "Mã thiết bị",
      EQU_CODE_NAME: "Tên thiết bị"
    }
    let arr = [];
    let dataSend = dataTable.filter(p => p.status === 'insert' || p.status === 'update').map(data => {
      data[data.status === 'insert' ? 'CREATE_BY' : 'UPDATE_BY'] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
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
            let returnValue = response.Payload.find(p => p.EQU_CODE === item.EQU_CODE && p.EQU_CODE_NAME === item.EQU_CODE_NAME);
            if (returnValue !== undefined) {
              item.ID = returnValue.ID;
              item.id = index;
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

  handleDelete() {
    let url = window.root_url + `bs-equipments/delete`;
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

  //-----------------------------------
  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Card style={{ marginBottom: "12px" }}>
          <CardContent>
            <Grid container>
              <Grid item xs={12} spacing={2}>
                <Stack mb={1} direction="row" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>Tìm kiếm:</span>
                    <TextField
                      size="small"
                      id="tim-kiem"
                      onChange={(e) => {
                        this.setState({
                          tableFilter: {
                            EQU_TYPE: e.target.value.trim(),
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
                    <Button
                      size='small'
                      type='button'
                      className="m-btn m-secondary"
                      variant='outlined'
                      onClick={() => {
                        this.setState({
                          isOpen: true
                        })
                      }}
                      sx={{ width: '100px' }}
                      disabled={
                        this.state.dataTable.filter(p => p.isChecked === true).length > 0
                          ? false
                          : true
                      }>
                      Phân bổ
                    </Button>
                    <Divider flexItem orientation="vertical" />
                    <ExportCSV csvData={this.state.dataTable} fileName="DM-Thiet-Bi"></ExportCSV>
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
                      size="small"
                      type="button"
                      variant="outlined"
                      onClick={() => this.handleSave()}
                      startIcon={<SaveIcon />}
                      color="success"
                    >
                      Lưu
                    </Button>
                    <Divider orientation="vertical" />
                    <Button
                      size="small"
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        this.setState({
                          confirmPopup: {
                            isOpen: true,
                            message: 'Bạn có muốn xóa dữ liệu?'
                          }
                        })
                      }}
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
                      .filter(data => data.EQU_TYPE.toUpperCase().includes(this.state.tableFilter.EQU_TYPE.toUpperCase()))
                    }
                    rowHeight={35}
                    columns={this.columns}
                    columnVisibilityModel={{
                      ID: false
                    }}
                    columnGroupingModel={this.columnGroupingModel}
                    sx={{
                      height: "63vh",
                      '& .b-column-group': {
                      },
                    }}
                    isCellEditable={(params) => {
                      if (params.field === 'BLOCK') {
                        if (params.isChecked !== true && this.state.blockData.length === 0) {
                          return false;
                        } else {
                          return true;
                        }
                      } else {
                        return true;
                      }
                    }}
                    experimentalFeatures={{ columnGrouping: true }}
                    onSelectionModelChange={(ids) => {
                      let { dataTable, selectedStorage } = this.state;
                      if (Object.keys(selectedStorage).length > 0 && ids.length > 0) {
                        dataTable[ids.at(-1)]['WAREHOUSE_CODE'] = selectedStorage.WAREHOUSE_CODE;
                        dataTable.map(item => item['isChecked'] = ids.indexOf(item.id) >= 0);
                      } else {
                        dataTable.map(item => item['isChecked'] = ids.indexOf(item.id) >= 0);
                      }
                      this.setState({
                        dataTable: dataTable,
                        oldBlock: dataTable[ids.at(-1)]?.BLOCK

                      })
                    }}
                    onCellEditCommit={(params) => {
                      let temp = [...this.state.dataTable];
                      let oldBlock = this.state.oldBlock;
                      if (params.field === 'BLOCK') {
                        temp.map((data, idx) => {
                          if (params.id === data.id) {
                            if (oldBlock) {
                              data[params.field] = oldBlock + ',' + params.formattedValue;
                            } else {
                              data[params.field] = params.formattedValue;
                            }
                            if (data.status !== 'insert') {
                              data.status = 'update'
                            }
                          }
                          return true;
                        })
                      } else if (params.field === "EQU_TYPE") {
                        temp.map(data => {
                          if (params.id === data.id) {
                            data[params.value] = params.formattedValue;
                            if (data.status !== 'insert') {
                              data.status = 'update'
                            }
                          }
                          return true;
                        })
                      }
                      else {
                        temp.map(data => {
                          if (params.id === data.id) {
                            data[params.field] = params.value.trim();
                            if (data.status !== 'insert') {
                              data.status = 'update'
                            }
                          }
                          return true;
                        });
                      }
                      this.setState({ dataTable: temp, selectedBlock: [] })
                    }}
                    checkboxSelection
                    disableSelectionOnClick

                  >
                  </DataGrid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/* -------------------- Dialog -------------------- */}
        {
          this.state.isOpen === true
            ?
            <Dialog
              open={this.state.isOpen}
              scroll="paper"
              fullWidth={true}
              maxWidth="sm"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  this.setState({
                    isOpen: false
                  })
                }
              }}
            >
              <DialogTitle variant="h5" align="center">Chọn Kho</DialogTitle>
              <DialogContent >
                <Stack direction="row" justifyContent='center' spacing={2} sx={{ flexWrap: 'wrap', gap: '10px' }}>
                  {
                    this.state.storageList.map((item, index) => {
                      return (
                        <Paper
                          key={'Storage' + index}
                          align="center"
                          sx={{ width: "auto", height: '40px', position: 'relative' }}
                        >
                          <FormControl >
                            <RadioGroup
                              onChange={(e) => {
                                this.setState({
                                  selectedStorage: item
                                })
                              }}>
                              <FormControlLabel sx={{ marginLeft: '2px' }} value={item} keys={index} control={<Radio
                                onChange={(e) => {
                                  this.setState({
                                    selectedStorage: item
                                  })
                                  this.handleSelectBLOCK(item);
                                }}
                                checked={item.id === this.state.selectedStorage.id ? true : false}
                              />} label={item.WAREHOUSE_CODE} />
                            </RadioGroup>
                          </FormControl>
                        </Paper>
                      )
                    })
                  }
                </Stack>
              </DialogContent >
              <DialogActions>
                <Button
                  variant='contained'
                  onClick={() => {
                    this.setState({
                      isOpen: false
                    })
                  }}>
                  Đóng
                </Button>
              </DialogActions>
            </Dialog >
            : ''
        }
        {/* ---------------- Close - Dialog ---------------- */}
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
          }}
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
      </Box>
    )
  }
}
ItemsList.defaultProps = { multiple: true };
export default ItemsList;