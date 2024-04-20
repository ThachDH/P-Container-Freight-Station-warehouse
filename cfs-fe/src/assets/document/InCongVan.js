import * as React from "react";
import { Button, Dialog, DialogActions, Card } from "@mui/material";

class InCongVan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [],
      isOpen: false,
      total_CARGO_PIECE: 0,
    };
  }

  handlePrint(elementId, uniqueIframeId) {
    const content = document.getElementById("viewInforOrder");
    let pri;
    if (document.getElementById("", "PRINT DATA")) {
      pri = document.getElementById(uniqueIframeId).contentWindow;
    } else {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("title", uniqueIframeId);
      iframe.setAttribute("id", uniqueIframeId);
      iframe.setAttribute(
        "style",
        "height: 0px; width: 0px; position: absolute;"
      );
      document.body.appendChild(iframe);
      pri = iframe.contentWindow;
    }
    pri.document.open("_blank");
    pri.document.write(content.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
  }
  closeDialog() {
    this.props.handleCloseDialog();
  }

  render() {
    let total_CARGO_PIECE = 0;
    let total_CARGO_WEIGHT = 0;
    let total_CBM = 0;
    this.props.dialog?.dataTable.map((item, i) => {
      total_CARGO_PIECE += Number(item.CARGO_PIECE);
      total_CARGO_WEIGHT += Number(item.CARGO_WEIGHT);
      total_CBM += Number(item.CBM);
      return item;
    });
    const currentTime = new Date();
    const day = currentTime.getDate();
    const month = currentTime.getMonth() + 1;
    const year = currentTime.getFullYear();

    const userName = JSON.parse(localStorage.getItem("userInfo"))?.name;
    return (
      <Dialog
        open={this.props.dialog.isOpen}
        croll="paper"
        fullWidth
        maxWidth="xl"
      >
        {this.props.dialog.dataTable ? (
          <Card id="viewInforOrder" sx={{ padding: "20px", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: "bolder" }}>ICD PHUOC LONG</div>
                <div>KHO CFS ICD3</div>
              </div>
              <div style={{ marginRight: "100px" }}>
                <div
                  style={{
                    marginBottom: "5px",
                    fontWeight: "bolder",
                    textAlign: "center",
                  }}
                >
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </div>
                <div style={{ fontWeight: "bolder", textAlign: "center" }}>
                  ĐỘC LẬP - TỰ DO - HẠNH PHÚC
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: "25px",
                fontWeight: "600",
                textAlign: "center",
                margin: "10px",
              }}
            >
              CÔNG VĂN XIN ĐƯA HÀNG TỪ CONTAINER VÀO KHO
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              <i>Kính gửi: Hải quan giám sát kho bãi khu vực IV</i>
            </div>
            <div style={{ marginTop: "10px", fontSize: "13px" }}>
              CTY CP-ĐL-LHVC GEMADEPT - Cảng ICD Phước Long đại diện cho đại lý
              giao nhận:{" "}
              <span style={{ fontWeight: "bold" }}>
                {" "}
                {this.props.dialog.CUSTOMER_NAME ?? ""}
              </span>
            </div>
            <div style={{ marginTop: "5px", fontSize: "13px" }}>
              Đề nghị đội Hải quan giám sát kho bãi cho chúng tôi được rút hàng
              vào kho các container hàng chung chủ sau đây vào kho CFS
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                fontWeight: "bolder",
              }}
            >
              <div style={{ marginRight: "40px" }}>
                TÊN TÀU: {this.props.dialog.infoVessel.VESSEL_NAME ?? ""}
              </div>
              <div style={{ marginRight: "40px" }}>
                CHUYẾN: {this.props.dialog.infoVessel.INBOUND_VOYAGE ?? ""}
              </div>
              <div style={{ marginRight: "40px" }}>
                CẬP CẢNG NGÀY: {this.props.dialog.infoVessel.ETA ?? ""}
              </div>
            </div>

            <div id="table">
              <table
                cellspacing="0"
                cellpadding="0"
                style={{ width: "100%", margin: "10px 0px" }}
                border="1"
              >
                <tr style={{ height: "50px", fontSize: "15px" }}>
                  <th>STT</th>
                  <th>Vận đơn</th>
                  <th>Số Container</th>
                  <th>Số Seal</th>
                  <th>Chủ hàng</th>
                  <th>Số lượng</th>
                  <th>Trọng lượng</th>
                  <th>Khối lượng</th>
                  <th>Ghi chú</th>
                </tr>

                {this.props.dialog?.dataTable.map((item, i) => {
                  return (
                    <>
                      <tr style={{ height: "38px", textAlign: "center" }}>
                        <td style={{ width: "60px" }}>{i + 1}</td>
                        <td>{item.HOUSE_BILL}</td>
                        {i === 0 ? (
                          <td>{this.props.dialog.infoCont.CNTRNO}</td>
                        ) : (
                          <td></td>
                        )}
                        {i === 0 ? (
                          <td>{this.props.dialog.infoCont.SEALNO}</td>
                        ) : (
                          <td></td>
                        )}
                        <td>{item.CUSTOMER_NAME}</td>
                        <td style={{ width: "110px" }}>{`${item.CARGO_PIECE} ${item.CARGO_PIECE ? item.UNIT_CODE : ""
                          }`}</td>
                        <td style={{ width: "110px" }}>{item.CARGO_WEIGHT}</td>
                        <td style={{ width: "100px" }}>{item.CBM}</td>
                        <td>{item.NOTE}</td>
                      </tr>
                    </>
                  );
                })}
                <tfoot>
                  <tr
                    style={{
                      height: "38px",
                      textAlign: "center",
                      background: "#c6c4c4",
                    }}
                  >
                    <td colspan="5">TỔNG</td>
                    <td>
                      {Number.isInteger(total_CARGO_PIECE)
                        ? total_CARGO_PIECE
                        : total_CARGO_PIECE.toFixed(3)}
                    </td>
                    <td>
                      {Number.isInteger(total_CARGO_WEIGHT)
                        ? total_CARGO_WEIGHT
                        : total_CARGO_WEIGHT.toFixed(3)}
                    </td>
                    <td>
                      {Number.isInteger(total_CBM)
                        ? total_CBM
                        : total_CBM.toFixed(3)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div style={{ fontSize: "13", margin: "10px" }}>
              Chúng tôi hoàn toàn chịu trách nhiệm về hàng hóa sau khi đã nhập
              kho.
            </div>

            <div
              style={{
                justifyContent: "space-between",
                display: "flex",
                padding: "0px 90px",
              }}
            >
              <div style={{ fontSize: "13", fontWeight: "bold" }}>
                Hải quan giám sát kho bãi
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "13" }}>
                  TP.HCM Ngày {day} Tháng {month} Năm {year}
                </div>
                <div style={{ fontSize: "13", fontWeight: "bold", marginTop: "12px" }}>
                  CẢNG ICD PHƯỚC LONG
                </div>
                <div style={{ marginTop: "100px" }}>{userName ?? ""}</div>
              </div>
            </div>
          </Card>
        ) : (
          ""
        )}
        <DialogActions>
          <Button variant="contained" onClick={() => this.closeDialog()}>
            Đóng
          </Button>
          <Button variant="contained" onClick={() => this.handlePrint()}>
            In Lệnh
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default InCongVan;
