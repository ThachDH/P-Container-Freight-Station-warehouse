import * as React from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Divider,
  Card,
  CardContent,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Checkbox
} from "@mui/material";
import FormGroup from '@mui/material/FormGroup';
import FixedPageName from "../../componentsCFS2/fixedPageName";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CustomerSelect from "../../componentsCFS2/dialog/CustomerSelect";

class DocumentCancel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invoice: "1",
      dialog_Customer: {
        isOpen: false
      },
      customer_Pay: '',
      isChecked: true,
      dataTable: [],
    };
    this.columns = [
      {
        field: "STT",
        headerName: "STT",
        editable: false,
        width: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "FUNCT",
        headerName: "Chức năng",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "PTC",
        headerName: "Sô sPTC",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "HĐ",
        headerName: "Số HĐ",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "STATUSHD",
        headerName: "Trạng thái HĐ",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "KT",
        headerName: "Hãng khai thác",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "KH",
        headerName: "Mã khách hàng",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "NAMEKH",
        headerName: "Tên khách hàng",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CODE",
        headerName: "Thành tiền",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "VAT",
        headerName: "Tiền thuế",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "SUMCODE",
        headerName: "Tổng tiền",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "TYPECODE",
        headerName: "Loại tiền",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CANCEL",
        headerName: "Người hủy",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "DAYCANCEL",
        headerName: "Ngày hủy",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "CAUSECANCEL",
        headerName: "Lý do hủy",
        editable: false,
        flex: 1,
        align: "center",
        headerAlign: "center"
      }
    ]
  }

  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Card>
          <CardContent>
            <Divider textAlign="center"> Truy vấn thông tin Chứng từ</Divider>
            <Stack marginTop="10px" direction="row" spacing={2} alignItems="center" padding="10px 15px">
              <Stack direction="row" spacing={2} alignItems="center" >
                <Grid  >
                  <TextField
                    size="small"
                    placeholder="Tìm kiếm theo số lệnh"
                    fullWidth
                  // InputProps={{
                  //   endAdornment: (
                  //     <InputAdornment position="end">
                  //       <SearchIcon
                  //         style={{ cursor: "default" }}
                  //       />
                  //     </InputAdornment>
                  //   ),
                  // }}
                  ></TextField>
                </Grid>
              </Stack>
              <Stack >
                <Grid >
                  <FormControl>
                    <RadioGroup
                      row
                      value={this.state.invoice}
                      onChange={(e) => e.target.value}
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio
                          onChange={() => {
                            this.setState({
                              invoice: "1",
                            })
                          }}
                        ></Radio>}
                        label="Hóa đơn" />
                      <FormControlLabel
                        value="2"
                        control={<Radio
                          onChange={() => {
                            this.setState({
                              invoice: "2",
                            })
                          }}
                        ></Radio>}
                        label="Phiếu tính cước" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Stack>
              <Stack>
                <Grid display="flex" gap="10px" >
                  <LocalizationProvider dateAdapter={AdapterMoment} >
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
                  <LocalizationProvider dateAdapter={AdapterMoment} >
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
                <Button
                  type="button"
                  variant="contained"
                  startIcon={<AutorenewIcon />}
                >Nạp dữ liệu</Button>
              </Stack>
            </Stack>
            <Stack padding="10px 15px" direction="row" gap="15px" alignItems="center">
              <Stack  >
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
              <Stack direction="row" alignItems="center" gap="20px">
                <Grid>
                  <Typography sx={{ fontWeight: "600" }}>Hình thức:</Typography>
                </Grid>
                <Grid >
                  <FormGroup row>
                    <FormControlLabel control={<Checkbox />} label="Thu ngay" />
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Thu sau" />
                  </FormGroup>
                </Grid>
              </Stack>
              <Stack >
                <Grid container alignItems="center" gap="20px">
                  <Grid >
                    <Typography sx={{ fontWeight: "600" }}>Trạng thái hoạt động:</Typography>
                  </Grid>
                  <Grid >
                    <FormGroup row>
                      <FormControlLabel control={<Checkbox />} label="Chưa thanh toán" />
                      <FormControlLabel control={<Checkbox />} label="Đã thanh toán" />
                      <FormControlLabel control={<Checkbox defaultChecked />} label="Đã hủy" />
                    </FormGroup>
                  </Grid>
                </Grid>
              </Stack>
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
export default DocumentCancel;