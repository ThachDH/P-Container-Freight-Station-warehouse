import * as React from "react";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { DataGrid } from '@mui/x-data-grid';
import {
  Stack,
  Grid,
  Divider,
  TextField,
  Box,
  Card,
  CardContent,
  Autocomplete,
  CardHeader,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FixedPageName from "../../componentsCFS2/fixedPageName";
import SelectVessel from "../../componentsCFS2/dialog/SelectVessel"
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const lstData = ["Nhập Kho"];

class OutputExport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
      activeStep: "detail",
      dataTable: [],
      lstMethod: [],
      selectMethod: [],
      data: {
        Item: "",
        Lot: "",
        Descript: "",
        PalletNumber: "",
        LotSize: "",
        Qty: "",
        CTN: "",
        PalletQty: "",
      },
      filter: {
        hopDongSo: "",
        chuHang: "",
        kho: ""
      },
      selected: null,
      lstData: {
        options: lstData,
      },
      dialogHopDongSo: {
        isOpen: false,
        data: null,
        type: 0,
      },
      dialogChuHang: {
        isOpen: false,
        data: null,
        type: 0,
      },
      dialogKho: {
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
      setSelectedFile: "",
      setIsSelected: false,
    };
    this.tableFilter = {
      search: '',
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
        field: "BOOKING_NO",
        headerName: "Số Booking",
        editable: true,
        flex: 1
      },
      {
        field: "CNTR",
        headerName: "Số Container",
        editable: true,
        flex: 1
      },
      {
        field: "ITEM_TYPE_CODE",
        headerName: "Loại Hàng",
        editable: true,
        flex: 1
      },
      {
        field: "BOOKING",
        headerName: "BOOKING_FWD",
        editable: true,
        flex: 1
      },
      {
        field: "CARGO_PIECE",
        headerName: "Số Lượng",
        editable: true,
        flex: 1
      },
      {
        field: "UNIT_CODE",
        headerName: "ĐVT",
        editable: true,
        flex: 1
      },
      {
        field: "CARGO_WEIGHT",
        headerName: "Trọng Lượng",
        editable: true,
        flex: 1
      },
      {
        field: "CBM",
        headerName: "Số khối",
        editable: true,
        flex: 1
      },
      {
        field: "ID",
        headerName: "ID",
        editable: false,
      },
    ];
  }

  handleAddRow() {
    let { dataTable } = this.state;
    let newRow = [];
    let idCounter = this.state.dataTable.length + 1;
    if (dataTable.length !== 0) {
      let newData = {
        ...this.state.data,
        id: idCounter,
        Item: "TEST-" + idCounter,
        status: "delete",
      }
      newRow.push(newData);
      let mergeDataTable = [...this.state.dataTable, ...newRow];
      this.setState({
        dataTable: mergeDataTable,
        alert: {
          isOpen: true,
          message: 'Thêm dòng thành công',
          duration: 2000,
          type: 'success',
        }
      });
    }
  }

  handleDelete(data) {
    let { dataTable } = this.state;
    data.map(item => {
      let newData = dataTable.filter(itm => itm.Item !== item.Item);
      this.setState({
        dataTable: [...newData],
        alert: {
          isOpen: true,
          message: 'Xoá dữ liệu thành công!',
          duration: 2000,
          type: 'success',
        }
      });
      return item;
    });
  }

  loadMethod() {
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
      .then(data => {
        const arr = [];
        data.map(item => {
          arr.push(item.METHOD_CODE);
          return item;
        })
        this.setState({ lstMethod: arr });
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

  componentDidMount() {
    this.loadMethod();
  }

  createRows = (data) => data.map((row, index) => ({
    id: index,
    Item: row.Item,
    Lot: row.Lot,
    Descript: row.Descript,
    PalletNumber: row.PalletNumber,
    LotSize: row.LotSize,
    Qty: row.Qty,
    CTN: row.CTN,
    PalletQty: row.PalletQty,
  }));

  handleChangePage(event, newPage) {
    this.setState({ page: newPage });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  }

  closeDialogHopDongSo() {
    this.setState({
      dialogHopDongSo: {
        isOpen: false,
      },
    });
  }

  closeDialogChuHang() {
    this.setState({
      dialogChuHang: {
        isOpen: false,
      },
    });
  }

  closeDialogKho() {
    this.setState({
      dialogKho: {
        isOpen: false,
      },
    });
  }

  openHopDongSo() {
    this.setState({
      dialogHopDongSo: {
        isOpen: true,
      },
    });
  }

  openPhieuChuHang() {
    this.setState({
      dialogChuHang: {
        isOpen: true,
      },
    });
  }

  openKho() {
    this.setState({
      dialogKho: {
        isOpen: true,
      },
    });
  }

  selectedHDS(data) {
    data.map(item => {
      this.setState({
        filter: {
          ...this.state.filter,
          hopDongSo: item.Code,
        },
      });
      return item;
    });
    this.closeDialogHopDongSo();
  }

  selectedCH(data) {
    data.map(item => {
      this.setState({
        filter: {
          ...this.state.filter,
          chuHang: item.Code,
        },
      });
      return item;
    });
    this.closeDialogChuHang();
  }

  selectedK(data) {
    data.map(item => {
      this.setState({
        filter: {
          ...this.state.filter,
          kho: item.Code,
        },
      });
      return item;
    });
    this.closeDialogKho();
  }

  selectedVessel(data) {
    console.log(data);
  }

  changeHandler = (event) => {
    this.setState({
      setSelectedFile: event.target.files[0],
      setIsSelected: true
    });

  }
  //Thoilc(*Note)-Lọc dữ liệu trên lưới
  filterGridView() {
    this.setState({ tableFilter: Object.assign({}, this.tableFilter) });
  }
  //--------------------------------------
  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Grid container spacing={1}>
          <Grid item xs={3} >
            <Card>
              <CardHeader
                title="Thông tin lệnh"
              >
              </CardHeader>
              <CardContent>
                <Grid container rowSpacing={1} columnSpacing={1}>
                  <Grid item md={12}>
                    <SelectVessel orientation="vertical" handleSelected={(data) => this.selectedVessel(data)}>
                    </SelectVessel>
                  </Grid>
                  <Grid item md={6}>
                    <TextField key="CNTRNO" fullWidth placeholder="Số Container:" />
                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      fullWidth
                      id="BOOKING_NO"
                      label=" Số Booking:"
                    />
                  </Grid>
                </Grid>
                <Stack direction="column" spacing={2}>
                  <Grid container spacing={1}>
                  </Grid>
                  <Autocomplete
                    id="tags-outlined"
                    options={this.state.lstMethod || []}
                    onChange={(event, listSelected) => {
                      this.setState({
                        selectMethod: listSelected
                      })
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Phuơng án:"
                      />
                    )}
                  />
                  <TextField
                    id="payner"
                    label="ĐTTT"
                    onClick={() => this.openPhieuChuHang()}
                    value={this.state.filter.chuHang}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }} />
                </Stack>
              </CardContent>
              <Divider />
              <CardHeader
                title="Thông tin chủ hàng"
              >
              </CardHeader>
              <CardContent>
                <Grid container rowSpacing={1} columnSpacing={1} >
                  <Grid item md={12}>
                    <TextField
                      fullWidth
                      id='cus-name'
                      label='Chủ hàng:' />
                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      fullWidth
                      id='smth-name'
                      label='Tên người đại diện' />
                  </Grid>
                  <Grid item md={6}>
                    <TextField
                      fullWidth
                      id='phone'
                      type='number'
                      label='SĐT:' />
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      fullWidth
                      id='desc'
                      label='Ghi chú' />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={9}>
            <Card style={{ marginBottom: "12px" }}>
              <CardContent>
                <Stepper acttiveStep={this.state.activeStep}>
                  <Step key="detail">
                    <StepLabel>
                      Chi tiết lệnh
                    </StepLabel>
                  </Step>
                  <Step key="tarif">
                    <StepLabel>
                      Tính cước
                    </StepLabel>
                  </Step>
                  <Step key="payment">
                    <StepLabel>
                      Thanh toán
                    </StepLabel>
                  </Step>
                </Stepper>
                {/* ------------------------------- start - Chi tiết lệnh ---------------------------- */}
                {
                  this.state.activeStep === 'detail' ?
                    <Grid container sx={{ marginTop: '20px' }}>
                      <Grid item xs={12}>
                        <Stack mb={1} direction="row" justifyContent="space-between">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <span>Tìm kiếm:</span>
                            <TextField
                              id="tim-kiem"
                              onChange={(e) => {
                                this.tableFilter.CUSTOMER_TYPE_CODE = e.target.value
                              }}
                              onKeyPress={(e) => {
                                if (e.code === "Enter") {
                                  this.setState({ tableFilter: Object.assign({}, this.tableFilter) });
                                }
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <SearchIcon
                                      onClick={() => { this.setState({ tableFilter: Object.assign({}, this.tableFilter) }) }}
                                      style={{ cursor: "default" }}
                                    />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Stack>

                        </Stack>
                        <Divider />
                        <Grid item mt={1} md={12}>
                          <DataGrid
                            className="m-table"
                            rows={(this.state.dataTable)
                              // .filter(data => data.CUSTOMER_TYPE_CODE.includes(this.tableFilter.CUSTOMER_TYPE_CODE.toUpperCase()))
                            }
                            rowHeight={35}
                            columns={this.columns}
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
                      </Grid>
                    </Grid>
                    : ""
                }
                {/* --------------------------------- end - Chi tiết lệnh ------------------------------ */}

                {/* --------------------------------- start - Tính cước ------------------------------ */}

                {/* --------------------------------- end - Tính cước ------------------------------ */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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
    );
  }
}

export default OutputExport;