import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  Grid,
  Stack,
  Card,
  TextField,
  Checkbox,
  FormGroup,
  FormControl,

} from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
class DialogConfirmPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 1,
    };
  }

  handleClose() {
    this.props.handleCloseDialog();
  }
  handleSaveOrder() {
    this.props.handleSaveOrder(this.state.type);
  }

  render() {
    // console.log(this.props.dialog.dataCus);
    // console.log(this.props.dialog.dataBill);
    // let PayCas = this.props.dialog.dataPay.find(p => p === 'CAS');
    // console.log(PayCas)
    return (
      <>
        <Dialog
          open={this.props.dialog.isOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="confirm-popup"
          fullWidth
          maxWidth="xl"
        >
          {this.props.dialog.dataCus
            ?
            <DialogContent sx={{ height: "40vh" }}>
              <Card style={{ width: "100%", height: "100%" }} >
                <Grid item md={12} container spacing={1} style={{ padding: "50px 90px", justifyContent: "space-between" }}>
                  <Grid item md={7} gap="10px" display="flex" flexDirection="column">
                    <Stack>
                      <Typography fontSize="19px" style={{ color: "#4682B4" }}>Thông tin thanh toán</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="end" spacing={1}  >
                      <Typography fontSize="14px" fontWeight="600" style={{ color: "#2F4F4F", width: "25%" }}>Mã KH/MST</Typography>
                      <TextField
                        fullWidth
                        maxWidth
                        disabled
                        variant="standard"
                        id="outlined-disabled"
                        value={this.props.dialog.dataCus?.CUSTOMER_CODE}
                      />
                    </Stack>
                    <Stack direction="row" alignItems="end" >
                      <Typography fontSize="14px" fontWeight="600" style={{ color: "#2F4F4F", width: "25%" }}>Tên</Typography>
                      <TextField
                        fullWidth
                        maxWidth
                        disabled
                        variant="standard"
                        id="outlined-disabled"
                        value={this.props.dialog.dataCus?.CUSTOMER_NAME}
                      />
                    </Stack>
                    <Stack direction="row" alignItems="end" spacing={1}>
                      <Typography fontSize="14px" fontWeight="600" style={{ color: "#2F4F4F", width: "25%" }}>Địa chỉ</Typography>
                      <TextField
                        fullWidth
                        maxWidth
                        disabled
                        variant="standard"
                        id="outlined-disabled"
                        value={this.props.dialog.dataCus?.ADDRESS}
                      />
                    </Stack>
                    <Stack direction="row" alignItems="center">
                      <Typography fontSize="14px" fontWeight="600" style={{ color: "#2F4F4F", width: "21%" }}>Thanh toán</Typography>
                      <FormGroup row={true}>
                        <FormControlLabel
                          control={<Checkbox
                            color="default"

                            checked={this.props.dialog?.dataPay === 'CAS' ? true : false}
                          />} label="Thu ngay" />
                        <FormControlLabel
                          control={<Checkbox
                            color="default"
                            checked={this.props.dialog?.dataPay === 'CRE' ? true : false}

                          />} label="Thu sau" />
                      </FormGroup>
                    </Stack>
                    <Stack>
                      <FormControl  >
                        <RadioGroup
                          row
                          value={this.state.type}
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="female"
                          name="radio-buttons-group"
                          sx={{ marginLeft: "20%", justifyContent: "center" }}
                        >
                          <FormControlLabel value={1} sx={{ fontSize: "17px", fontWeight: "600" }} control={<Radio color="primary" onChange={() => { this.setState({ type: 1 }) }} />} label="Phiếu tạm thu" />
                          <FormControlLabel value={2} sx={{ fontSize: "17px", fontWeight: "600" }} control={<Radio color="warning" onChange={() => { this.setState({ type: 2 }) }} />} label="Hóa đơn điện tử" />
                        </RadioGroup>
                      </FormControl>
                    </Stack>

                  </Grid>
                  <Grid item md={4.5} display="flex" flexDirection="column" gap="10px" >
                    <Stack direction="row" alignItems="end" spacing={1}>
                      <Typography fontSize="19px" style={{ color: "#4682B4" }}>Thành tiền</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="end" spacing={1}>
                      <Typography fontSize="14px" fontWeight="600" style={{ color: "#2F4F4F", width: "40%" }}>Tiền thuế</Typography>
                      <TextField
                        fullWidth
                        maxWidth
                        disabled
                        variant="standard"
                        id="outlined-disabled"
                        value={this.props.dialog?.dataBill.VAT_RATE}
                      />
                    </Stack>
                    <Stack direction="row" alignItems="end" spacing={1}>
                      <Typography fontSize="14px" fontWeight="600" style={{ color: "#2F4F4F", width: "40%" }}>Tổng tiền</Typography>
                      <TextField
                        fullWidth
                        maxWidth
                        disabled
                        variant="standard"
                        id="outlined-disabled"
                        value={this.props.dialog?.dataBill.TAMOUNT}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Card>
            </DialogContent>
            : ''
          }
          <DialogActions>
            <Button
              type="button"
              variant="contained"
              onClick={() => this.handleSaveOrder()}
            >
              Xác nhận thanh toán
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={() => this.handleClose()}
            > Đóng</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}
export default DialogConfirmPayment;