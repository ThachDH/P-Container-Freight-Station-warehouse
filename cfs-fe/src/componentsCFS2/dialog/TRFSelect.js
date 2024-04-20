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
  TextField,
  Stack,
  InputAdornment,
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';

import CachedIcon from '@mui/icons-material/Cached';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class TRFSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [],
      selectedTRF: {},
      TRF_TEMP: '',
      searchField: {
        TRF_TEMP: '',
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
              this.state.selectedTRF.id === params.row.id
            }
            onClick={() => {
              this.setState({
                selectedTRF: params.row,
                TRF_TEMP: params.row.TRF_TEMP
              })
            }}
            inputProps={{ "aria-label": params.row.id }}
          />
        ]
      },
      {
        field: "TRF_TEMP",
        headerName: 'Tên biểu cước',
        flex: 1,
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

  selected(params) {
    if (params) {
      this.props.handleSelect(params.row);
    } else {
      this.props.handleSelect(this.state.selectedTRF);
      const { selectedTRF } = this.state;
      if (selectedTRF.TRF_TEMP.length === 0) {
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
  }

  componentDidMount() {
    this.loadTRF();
  }

  loadTRF() {
    let url = window.root_url + `trf-stds/viewCode`;
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
    })
      .then(async (res) => {
        // if (!res.ok) {
        //   const text = await res.text();
        //   throw new Error(text);
        // }
        return res.json();
      })
      .then(data => {
        let temp1 = data.Payload.trfStd.map(item => {
          item.FROM_DATE = moment(item.FROM_DATE, "DD/MM/YYYY").format("YYYY-MM-DD")
          item.TO_DATE = moment(item.TO_DATE, 'DD/MM/YYYY').format('YYYY-MM-DD')
          return item;
        })
        let temp = this.createRows(temp1);
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
      <>
        <Dialog
          open={this.props.dialog.isOpen}
          scroll="paper"
          fullWidth={true}
          maxWidth="sm"
        >
          <DialogTitle variant="h5">Mẫu biểu cước</DialogTitle>
          <Divider />
          <DialogContent>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Tìm kiếm:</span>
                  <TextField
                    size="small"
                    id="tim-kiem"
                    onChange={(e) => {
                      this.setState({
                        searchField: {
                          TRF_TEMP: e.target.value,
                        }
                      });
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon
                            style={{ cursor: "default" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
                <Grid item mt={1} md={12}>
                  <DataGrid
                    onRowDoubleClick={(e) => this.selected(e)}
                    hideFooterSelectedRowCount={true}
                    className="m-table"
                    rows={(this.state.dataTable)
                      .filter(data => data.TRF_TEMP.toUpperCase().includes(this.state.searchField.TRF_TEMP.toUpperCase()))
                    }
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
            <Button variant='contained' onClick={() => this.loadTRF()} startIcon={<CachedIcon />}>Tải lại</Button>
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
export default TRFSelect;
