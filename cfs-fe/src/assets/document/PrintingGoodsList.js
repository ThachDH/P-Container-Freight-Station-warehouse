import * as React from "react";
import "./printIndex.scss";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Stack,
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import QRCode from 'qrcode.react';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const QR = React.forwardRef(function QR(props, ref) {
  return <QRCode ref={ref}  {...props} />
})


class PrintingGoodsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      printItem: this.props.dataPrint ?? [],
      value: this.props.value,
      container: this.props.container ?? {},
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
  }

  handlePrint = () => {
    let printElement = document.getElementById('PrintMe');
    let printWindow = window.open('', 'PrintMe');
    printWindow.document.write(document.documentElement.innerHTML);
    setTimeout(() => { // Needed for large documents
      printWindow.document.body.style.margin = '0 0';
      printWindow.document.body.innerHTML = printElement.outerHTML;
      printWindow.document.close(); // necessary for IE >= 10
      printWindow.focus(); // necessary for IE >= 10*/
      printWindow.print();
      printWindow.close();
    }, 3000);
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.dataPrint !== nextState.dataPrint) {
      return true;
    }
    return false;
  }

  closeDialog() {
    this.props.handleCloseDialog();
    this.setState({
      printItem: [],
    })
  }

  viewItem() {
    let { printItem } = this.state;
    if (printItem.length > 0) {
      let count = 0;
      let item = [];
      printItem.map(data => {
        count = Math.ceil((data.CBM) / 1.2)
        if (this.state.value === 1) {
          for (let i = 1; i <= count; i++) {
            item.push(
              <div class="s-main">
                <div class="block">
                  <div class='item' style={{ display: 'block' }}>
                    <div class="item">
                      <p>Số Cont:</p>
                      <p>{data.CNTRNO}</p>
                    </div>
                    <div class="item">
                      <p>Masterbill:</p>
                      <p>{this.state.container.BILLOFLADING}</p>
                    </div>
                  </div>
                  <div class="item">
                    <p>Số Lô:</p>
                    <p>{data.STT}</p>
                  </div>
                </div>
                <hr class="fade-2"></hr>
                <div class='block' style={{ marginTop: '-15px' }}>
                  <div class="item" >
                    <p>Số House_Bill:</p>
                    <p>{data.HOUSE_BILL}</p>
                  </div>
                  <div style={{ justifyContent: 'space-between' }} class="item">
                    <p>Số Lượng:</p>
                    <p>/ {data.CARGO_PIECE}</p>
                  </div>
                </div>
                <div class="block" style={{ marginTop: '-5px' }}>
                  <div class="item" style={{ marginBottom: '20px', marginTop: '-20px' }}>
                    <p>Khách Hàng:</p>
                    <p>{data.CUSTOMER_NAME}</p>
                  </div>
                </div>
                <div style={{ display: "inline-block" }}>
                  <QR
                    class='QR-code'
                    renderAs='svg'
                    value={data.HOUSE_BILL}
                    size={100}
                  />
                  <div class='unique'>
                    <p class='label'>Shipmarks:</p>
                    {
                      data.SHIPMARKS.length > 130
                        ? <p class='smaller-details'>{data.SHIPMARKS}</p>
                        : <p class='details'>{data.SHIPMARKS}</p>
                    }

                  </div>
                </div>
                <hr class="fade-3" style={{ marginTop: '30px' }}></hr>
              </div >
            )
          }
        } else {
          for (let i = 1; i <= count; i++) {
            item.push(
              <div class="s-main">
                <div class="block">
                  <div class='item' style={{ display: 'block' }}>
                    <div class="item">
                      <p>Số Cont:</p>
                      <p>{data.CNTRNO}</p>
                    </div>
                    <div class="item">
                      <p>Booking:</p>
                      <p>{data.BOOKING_NO}</p>
                    </div>
                  </div>
                  <div class="item">
                    <p>Số Lô:</p>
                    <p>{data.STT}</p>
                  </div>
                </div>
                <hr class="fade-2"></hr>
                <div class='block' style={{ marginTop: '-15px' }}>
                  <div class="item">
                    <p>Số Booking_FWD:</p>
                    <p>{data.BOOKING_FWD}</p>
                  </div>
                  <div style={{ justifyContent: 'space-between' }} class="item">
                    <p>Số Lượng:</p>
                    <p>/ {data.CARGO_PIECE}</p>
                  </div>
                </div>
                <div class="block" style={{ marginTop: '-5px' }}>
                  <div class="item" style={{ marginBottom: '20px', marginTop: '-20px' }}>
                    <p>Khách Hàng:</p>
                    <p>{data.CUSTOMER_NAME}</p>
                  </div>
                </div>
                <div style={{ display: "inline-block" }}>
                  <QR
                    class='QR-code'
                    renderAs='svg'
                    value={data.BOOKING_FWD}
                    size={100}
                  />
                  <div class='unique'>
                    <p class='label'>Shipmarks:</p>
                    {
                      data.SHIPMARKS.length > 130
                        ? <p class='smaller-details'>{data.SHIPMARKS}</p>
                        : <p class='details'>{data.SHIPMARKS}</p>
                    }
                  </div>
                </div>
                <hr class="fade-3" style={{ marginTop: '30px' }}></hr>
              </div >
            )
          }
        }
        return data;
      })
      return item;
    }
  }

  //-----------------------------------
  render() {
    let total = 0;
    this.state.printItem.map(item => {
      return total += Math.ceil((item.CBM) / 1.2)
    })
    return (
      <Dialog
        open={this.props.dialog.isOpen}
        scroll="paper"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle variant="h5">
          <Stack direction='row' justifyContent="space-between" alignItems="center">
            <span class='text'>In Bảng Kê Hàng Hoá</span>
            <Stack direction='row' spacing={2}>
              <span>Số lượng: {total} </span>
              <Divider orientation='vertical' flexItem />
              <Button onClick={() => this.handlePrint()} variant="contained">In</Button>
              <Button onClick={() => this.closeDialog()} variant="outlined">Đóng</Button>
            </Stack>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <div id="PrintMe">
            {
              this.viewItem()
            }
          </div>
        </DialogContent>
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
    );
  }
}

export default PrintingGoodsList;
