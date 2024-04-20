import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Divider,
  Grid,
  Card,
  CardContent,
  FormControl,
  Autocomplete,
  Box,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import MuiAlert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ConfirmPopup from "./ConfirmPopup";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class ContainerSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmPopup: {
        isOpen: false,
      },
      dataTable: [],
      deleteRow: {},
      ItemTypeCode: [],
      orientation: this.props.orientation === "vertical" ? false : true,
      selectedContainer: {
        SEALNO: '',
        CNTRNO: '',
        CNTRSZTP: '',
        BILLOFLADING: '',
        BOOKING_NO: '',
        ITEM_TYPE_CODE: '',
        STATUSOFGOOD: '', 
        COMMODITYDESCRIPTION: '',
      },
      isOpen: false,
      dataFilter: {
        CNTRNO: '',
      },
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
      deleteRow: {}
    };
    this.columns = [
      {
        field: "BILLOFLADING",
        headerName: 'Số vận đơn',
        flex: 1,
      },

      {
        field: "CNTRNO",
        headerName: "Số container",
        flex: 1,
      },
      {
        field: "CNTRSZTP",
        headerName: "Size Type",
        flex: 1,
      },
      {
        field: "SEALNO",
        headerName: "Số niêm chì",
        flex: 1,
      },
      {
        field: "STATUSOFGOOD",
        headerName: "FULL/EMPTY",
        flex: 1,
        valueGetter: params => {
          if (params.value === false) {
            return params.value = 'Empty'
          } else {
            return params.value = 'Full';
          }
        }
      },
      {
        field: "CLASS_CODE",
        headerName: "Hướng",
        flex: 1,
      },
      {
        field: "ITEM_TYPE_CODE",
        headerName: "Mã loại hàng hoá",
        flex: 1,
      },
      {
        field: "tacvu",
        headerName: "Tác vụ",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          return (
            <Tooltip title="Xóa" placement="right" >
              <IconButton>
                <DeleteOutlineIcon
                  onClick={() =>
                    this.setState({
                      deleteRow: params.row,
                      confirmPopup: {
                        isOpen: true,
                        message: "Bạn có muốn xóa dữ liệu?",
                      },
                    })
                  }
                />
              </IconButton>
            </Tooltip>
          );
        },
      }
    ];
    this.columns2 = [
      {
        field: "BOOKING_NO",
        headerName: 'Booking',
        flex: 1,
      },

      {
        field: "CNTRNO",
        headerName: "Số container",
        flex: 1,
      },
      {
        field: "CNTRSZTP",
        headerName: "Size Type",
        flex: 1,
      },
      {
        field: "SEALNO",
        headerName: "Số niêm chì",
        flex: 1,
      },
      {
        field: "STATUSOFGOOD",
        headerName: "FULL/EMPTY",
        flex: 1,
      },
      {
        field: "CLASS_CODE",
        headerName: "Hướng",
        flex: 1,
      },
      {
        field: "ITEM_TYPE_CODE",
        headerName: "Mã loại hàng hoá",
        flex: 1,
      },
      {
        field: "tacvu",
        headerName: "Tác vụ",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          return (
            <Tooltip title="Xóa" placement="right" >
              <IconButton>
                <DeleteOutlineIcon
                  onClick={() =>
                    this.setState({
                      deleteRow: params.row,
                      confirmPopup: {
                        isOpen: true,
                        message: "Bạn có muốn xóa dữ liệu?",
                      },
                    })
                  }
                />
              </IconButton>
            </Tooltip>
          );
        },
      }
    ];
    this.createRows = (data) => data.map((row, index) => ({
      STT: index + 1,
      id: index,
      ...row
    }),
    );
  }

  handleDeleteCont() {
    const { deleteRow } = this.state;
    let url = window.root_url + `/dt-cntr-mnf-ld/deleteCntrAndGoods`;
    let dataSend = this.state.deleteRow
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
          let temp = this.state.dataTable.filter(p => this.props.selectedClassCode === 1 ? p.BILLOFLADING !== deleteRow.BILLOFLADING : p.BOOKING_NO !== deleteRow.BOOKING_NO && p.CNTRNO !== deleteRow.CNTRNO);
          temp = temp.map((item, idx) => {
            item.STT = idx + 1
            item.id = idx
            return item;
          });
          this.props.handleDeleteContainer(this.state.deleteRow);
          this.setState({
            dataTable: temp,
            alert: {
              isOpen: true,
              message: response.Message,
              duration: 3000,
              type: 'success',
            },
            selectedContainer: {
              SEALNO: '',
              CNTRNO: '',
              CNTRSZTP: '',
              BILLOFLADING: '',
              BOOKING_NO: '',
              ITEM_TYPE_CODE: '',
              STATUSOFGOOD: '',
              COMMODITYDESCRIPTION: '',
            },
          })
        } else {
          this.setState({
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

  clearData() {
    this.setState({
      selectedContainer: {
        SEALNO: '',
        CNTRNO: '',
        CNTRSZTP: '',
        BILLOFLADING: '',
        BOOKING_NO: '',
        ITEM_TYPE_CODE: '',
      }
    })
  }

  //Binh - lưu và render những Container đã chọn
  selected(params) {
    if (params) {
      this.props.handleSelectContainer(params.row);
    } else {
      const { selectedContainer } = this.state;
      this.props.handleSelectContainer(selectedContainer);
      if (selectedContainer.CNTRNO.length === 0) {
        this.setState({
          alert: {
            isOpen: true,
            duration: 2000,
            message: 'không có dữ liệu',
            type: 'warning',
          }
        });
        return;
      }
    }
    this.setState({
      isOpen: false,
    });
  }

  componentDidMount() {
    this.LoadItemTypeCode();
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

  loadContainer() {
    let url = window.root_url + `dt-cntr-mnf-ld/view`;
    let dataSend = {
      VOYAGEKEY: this.props.selectedVessel.VOYAGEKEY,
      CLASS_CODE: this.props.selectedClassCode === 1 ? 1 : 2
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
            dataTable: temp,
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
              message: JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }

  handleContInfo(e, autoCompleteValue) {
    if (e === "STATUSOFGOOD" || e === 'ITEM_TYPE_CODE') {
      this.setState((prevState) => {
        return {
          selectedContainer: {
            ...prevState.selectedContainer,
            [e]: autoCompleteValue,
          }
        }
      }
      )
    } else {
      let key = e.target.id
      this.setState((prevState) => {
        return {
          selectedContainer: {
            ...prevState.selectedContainer,
            [key]: e.target.value.toUpperCase(),
          }
        }
      }
      )
    }
    setTimeout(() => {
      if (this.state.selectedContainer.CNTRNO && this.state.selectedContainer.CNTRSZTP && this.state.selectedContainer.ITEM_TYPE_CODE) {
        this.props.handleInputContainer(this.state.selectedContainer);
      }
    }, 100)
  }

  //-----------------------------------
  render() {
    return (
      <Box>
        <Grid container columnSpacing={1} rowSpacing={2}>
          <Grid item md={this.state.orientation ? 2 : 12}>
            <Button variant="contained"
              fullWidth
              onClick={() => {
                this.loadContainer()
                this.setState({ isOpen: true })
              }}
            >Chọn Container</Button>
          </Grid>
          {
            this.props.selectedClassCode === 2
              ?
              <Grid item md={this.state.orientation ? this.props.selectedClassCode === 2 ? 1.5 : 2 : 6}>
                <TextField
                  inputProps={{ readOnly: Object.keys(this.props.selectedVessel).length > 0 ? false : true }}
                  style={{ marginTop: '-15px' }}
                  fullWidth
                  id="BOOKING_NO"
                  variant="standard"
                  label="Booking No"
                  value={this.state.selectedContainer.BOOKING_NO}
                  onChange={(e) => { this.handleContInfo(e) }} />
              </Grid>
              : ''
          }
          <Grid item md={this.state.orientation ? this.props.selectedClassCode === 2 ? 1.5 : 2 : 6}>
            <TextField style={{ marginTop: '-15px' }} inputProps={{ maxLength: 11 }} type='text' fullWidth id="CNTRNO" variant="standard" label="Số cont" value={this.state.selectedContainer.CNTRNO} onChange={(e) => { this.handleContInfo(e) }} />
          </Grid>
          <Grid item md={this.state.orientation ? this.props.selectedClassCode === 2 ? 1 : 1.5 : 6}>
            <Autocomplete
              id="ITEM_TYPE_CODE"
              value={this.state.selectedContainer.ITEM_TYPE_CODE}
              clearOnEscape
              style={{ width: "100%", marginTop: '-19px' }}
              autoHighlight
              disableClearable
              openOnFocus
              selectOnFocus
              options={this.state.ItemTypeCode || []}
              onChange={(e, value) => {
                if (value) {
                  this.handleContInfo('ITEM_TYPE_CODE', value)
                }
              }}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  label='Loại hàng hóa'
                  value={this.state.selectedContainer.ITEM_TYPE_CODE}
                  variant="standard"
                  multiline
                  {...params} />
              )}
            />
            {/* <TextField style={{marginTop:'-15px'}} fullWidth id="ITEM_TYPE_CODE"  variant="standard" label="Mã loại hàng"  value={this.state.selectedContainer.ITEM_TYPE_CODE} onChange={(e)=>{this.handleContInfo(e)}} /> */}
          </Grid>
          <Grid item md={this.state.orientation ? this.props.selectedClassCode === 2 ? 2 : 2 : 6}>
            <TextField style={{ marginTop: '-15px' }} fullWidth id="SEALNO" variant="standard" label="Số niêm chì" value={this.state.selectedContainer.SEALNO} onChange={(e) => { this.handleContInfo(e) }} />
          </Grid>
          <Grid item md={this.state.orientation ? this.props.selectedClassCode === 2 ? 1 : 1.5 : 6}>
            <TextField style={{ marginTop: '-15px' }} fullWidth id="CNTRSZTP" variant="standard" label="Kích cỡ" value={this.state.selectedContainer.CNTRSZTP} onChange={(e) => { this.handleContInfo(e) }} />
          </Grid>
          <Grid item md={this.state.orientation ? this.props.selectedClassCode === 2 ? 1 : 1.5 : 6}>
            <Autocomplete
              value={this.state.selectedContainer.STATUSOFGOOD}
              autoHighlight
              disableClearable
              openOnFocus
              selectOnFocus
              style={{ width: "100%", marginTop: '-15px' }}
              id="STATUSOFGOOD"
              options={[true, false]}
              getOptionLabel={(params) => {
                if (params === true) {
                  params = 'Full'
                } else if (params === false) {
                  params = 'Empty'
                }
                return params;
              }}
              onChange={(e, value) => {
                this.handleContInfo('STATUSOFGOOD', value)
              }}
              renderInput={(params) => (
                <TextField
                  label="Full/Empty"
                  variant="standard"
                  value={this.state.selectedContainer.STATUSOFGOOD}
                  fullWidth
                  {...params} />
              )}
            />
          </Grid>
          <Grid item md={this.state.orientation ? this.props.selectedClassCode === 2 ? 2 : 1.5 : 6}>
            <TextField style={{ marginTop: '-15px' }} fullWidth id="COMMODITYDESCRIPTION" variant="standard" label="Mô tả hàng hóa" value={this.state.selectedContainer.COMMODITYDESCRIPTION} onChange={(e) => { this.handleContInfo(e) }} />
          </Grid>
        </Grid>
        <Dialog
          open={this.state.isOpen}
          scroll="paper"
          fullWidth={true}
          maxWidth="lg"
        >
          <DialogTitle variant="h5">Chọn Container</DialogTitle>
          <Divider />
          <DialogContent>
            <Card sx={{ mb: 1 }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Tìm kiếm:</span>
                  <FormControl>
                    <TextField
                      size="small"
                      id="tim-kiem"
                      label='Số cont'
                      onChange={(e) => {
                        this.setState({
                          dataFilter: {
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
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Grid item mt={1} md={12}>
                  <DataGrid
                    className="m-table"
                    onRowClick={(params) => {
                      this.setState({
                        selectedContainer: params.row
                      })
                    }}
                    onRowDoubleClick={(params) => this.selected(params)}
                    rows={(this.state.dataTable)
                      .filter(data => data.CNTRNO.toUpperCase().includes(this.state.dataFilter.CNTRNO.toUpperCase()))
                    }
                    rowHeight={35}
                    columns={
                      this.props.selectedClassCode === 1
                        ? this.columns : this.columns2
                    }
                    columnVisibilityModel={{
                      ID: false
                    }}
                    sx={{ height: "63vh" }}
                    onCellEditCommit={(params) => {
                      let temp = [...this.state.dataTable];
                      temp.map(data => {
                        if (params.id === data.id) {
                          data[params.field] = params.value;
                          if (data.status !== 'insert') {
                            data.status = 'update'
                          }
                        }
                        return true;
                      });
                      this.setState({ dataTable: temp })
                    }}
                  >
                  </DataGrid>
                </Grid>
              </CardContent>
            </Card>
          </DialogContent >
          <DialogActions>
            <Button onClick={() => { this.setState({ isOpen: false }) }}>Đóng</Button>
            <Button onClick={() => this.selected()} variant="contained">
              Chọn
            </Button>
          </DialogActions>
          {/* -------------------- global alert -------------------- */}

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
                this.handleDeleteCont()
              } else {
                this.setState({
                  confirmPopup: {
                    isOpen: false
                  },
                  deleteRow: {}
                })
              }
            }
            }
          />
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
      </Box >
    );
  }
}
export default ContainerSelect;
