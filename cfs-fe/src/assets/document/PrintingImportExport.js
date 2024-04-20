import logoSPITC2 from "../../assets/images/LOGO_ICD3.png";
import * as React from "react";
import * as moment from "moment";
import {
  Button,
  Dialog,
  Card,
  DialogActions
} from "@mui/material";

class PrintingImportExport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDetail: [],
      data: this.props.filterData ?? [],
      dataHeader: [],
      isOpen: false,
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
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

  openDialog() {
    this.setState({
      isOpen: true
    });
  }

  closeDialog() {
    this.setState({
      isOpen: false
    })
  }

  setDataSource(data) {
    let dataTable = [];
     data.map(item => {
      item.Details.map(p => {
        if (p) {
          dataTable.push(p)
        } else {
          return p;
        }
        return p;
      });
      return item;
    });
    this.setState({
      dataHeader: data,
      dataDetail: dataTable,
    })
  }

  //-----------------------------------
  render() {
    return (
      <Dialog open={this.state.isOpen} scroll="paper" fullWidth maxWidth="xl" >
        {this.state.dataHeader[0]?.RECEIPT_NO
          ? <Card id="viewInforOrder" sx={{ padding: "30px", overflow: "auto" }}>
            <div style={{
              display: 'grid', justifyContent: 'space-between', borderBottom: '2px solid #000',
              gridTemplateColumns: '37% 62%', columnGap: '20px', paddingBottom: "10px"
            }}>
              <div>
                <img src={logoSPITC2} alt="logo" height="120px" width="210px" ></img>
              </div>
              <div style={{ lineHeight: "25px", paddingTop: "15px" }}>
                <div style={{ fontSize: '23px', fontWeight: 600, fontFamily: 'auto' }}>CÔNG TY TNHH CẢNG PHƯỚC LONG</div>
                <div style={{ fontSize: '16px' }}>Địa chỉ: Km7 - Xa lộ Hà Nội, Phường Phước Long A, TP Thủ Đức, HCM</div>
                <div style={{ display: 'flex' }}>
                  <div style={{ fontSize: '16px' }}>TEL: (84 - 28) 3731 3204 &nbsp;&nbsp;</div>
                  <div style={{ fontSize: '16px' }}>Fax: (84 - 28) 3728 1344</div>
                </div>
                <div style={{ fontSize: '16px' }}>Email: mkt@pip.com.vn</div>
              </div>

            </div>
            <div >
              <div style={{ display: 'grid', gridTemplateColumns: '65% 35%', alignItems: "center" }}>
                <div>
                  <div
                    style={{
                      fontSize: "25px",
                      fontWeight: "600",
                      fontFamily: "auto",
                      textAlign: 'center',
                      margin: "20px",
                    }}
                  >
                    PHIẾU {this.state.dataHeader[0].JOB_TYPE === 'NK' ? 'NHẬP KHO' : 'XUẤT KHO'} {this.state.dataHeader[0].CLASS_CODE === 1 ? 'HÀNG NHẬP' : 'HÀNG XUẤT'}
                  </div>
                </div>
                <div style={{ fontSize: '15px', marginTop: '15px', lineHeight: "25px" }}>
                  <div style={{ display: 'flex' }}>
                    <div>Số phiếu: &ensp;</div>
                    <div style={{ fontWeight: 600 }}>
                      {this.state.dataHeader[0].RECEIPT_NO ? this.state.dataHeader[0].RECEIPT_NO : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div>Số lệnh: &ensp; </div>
                    <div style={{ fontWeight: 600 }}>
                      {this.state.dataHeader[0].ORDER_NO ? this.state.dataHeader[0].ORDER_NO : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div>{this.state.dataHeader[0].JOB_TYPE === 'NK' ? 'Ngày nhập kho: ' : 'Ngày xuất kho: '} &ensp;</div>
                    <div style={{ fontWeight: 600 }}>{this.state.dataHeader[0].RECEIPT_DATE ? moment(this.state.dataHeader[0].RECEIPT_DATE).format("DD/MM/YYYY HH:mm:ss:") : ''} </div>
                  </div>
                </div>
              </div>
            </div>


            <div style={{ lineHeight: "30px" }}>
              <div style={{ display: 'flex', width: "100%" }}>
                <div>
                  <div style={{ display: 'flex', gap: '5px', fontSize: '14px', }}>
                    <div>Tên đơn vị:</div>
                    <div style={{ fontWeight: 600 }}>{this.state.dataHeader[0].OWNER}</div>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', fontSize: '17px' }}>
                  <div style={{ width: "70px" }}>Địa chỉ:</div>
                  <div style={{ fontWeight: 600 }}>{this.state.dataHeader[0].ADDRESS ? this.state.dataHeader[0].ADDRESS : ''}</div>
                </div>
              </div>
              <div style={{ display: 'flex', width: "100%" }}>
                <div style={{ width: "40%" }}>
                  <div style={{ display: 'flex', gap: '5px', fontSize: '14px' }}>
                    <div>{this.state.dataHeader[0].CLASS_CODE === 1 ? 'Số Masterbill:' : 'Số Booking:'}</div>
                    <div style={{ fontWeight: 600 }}>
                      {this.state.dataHeader[0].CLASS_CODE === 1 ? this.state.dataHeader[0].BILLOFLADING : this.state.dataHeader[0].BOOKING_NO}
                    </div>
                  </div>
                </div>
                <div style={{ width: "26.666%" }}>
                  <div style={{ display: 'flex', gap: '5px', fontSize: '14px' }}>
                    <div>Số Container:</div>
                    <div style={{ fontWeight: 600 }}>
                      {this.state.dataHeader[0].CNTRNO ? this.state.dataHeader[0].CNTRNO : ''}
                    </div>
                  </div>
                </div>

                <div style={{ width: "33.333%" }}>
                  <div style={{ display: 'flex', gap: '5px', fontSize: '14px', justifyContent: "center" }}>
                    <div>Kích cỡ:</div>
                    <div style={{ fontWeight: 600 }}>
                      {this.state.dataHeader[0].CNTRSZTP ? this.state.dataHeader[0].CNTRSZTP : ''}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', width: "100%" }}>
                <div style={{ width: "40%" }}>
                  <div style={{ display: 'flex', gap: '5px', fontSize: '14px' }}>
                    <div>Tên tàu:</div>
                    <div style={{ fontWeight: 600 }}>
                      {this.state.dataHeader[0].VESSEL_NAME ? this.state.dataHeader[0].VESSEL_NAME : ''}
                    </div>
                  </div>
                </div>
                <div style={{ width: "26.666%" }}>
                  <div style={{ display: 'flex', gap: '5px', fontSize: '14px' }}>
                    <div>Số Chuyến:</div>
                    <div style={{ fontWeight: 600 }}>
                      {this.state.dataHeader[0].VESSEL_BOUND}
                    </div>
                  </div>
                </div>
                <div style={{ width: "33.333%" }}>
                  <div style={{ display: 'flex', gap: '5px', fontSize: '14px', justifyContent: "center", marginRight: "10px" }}>
                    <div>Số xe:</div>
                    <div style={{ fontWeight: 600 }}>
                      {this.state.dataHeader[0].TRUCK_NO ? this.state.dataHeader[0].TRUCK_NO : ''}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', width: "100%" }}>
                <div style={{ width: "40%" }}>
                  <div style={{ display: 'flex', gap: '5px', fontSize: '14px' }}>
                    <div>Kho:</div>
                    <div style={{ fontWeight: 600 }}>
                      {this.state.dataHeader[0].WAREHOUSE_CODE ? this.state.dataHeader[0].WAREHOUSE_CODE : ''}
                    </div>
                  </div>
                </div>
                <div style={{ width: "60%" }}>
                  <div style={{ display: 'flex', gap: '5px', fontSize: '14px' }}>
                    <div>Phương thức giao-nhận:</div>
                    <div style={{ fontWeight: 600 }}>
                      {this.state.dataHeader[0].JOB_TYPE ? this.state.dataHeader[0].JOB_TYPE : ''}
                    </div>
                  </div>
                </div>

              </div>
              <div>
                <div style={{ display: 'flex', gap: '5px', fontSize: '14px', }}>
                  <div>Ghi chú:</div>
                  <div style={{ fontWeight: 600 }}>{this.state.dataHeader[0].NOTE ? this.state.dataHeader[0].NOTE : ''}</div>
                </div>
              </div>
            </div>
            <div id="table" >
              <table cellspacing="0" cellpadding="0" style={{ width: "100%", margin: "20px 0px" }} border="1">
                <tr style={{ height: "50px", fontSize: "15px" }}>
                  <th >STT</th>
                  <th >{this.state.dataHeader[0].CLASS_CODE === 1 ? 'House_Bill' : 'Booking_FWD'} </th>
                  <th >Tên hàng</th>
                  <th >Số lượng</th>
                  <th >Trọng lượng</th>
                  <th >Khối lượng</th>
                  <th >ĐVT</th>
                  <th width="18%">Ghi Chú</th>
                </tr>
                {this.state.dataDetail.map((item, i) => {
                  return (
                    <>
                      <tr style={{ height: "38px", textAlign: "center" }}>
                        <td>{i + 1}</td>
                        <td>{this.state.dataHeader[0].CLASS_CODE === 1 ? item.HOUSE_BILL : item.BOOKING_FWD}</td>
                        <td>{item.COMMODITYDESCRIPTION}</td>
                        <td>{item.ACTUAL_CARGO_PIECE} </td>
                        <td>{item.CARGO_WEIGHT}</td>
                        <td>{item.CBM}</td>
                        <td>{item.UNIT_CODE}</td>
                        <td>{item.NOTE}</td>
                      </tr>
                    </>
                  )
                })
                }
                <tr style={{ height: "50px", fontSize: "15px", textAlign: "center" }}>
                  <td colspan="3" >Tổng cộng</td>
                  <th>{this.state.dataDetail.map(item => parseFloat(item.ACTUAL_CARGO_PIECE || 0)).reduce((a, b) => a + b, 0) || ''}</th>
                  <th>{this.state.dataDetail.map(item => parseFloat(item.CARGO_WEIGHT || 0)).reduce((a, b) => a + b, 0).toFixed(2) || ''}</th>
                  <th>{this.state.dataDetail.map(item => parseFloat(item.CBM || 0)).reduce((a, b) => a + b, 0).toFixed(2) || ''}</th>
                  <th />
                  <th />
                </tr>
              </table>
            </div>
            <div
              style={{
                textAlign: "end",
                marginRight: "40px",
                fontSize: "17px",
                marginTop: "15px",
                marginBottom: "20px"
              }}
            >
              <div style={{ marginRight: '60px' }}>Ngày in phiếu {moment().format("DD/MM/YYYY")}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ paddingLeft: '100px' }}>Khách hàng</div>
                <div style={{ marginRight: '100px' }}>
                  <div style={{ textAlign: 'center' }}>Người lập phiếu</div>
                  <div style={{ paddingTop: '3.8rem', textAlign: 'center' }}>{JSON.parse(localStorage.getItem("userInfo")).name}</div>

                </div>
              </div>
            </div>
          </Card>
          : ""}
        <DialogActions>
          <Button variant="contained" onClick={() => this.closeDialog()}>Đóng</Button>
          <Button variant="contained" onClick={() => this.handlePrint()} >In Phiếu</Button>
        </DialogActions>
      </Dialog >
    );
  }
}

export default PrintingImportExport;
