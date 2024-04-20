import * as React from "react";
import * as moment from "moment";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  Radio,
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import CachedIcon from '@mui/icons-material/Cached';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class Warehouse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [],
      selectedWarehouse: {},
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.columns = [
      {
        field: "Action",
        headerName: "Chọn",
        type: "actions",
        width: 80,
        getActions: (params) => [
          <Radio
            checked={
              this.state.dataTable !== [] &&
              this.state.selectedWarehouse.id === params.row.id
            }
            onClick={() => {
              this.setState({
                selectedWarehouse: params.row,
              })
            }}
            inputProps={{ "aria-label": params.row.id }}
          />
        ]
      },
      {
        field: "WAREHOUSE_CODE",
        headerName: 'Mã kho',
        flex: 1,
      },
      {
        field: "WAREHOUSE_NAME",
        headerName: 'Tên kho',
        flex: 1,
      }
    ];
    this.createRows = (data) => data.map((row, index) => ({
      id: index + 1,
      ...row
    }),
    );
  }
  closeDialog() {
    this.props.handleCloseDialog();
  }
  selected() {
    if (Object.keys(this.state.selectedWarehouse).length === 0) {
      this.setState({
        alert: {
          isOpen: true,
          duration: 2000,
          message: 'không có dữ liệu',
          type: 'warning',
        }
      });
    } else {
      this.props.handleSelect(this.state.selectedWarehouse);
    }
  }

  componentDidMount() {
    this.loadWarehouse();
  }
  loadWarehouse() {
    let url = window.root_url + `bs-warehouse/view`;
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
        let temp = this.createRows(data.Payload);
        this.setState({
          dataTable: temp,
          alert: {
            isOpen: true,
            type: "success",
            duration: 3000,
            message: "Nạp dữ liệu thành công!"
          },
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
              message: 'Nạp dữ liệu không thành công',
              type: 'error'
            }
          });
        }
      });
  }
  //-----------------------------------
  render() {
    return (
      <>
        <Dialog
          open={this.props.dialog.isOpen}
          scroll="paper"
          fullWidth={true}
          maxWidth="sm"
        >
          <DialogTitle variant="h5">Chọn kho</DialogTitle>
          <Divider />
          <DialogContent>
            <Card>
              <CardContent>
                <Grid item mt={1} md={12}>
                  <DataGrid
                    hideFooterSelectedRowCount={true}
                    className="m-table"
                    rows={(this.state.dataTable)}
                    rowHeight={35}
                    columns={this.columns}
                    sx={{ height: "63vh" }}
                  >
                  </DataGrid>
                </Grid>
              </CardContent>
            </Card>
          </DialogContent >
          <DialogActions>
            <Button onClick={() => this.selected()} variant="contained">
              Chọn
            </Button>
            <Button onClick={() => this.closeDialog()}>Đóng</Button>
            <Button variant='contained' onClick={() => this.loadWarehouse()} startIcon={<CachedIcon />}>Tải lại</Button>
          </DialogActions>
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
        </Dialog>
      </>
    )
  }
}
export default Warehouse;