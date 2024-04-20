import * as React from "react";
import * as moment from "moment";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Divider,
  Grid,
  Card,
  CardContent,
  FormControl,
  Box,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import MuiAlert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class SelectVessel extends React.Component {
  constructor(props) {
    /* props: {
    * orientation: "horizone" | "vertical"
    }*/
    super(props);
    this.state = {
      dataTable: [],
      orientation: this.props.orientation === "vertical" ? false : true,
      selectedVessel: {
        VESSEL_NAME: '',
        INBOUND_VOYAGE: '',
        OUTBOUND_VOYAGE: '',
      },
      isOpen: false,
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
      tableFilter: {
        VESSEL_NAME: '',
      },
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
        field: "VESSEL_NAME",
        headerName: 'Tên Tàu',
        flex: 1,
      },
      {
        field: "INBOUND_VOYAGE",
        headerName: "Chuyến Nhập",
        flex: 1,
      },
      {
        field: "OUTBOUND_VOYAGE",
        headerName: "Chuyến Xuất",
        flex: 1,
      },
      {
        field: "ETA",
        headerName: "Ngày Tàu Đến",
        flex: 1,
      },
      {
        field: "ETD",
        headerName: "Ngày Tàu Rời",
        flex: 1,
      },
    ];
    this.createRows = (data) => data.map((row, index) => ({
      STT: index + 1,
      id: index,
      ...row
    }),
    );
  }

  closeDialog() {
    this.props.handleCloseDialog();
  }

  selected(params) {
    if (params) {
      this.props.handleSelected(params.row);
    } else {
      this.props.handleSelected(this.state.selectedVessel);
      const { selectedVessel } = this.state;
      if (selectedVessel.VOYAGEKEY.length === 0) {
        this.setState({
          alert: {
            isOpen: true,
            duration: 2000,
            message: 'không có dữ liệu',
            type: 'warning',
          }
        });
        return;
      }
    }
    this.setState({
      isOpen: false,
    });
  }

  componentDidMount() {
    this.loadVessel();
  }

  loadVessel() {
    let url = window.root_url + `dt-vessel-visits/view`;
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
        data.map(item => {
          item.ETA = moment(item.ETA).format("DD/MM/YYYY HH:mm:ss")
          item.ETD = moment(item.ETD).format("DD/MM/YYYY HH:mm:ss")
          return item;
        })
        let newData = data;
        if (data.length > 0) {
          let temp = this.createRows(newData);
          this.setState({
            dataTable: temp,
            alert: {
              isOpen: true,
              type: "success",
              duration: 3000,
              message: "Nạp dữ liệu thành công!"
            },
          })
        } else {
          this.setState({
            alert: {
              isOpen: true,
              duration: 3000,
              message: 'Không tìm thấy dữ liệu',
              type: 'warning'
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
              message: 'Lỗi ' + JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }
  //-----------------------------------
  render() {
    return (
      <Box>
        <Grid container rowSpacing={2} columnSpacing={1}>
          <Grid item md={this.state.orientation ? 2 : 12}>
            <Button
              disabled={this.props.activeStep !== 1 && this.props.activeStep !== undefined ? true : false}
              fullWidth
              variant="contained"
              onClick={() => {
                this.setState({ isOpen: true })
              }}
            >Chọn Tàu Chuyến</Button>
          </Grid>
          {/* <Divider flexItem orientation={this.state.orientation ? "vertical" : "horizontal"} sx={this.state.orientation ? { mr: "-1px" } : { mt: "-1px" }} /> */}
          <Grid item md={this.state.orientation ? 6 : 12}>
            <TextField fullWidth disabled id="VESSEL_NAME" variant="standard" value={"Tên Tàu: " + this.state.selectedVessel.VESSEL_NAME} />
          </Grid>
          <Grid item md={this.state.orientation ? 2 : 6}>
            <TextField fullWidth disabled id="INBOUND_VOYAGE" variant="standard" value={"Chuyến Nhập: " + this.state.selectedVessel.INBOUND_VOYAGE} />
          </Grid>
          <Grid item md={this.state.orientation ? 2 : 6}>
            <TextField fullWidth disabled id="OUTBOUND_VOYAGE" variant="standard" value={"Chuyến Xuất: " + this.state.selectedVessel.OUTBOUND_VOYAGE} />
          </Grid>
        </Grid>

        <Dialog
          open={this.state.isOpen}
          scroll="paper"
          fullWidth={true}
          maxWidth="lg"
        >
          <DialogTitle variant="h5">Chọn Tàu Chuyến</DialogTitle>
          <Divider />
          <DialogContent>
            <Card sx={{ mb: 1 }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Tìm kiếm:</span>
                  <FormControl>
                    <TextField
                      size="small"
                      id="tim-kiem"
                      label='Tên tàu'
                      onChange={(e) => {
                        this.setState({
                          tableFilter: { VESSEL_NAME: e.target.value }
                        })
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
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Grid item mt={1} md={12}>
                  <DataGrid
                    onRowDoubleClick={(e) => this.selected(e)}
                    className="m-table"
                    rows={(this.state.dataTable)
                      .filter(data => data.VESSEL_NAME.toUpperCase().includes(this.state.tableFilter.VESSEL_NAME.toUpperCase()))
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
                    onRowClick={(params) => {
                      this.setState({
                        selectedVessel: params.row
                      })
                    }}
                  >
                  </DataGrid>
                </Grid>
              </CardContent>
            </Card>
          </DialogContent >
          <DialogActions>
            <Button onClick={() => { this.setState({ isOpen: false }) }}>Đóng</Button>
            <Button onClick={() => this.selected()} variant="contained">
              Chọn
            </Button>
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
      </Box>
    );
  }
}
export default SelectVessel;
