import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Radio,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

const columns = [
  { id: "maO", label: "Mã Ô", minWidth: 95 },
  { id: "maDay", label: "Mã Dãy", minWidth: 80 },
  {
    id: "maTang",
    label: "Mã Tầng",
    minWidth: 115,
  },
  {
    id: "chiSo",
    label: "Chỉ Số",
    minWidth: 125,
  },
  {
    id: "viTri",
    label: "Vị Trí",
    minWidth: 80,
  },
  {
    id: "kho",
    label: "Kho",
    minWidth: 80,
  },
  {
    id: "trangThai",
    label: "Trạng Thái",
    minWidth: 100,
  },
];

function createData(maO, maDay, maTang, chiSo, viTri, kho, trangThai) {
  return {
    maO,
    maDay,
    maTang,
    chiSo,
    viTri,
    kho,
    trangThai,
  };
}

const rows = [
  createData("A1.03N", "A", "1", "1", "N", "Kho 2", "Ô trống"),
  createData("A1.04N", "A", "1", "1", "N", "Kho 2", "Ô trống"),
  createData("A1.05N", "A", "1", "1", "N", "Kho 2", "Ô trống"),
  createData("A1.06N", "A", "1", "1", "N", "Kho 2", "Ô trống"),
  createData("A1.07N", "A", "1", "1", "N", "Kho 2", "Ô trống"),
];

class DanhSachO extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
      dataTable: [...rows],
      selected: null,
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
  selected() {
    this.props.handleselected(this.state.selected);
    this.clearData();
  }
  clearData() {
    this.setState({ selected: null });
  }

  handleSelect(row) {
    this.setState({ selected: row });
  }

  render() {
    return (
      <Dialog
        open={this.props.dialog.isOpen}
        scroll="paper"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle variant="h5">Chọn Ô</DialogTitle>
        <Divider />
        <DialogContent>
          <div className="search-container">
            <Stack direction="row" spacing={1}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1}>
                  <TextField id="dialog-ma-o" label="Mã Ô" />
                  <TextField id="dialog-ma-day" label="Mã Dãy" />
                  <TextField id="dialog-ma-tang" label="Mã Tầng" />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <TextField id="dialog-chi-so" label="Chỉ Số" />
                  <FormControl fullWidth>
                    <InputLabel id="dialog-vi-tri-label">Vị Trí</InputLabel>
                    <Select
                      labelId="dialog-vi-tri-label"
                      id="dialog-vi-tri"
                      label="Vị Trí"
                    >
                      <MenuItem value=""></MenuItem>
                      <MenuItem value="T">T</MenuItem>
                      <MenuItem value="N">N</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="dialog-trang-thai-label">
                      Trạng Thái
                    </InputLabel>
                    <Select
                      labelId="dialog-trang-thai-label"
                      id="dialog-trang-thai"
                      label="Trạng Thái"
                    >
                      <MenuItem value=""></MenuItem>
                      <MenuItem value="Ô trống">Ô trống</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
              <Button type="button" variant="contained">
                Tìm kiếm
              </Button>
            </Stack>
          </div>
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
                          key={row.maO}
                          onClick={() => this.handleSelect(row)}
                        >
                          <TableCell align="center">
                            <Radio
                              checked={
                                this.state.selected !== null &&
                                this.state.selected.maO === row.maO
                              }
                              name="chon-o"
                              inputProps={{ "aria-label": row.maO }}
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
              count={rows.length}
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
export default DanhSachO;
