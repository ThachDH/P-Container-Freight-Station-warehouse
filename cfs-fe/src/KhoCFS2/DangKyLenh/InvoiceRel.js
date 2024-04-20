import * as React from "react";
import * as moment from "moment";
import {
  Box,
  Button,
  Stack,
  TextField,
  Divider,
  Card,
  CardContent,
  Grid,

  Autocomplete,
  Typography,
} from "@mui/material";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DataGrid } from '@mui/x-data-grid';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import PrintIcon from '@mui/icons-material/Print';
import CustomerSelect from "../../componentsCFS2/dialog/CustomerSelect";

class InvoiceRel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [],
      lstCD: [],
      dialog_Customer: {
        isOpen: false
      },
      customer_Pay: '',
      dataTableDetails: [],
      fromDate: moment(),
      itemList: [
        "Thu sau",
      ],
      itemMethod: [
        "Chuyển khoản",
        "Tiền mặt/Chuyển khoản"
      ]
    };
    this.columns = [
      {
        field: "STT",
        headerName: "STT",
        editable: false,
        width: 100,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "PTC",
        headerName: "Số PTC",
        editable: true,
        flex: 1
      },
      {
        field: "DATE",
        headerName: "Ngày lập phiếu",
        editable: true,
        flex: 1
      },
      {
        field: "ORDER",
        headerName: "Số lệnh",
        editable: true,
        flex: 1
      },
      {
        field: "DTTT",
        headerName: "Tên DTTT",
        editable: true,
        flex: 1
      },
      {
        field: "CODE",
        headerName: "Thành tiền",
        editable: true,
        flex: 1
      },
      {
        field: "VAT",
        headerName: "Tiền thuế",
        editable: true,
        flex: 1
      },
      {
        field: "SUM",
        headerName: "Tổng tiền",
        editable: true,
        flex: 1
      },
      {
        field: "TYPECODE",
        headerName: "Loại tiền",
        editable: true,
        flex: 1
      },
      {
        field: "DEPOT",
        headerName: "Depot",
        editable: true,
        flex: 1
      }


    ];
    this.columnsDetails = [
      {
        field: "STT",
        headerName: "STT",
        editable: false,
        width: 100,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "PTC",
        headerName: "Số PTC",
        editable: true,
        flex: 1
      },
      {
        field: "BC",
        headerName: "Mã biểu cước",
        editable: true,
        flex: 1
      },
      {
        field: "NOTE",
        headerName: "Diễn giải",
        editable: true,
        flex: 1
      },
      {
        field: "DVT",
        headerName: "ĐVT",
        editable: true,
        flex: 1
      },
      {
        field: "ITEMTYPE",
        headerName: "Loại hàng",
        editable: true,
        flex: 1
      },
      {
        field: "SIZE",
        headerName: "Kích cỡ",
        editable: true,
        flex: 1
      },
      {
        field: "FULL/EMPTY",
        headerName: "Hàng/Rỗng",
        editable: true,
        flex: 1
      },
      {
        field: "N/N",
        headerName: "Nội/Ngoại",
        editable: true,
        flex: 1
      },
      {
        field: "SL",
        headerName: "Số lượng",
        editable: true,
        flex: 1
      },
      {
        field: "DG",
        headerName: "Đơn giá",
        editable: true,
        flex: 1
      },
      {
        field: "CK",
        headerName: "CK%",
        editable: true,
        flex: 1
      },
      {
        field: "CKBEFORT",
        headerName: "Đơn giá CK",
        editable: true,
        flex: 1
      },
      {
        field: "CKAFTER",
        headerName: "Đơn giá sau CK",
        editable: true,
        flex: 1
      },
      {
        field: "CODE",
        headerName: "Thành tiền",
        editable: true,
        flex: 1
      },
      {
        field: "VAT",
        headerName: "VAT(%)",
        editable: true,
        flex: 1
      },
      {
        field: "VATTHUE",
        headerName: "Tiền Thuế",
        editable: true,
        flex: 1
      },
      {
        field: "SUMCODE",
        headerName: "Tổng tiền",
        editable: true,
        flex: 1
      },
      {
        field: "NOTEDetails",
        headerName: "Ghi chú",
        editable: true,
        flex: 1
      },
      {
        field: "DETAILS",
        headerName: "Chi tiết",
        editable: true,
        flex: 1
      }
    ];

    this.createRows = (data) => data.map((row, index) => ({
      id: index,
      STT: index + 1,
      ...row
    }),
    );
  }

  componentDidMount() {
    this.handleLoadPayment();
  }

  handleLoadPayment() {
    let url = window.root_url + `accounts/view`;
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
        const arr = [];
        const arrType = [];
        data.map(item => {
          arr.push(item.value = `${item.ACC_TYPE} : ${item.ACC_NO}`);
          return item;
        });
        data.map(item => {
          arrType.push(item.value = `${item.ACC_TYPE} `);
          return item;
        })
        this.setState({
          dataPay: data,
          lstCD: arr
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
              message: JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }

  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Card>
          <CardContent >
            <Divider textAlign="left" flexItem > Truy vấn thông tin hóa đơn</Divider>
            <Stack direction="row" spacing={2} alignItems="center" margin="15px 0">
              <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
                <Grid >
                  <Typography> Khoảng ngày</Typography>
                </Grid>
                <Grid sx={{ display: "flex", justifyContent: "end", gap: "15px" }} spacing={2}>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      label="Từ ngày"
                      inputFormat="DD/MM/YYYY"
                      value={this.state.fromDate}
                      onChange={(newValue) => {
                        this.setState({
                          fromDate: newValue,
                        })
                      }}
                      renderInput={(params) => <TextField fullWidth size="small" {...params} />}
                    />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      label="Đến ngày"
                      inputFormat="DD/MM/YYYY"
                      value={this.state.fromDate}
                      onChange={(newValue) => {
                        this.setState({
                          fromDate: newValue,
                        })
                      }}
                      renderInput={(params) => <TextField fullWidth size="small" {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Stack>
              <Stack>
                <Autocomplete
                  sx={{ width: '200px' }}
                  id="tags-outlined"
                  defaultValue={''}
                  options={this.state.itemList || []}
                  size="small"
                  getOptionLabel={(params) => {
                    if (params === '') {
                      params = 'Thu ngay'
                    }
                    return params
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      readOnly
                      label='Loại thanh toán'
                    />
                  )}
                />
              </Stack>
              <Stack>
                <Autocomplete
                  sx={{ width: '200px' }}
                  id="tags-outlined"
                  defaultValue={''}
                  options={this.state.itemCode || []}
                  size="small"
                  getOptionLabel={(params) => {
                    if (params === '') {
                      params = 'VND'
                    }
                    return params
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      readOnly
                      label='Loại tiền'
                    />
                  )}
                />
              </Stack>
              <Stack>
                <Grid >
                  <TextField size="small" fullWidth label="Depot" ></TextField>
                </Grid>
              </Stack>
              <Button
                // size="small"
                type="button"
                variant="contained"
                startIcon={<AutorenewIcon />}
              >
                Nạp dữ liệu
              </Button>
            </Stack>
            <Divider textAlign="left" flexItem > Thông tin phát hành hóa đơn</Divider>
            <Stack direction="row" spacing={2} alignItems="center" margin="15px 0">
              <Stack direction="row" gap="15px" alignItems="center">
                <Grid >
                  <Typography >Ngày lập hợp đồng</Typography>
                </Grid>
                <Grid >
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      label="Từ ngày"
                      inputFormat="DD/MM/YYYY"
                      value={this.state.fromDate}
                      onChange={(newValue) => {
                        this.setState({
                          fromDate: newValue,
                        })
                      }}
                      renderInput={(params) => <TextField fullWidth size="small" {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Stack>
              <Stack>
                <TextField
                  size="small"
                  fullWidth
                  value={this.state.customer_Pay}
                  onClick={() => {
                    this.setState({
                      dialog_Customer: {
                        isOpen: true
                      }
                    })
                  }}
                  label="Mã KH">
                </TextField>
              </Stack>
              <Stack>
                <Autocomplete
                  sx={{ width: "300px" }}
                  id="tags-outlined"
                  options={this.state.lstCD || []}
                  onChange={(event, listSelected) => {
                    this.setState({
                      selectedCD: listSelected
                    })
                  }}
                  size="small"

                  renderInput={(params) => (
                    <TextField
                      {...params}
                      readOnly
                      placeholder="Hình thức thanh toán"
                    />
                  )}
                />
              </Stack>
              <Stack >
                <Grid >
                  <TextField size="small" fullWidth label="Loại hóa đơn"></TextField>
                </Grid>
              </Stack>
            </Stack>
            <Stack marginTop="15px">
              <Grid container gap="30px">
                <Typography sx={{ fontWeight: 600 }}>Đối tượng thanh toán:</Typography>
                <Typography sx={{ fontWeight: 600 }}>Địa chỉ:</Typography>
                <Typography sx={{ fontWeight: 600 }}>Hình thức thanh toán:</Typography>
              </Grid>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ marginTop: "10px" }}>
          <Grid container justifyContent="space-between" padding="10px 15px">
            <Stack direction="row" spacing={1} alignItems="center">
              <span>Tìm kiếm:</span>
              <TextField
                size="small"
                id="tim-kiem"
                onChange={(e) => {
                  this.setState({
                    searchField: {
                      UNIT_CODE: e.target.value.trim(),
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
            <Stack direction="row" spacing={1} >
              <Button
                size="small"
                type="button"
                variant="outlined"
                color="success"
                startIcon={<UpgradeIcon />}
              >
                Xuất hóa đơn điện tử
              </Button>
              <Divider orientation="vertical" />
              <Button
                size="small"
                type="button"
                variant="outlined"
                startIcon={<PrintIcon />}
                color="warning"
              >
                In phiếu tính cước
              </Button>
            </Stack>
          </Grid>
          <Divider />
          <Grid>
            <DataGrid
              className="m-table"
              rows={this.state.dataTable}
              columns={this.columns}
              rowHeight={35}
              columnVisibilityModel={{
                ID: false
              }}
              sx={{ height: "43vh" }}
            />
          </Grid>
        </Card>
        <Card sx={{ marginTop: "10px" }}>
          <Grid>
            <DataGrid
              className="m-table"
              rows={this.state.dataTableDetails}
              columns={this.columnsDetails}
              rowHeight={35}
              columnVisibilityModel={{
                ID: false
              }}
              sx={{ height: "43vh" }}
            />
          </Grid>
        </Card>
        <CustomerSelect
          dialog={this.state.dialog_Customer}
          handleSelect={(data) => {
            if (Object.keys(data).length > 0) {
              this.setState({
                customer_Pay: data.CUSTOMER_CODE,
                dialog_Customer: {
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
              dialog_Customer: {
                isOpen: false
              }
            })
          }} />
      </Box>
    )
  }
}
export default InvoiceRel;