import "./index.scss";
import * as React from "react";
import moment from "moment";
//Thoilc(*Note)-Relative path to image 
import logo from '../images/logo.jpg'
class InPhieuNhap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      printItem: this.props.dataPrintItem || [],
      printHeader: this.props.dataPrintHeader || [],
    };
    this.columns = [
      { field: "goodsCommon_ProductCode", headerName: "Mã Sản Phẩm", width: 100 },
      { field: "goodsCommon_ProductName", headerName: "Tên Sản Phẩm", width: 180 },
      { field: "goodsDetail_CustomerNo", headerName: "Mã khách hàng", width: 100 },
      { field: "goodsDetail_CustomerName", headerName: "Tên khách hàng", width: 120 },
      {
        field: "goodsDetail_UnitCode",
        headerName: "ĐVT",
        width: 30,
      },
      {
        field: "goodsCommon__Length",
        headerName: "Dài",
        width: 30,
      },
      {
        field: "goodsCommon__Width",
        headerName: "Rộng",
        width: 30,
      },
      {
        field: "goodsCommon__Height",
        headerName: "Cao",
        width: 30,
      },
      {
        field: "goodsDetail_ContainerNo",
        headerName: "Số Container/Lô",
        width: 50,
      },
      {
        field: "goodsCommon_NetWeight",
        headerName: "Trọng lượng",
        width: 50,
      },
      {
        field: "goodsDetail_Quantity",
        headerName: "Số Lượng(Thùng)",
        width: 50,
      },
      {
        field: "goodsDetail_Total",
        headerName: "Tổng(KG)",
        width: 50,
      },
      {
        field: "goodsDetail_AmountPallet",
        headerName: "Số Lượng Kiện(Thùng)/Pallet",
        width: 50,
      },
      {
        field: "goodsDetail_ExpiryDate",
        headerName: "Hạn Sử Dụng",
        width: 100,
      },
      {
        field: "goodsCommon_Description",
        headerName: "Diễn Giải",
        width: 240,
      }
    ];
  }

  // //Thoilc(*Note)-Sử dụng datagridview
  createRows = (data) => data.map((row, idx) => ({
    id: idx,
    goodsCommon_ProductCode: row.goodsCommon_ProductCode,
    goodsCommon_ProductName: row.goodsCommon_ProductName,
    goodsDetail_CustomerNo: row.goodsDetail_CustomerNo,
    goodsDetail_CustomerName: row.goodsDetail_CustomerName,
    goodsDetail_UnitCode: row.goodsDetail_UnitCode,
    goodsCommon__Length: row.goodsCommon__Length,
    goodsCommon__Width: row.goodsCommon__Width,
    goodsCommon__Height: row.goodsCommon__Height,
    goodsDetail_ContainerNo: row.goodsDetail_ContainerNo,
    goodsCommon_NetWeight: row.goodsCommon_NetWeight,
    goodsDetail_Quantity: row.goodsDetail_Quantity,
    goodsDetail_Total: row.goodsDetail_Total,
    goodsDetail_AmountPallet: row.goodsDetail_AmountPallet,
    goodsDetail_ExpiryDate: row.goodsDetail_ExpiryDate,
    goodsCommon_Description: row.goodsCommon_Description,
  }));
  //Thoilc(*Note)-In phiếu PDF
  // inphieunhapPdf() {

  // }

  //Thoilc(*Note)-In phiếu nhập kho sử dụng js
  //Link tham khảo: https://stackoverflow.com/questions/2255291/print-the-contents-of-a-div
  handlePrint = (divName) => {
    setTimeout(() => { // Needed for large documents
      window.document.body.style.margin = '0 0';
      window.document.close(); // necessary for IE >= 10
      window.focus(); // necessary for IE >= 10*/
      window.print();
      window.close();
    }, 1000);
  };

  //Thoilc(*Note)-Ngăn chặn render
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.dataHeader !== nextState.dataHeader) {
      return true;
    }
    return false;
  }

  //Thoilc(*Note)-UI Printer
  //Link tham khảo template: https://www.bootdey.com/snippets/view/company-invoice#html
  render() {
    return (
      <div class="wrapper">
        <div class="header">
          <div class="sub-header-1">
            <div class="m-sub-header-1-1">
              <h3>
                In Phiếu:
                <small>
                  &nbsp;
                  #{this.state.printHeader.journalReceive_RowID || 0}
                </small>
              </h3>
            </div>
            <div class="m-sub-header-1-2">
              <button type="button" class="btn-default" onClick={() => this.handlePrint('PrintMe')}>
                <span class="glyphicon glyphicon-print"></span> Printer
              </button>
            </div>
          </div>

          <div class="PrintMe">

            <div class="sub-header-2">
              <h2>Phiếu Nhập Kho</h2>
              <div class="m-sub-header-2-1">
                <img src={logo} alt="Đơn vị cảng" />
              </div>
              <div class="m-sub-header-2-2">
                <h3>CẢNG CONTAINER QUỐC TẾ SP-ITC</h3>
                <div class="n-sub-header-2-2-1">
                  Địa chỉ: Đường Nguyễn Thị Tư(990 Nguyễn Duy Trinh), Phường Phú Hữu, Quận 9, TPHCM
                  <br />
                  Ext: 123
                  <br />
                  Tel:(+02) 123.456.789
                  <br />
                  Phone:(+84) 123.456.789
                  <br />
                  <i>Email: cfs@sp-itc.com.vn</i>
                </div>
              </div>

            </div>

            <div class="sub-header-3">
              <h3>TÊN ĐƠN VỊ</h3>
              <div class="m-sub-header-3-1">
                <h3>*{this.state.printHeader.journalReceive_No_ || ''}*</h3>
              </div>
            </div>

            <div class="sub-header-4">
              <div class="m-sub-header-4-1">
                Tên đơn vị/Customer: {this.state.printHeader.getCustomer_Name || ''}
                <br />
                Địa chỉ/Address: {this.state.printHeader.getCustomer_Address || ''}
                <br />
                Người giao hàng/Deliver: {this.state.printHeader.journalReceive_Deliver || ''}
                <br />
                Số Container/Container: {this.state.printHeader.journalReceive_ContainerNo || ''}
                <br />
                Ghi chú/Note: {this.state.printHeader.journalReceive_Description || ''}
                <br />
                KCS Kho/Quality controller: {this.state.printHeader.journalReceive_Note || ''}
              </div>
              <div class="m-sub-header-4-2">
                Số phiếu nhập/Code: {this.state.printHeader.journalReceive_No_ || ''}
                <br />
                Ngày nhập kho/Date: {this.state.printHeader.journalReceive_DocumentDate || '01/01/1900'}
                <br />
                Giờ nhập kho/Time: {moment.utc(this.state.printHeader.journalReceive_DocumentTime, "DD/MM/YYYY").format("HH:ss") || '01/01/1900'}
                <br />
                Số tham chiếu/Ref no: {this.state.printHeader.journalReceive_DocumentNo || ''}
                <br />
                Kho/Location: {this.state.printHeader.journalReceive_LocationNo || ''}
                <br />
                Số xe/Car: {this.state.printHeader.journalReceive_CarNo || ''}
              </div>
            </div>

            <div class="main">
              <table class="zebra">
                <thead>
                  <tr>
                    {
                      this.columns.map((item, idx) => {
                        return (
                          <th scope="col">{item.headerName}</th>
                        );
                      })
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    this.createRows(this.state.printItem || []).map((item, idx) => {
                      return (
                        <>
                          <tr>
                            <td scope={"row"}>{item.goodsCommon_ProductCode}</td>
                            <td scope={"row"}>{item.goodsCommon_ProductName}</td>
                            <td scope={"row"}>{item.goodsDetail_CustomerNo}</td>
                            <td scope={"row"}>{item.goodsDetail_CustomerName}</td>
                            <td scope={"row"}>{item.goodsDetail_UnitCode}</td>
                            <td scope={"row"}>{item.goodsCommon__Length}</td>
                            <td scope={"row"}>{item.goodsCommon__Width}</td>
                            <td scope={"row"}>{item.goodsCommon__Height}</td>
                            <td scope={"row"}>{item.goodsDetail_ContainerNo}</td>
                            <td scope={"row"}>{item.goodsCommon_NetWeight}</td>
                            <td scope={"row"}>{item.goodsDetail_Quantity}</td>
                            <td scope={"row"}>{item.goodsDetail_Total}</td>
                            <td scope={"row"}>{item.goodsDetail_AmountPallet}</td>
                            <td scope={"row"}>{item.goodsDetail_ExpiryDate}</td>
                            <td scope={"row"}>{item.goodsCommon_Description}</td>
                          </tr>
                        </>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    );
  }
}
export default InPhieuNhap;