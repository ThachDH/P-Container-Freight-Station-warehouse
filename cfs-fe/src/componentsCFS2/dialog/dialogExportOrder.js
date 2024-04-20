import * as moment from "moment";
import * as React from "react";
import logoSPITC2 from "../../assets/images/LOGO_ICD3.png";
import {
  Button,
  Dialog,
  DialogActions,
  Card,
} from "@mui/material";

class DialogExportOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [],
      isOpen: false
    };
  }


  handlePrint(elementId, uniqueIframeId) {
    const content = document.getElementById('viewInforOrder')
    let pri
    if (document.getElementById('', 'PRINT DATA')) {
      pri = document.getElementById(uniqueIframeId).contentWindow;
    } else {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('title', uniqueIframeId);
      iframe.setAttribute('id', uniqueIframeId);
      iframe.setAttribute('style', 'height: 0px; width: 0px; position: absolute;');
      document.body.appendChild(iframe);
      pri = iframe.contentWindow;
    }
    pri.document.open('_blank');
    pri.document.write(content.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
  }
  closeDialog() {
    this.props.handleCloseDialog();
  }

  render() {
    let checkCustom = this.props.dialog.inforCus === undefined ? false : true;
    let checkVessel = this.props.dialog.inforVessel === undefined ? false : true;
    return (
      <Dialog open={this.props.dialog.isOpen} croll="paper" fullWidth maxWidth="xl">
        {
          this.props.dialog.dataTable
            ?
            <Card id="viewInforOrder" sx={{ padding: "20px", overflow: "auto" }}>
              <div style={{ display: 'grid', justifyContent: 'space-between', alignItems: "center", borderBottom: '2px solid #000', gridTemplateColumns: '40% 59%', columnGap: '20px' }}>
                <div>
                  <img src={logoSPITC2} alt="logo" height="150px" width="250px" ></img>
                </div>
                <div style={{ lineHeight: "25px" }}>
                  <div style={{ fontSize: '25px', fontWeight: 600, fontFamily: 'auto' }}>CÔNG TY TNHH CẢNG PHƯỚC LONG</div>
                  <div style={{ fontSize: '15px' }}>Địa chỉ: Km7 - Xa lộ Hà Nội, Phường Phước Long A, TP Thủ Đức, HCM</div>
                  <div style={{ display: 'flex' }}>
                    <div style={{ fontSize: '15px' }}>TEL: (84 - 28) 3731 3204 &nbsp;&nbsp;</div>
                    <div style={{ fontSize: '15px' }}>Fax : (84 - 28) 3728 1344</div>
                  </div>
                  <div style={{ fontSize: '15px' }}>Email: mkt@pip.com.vn</div>
                </div>
              </div>
              <div  >
                <div >
                  <div
                    style={{
                      fontSize: "25px",
                      fontWeight: "600",
                      fontFamily: "auto",
                      textAlign: 'center',
                      margin: "20px",
                    }}
                  >
                    LỆNH {this.props.dialog.dataTable[0]?.METHOD_CODE === 'NKN' ? 'NHẬP KHO' : this.props.dialog.dataTable[0]?.METHOD_CODE === 'NKX' ? 'NHẬP KHO' : 'XUẤT KHO'} {this.props.dialog.dataTable[0]?.CLASS_CODE === 1 ? 'HÀNG NHẬP' : 'HÀNG XUẤT'}
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: "Grid", gridTemplateColumns: " 80% 20% ", padding: "10px" }}>
                  <div style={{ display: "flex", gap: "10px" }} >
                    <div style={{ fontSize: "13px" }}>Tên khách hàng:</div>
                    <div style={{ fontSize: "13px", fontWeight: "600" }} >{checkCustom ? this.props.dialog.inforCus.CUSTOMER_NAME : (this.props.dialog.dataTable[0]?.CUSTOMER_NAME || '')}</div>
                  </div>
                  <div style={{ display: "flex", marginRight: "50px", gap: "10px" }} >
                    <div style={{ fontSize: "13px" }}>Số điện thoại:</div>
                    <div style={{ fontSize: "13px", fontWeight: "600" }} >{this.props.dialog.dataTable[0]?.OWNER_PHONE || ''}</div>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ padding: "10px", display: "Grid", gridTemplateColumns: " 80% 20% " }} >
                  <div style={{ display: "flex", gap: "10px" }}  >
                    <div style={{ fontSize: "13px" }}>Số Lệnh: </div>
                    <div style={{ fontSize: "13px", fontWeight: "600" }} >{this.props.dialog.dataTable[0]?.ORDER_NO || ''}</div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", marginRight: "21px" }} >
                    <div style={{ fontSize: "13px" }}>Ngày Lệnh: </div>
                    <div style={{ fontSize: "13px", fontWeight: "600" }} >{this.props.dialog.dataTable[0]?.EXP_DATE ? moment(this.props.dialog.dataTable[0]?.EXP_DATE).format("DD/MM/YYYY") : ''}</div>
                  </div>
                </div>
                <div style={{ display: "Grid", gridTemplateColumns: " 40% 40% 20% ", padding: "10px" }}>
                  <div style={{ display: "flex", gap: "10px" }} >
                    <div style={{ fontSize: "13px" }} >{this.props.dialog.dataTable[0]?.CLASS_CODE === 1 ? "Số Masterbill:" : "Số Booking: "} </div>
                    <div style={{ fontSize: "13px", fontWeight: "600" }} >{this.props.dialog.dataTable[0]?.CLASS_CODE === 1 ? this.props.dialog.dataTable[0]?.BILLOFLADING : (this.props.dialog.dataTable[0]?.BOOKING_FWD || this.props.dialog.dataTable[0]?.BOOKING_NO)}</div>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }} >
                    <div style={{ fontSize: "13px" }} >Số Container: </div>
                    <div style={{ fontSize: "13px", fontWeight: "600" }} >{this.props.dialog.dataTable[0]?.CNTRNO || ''}</div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", marginRight: "32px" }} >
                    <div style={{ fontSize: "13px" }}>Hạn lệnh:</div>
                    <div style={{ fontSize: "13px", fontWeight: "600" }} >{this.props.dialog.dataTable[0]?.EXP_DATE ? moment(this.props.dialog.dataTable[0]?.EXP_DATE).format("DD/MM/YYYY") : ''}</div>
                  </div>
                </div>
                <div style={{ display: "Grid", gridTemplateColumns: " 40% 40% 20% ", padding: "10px" }}>
                  <div style={{ display: "flex", gap: "10px" }} >
                    <div style={{ fontSize: "13px" }}>Tên tàu:</div>
                    <div style={{ fontSize: "13px", fontWeight: "600" }} >{this.props.dialog.dataTable[0]?.VESSEL_NAME || ''}</div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", marginRight: "80px" }} >
                    <div style={{ fontSize: "13px" }}>Số Chuyến:</div>
                    <div style={{ fontSize: "13px", fontWeight: "600" }} >{checkVessel ? this.props.dialog.inforVessel.INBOUND_VOYAGE : (this.props.dialog.dataTable[0]?.INBOUND_VOYAGE || '')}</div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", marginRight: "9px" }} >
                    <div style={{ fontSize: "13px" }} >Ngày tàu đến:</div>
                    <div style={{ fontSize: "13px", fontWeight: "600" }} >{checkVessel ? this.props.dialog.inforVessel.ETA : moment(this.props.dialog.dataTable[0]?.ETA || '').format("DD/MM/YYYY HH:ss:mm")}</div>
                  </div>
                </div>
              </div>

              <div id="table" >
                <table cellspacing="0" cellpadding="0" style={{ width: "100%", margin: "20px 0px" }} border="1">
                  <tr style={{ height: "50px", fontSize: "15px" }}>
                    <th >STT</th>
                    {
                      this.props.dialog.dataTable[0]?.METHOD_CODE === "XKN" || this.props.dialog.dataTable[0]?.METHOD_CODE === "NKN"
                        ?
                        // ''
                        // :
                        <th> House_Bill</th>
                        : <th>{this.props.dialog.dataTable[0]?.METHOD_CODE === "XKX" ? 'Booking_FWD' : "Số lot"} </th>
                    }
                    <th >{this.props.dialog.dataTable[0]?.METHOD_CODE === "NKX" ? 'Shipmark' : 'Loại hàng'}</th>
                    <th >{this.props.dialog.dataTable[0]?.METHOD_CODE === "NKX" ? 'loại hàng' : 'Kích cỡ'} </th>
                    <th >Số lượng</th>
                    <th >Trọng lượng(KG)</th>
                    {
                      this.props.dialog.dataTable[0]?.METHOD_CODE === "NKX"
                        ?
                        <th>Số tờ khai</th>
                        : ''
                    }
                    <th >Remark</th>
                  </tr>

                  {this.props.dialog?.dataTable.map((item, i) => {
                    return (
                      <>
                        <tr style={{ height: "38px", textAlign: "center" }}>
                          <td>{i + 1}</td>
                          {
                            this.props.dialog.dataTable[0]?.METHOD_CODE === "XKN" || this.props.dialog.dataTable[0]?.METHOD_CODE === "NKN"
                              ?
                              <td> {item.HOUSE_BILL} </td>
                              : <td>{this.props.dialog.dataTable[0]?.METHOD_CODE === "XKX" ? item.BOOKING_FWD : item.LOT_NO}</td>
                          }
                          <td>{this.props.dialog.dataTable[0]?.METHOD_CODE === "NKX" ? item.SHIPMARKS : item.ITEM_TYPE_CODE}</td>
                          <td>{this.props.dialog.dataTable[0]?.METHOD_CODE === "NKX" ? item.ITEM_TYPE_CODE : item.CNTRSZTP}</td>
                          <td>{item.CARGO_PIECE}</td>
                          <td>{item.CARGO_WEIGHT}</td>
                          {
                            this.props.dialog.dataTable[0]?.METHOD_CODE === "NKX"
                              ?
                              <td >{item.DECLARE_NO}</td>
                              : ''
                          }
                          <td>{item.NOTE}</td>
                        </tr>
                      </>
                    )
                  })
                  }
                </table>
              </div>
            </Card>
            : ""
        }
        <DialogActions>
          <Button variant="contained" onClick={() => this.closeDialog()}>Đóng</Button>
          <Button variant="contained" onClick={() => this.handlePrint()} >In Lệnh</Button>
        </DialogActions>
      </Dialog >
    )
  }
}
export default DialogExportOrder;