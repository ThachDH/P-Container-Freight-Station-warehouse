import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  TextField,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
  CardContent,
  Card
} from "@mui/material";

const columns = [
  { id: "goodsCommon_ProductCode", label: "Mã mặt hàng", minWidth: 80 },
  {
    id: "goodsCommon_ProductName",
    label: "Tên mặt hàng",
    minWidth: 125,
  },
  {
    id: "goodsCommon_ItemGroup",
    label: "Loại mặt hàng",
    minWidth: 100,
  },
  {
    id: "goodsCommon__Length",
    label: "Dài",
    minWidth: 80,
  },
  {
    id: "goodsCommon__Width",
    label: "Rộng",
    minWidth: 80,
  },
  {
    id: "goodsCommon__Height",
    label: "Cao",
    minWidth: 80,
  },
  {
    id: "goodsCommon_NetWeight",
    label: "Trọng lượng",
    minWidth: 80,
  },
  {
    id: "goodsCommon_Description",
    label: "Ghi chú",
    minWidth: 120,
  },
];

class ChonSanPham extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProductCode: [],
      page: 0,
      rowsPerPage: 10,
      dataTable: [],
      selectItem: [],
    };
    this.tableFilter = {
      goodsCommon_ProductCode: '',
      goodsCommon_ProductName: '',
      goodsCommon_ItemGroup: '',
    };
  }

  handleChangePage(event, newPage) {
    this.setState({ page: newPage });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  }

  closeDialog() {
    this.props.handleCloseDialog();
    this.clearData();
  }

  //Thoilc(*Note)-Chọn những phần tử đã được tick
  selected() {
    this.setState({
      selectItem: this.state.dataTable.filter(
        item => item.isChecked === true
      ),
    });
    setTimeout(() => {
      this.props.handleselected(this.state.selectItem);
      this.closeDialog();
    }, 0);
  }

  //Thoilc(*Note)-Clear dữ liệu sau khi chọn
  clearData() {
    this.setState({ selected: [] });
    let data = [...this.state.dataTable];
    data.map(item => item.isChecked = false);
    this.setState({ data });
  }

  //Thoilc(*Note)-Chọn nhiều phần tử
  handleSelect(row) {
    this.setState({
      selectedProductCode: row
    })
  }

  //Thoilc(*Note)-Lifecycle
  componentDidMount() {
    this.loadItem();
  }

  //Thoilc(*Note)-View dữ liệu mặt hàng
  loadItem() {
    let url = window.root_url + `goods-commons/view`;

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
        this.setState({ dataTable: data });
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

  //Thoilc(*Note)-Lọc dữ liệu trên lưới
  filterGridView() {
    this.setState({ tableFilter: Object.assign({}, this.tableFilter) });
  }
  //---------------------------
  render() {
    return (
      <Dialog
        open={this.props.dialog.isOpen}
        scroll="paper"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle variant="h5">Chọn Sản Phẩm</DialogTitle>
        <Divider />
        <DialogContent>
          <Card sx={{ mb: 1 }}>
            <CardContent>
              <div className="search-container">
                <Stack direction="row" spacing={1}>
                  <Stack direction="row" spacing={0.5}>
                    <FormControl fullWidth>
                      <TextField
                        id="ma-sp"
                        label="Mã sản phẩm"
                        onChange={(event) => {
                          this.tableFilter.goodsCommon_ProductCode = event.target.value
                        }}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <TextField id="ten-sp"
                        label="Tên sản phẩm"
                        onChange={(event) => {
                          this.tableFilter.goodsCommon_ProductName = event.target.value
                        }}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <TextField id="loai-sp"
                        label="Loại sản phẩmg"
                        onChange={(event) => {
                          this.tableFilter.goodsCommon_ItemGroup = event.target.value
                        }}
                      />
                    </FormControl>
                  </Stack>
                  <Button type="button" variant="contained"
                    onClick={() => this.filterGridView()}>
                    Lọc trên lưới
                  </Button>
                </Stack>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="main-content">
                <TableContainer>
                  <Table aria-label="table" className="select-table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Chọn</TableCell>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.dataTable
                        .filter(data => {
                          if (data.goodsCommon_ProductCode.includes(this.tableFilter.goodsCommon_ProductCode)
                            && data.goodsCommon_ProductName.includes(this.tableFilter.goodsCommon_ProductName)
                            && data.goodsCommon_ItemGroup.includes(this.tableFilter.goodsCommon_ItemGroup)) {
                            return data;
                          } else {
                            return false;
                          }
                        })
                        .slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                          this.state.rowsPerPage
                        )
                        .map((row, index) => {
                          return (
                            <TableRow
                              hover
                              tabIndex={-1}
                              key={row.goodsCommon_ProductCode + index}
                              onClick={() => {
                                this.props.multiple === true
                                  ? (row.isChecked = !row.isChecked)
                                  : (row.isChecked = true);
                                this.handleSelect(row)
                              }}
                            >
                              <TableCell align="center">
                                <Checkbox
                                  checked={
                                    row.isChecked === true
                                    // this.state.selectedProductCode !== [] &&
                                    // this.state.selectedProductCode.goodsCommon_ProductCode === row.goodsCommon_ProductCode
                                  }
                                  name="chon-sp"
                                  inputProps={{ "aria-label": row.goodsCommon_ProductCode }}
                                />

                              </TableCell>
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell key={column.id} align={column.align}>
                                    {value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={(this.state.dataTable || []).length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onPageChange={(event, newPage) =>
                    this.handleChangePage(event, newPage)
                  }
                  onRowsPerPageChange={(event) =>
                    this.handleChangeRowsPerPage(event)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.closeDialog()}>Đóng</Button>
          <Button onClick={() => this.selected()} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ChonSanPham.defaultProps = { multiple: true };
export default ChonSanPham;
