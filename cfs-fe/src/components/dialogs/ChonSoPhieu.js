import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Radio,
  CardContent,
  Card,
  Stack,
  TextField
} from "@mui/material";

const columns = [
  { id: "Code", label: "Số Serial", minWidth: 70 },
  { id: "Description", label: "Diễn Giải", minWidth: 150 },
  {
    id: "StartingNo",
    label: "Số Bắt Đầu",
    minWidth: 100,
  },
  {
    id: "EndingNo",
    label: "Mã Kết Thúc",
    minWidth: 105,
  },
  {
    id: "ImcrementNo",
    label: "Tăng Theo Số",
    minWidth: 100,
  },
  {
    id: "LastNoUsed",
    label: "Số Dùng Gần Nhất",
    minWidth: 100,
  },
];

class ChonSoPhieu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
      dataTable: [],
      selected: null,
    };
    this.tableFilter = {
      Code: '',
    };
  }

  //Thoilc(*Note)-Cập nhật trạng thái thay đổi của bảng cấu hình
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.dataSrouce !== null &&
      prevState.dataTable !== nextProps.dataSrouce
    ) {
      return { dataTable: nextProps.dataSrouce };
    } else return null;
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

  selected() {
    this.props.handleselected(this.state.selected);
    this.clearData();
  }
  clearData() {
    this.setState({ selected: null });
  }

  //Thoilc(*Note)-Truyền dữ liệu
  handleSelect(row, index) {
    let dataSelected = {
      ...row,
      LastNoUsed: parseInt(row.LastNoUsed) + parseInt(row.ImcrementNo),
      index: index,
    };
    this.setState({ selected: dataSelected });
  }

  //Thoilc(*Note)-Tìm kiếm khách hàng trên lưới Dialog
  filterGridView() {
    this.setState({ searchTable: Object.assign({}, this.state.searchTable) });
  }
  //----------------------------------
  render() {
    return (
      <Dialog
        open={this.props.dialog.isOpen}
        scroll="paper"
        fullWidth={true}
        maxWidth="lg"
        data={this.state.data}
      >
        <DialogTitle variant="h5">Chọn Số Phiếu</DialogTitle>
        <Divider />
        <DialogContent>
          <Card style={{ marginBottom: '12px' }}>
            <CardContent>
              <Stack direction="row" spacing={1}>
                <TextField
                  id="ma-serial" label="Số Serial"
                  onChange={(e) => {
                    this.tableFilter.Code = e.target.value
                  }}
                />
                <span>&nbsp;</span>
                <Button type="button" variant="contained"
                  onClick={() => this.filterGridView()}>
                  Tìm kiếm
                </Button>
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <TableContainer sx={{ maxHeight: "54.5vh" }}>
                <Table aria-label="table" className="select-table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Chọn</TableCell>

                      {columns.map((column, idx) => (
                        <TableCell
                          key={column.id + idx}
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
                        if (data.Code.includes(this.tableFilter.Code)) {
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
                            key={row.Code}
                            onClick={() => this.handleSelect(row, index)}
                          >
                            <TableCell align="center">
                              <Radio
                                checked={
                                  this.state.selected !== null &&
                                  this.state.selected.Code === row.Code
                                }
                                name="chon-so-phieu"
                                inputProps={{ "aria-label": row.Code }}
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
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.closeDialog()}>Đóng</Button>
          <Button onClick={() => this.selected()} variant="contained">
            Chọn
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default ChonSoPhieu;
