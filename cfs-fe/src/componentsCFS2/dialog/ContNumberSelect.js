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
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class ContNumberSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableOrder: [],
      selectedCont: {},
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
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
        field: "CNTRNO",
        headerName: 'Diễn giải',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: "CNTRSZTP",
        headerName: 'Loại',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: "",
        headerName: 'Hãng khai thác',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
    ];
    this.createRows = (data) => data.map((row, index) => ({
      id: index,
      ...row
    }),
    );
  }

  closeDialog() {
    this.props.handleCloseDialog();
  }

  sendData(data) {
    let temp = this.createRows(data)
    this.setState({
      tableOrder: temp
    })
  }

  handleLoadData(params) {
    let url = window.root_url + `dt-package-mnf-ld/get`;
    let dataSend = {
      VOYAGEKEY: this.props.vessel.VOYAGEKEY,
      CNTRNO: params ? params.row.CNTRNO : this.state.selectedCont.CNTRNO,
      CLASS_CODE: this.props.dialog.type === 1 ? 1 : 2,
    }
    if (this.props.vessel.VOYAGEKEY === undefined) {
      this.setState({
        alert: {
          isOpen: true,
          message: 'Vui lòng chọn tàu chuyến!',
          duration: 2000,
          type: 'error'
        }
      })
      return;
    }
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
      body: JSON.stringify(dataSend)
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(data => {
        if (data.Status) {
          if (data.Payload.length === 0) {
            this.setState({
              alert: {
                isOpen: true,
                message: 'Container không có hàng!',
                type: 'warning',
                duration: 2000
              }
            })
            return;
          }
          this.setState({
            alert: {
              isOpen: true,
              type: "success",
              duration: 3000,
              message: data.Message
            },
          })
          this.props.handleSelect(data.Payload)
        }
        else {
          this.setState({
            alert: {
              type: 'warning',
              message: data.Message,
              duration: 3000,
              isOpen: true
            }
          });
        }
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
          <DialogTitle variant="h5">Số Container</DialogTitle>
          <Divider />
          <DialogContent>
            <Card>
              <CardContent>
                <Grid item mt={1} md={12}>
                  <DataGrid
                    onRowDoubleClick={(params) => this.handleLoadData(params)}
                    onRowClick={(params) => {
                      this.setState({
                        selectedCont: params.row
                      })
                    }}
                    hideFooter={true}
                    className="m-table"
                    rows={(this.state.tableOrder)}
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
            <Button onClick={() => this.handleLoadData()} variant="contained">
              Chọn
            </Button>
            <Button onClick={() => this.closeDialog()}>Đóng</Button>
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
        </Dialog >
      </>
    );
  }
}
export default ContNumberSelect;
