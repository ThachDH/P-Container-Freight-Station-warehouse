import * as React from "react";
import * as moment from "moment";
import MuiAlert from '@mui/material/Alert';
import PrintingImportExport from "../../assets/document/PrintingImportExport";
import Snackbar from '@mui/material/Snackbar';
import { DataGrid } from '@mui/x-data-grid';
import {
  Stack,
  Grid,
  Divider,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FixedPageName from "../../componentsCFS2/fixedPageName";
import PrintImport from "../../assets/document/printImport";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class APITOS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataOrder: [],
      dataTable: [],
      dataPrint: [],
      isOpenDialogImport: false,
      isInOut: 1,
      searchField: {
        ORDER_NO: ''
      },
      data: {
        FROM_DATE: moment().subtract(1, "days").format('yyyy-MM-DDThh:mm'),
        TO_DATE: moment().format('yyyy-MM-DDThh:mm'),
        JOB_TYPE: '',
        CLASS_CODE: '',
        INFORMATION: '',
        PAYER: '',
        type: '',
      },
      customerName: [],
      type: 1,
      dialog: {
        isOpen: false,
        type: 1,
      },
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.createRows = (data) => data.map((row, index) => ({
      STT: index + 1,
      id: index,
      ...row
    }),
    );
    this.columns = [
      {
        field: "STT",
        headerName: "STT",
        width: 80,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "JOB_TYPE",
        headerName: "Phương thức giao nhận",
        flex: 1,
        align: 'center',
        type: 'dateTime',
        headerAlign: 'center',
        renderCell: (params) => {
          return [
            params.row.JOB_TYPE === "NK" ? "Nhập Kho" : "Xuất Kho"
          ]
        }
      },
      {
        field: "CLASS_CODE",
        headerName: "Hướng",
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
          return [
            params.row.CLASS_CODE === 1 ? "Hướng nhập" : "Hướng Xuất"
          ]
        }
      },
      {
        field: "RECEIPT_NO",
        headerName: "Số phiếu",
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: "ORDER_NO",
        headerName: "Số lệnh",
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
      {
        headerName: "Số vận đơn",
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
          return [
            params.row.CLASS_CODE === 1 ? params.row.BILLOFLADING : params.row.BOOKING_NO
          ]
        }
      },
      {
        field: "CNTRNO",
        headerName: "Số container",
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: "VESSEL_NAME",
        headerName: "Tên tàu",
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: "VESSEL_BOUND",
        headerName: "Số chuyển",
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
    ];
  }

  componentDidMount() {
    this.handleLoadCustomer();
  }

  handleLoadCustomer() {
    let url = window.root_url + `bs-customer/view`;
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
          let temp = data.map(item => {
            return (item.CUSTOMER_NAME)
          })
          this.setState({
            customerName: temp,
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

  handleViewData() {
    let dataSend = {
      ...this.state.data,
    };
    dataSend[this.state.data.type !== '' ? this.state.data.type : 'TYPE'] = this.state.data.INFORMATION
    let url = window.root_url + `receipts/getItem`;
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
          let storage = [];
          data.Payload.map(item => {
            let check = storage.filter(p => p.ORDER_NO === item.ORDER_NO);
            if (check.length === 0) {
              storage.push(item);
            };
            return item;
          });
          let temp = this.createRows(storage)
          this.setState({
            dataTable: temp,
            dataPrint: data.Payload,
            alert: {
              isOpen: true,
              type: "success",
              duration: 3000,
              message: data.Message
            },
          })
        }
        else {
          this.setState({
            dataTable: [],
            alert: {
              isOpen: true,
              type: 'error',
              duration: 2000,
              message: "Không tìm thấy dữ liệu"

            }
          });
        }
      })
      .catch(err => {
        console.log(err);
      })
  }
  //--------------------------------------
  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Card>
          <CardContent >
            <Grid item>
              <Divider textAlign="center">
                <span className="m-filter-title">Lọc dữ liệu</span>
              </Divider>
            </Grid>
            <Stack >
              <Stack spacing={1} style={{ marginTop: "12px", marginLeft: '12px', marginRight: '12px ' }}>
                <Stack direction="row" spacing={1} alignItems={'center'} >
                  <Autocomplete
                    id="tags-outlined"
                    options={['HOUSE_BILL', 'BOOKING_NO', 'BOOKING_FWD', 'BILLOFLADING', 'CNTRNO']}
                    sx={{ width: '200px' }}
                    size="small"
                    onChange={(event, listSelected) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          type: listSelected
                        }
                      })
                    }}
                    getOptionLabel={(params) => {
                      if (params === 'HOUSE_BILL') {
                        params = 'Số House_Bill'
                      } else if (params === 'BOOKING_NO') {
                        params = 'Số Booking'
                      } else if (params === 'BOOKING_FWD') {
                        params = 'Số Booking_FWD'
                      } else if (params === 'BILLOFLADING') {
                        params = 'Số Vận Đơn'
                      } else {
                        params = 'Số Container'
                      }

                      return params
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        readOnly
                        label='Truy vấn theo'
                      />
                    )}
                  />
                  <TextField
                    key='INFORMATION'
                    size='small'
                    sx={{ width: '200px' }}
                    label='Thông tin truy vấn'
                    onChange={(e) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          INFORMATION: e.target.value,
                        }
                      })
                    }} />
                  <Divider orientation="vertical" flexItem />
                  <Stack direction="row" gap="12px" >
                    <Stack direction="row" alignItems="center" >
                      <TextField
                        sx={{ width: '200px' }}
                        key="from"
                        size="small"
                        type="datetime-local"
                        label="Từ ngày"
                        value={this.state.data.FROM_DATE}
                        onChange={(e) => {
                          this.setState({
                            data: {
                              ...this.state.data,
                              FROM_DATE: e.target.value
                            }
                          })
                        }}
                      />
                    </Stack>
                    <Stack direction="row" alignItems="center">
                      <TextField
                        key="to"
                        sx={{ width: '200px' }}
                        size="small"
                        type="datetime-local"
                        label="Đến ngày"
                        value={this.state.data.TO_DATE}
                        onChange={(e) => {
                          this.setState({
                            data: {
                              ...this.state.data,
                              TO_DATE: e.target.value
                            }
                          })
                        }}
                      />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack direction='row' spacing={1} >
                  <Autocomplete
                    id="tags-outlined"
                    sx={{ width: '200px' }}
                    defaultValue=''
                    options={['', 'NK', 'XK']}
                    size="small"
                    onChange={(event, listSelected) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          JOB_TYPE: listSelected
                        }
                      })
                    }}
                    getOptionLabel={(params) => {
                      if (params === 'NK') {
                        params = 'Nhập kho'
                      } else if (params === 'XK') {
                        params = 'Xuất kho'
                      } else {
                        params = 'Tất cả'
                      }
                      return params
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        readOnly
                        label='Phương án'
                      />
                    )}
                  />
                  <Autocomplete
                    id="tags-outlined"
                    defaultValue=''
                    sx={{ width: '200px' }}
                    options={['', 1, 2]}
                    size="small"
                    onChange={(event, listSelected) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          CLASS_CODE: listSelected
                        }
                      })
                    }}
                    getOptionLabel={(params) => {
                      if (params === 1) {
                        params = 'Nhập'
                      } else if (params === 2) {
                        params = 'Xuất'
                      } else {
                        params = 'Tất cả'
                      }
                      return params
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        readOnly
                        label='Hướng'
                      />
                    )}
                  />
                  <Divider orientation="vertical" flexItem />
                  <Autocomplete
                    sx={{ width: '200px' }}
                    id="tags-outlined"
                    options={this.state.customerName || []}
                    size="small"
                    onChange={(event, listSelected) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          PAYER: listSelected,
                        }
                      })
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        readOnly
                        label='Đối tượng thanh toán'
                      />
                    )} />
                  <Divider flexItem orientation="vertical" />
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => this.handleViewData()}
                  >Nạp dữ liệu</Button>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card >
        <Card style={{ marginTop: "10px" }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row" spacing={1} alignItems="center">
                <span>Tìm kiếm:</span>
                <TextField
                  size="small"
                  id="tim-kiem"
                  onChange={(e) => {
                    this.setState({
                      searchField: {
                        ORDER_NO: e.target.value,
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
              <Stack direction="row" gap="10px" >
                <Button
                  className="m-btn m-success"
                  variant='outlined'
                  onClick={() => {
                    this.MyDialogPrintImport.openDialog();
                    this.MyDialogPrintImport.setDataSource(this.state.dataOrder);
                  }}
                > In biên bản nhập kho </Button>
                <Button
                  className="m-btn m-secondary"
                  variant='outlined'
                  onClick={() => {
                    this.MyDialogExportOrder.openDialog();
                    this.MyDialogExportOrder.setDataSource(this.state.dataOrder);
                  }}
                > In phiếu </Button>
              </Stack>
            </Stack>

            <Grid item mt={1}>
              <DataGrid
                hideFooter={true}
                sx={{ height: "63vh" }}
                className="m-table"
                rows={(this.state.dataTable)
                  .filter(data => data.ORDER_NO.toUpperCase().includes(this.state.searchField.ORDER_NO.toUpperCase()))
                }
                rowHeight={40}
                columns={this.columns}
                onRowClick={(params) => {
                  let dataPrintTable = this.state.dataPrint.filter(item => item.ORDER_NO === params.row.ORDER_NO);
                  this.setState({
                    dataOrder: dataPrintTable
                  })
                }}
              >
              </DataGrid>
            </Grid>
          </CardContent>
        </Card>
        <PrintingImportExport
          ref={(ref) => this.MyDialogExportOrder = ref}
          dialog={this.state.dialogExportOrder}

        />
        <PrintImport
          ref={(ref) => this.MyDialogPrintImport = ref}
          dialog={this.state.isOpenDialogImport}
        />


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
}

export default APITOS;
