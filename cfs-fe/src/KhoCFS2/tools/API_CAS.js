import * as React from "react";
import * as moment from "moment";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { DataGrid } from '@mui/x-data-grid';
import ExportCSV from "../../components/caiDat/ExportCSV";
import clsx from 'clsx';
import {
  Stack,
  Grid,
  Divider,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Card,
  CardContent,
  Autocomplete,
  InputAdornment,
  Typography,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FixedPageName from "../../componentsCFS2/fixedPageName";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class APICAS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [
        { id: 1, STT: 1, CREATE_DATE: '15/03/2023', FUNCTION_PATCH: 'Vessel', GET_DATA: '', POST_DATA: '', MES_STATUS: true, FUNCTION: '' },
        { id: 2, STT: 2, CREATE_DATE: '16/03/2023', FUNCTION_PATCH: 'Container', GET_DATA: '', POST_DATA: '', MES_STATUS: false, FUNCTION: '' },
      ],
      data: {
        FROM_DATE: moment().subtract(1, "days").format('yyyy-MM-DDThh:mm'),
        TO_DATE: moment().format('yyyy-MM-DDThh:mm'),
        MES_STATUS: '',
        FUNCTION_PATCH: '',
        SERVICE: '',
        GET_DATA: '',
        POST_DATA: '',
      },
      type: 1,
      dialog: {
        isOpen: false,
        type: 1,
        data: { STATUS: true, Payload: [{ VOYAGEKEY: "A12320230404155636", VESSEL_NAME: "A123", INBOUND_VOYAGE: "11M", OUTBOUND_VOYAGE: "12N", ETA: "2023-04-04 15:56:19.000", ETD: "2023-04-05 15:56:30.000", CallSign: "123", IMO: "1", TOS_SHIPKEY: "A12320230404155636" }, { VOYAGEKEY: "ACLR20230404155636", VESSEL_NAME: "AS CLARITA", INBOUND_VOYAGE: "09L", OUTBOUND_VOYAGE: "10L", ETA: "2023-04-04 15:56:21.000", ETD: "2023-04-05 15:56:32.000", CallSign: "CQIW3", IMO: "9300972", TOS_SHIPKEY: "ACLR20230404155636" }, { VOYAGEKEY: "TOYN20230331151431", VESSEL_NAME: "TOY EXPRESS", INBOUND_VOYAGE: "11X", OUTBOUND_VOYAGE: "11S", ETA: "2023-03-31 15:14:00.000", ETD: "2023-05-31 15:19:00.000", CallSign: null, IMO: null, TOS_SHIPKEY: "TOYN20230331151431" }], Message: "Truy vấn dữ liệu thành công!" }
      },
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.createRows = (data) => data.map((row, index) => ({
      STT: index + 1,
      id: index,
      ...row
    }),
    );
    this.columns = [
      {
        field: "STT",
        headerName: "STT",
        width: 80,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "CREATE_DATE",
        headerName: "Thời gian",
        flex: 1,
        align: 'center',
        type: 'dateTime',
        headerAlign: 'center',
      },
      {
        field: "FUNCTION_PATCH",
        headerName: "Danh mục",
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: "GET_DATA",
        headerName: "Dữ liệu gửi",
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        renderCell: (item) => {
          return this.renderCellButton(item, 1);
        }
      },
      {
        field: "POST_DATA",
        headerName: "Dữ liệu nhận",
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        renderCell: (item) => {
          return this.renderCellButton(item, 2);
        }
      },
      {
        field: "MES_STATUS",
        headerName: "Tình trạng",
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        renderCell: (item) => {
          if (item.value === true) {
            item.value = 'Thành công'
          } else if (item.value === false) {
            item.value = 'Thất bại'
          }
          return item.value
        },
        cellClassName: (params) => {
          return clsx('super-app', {
            negative: params.value === true,
            positive: params.value === false,
          });
        },
      },
      {
        field: "FUNCTION",
        headerName: "Chức năng",
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        renderCell: (item) => {
          if (item.row.MES_STATUS === false) {
            return this.renderResendButton();
          }
        }
      },
    ];
  }

  renderResendButton() {
    return (
      <Button
        className="m-btn "
        variant="outlined"
        onClick={(e) => console.log(e)}>
        Gửi lại
      </Button>
    )
  }

  renderCellButton(item, type) {
    return (
      <Button
        className='b-button'
        sx={{ color: '#ff9900' }}
        onClick={() => {
          if (type === 1) {
            this.setState({
              dialog: {
                ...this.state.dialog,
                isOpen: true,
                type: 1,
                // data: item.row.GET_DATA,
              }
            })
          } else {
            this.setState({
              dialog: {
                ...this.state.dialog,
                isOpen: true,
                type: 2,
                // data: item.row.POST_DATA,
              }
            })
          }
        }}
        endIcon={<InfoOutlinedIcon />}>
        {
          type === 1
            ? " Dữ liệu gửi"
            : 'Dữ liệu nhận'
        }
      </Button>
    )
  }

  //--------------------------------------
  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Card>
          <CardContent >
            <Grid item>
              <Divider textAlign="center">
                <span className="m-filter-title">Lọc dữ liệu</span>
              </Divider>
            </Grid>
            <Stack>
              <Stack direction="row" spacing={2} style={{ marginTop: "12px", marginLeft: '12px', marginRight: '12px ' }} alignItems={'center'} >
                <Stack direction="row" gap="12px" >
                  <Stack direction="row" alignItems="center" >
                    <TextField
                      key="from"
                      fullWidth
                      size="small"
                      type="datetime-local"
                      label="Từ ngày"
                      value={this.state.data.FROM_DATE}
                      onChange={(e) => {
                        this.setState({
                          data: {
                            ...this.state.data,
                            FROM_DATE: e.target.value
                          }
                        })
                      }}
                    />
                  </Stack>
                  <Stack direction="row" alignItems="center">
                    <TextField
                      key="to"
                      fullWidth
                      size="small"
                      type="datetime-local"
                      label="Đến ngày"
                      value={this.state.data.TO_DATE}
                      onChange={(e) => {
                        this.setState({
                          data: {
                            ...this.state.data,
                            TO_DATE: e.target.value
                          }
                        })
                      }}
                    />
                  </Stack>
                </Stack>
                <Divider orientation="vertical" flexItem />
                <Stack direction='row' spacing={1} sx={{ width: '400px' }}>
                  <Autocomplete
                    fullWidth
                    id="tags-outlined"
                    defaultValue=''
                    options={['', true, false]}
                    size="small"
                    onChange={(event, listSelected) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          MES_STATUS: listSelected
                        }
                      })
                    }}
                    getOptionLabel={(params) => {
                      if (params === false) {
                        params = 'Thất bại'
                      } else if (params === true) {
                        params = 'Thành công'
                      } else {
                        params = 'Tất cả'
                      }
                      return params
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        readOnly
                        label='Tình trạng'
                      />
                    )}
                  />
                  <Autocomplete
                    fullWidth
                    id="tags-outlined"
                    defaultValue=''
                    options={['', 'VESSEL', 'CONTAINER', 'MANIFEST']}
                    size="small"
                    onChange={(event, listSelected) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          FUNCTION_PATCH: listSelected
                        }
                      })
                    }}
                    getOptionLabel={(params) => {
                      if (params === 'VESSEL') {
                        params = 'Tàu / Chuyến'
                      } else if (params === 'MANIFEST') {
                        params = 'Manifest Container'
                      } else if (params === 'CONTAINER') {
                        params = 'Container biến động'
                      } else {
                        params = 'Tất cả'
                      }
                      return params
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        readOnly
                        label='Tìm theo danh mục'
                      />
                    )}
                  />
                </Stack>
                <Divider orientation="vertical" flexItem />
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => this.handleViewData()}
                  endIcon={<SearchIcon />}
                >Nạp dữ liệu</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card >
        <Card style={{ marginTop: "10px" }}>
          <CardContent>
            <Stack mb={1} direction="row" justifyContent="space-between">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ width: 80 }} >Tìm kiếm:</Typography >
                <TextField
                  id="tim-kiem"
                  onChange={(e) => {
                    this.setState({
                      tableFilter: {
                        CNTRNO: e.target.value,
                      }
                    });
                  }}
                  size="small"
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
              <ExportCSV csvData={this.state.dataTable} fileName="API"></ExportCSV>
            </Stack>
            <Divider style={{ marginTop: "10px" }} flexItem />
            <Grid item mt={1}>
              <DataGrid
                hideFooter={true}
                sx={{ '& .super-app.negative': { color: '#51cb52', }, '& .super-app.positive': { color: '#ff5c33', }, height: "63vh" }}
                className="m-table"
                rows={(this.state.dataTable)
                  // .filter(data => data.CNTRNO.toUpperCase().includes(this.state.tableFilter.CNTRNO.toUpperCase()))
                }
                rowHeight={40}
                columns={this.columns}
              >
              </DataGrid>
            </Grid>
          </CardContent>
        </Card>

        {/* -------------------- Dialog --------------------*/}
        {
          this.state.dialog.isOpen === true
            ?
            <Dialog
              open={this.state.dialog.isOpen}
              fullWidth={true}
              maxWidth="sm"
              scroll="paper"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  this.setState({
                    dialog: {
                      isOpen: false,
                    }
                  })
                }
              }}
            >
              <DialogTitle variant="h5" >{this.state.dialog.type === 1 ? 'Dữ liệu gửi!' : 'Dữ liệu nhận!'}</DialogTitle>
              <DialogContent>
                <Card>
                  {
                    this.state.dialog.type === 1
                      ?
                      <span style={{ whiteSpace: 'break-spaces' }}>
                        {
                          JSON.stringify(this.state.dialog.data).replaceAll(',', '\n')
                        }
                      </span>
                      :
                      <span style={{ whiteSpace: 'break-spaces' }}>
                        {
                          `Status : ${JSON.stringify(this.state.dialog.data.STATUS)} \n`
                        }
                        {
                          `Payload : ${JSON.stringify(this.state.dialog.data.Payload).replaceAll(',', '\n')}`
                        }
                        {
                          `\n Message : ${JSON.stringify(this.state.dialog.data.Message)}`
                        }
                      </span>
                  }
                </Card>
              </DialogContent>
              <DialogActions>
                <Button
                  variant='contained'
                  color='success'
                  onClick={() => {
                    this.setState({
                      dialog: {
                        ...this.state.dialog,
                        isOpen: false
                      }
                    })
                  }}>
                  Xác nhận
                </Button>
              </DialogActions>
            </Dialog>
            : ''
        }
        {/* -------------------- Close - Dialog --------------------*/}

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
      </Box >
    );
  }
}

export default APICAS;
