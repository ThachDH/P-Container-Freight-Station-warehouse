import * as React from "react";
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  AccordionSummary,
  AccordionDetails,
  Accordion,
  List,
  ListSubheader,
  Card,
  CardContent,
  Divider,
  FormControl,
  ListItemButton,
  Grid,
  TextField,
  Dialog,
  Snackbar,
} from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import { QrReader } from "react-qr-reader";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import MuiAlert from '@mui/material/Alert';
import { ExpandMore } from "@mui/icons-material";
import { Typography } from "@material-ui/core";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
class TruyVanThongTin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
      STOCK_TIME: '',
      dataVessel: {
        VESSEL_NAME: '',
        INBOUND_VOYAGE: '',
      },
      dataPallet: [],
      dataTablePallet: {
        VOYAGEKEY: '',
        BOOKING_FWD: '',
        HOUSE_BILL: '',
        CARGO_PIECE: '',
        VESSEL_NAME: '',


      },
      type: '',
      dialogQR: false,
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },

    }
    this.handleError = this.handleError.bind(this);
    this.handleScan = this.handleScan.bind(this);
  }
  handleChangeTab(event, newValue) {
    this.setState({ activedTab: newValue });
  }

  handleLoadPallet() {
    this.setState({
      actionStep: "Pallet"
    })
  }
  componentDidMount() {
    this.handleLoadPallet();
  }

  handleScan(data) {
    if (data) {
      this.setState({
        result: data.text,
        type: ''
      });
      this.handleLoadInforPallet();
    }
  };

  handleError(err) {
    console.error(err);
  };

  handleLoadInforPallet() {
    let url = window.root_url + `dt-package-stock/viewPalletInfor`;
    let dataSend = {
      HB_BK: this.state.result,

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
      .then(response => {

        if (response.Status) {
          let timeIn = new Date(response.Payload.TIME_IN);
          let currentTime = new Date();
          let STOCK_TIME = (Math.ceil((currentTime.getTime() - timeIn.getTime()) / (1000 * 3600 * 24)));
          this.setState({
            dataTablePallet: response.Payload,
            dataVessel: response.Payload.vesselVisit[0],
            STOCK_TIME: STOCK_TIME,
            dataPallet: response.Payload.palletStockInfo,
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message,
              type: 'success'
            }
          })
        } else {
          this.setState({
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message,
              type: 'error'
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
  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Grid >
          <Grid display="flex" flexDirection="column" justifyContent="center">
            <Grid mt="20px" item container md={12} >
              <Grid item md={3}></Grid>
              <Grid item md={6}>
                <Card style={{ marginBottom: '12px' }}>
                  <CardContent >
                    <Typography style={{ textAlign: 'center', fontSize: 25 }}>Tra Cứu Thông Tin</Typography>

                    <Grid display="flex" justifyContent="center" gap="10px" mt="10px">
                      <Button
                        type="button"
                        variant="contained"
                        size="small"
                        style={{ width: "50%" }}

                        onClick={() => {
                          this.setState({
                            type: "scan",
                            dialogQR: true
                          })
                        }}
                      >QR scan</Button>
                      <TextField
                        label={(this.state.dataTablePallet.HOUSE_BILL || this.state.dataTablePallet.BOOKING_FWD)
                          ? ((this.state.dataTablePallet.HOUSE_BILL)
                            ? "House_Bill" : "Booking_FWD") : "House_Bill / Booking_FWD"}
                        size="small"
                        value={this.state.result}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            return this.handleLoadInforPallet();
                          }
                        }}
                        onChange={(e) => {
                          this.setState({
                            result: e.target.value.trim()
                          })
                        }}
                        style={{ width: "50%" }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => this.handleLoadInforPallet()}
                              />
                            </InputAdornment>
                          ),
                        }}
                      ></TextField>
                    </Grid>

                    <Divider textAlign="center" sx={{ mt: "10px", mb: "10px" }}>Thông tin chi tiết</Divider>

                    <Grid display="flex" flexDirection="column" gap="15px" mb="15px">
                      <Grid container gap="10px" justifyContent="center">
                        <Grid width="31%">
                          <TextField
                            readOnly
                            key='vessel'
                            fullWidth
                            size='small'
                            value={this.state.dataVessel.VESSEL_NAME}
                            label='Tên tàu'
                          />

                        </Grid>
                        <Grid width="31%">
                          <TextField
                            key='vessel'
                            fullWidth
                            size='small'
                            value={this.state.dataVessel.INBOUND_VOYAGE}
                            label='Chuyến'
                          />
                        </Grid>
                        <Grid width="31%">
                          <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterMoment} >
                              <DatePicker
                                readOnly
                                label={((this.state.dataTablePallet.HOUSE_BILL) || (this.state.dataTablePallet.BOOKING_FWD))
                                  ? ((this.state.dataTablePallet.HOUSE_BILL)
                                    ? "Ngày tàu cập" : "Ngày tàu rời") : "Ngày tàu cập / rời"}
                                inputFormat="DD/MM/YYYY"
                                value={((this.state.dataTablePallet.HOUSE_BILL) || (this.state.dataTablePallet.BOOKING_FWD))
                                  ? ((this.state.dataTablePallet.HOUSE_BILL)
                                    ? (this.state.dataVessel.ETA) : (this.state.dataVessel.ETD)) : null}
                                renderInput={(params) => <TextField disabled size="small" {...params} />}
                              />
                            </LocalizationProvider>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container gap="10px" justifyContent="center">
                        <Grid width="31%">
                          <TextField
                            key='vessel'
                            fullWidth
                            size='small'
                            value={(this.state.dataTablePallet.HOUSE_BILL) ? (this.state.dataTablePallet.HOUSE_BILL) : (this.state.dataTablePallet.BOOKING_FWD)}
                            label={(this.state.dataTablePallet.HOUSE_BILL || this.state.dataTablePallet.BOOKING_FWD)
                              ? ((this.state.dataTablePallet.HOUSE_BILL)
                                ? "House_Bill" : "Booking_FWD") : "House_Bill / Booking_FWD"}
                          />
                        </Grid>
                        <Grid width="31%">
                          <TextField
                            key='vessel'
                            fullWidth
                            size='small'
                            value={this.state.dataTablePallet.CARGO_PIECE}
                            label='Số lượng'
                          />
                        </Grid>
                        <Grid width="31%">
                          <TextField
                            readOnly
                            key='vessel'
                            fullWidth
                            size='small'
                            value={this.state.STOCK_TIME}
                            label='Số ngày tồn'
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid>
                      <Accordion expanded={this.state.actionStep === 'Pallet'} onChange={() => {
                        this.handleChange('Pallet')
                      }}>
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          aria-controls="pallet-content"
                          id="pallet-header"
                        >
                          <Grid container alignContent="center">
                            <Grid >
                              <Typography style={{ fontSize: 18 }}>
                                Chi tiết thông tin pallet
                              </Typography>
                            </Grid>
                          </Grid>
                        </AccordionSummary>
                        <AccordionDetails sx={{ height: "40vh", overflowY: 'auto' }}>
                          <List component="nav" sx={{ bgcolor: 'background.paper' }}>
                            <ListSubheader>
                              <Grid container justifyItems="center">
                                <Grid item xs={4} sx={{ textAlign: "center" }}>
                                  <Typography variant="b" component="b">Mã Pallet</Typography>
                                </Grid>
                                <Grid item xs={4} sx={{ textAlign: "center" }}>
                                  <Typography variant="b" component="b">Vị trí</Typography>
                                </Grid>
                                <Grid item xs={4} sx={{ textAlign: "center" }}>
                                  <Typography variant="b" component="b">Số lượng</Typography>
                                </Grid>
                              </Grid>
                            </ListSubheader>
                            {
                              this.state.dataPallet?.map((item, i) => {
                                return (
                                  <>
                                    {i !== 0 ? <Divider /> : ""}
                                    <ListItemButton
                                      key={i}
                                    >
                                      <Grid container spacing={1}>
                                        <Grid item xs={4} sx={{ textAlign: "center" }}>
                                          <Typography variant="b" component="b">{item.PALLET_NO}</Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{ textAlign: "center" }}>
                                          <Typography variant="b" component="b">{`${item.BLOCK} - ${item.SLOT}  - ${item.TIER} `}</Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{ textAlign: "center" }}>
                                          <Typography variant="b" component="b">{item.CARGO_PIECE}</Typography>
                                        </Grid>

                                      </Grid>
                                    </ListItemButton>
                                  </>
                                );
                              })
                            }
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item md={3}></Grid>
            </Grid>
          </Grid>
        </Grid>
        {
          this.state.type === "scan"
            ? <Dialog
              onClose={() => { this.setState({ dialogQR: false }) }}
              open={this.state.dialogQR}
              scroll="paper"
              fullWidth
              maxWidth="xs"
            >
              <Grid style={{ backgroundColor: "#DCDCDC" }}>
                <div style={{ width: "80%", margin: "auto" }}>
                  <QrReader
                    delay={300}
                    facingMode={"environment"}
                    onError={(err) => this.handleError(err)}
                    onResult={(data) => this.handleScan(data)}
                    style={{ width: "100%" }}
                  />
                </div>
              </Grid>
            </Dialog>
            : ''
        }

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

    )
  }
}
export default TruyVanThongTin;
