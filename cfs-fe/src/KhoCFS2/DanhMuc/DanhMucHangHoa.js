import * as moment from "moment";
import * as React from "react";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Stack,
  Checkbox,
  Card,
  CardContent,
  Grid,
  TextField,
  Divider,
} from "@mui/material";
// import DecodeJWT from '../login/DecodeJWT'
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from "@mui/icons-material/Delete";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import ExportCSV from "../../components/caiDat/ExportCSV";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { DataGrid } from '@mui/x-data-grid';
import AddRows from "../../componentsCFS2/dialog/AddRows";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class DanhMucHangHoa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbs: [
        {
          text: "Home",
          href: "/",
        },
        {
          text: "DM Hàng Hóa",
          href: "/category/goods",
        },
      ],
      page: 0,
      rowsPerPage: 10,
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
      },
      dialogAlert: {
        isOpen: false,
        data: null,
        type: 0,
      },
      tempdata: [
        { id: 1, STT: 1, ITEM_CODE: "CHIP", ITEM_NAME: "CHIP", UNIT: "UNIT", L: "1", W: "1", H: "1", WAREHOUSE_CODE: "CFS1", CUSTOMER_CODE: "LOG-SG", STOCK_DAYS: "0", WEIGHT: "10" },
        { id: 2, STT: 2, ITEM_CODE: "MAIN", ITEM_NAME: "MAIN", UNIT: "UNIT", L: "4", W: "4", H: "4", WAREHOUSE_CODE: "CFS2", CUSTOMER_CODE: "LOG-SG", STOCK_DAYS: "0", WEIGHT: "9" },
        { id: 3, STT: 3, ITEM_CODE: "MAIN", ITEM_NAME: "MAIN", UNIT: "UNIT", L: "6", W: "5", H: "8", WAREHOUSE_CODE: "CFS3", CUSTOMER_CODE: "LOG-SG", STOCK_DAYS: "0", WEIGHT: "2" },
        { id: 4, STT: 4, ITEM_CODE: "MAIN2", ITEM_NAME: "MAIN2", UNIT: "UNI2T", L: "62", W: "52", H: "82", WAREHOUSE_CODE: "CFS32", CUSTOMER_CODE: "LOG-SG1", STOCK_DAYS: "01", WEIGHT: "22" },
      ],
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 15000,
        type: 'info' // info / warning / error / success
      },
      dataTable: [
        { id: 1, STT: 1, ITEM_CODE: "CHIP", ITEM_NAME: "CHIP", UNIT: "UNIT", L: "1", W: "1", H: "1", WAREHOUSE_CODE: "CFS1", CUSTOMER_CODE: "LOG-SG", STOCK_DAYS: "0", WEIGHT: "10" },
        { id: 2, STT: 2, ITEM_CODE: "MAIN", ITEM_NAME: "MAIN", UNIT: "UNIT", L: "4", W: "4", H: "4", WAREHOUSE_CODE: "CFS2", CUSTOMER_CODE: "LOG-SG", STOCK_DAYS: "0", WEIGHT: "9" },
        { id: 3, STT: 3, ITEM_CODE: "MAIN", ITEM_NAME: "MAIN", UNIT: "UNIT", L: "6", W: "5", H: "8", WAREHOUSE_CODE: "CFS3", CUSTOMER_CODE: "LOG-SG", STOCK_DAYS: "0", WEIGHT: "2" },
      ],
      searchField: {
        ITEM_CODE: "",
        ITEM_NAME: "",
        UNIT: "",
        L: "",
        W: "",
        H: "",
        WAREHOUSE_CODE: "",
        CUSTOMER_CODE: "",
        STOCK_DAYS: "",
        WEIGHT: "",
      }
    };
    this.columns = [
      {
        field: "Action",
        headerName: "Chọn",
        type: "actions",
        width: 80,
        getActions: (params) => {
          return [
            <Checkbox
              onChange={(e) => {
                this.rowSelectHandle(params.row.STT - 1, e.target.checked);
              }}
              checked={
                params.row.isChecked
              }
            ></Checkbox>
          ];
        }
      },
      {
        field: "STT",
        headerName: "STT",
        width: 100,
        editable: false,
        align: "center",
        headerAlign: "center"
      },
      {
        field: "ITEM_CODE", headerName: "Mã Hàng Hóa",
        flex: 1,
        editable: true,
      },
      {
        field: "ITEM_NAME",
        headerName: "Tên Hàng Hóa",
        flex: 1,
        editable: true,
      },
      {
        field: "UNIT",
        headerName: "Đơn Vị Tính",
        flex: 1,
        editable: true,
      },
      {
        field: "L",
        headerName: "Dài",
        flex: 1,
        editable: true,
      },
      {
        field: "W",
        headerName: "Rộng",
        flex: 1,
        editable: true,
      },
      {
        field: "H",
        headerName: "Cao",
        flex: 1,
        editable: true,
      }, {
        field: "WAREHOUSE_CODE",
        headerName: "Mã Kho",
        flex: 1,
        editable: true,
      }, {
        field: "CUSTOMER_CODE",
        headerName: "Mã Khách",
        flex: 1,
        editable: true,
      }, {
        field: "STOCK_DAYS",
        headerName: "Số Ngày Tồn Kho",
        flex: 1,
        editable: true,
      }, {
        field: "WEIGHT",
        headerName: "Nặng",
        flex: 1,
        editable: true,
      },
      {
        field: "ID",
        headerName: "ID",
        editable: false,
      },
    ];
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
    for (let i = 0; i < rowCount; i++) {
      let newData = {
        ...this.state.searchField,
        id: dataTable.length + i + 1,
        STT: dataTable.length + i + 1,
        Status: 'insert',
        isCreate: true,
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

  openDialogAdd() {
    this.setState({
      dialog: {
        isOpen: true,
        data: null,
        type: 0,
      },
    });
  }

  handleDelete() {
    let { dataTable } = this.state;
    let temp = dataTable.filter(p => p.isChecked !== true)
    this.setState({
      dataTable: temp,
      alert: {
        isOpen: true,
        message: 'Xoá dữ liệu thành công!',
        duration: 2000,
        type: 'success',
      }
    })
  }

  handleInsertOrUpdate() {
    let dataSend;
    this.state.dataTable.map(data => {
      if (data.Status === "insert") {
        let temp = this.state.dataTable.filter(item => item.Status === "insert")
        dataSend = temp.map(item1 => {
          let obj = {};
          obj['status'] = item1.Status;
          obj["ITEM_CODE"] = item1.ITEM_CODE;
          obj["ITEM_NAME"] = item1.ITEM_NAME;
          obj["UNIT"] = item1.UNIT;
          obj["STOCK_DAYS"] = item1.STOCK_DAYS;
          obj["WEIGHT"] = item1.WEIGHT;
          obj["CUSTOMER_CODE"] = item1.CUSTOMER_CODE;
          obj["WAREHOUSE_CODE"] = item1.WAREHOUSE_CODE;
          obj["H"] = item1.H;
          obj["W"] = item1.W;
          obj["L"] = item1.L;
          obj["CREATE_BY"] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
          return obj;
        });
      } else {
        let temp = this.state.dataTable.filter(p => p.Status === "update")
        dataSend = temp.map(item2 => {
          let obj = {};
          obj['status'] = item2.Status;
          obj["ITEM_CODE"] = item2.ITEM_CODE;
          obj["ITEM_NAME"] = item2.ITEM_NAME;
          obj["UNIT"] = item2.UNIT;
          obj["STOCK_DAYS"] = item2.STOCK_DAYS;
          obj["WEIGHT"] = item2.WEIGHT;
          obj["CUSTOMER_CODE"] = item2.CUSTOMER_CODE;
          obj["WAREHOUSE_CODE"] = item2.WAREHOUSE_CODE;
          obj["H"] = item2.H;
          obj["W"] = item2.W;
          obj["L"] = item2.L;
          obj["UPDATE_BY"] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
          return obj;
        });
        return true;
      }
      return data;
    })
    // if (this.state.tempdata.length > 0) {
    this.setState({
      dataTable: this.state.tempdata,
      alert: {
        isOpen: true,
        message: 'Tạo dữ liệu thành công!',
        duration: 2000,
        type: 'success',
      }
    })
    // } else {
    //   this.setState({
    //     alert: {
    //       isOpen: true,
    //       message: 'Vui lòng nhập đầy đủ thông tin!',
    //       duration: 2000,
    //       type: 'warning',
    //     }
    //   })
    // }
    // this.setState({
    //   alert: {
    //     isOpen: true,
    //     message: 'Lưu dữ liệu thành công!',
    //     duration: 2000,
    //     type: 'success',
    // }
    // })

    console.log(dataSend);
  }
  //-----------------------------------
  render() {
    return (
      <Box>
        <FixedPageName
          pageName="Danh Mục Hàng Hóa"
          breadcrumbs={this.state.breadcrumbs}
        ></FixedPageName>
        <Card style={{ marginBottom: "12px" }}>
          <CardContent>
            <Grid container>
              <Grid item xs={12} spacing={2}>
                <Stack mb={1} direction="row" justifyContent="space-between" >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span  >Tìm kiếm:</span>
                    <TextField
                      id="tim-kiem"
                      // label="Tìm kiếm"
                      onChange={(e) => {
                        this.setState({
                          searchField: { ITEM_CODE: e.target.value }
                        })
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <ExportCSV csvData={this.state.dataTable} fileName="DM-Hang-Hoa"></ExportCSV>
                    <Divider orientation="vertical" />
                    <Button
                      className="m-btn m-secondary"
                      type="button"
                      variant="outlined"
                      onClick={() => this.openDialogAdd()}
                      startIcon={<AddIcon />}
                    >
                      Thêm dòng
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => this.handleDelete()}
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Xóa dòng
                    </Button>
                    <Divider orientation="vertical" />
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => this.handleInsertOrUpdate()}
                      color="success"
                      startIcon={<SaveIcon />}
                    >
                      Lưu
                    </Button>
                  </Stack>
                </Stack>
                <Divider />
                <Grid item mt={1} >
                  <DataGrid
                    className="m-table"
                    rowHeight={53}
                    rows={(this.state.dataTable)
                      .filter(data => data.ITEM_CODE.includes(this.state.searchField.ITEM_CODE.toUpperCase())
                        || data.ITEM_CODE.includes(this.state.searchField.ITEM_CODE.toLowerCase())
                      )
                    }
                    columns={this.columns}
                    rowsPerPageOptions={[10, 25, 100]}
                    sx={{ height: "63vh" }}
                    columnVisibilityModel={{
                      ID: false
                    }}
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
          </CardContent>
        </Card>
        <AddRows
          dialog={this.state.dialog}
          handleCloseDialog={() =>
            this.setState({
              dialog: {
                isOpen: false,
                data: null,
                type: 0,
              },
            })}
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
    );
  }
}
DanhMucHangHoa.defaultProps = { multiple: true };
export default DanhMucHangHoa;