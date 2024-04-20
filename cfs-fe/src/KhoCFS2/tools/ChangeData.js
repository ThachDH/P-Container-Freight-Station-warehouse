import * as React from "react";
import * as moment from "moment";
import {
  Box,
  Stack,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Divider,
  Checkbox
} from "@mui/material";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { DataGrid } from "@mui/x-data-grid";
import SelectVessel from "../../componentsCFS2/dialog/SelectVessel";
import ContainerSelect from "../../componentsCFS2/dialog/ContainerSelect";
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class ChangeData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vessel: {},
      container: {},
      CLASS_CODE: 1,
      dataTable: [],
      HOUSE_BILL: '',
      BOOKING_FWD: '',
      confirmPopup: {
        isOpen: false,
        type: 1,
        statusUpdate: true,
        paramsSelected: {}
      },
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.myRef = React.createRef();
    this.columns_Nhap = [
      {
        field: "STT",
        headerName: "STT",
        align: "center",
        headerAlign: "center",
        width: 30,
      },
      {
        field: "HOUSE_BILL",
        headerName: "Số House_Bill",
        align: "center",
        headerAlign: "center",
        flex: 1,
        width: 80,
      },
      {
        field: "TIME_IN",
        headerName: "Ngày nhập kho",
        align: "center",
        headerAlign: "center",
        flex: 1,
        width: 80,
        renderCell: (params) => {
          if (params.value) {
            params.value = moment(params.value).format('DD/MM/YYYY HH:mm:ss:')
          }
          return params.value
        }
      },
      {
        field: "ITEM_TYPE_CODE",
        headerName: "Loại hàng",
        align: "center",
        headerAlign: "center",
        flex: 1,
        width: 80,
      },
      {
        field: "CARGO_PIECE",
        headerName: "Số lượng",
        align: "center",
        flex: 1,
        headerAlign: "center",
        width: 80,
      },
      {
        field: "CARGO_WEIGHT",
        headerName: "Trọng lượng",
        align: "center",
        flex: 1,
        headerAlign: "center",
        width: 80,
      },
      {
        field: "CBM",
        headerName: "Số khối",
        align: "center",
        flex: 1,
        headerAlign: "center",
        width: 80,
      },
      {
        field: "UNIT_CODE",
        headerName: "Đơn vị tính",
        align: "center",
        flex: 1,
        headerAlign: "center",
        width: 80,
      },
      {
        field: "TLHQ",
        headerName: "TLHQ",
        flex: 1,
        align: "center",
        headerAlign: "center",
        type: 'actions',
        editable: true,
        getActions: (params) => {
          // return params.value;
          return [
            <Checkbox
              onChange={(event) => {
                this.setState({
                  confirmPopup: {
                    isOpen: true,
                    statusUpdate: event.target.checked,
                    paramsSelected: params
                  }
                })
                // this.rowSelectHandle(params.row.STT - 1, event.target.checked);
              }}
              checked={
                params.row.TLHQ === true ? true : false
              }
            ></Checkbox>
          ];
        }
      },
    ];

    this.columns_Xuat = [
      {
        field: "STT",
        headerName: "STT",
        align: "center",
        headerAlign: "center",
        width: 30,
      },
      {
        field: "BOOKING_FWD",
        headerName: "Số Booking_FWD",
        align: "center",
        headerAlign: "center",
        flex: 1,
        width: 80,
      },
      {
        field: "TIME_IN",
        headerName: "Ngày nhập kho",
        align: "center",
        headerAlign: "center",
        flex: 1,
        width: 80,
        renderCell: (params) => {
          if (params.value) {
            params.value = moment(params.value).format('DD/MM/YYYY HH:mm:ss:')
          }
          return params.value
        }
      },
      {
        field: "ITEM_TYPE_CODE",
        headerName: "Loại hàng",
        align: "center",
        headerAlign: "center",
        flex: 1,
        width: 80,
      },
      {
        field: "CARGO_PIECE",
        headerName: "Số lượng",
        align: "center",
        flex: 1,
        headerAlign: "center",
        width: 80,
      },
      {
        field: "CARGO_WEIGHT",
        headerName: "Trọng lượng",
        align: "center",
        flex: 1,
        headerAlign: "center",
        width: 80,
      },
      {
        field: "CBM",
        headerName: "Số khối",
        align: "center",
        flex: 1,
        headerAlign: "center",
        width: 80,
      },
      {
        field: "UNIT_CODE",
        headerName: "Đơn vị tính",
        align: "center",
        flex: 1,
        headerAlign: "center",
        width: 80,
      },
      {
        field: "TLHQ",
        headerName: "TLHQ",
        flex: 1,
        align: "center",
        headerAlign: "center",
        type: 'actions',
        editable: true,
        getActions: (params) => {
          // return params.value;
          return [
            <Checkbox
              onChange={(event) => {
                this.setState({
                  confirmPopup: {
                    isOpen: true,
                    statusUpdate: event.target.checked,
                    paramsSelected: params
                  }
                })
                // this.rowSelectHandle(params.row.STT - 1, event.target.checked);
              }}
              checked={
                params.row.TLHQ === true ? true : false
              }
            ></Checkbox>
          ];
        }
      },
    ];
  };
  updateTLHQ(key, status) {
    let url = window.root_url + `dt-package-stock/updateTLHQ`;
    let dataSend = {
      ID: key,
      TLHQ: status
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
          this.setState({
            alert: {
              isOpen: true,
              type: "success",
              message: data.Message,
            },
          })
        } else {
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
  }
  rowSelectHandle(idx, status) {
    let updateData = this.state.dataTable;
    updateData[idx]['TLHQ'] = status;
    this.setState({
      dataTable: updateData
    });
  }
  createRows = (data) => data.map((row, index) => ({
    id: index,
    STT: index + 1,
    ...row
  }));

  selectedVessel(data) {
    if (Object.keys(data).length) {
      let newData = { ...data }
      this.setState({
        vessel: newData,
        dataTable: []
      });
    }
  }
  selectedContainer(data) {
    if (Object.keys(data).length) {
      let newData = { ...data }
      this.setState({
        container: newData,
        dataTable: []
      })
    }
  }
  handleTable() {
    let url = window.root_url + `dt-package-stock/filterStock`;
    let dataSend = {
      CLASS_CODE: Number(this.state.CLASS_CODE),
      VOYAGEKEY: this.state.vessel.VOYAGEKEY,
      CNTRNO: this.state.container.CNTRNO,
      HOUSE_BILL: this.state.HOUSE_BILL,
      BOOKING_FWD: this.state.BOOKING_FWD,
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
          let temp = this.createRows(data.Payload);
          this.setState({
            dataTable: temp,
            alert: {
              isOpen: true,
              type: "success",
              message: data.Message,
            },
          })
        } else {
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
  }

  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Grid container spacing={1}>
          <Grid item xs={3} >
            <Card style={{ marginBottom: "12px" }}>
              <CardContent style={{ marginTop: -10 }}>
                <Grid >
                  <Divider textAlign="center" sx={{ mt: "11px" }}> Lọc dữ liệu</Divider>
                  <Grid item md={12}>
                    <SelectVessel
                      orientation="vertical"
                      handleSelected={(data) => this.selectedVessel(data)}
                    >
                    </SelectVessel>
                  </Grid>
                  <Grid item md={12}>
                    <ContainerSelect
                      orientation="vertical"
                      handleSelectContainer={(data) => this.selectedContainer(data)}
                      selectedVessel={this.state.vessel}
                      selectedClassCode={this.state.CLASS_CODE}
                      ref = {this.myRef}
                      >
                    </ContainerSelect>
                  </Grid>
                  <Grid item md={12}>
                    <Stack direction="row" spacing={1} sx={{ padding: "10px 0" }}>
                      <FormControl>
                        <RadioGroup
                          sx={{ marginLeft: "2vh" }}
                          name="filterType"
                          row
                          value={this.state.CLASS_CODE}
                          onChange={(e) => {
                            this.setState({
                              HOUSE_BILL: '',
                              BOOKING_FWD: '',
                              CLASS_CODE: Number(e.target.value)
                            })
                          }} >
                          <FormControlLabel
                            value={1}
                            control={
                              <Radio
                                onChange={(event) => {
                                  this.myRef.current.clearData();
                                  this.setState({
                                    CLASS_CODE: 1,
                                    dataTable: [],
                                    container : {}
                                  })
                                }}
                              />}
                            label=" Hướng Nhập" />
                          <FormControlLabel
                            value={2}
                            control={
                              <Radio
                                onChange={(event) => {
                                  this.myRef.current.clearData();
                                  this.setState({
                                    CLASS_CODE: 2,
                                    dataTable: [],
                                    container : {}
                                  })
                                }} />} label=" Hướng Xuất" />
                        </RadioGroup>
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item md={12}>
                    {this.state.CLASS_CODE === 1 ? <TextField
                      label='Số House_Bill'
                      fullWidth
                      size="small"
                      value={this.state.HOUSE_BILL}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          this.handleTable();
                        }
                      }}
                      onChange={(e) => {
                        this.setState({
                          HOUSE_BILL: e.target.value.trim()
                        })
                      }}
                    ></TextField> : <TextField
                      label='Số Booking_FWD'
                      fullWidth
                      size="small"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          this.handleTable();
                        }
                      }}
                      value={this.state.BOOKING_FWD}
                      onChange={(e) => {
                        this.setState({
                          BOOKING_FWD: e.target.value.trim()
                        })
                      }}
                    ></TextField>}
                  </Grid>
                </Grid>
                <Grid item sx={{ textAlign: 'end' }}>
                  <Button

                    sx={{ marginTop: "10px" }}
                    type="button"
                    variant="contained"
                    onClick={() => this.handleTable()} >
                    Nạp dữ liệu
                  </Button>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={9}>
            <Card height="200px">
              <CardContent>
                <Grid item mt={1} md={12}>
                  <DataGrid
                    hideFooter={true}
                    className="m-table"
                    rows={this.state.dataTable}
                    rowHeight={35}
                    columns={
                      this.state.CLASS_CODE === 1 ? this.columns_Nhap
                        : this.columns_Xuat
                    }
                    columnVisibilityModel={{
                      ID: false
                    }}
                    sx={{ height: "63vh" }}
                  >
                  </DataGrid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid >
        <ConfirmPopup
          dialog={this.state.confirmPopup}
          text={'Thay đổi trạng thái thanh lí hải quan?'}
          handleCloseDialog={(value) => {
            if (value === 'agree') {
              this.rowSelectHandle(this.state.confirmPopup.paramsSelected.row.STT - 1, this.state.confirmPopup.statusUpdate);
              this.updateTLHQ(this.state.confirmPopup.paramsSelected.row.ID, this.state.confirmPopup.statusUpdate);
              this.setState({
                confirmPopup: {
                  isOpen: false,
                }
              })
            } else {
              this.setState({
                confirmPopup: {
                  isOpen: false
                }
              })
              return;
            }
          }}
        >
        </ConfirmPopup>
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
export default ChangeData;