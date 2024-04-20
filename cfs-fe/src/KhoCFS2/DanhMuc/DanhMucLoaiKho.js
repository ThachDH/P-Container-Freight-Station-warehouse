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
} from "@mui/material";
// import DecodeJWT from '../login/DecodeJWT'
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from "@mui/icons-material/Delete";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import ExportCSV from "../../components/caiDat/ExportCSV";
import { DataGrid } from '@mui/x-data-grid';
import AddRows from "../../componentsCFS2/dialog/AddRows";


class DanhMucLoaiKho extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbs: [
        {
          text: "Home",
          href: "/",
        },
        {
          text: "DM Loại Kho",
          href: "/category/local-type",
        },
      ],
      page: 0,
      rowsPerPage: 10,
      dataTable: [],
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
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
      data: {
        No: "",
        Name: "",
        Depend_City: "",
      }
    };
    this.columns = [
      {
        field: "Action",
        headerName: "Chọn",
        type: "actions",
        width: 80,
        getActions: (params) => [
          <Checkbox onChange={() => {
            this.props.multiple === true
              ? (params.row.isChecked = !params.row.isChecked)
              : (params.row.isChecked = true);
          }}
            checked={
              params.row.isChecked === true ? true : false
            } ></Checkbox>
        ]
      },
      {
        field: "STT",
        headerName: "STT",
        editable: true,
        minWidth: 100,
      },
      {
        field: "No", headerName: "Mã Kiểu Kho",
        editable: true,
        minWidth: 350,
      },
      {
        field: "Name",
        headerName: "Tên Kiểu kho",
        editable: true,
        minWidth: 400
      },
      {
        field: "Depend_City",
        headerName: "Thuộc Doanh Nghiệp",
        editable: true,
        minWidth: 500
      },
    ];
  }
  handleAddRow(rowCount) {
    let { dataTable } = this.state;
    let newRow = [];
    for (let i = 0; i < rowCount; i++) {
      console.log(dataTable.length, i);
      let newData = {
        ...this.state.data,
        id: dataTable.length + i + 1,
        STT: dataTable.length + i + 1,
      }
      newRow.push(newData);
    }
    let mergeDataTable = [...dataTable, ...newRow];
    this.setState({
      dataTable: mergeDataTable
    })
    console.log(this.state.dataTable);
  }

  closeDialog() {
    this.setState({
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
      },
    });
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
  render() {
    return (
      <Box>
        <FixedPageName
          pageName="Danh Mục Loại Kho"
          breadcrumbs={this.state.breadcrumbs}
        ></FixedPageName>
        <Card style={{ marginBottom: "12px" }}>
          <CardContent>
            <Grid container>
              <Grid item xs={12} sx={{ height: "30px" }}>
                <Stack direction="row" spacing={1} style={{ marginTop: "15px" }} >
                  <Stack direction="row" spacing={1}>
                    <span  >Tìm kiếm:</span>
                    <TextField
                      id="tim-kiem"
                      // label="Tìm kiếm"
                      onChange={(e) => {
                        this.tableFilter.customer_Name = e.target.value;
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
                  <Stack direction="row" spacing={1} style={{
                    position: "absolute",
                    right: "0px",
                    marginRight: "22px"
                  }}>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => this.openDialogAdd()}
                      // style={{ marginLeft: "59%" }}
                      // color="success" focused
                      startIcon={<AddIcon />}
                    >
                      Thêm dòng
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      // onClick={() => this.themKhachHang()}
                      // color="secondary" focused
                      startIcon={<SaveIcon />}
                    >
                      Lưu
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => this.handleDelete()}
                      // color="error"
                      // focused
                      startIcon={<DeleteIcon />}
                    >
                      Xóa dòng
                    </Button>
                    <ExportCSV csvData={this.state.dataTable} fileName="DS-khach-hang"></ExportCSV>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
          <CardContent style={{ marginTop: "15px" }}>
            <Box
              sx={{
                textAlign: 'center',
                height: "auto",
                width: '100%',
                '& .MuiDataGrid-columnHeadersInner': {
                  backgroundColor: 'rgba(176,224,230, 0.55)',
                },
              }}
            >
              <DataGrid
                // rows={createRows(this.state.dataTable)}
                rows={this.state.dataTable}
                columns={this.columns}
                rowsPerPageOptions={[10, 25, 100]}
                sx={{ height: "63vh" }}
                onRowClick={(row) => {
                  this.props.multiple === true
                    ? (row.row.isChecked = !row.row.isChecked)
                    : (row.row.isChecked = true)
                }}
              >
              </DataGrid>
            </Box>
          </CardContent>
        </Card>
        <AddRows
          dialog={this.state.dialog}
          handleCloseDialog={() => this.closeDialog()}
          handleAddRows={(rowCount) => this.handleAddRow(rowCount)}
        >
        </AddRows>
      </Box>
    );
  }
}
export default DanhMucLoaiKho;