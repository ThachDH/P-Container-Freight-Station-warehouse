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
  TableRow,
  Checkbox,
} from "@mui/material";
const columns = [
  { id: "ten", label: "Tên Nút Nhấn", minWidth: 70 },
  { id: "dienGiai", label: "Diễn Giải", minWidth: 150 },
];

function createData(ten, dienGiai, isChecked) {
  return { ten, dienGiai, isChecked };
}

const rows = [
  createData("btnNext", ">", false),
  createData("btnPrev", "<", false),
  createData("btnClose", "Thoát", false),
  createData("btnReopen", "Điều Chỉnh", false),
  createData("btnPrint", "In Phiếu Chuyển Ô", false),
  createData("btnExcel", "Xuất Excel", false),
];

class ChonQuyenTrenNutNhan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: JSON.parse(JSON.stringify(rows)),
      id: -1,
    };
  }

  closeDialog() {
    this.props.handleCloseDialog();
    this.clearData();
  }

  //Thoilc(*Note)-Chọn phận quyền
  selected() {
    // let t = this.state.dataTable.ten;
    let selected = this.state.dataTable.filter(
      (item) => item.isChecked === true
    );
    setTimeout(() => {
      this.props.handleselected(this.props.dialog.id, selected);
      this.clearData();
    }, 0);
  }
  clearData() {
    this.setState({ dataTable: JSON.parse(JSON.stringify(rows)) });
  }
  handleSelect(row) {
    this.setState({ dataTable: [...this.state.dataTable] });
  }
  //--------------------------
  render() {
    return (
      <Dialog
        open={this.props.dialog.isOpen}
        scroll="paper"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle variant="h5">Lựa Chọn</DialogTitle>
        <Divider />
        <DialogContent>
          <div className="main-content">
            <TableContainer>
              <Table aria-label="table" className="select-table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{ width: "60px" }}>
                      Chọn
                    </TableCell>

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
                  {this.state.dataTable.map((row, index) => {
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={row.ten}
                        onClick={() => this.handleSelect(row)}
                      >
                        <TableCell align="center">
                          <Checkbox
                            checked={row.isChecked}
                            onChange={() => (row.isChecked = !row.isChecked)}
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
export default ChonQuyenTrenNutNhan;
