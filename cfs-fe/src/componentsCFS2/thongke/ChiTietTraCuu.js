import * as React from "react";
import {
  Card,
  CardContent,
  DialogTitle,
  DialogContent,
} from "@mui/material";

export const TraCuuKhachHang = (props) => {
  const { data } = props;
  return (
    <div className="tra-cuu-table">
      <DialogTitle variant="h5">
        Chi Tiết Khách Hàng
      </DialogTitle>
      <DialogContent >
        <Card>
          <CardContent>
            {
              data && data.length > 0 ?
                data.map(item => {
                  return (
                    <>
                      <table border='1' style={{ width: '-webkit-fill-available', marginBottom: "16px" }}>
                        <tr>
                          <th>Loại khách hàng</th>
                          <td>{item.customer_CUSTOMER_TYPE}</td>
                          <th>Mã KH</th>
                          <td>{item.customer_No_}</td>
                        </tr>
                        <tr>
                          <th>Tên Khách Hàng</th>
                          <td>{item.customer_Name}</td>
                          <th>Địa Chỉ</th>
                          <td>{item.customer_Address}</td>
                        </tr>
                        <tr>
                          <th>Tỉnh/Thành Phố</th>
                          <td>{item.customer_City}</td>
                          <th>Điện Thoại</th>
                          <td>{item.customer_Phone}</td>
                        </tr>
                        <tr>
                          <th>Mã Số Thuế</th>
                          <td>{item.customer_TaxCode}</td>
                          <th>Người Liên Hệ</th>
                          <td>{item.customer_Contact}</td>
                        </tr>
                        <tr>
                          <th>Ngày Tạo</th>
                          <td>{item.customer_PostingDate}</td>
                          <th>Người Dùng</th>
                          <td>{item.customer_UserID}</td>
                        </tr>
                        <tr>
                          <th>Trạng thái</th>
                          <td>{item.customer_Status}</td>
                        </tr>
                      </table>
                    </>
                  )
                })
                : ""
            }
          </CardContent>
        </Card>
      </DialogContent>
    </div>
  );
}

export const TraCuuPhieuNhap = (props) => {
  const { data } = props;
  return (
    <div className="tra-cuu-table">
      <DialogTitle variant="h5">
        Chi Tiết Phiếu Nhập
      </DialogTitle>
      <DialogContent>
        <Card>
          <CardContent>
            {
              data && data.length > 0 ?
                data.map(item => {
                  return (
                    <>
                      <table border='1' style={{ width: '-webkit-fill-available', marginBottom: "20px", marginTop: "10px" }}>
                        <tr>
                          <th>Mã Hợp Đồng</th>
                          <td>{item.journalReceive_ContractNo}</td>
                          <th>Số Phiếu Nhập</th>
                          <td>{item.journalReceive_No_}</td>
                        </tr>
                        <tr>
                          <th>Số Tham Chiếu</th>
                          <td>{item.journalReceive_DocumentNo}</td>
                          <th>Mã KH</th>
                          <td>{item.journalReceive_CustomerNo}</td>
                        </tr>
                        <tr>
                          <th>Tên KH</th>
                          <td>{item.getCustomer_Name}</td>
                          <th>Ngày Tạo</th>
                          <td>{item.journalReceive_PostingDate}</td>
                        </tr>
                        <tr>
                          <th>Mã Kho</th>
                          <td>{item.journalReceive_LocationNo}</td>
                          <th>Người Giao Hàng</th>
                          <td>{item.journalReceive_Deliver}</td>
                        </tr>
                        <tr>
                          <th>Số Xe</th>
                          <td>{item.journalReceive_CarNo}</td>
                          <th>Tài Xế</th>
                          <td>{item.journalReceive_Driver}</td>
                        </tr>
                        <tr>
                          <th>Container</th>
                          <td>{item.journalReceive_ContainerNo}</td>
                          <th>Hình Thức Thuê</th>
                          <td>{item.journalReceive_DocumentType}</td>
                        </tr>
                        <tr>
                          <th>Ghi Chú</th>
                          <td>{item.journalReceive_Description}</td>
                          <th>Diễn Giải KCS</th>
                          <td>{item.journalReceive_Note}</td>
                        </tr>
                        <tr>
                          <th>Người Dùng</th>
                          <td>{item.journalReceive_UserID}</td>
                          <th>Mã Sản Phẩm</th>
                          <td>{ }</td>
                        </tr>
                        <tr>
                          <th>Tên Sản Phẩm</th>
                          <td>{ }</td>
                          <th>Mã Khách Hàng</th>
                          <td>{ }</td>
                        </tr>
                        <tr>
                          <th>Tên Khách Hàng</th>
                          <td>{ }</td>
                          <th>ĐVT</th>
                          <td>{ }</td>
                        </tr>
                        <tr>
                          <th>Dài</th>
                          <td>{ }</td>
                          <th>Rộng</th>
                          <td>{ }</td>
                        </tr>
                        <tr>
                          <th>Số Container/Lô	</th>
                          <td>{ }</td>
                          <th>Cao</th>
                          <td>{ }</td>
                        </tr>
                        <tr>
                          <th>Trọng Lượng</th>
                          <td>{ }</td>
                          <th>Số Lượng(Thùng)</th>
                          <td>{ }</td>
                        </tr>
                        <tr>
                          <th>Tổng(KG)</th>
                          <td>{ }</td>
                          <th>Số Lượng Kiện(Thùng)/Pallet</th>
                          <td>{ }</td>
                        </tr>
                        <tr>
                          <th>Hạn Sử Dụng	</th>
                          <td>{item.journalReceive_FinishTime}</td>
                          <th>Diễn Giải</th>
                          <td>{ }</td>
                        </tr>
                        <tr>
                          <th>Người Dùng	</th>
                          <td>{ }</td>
                        </tr>
                      </table>
                    </>
                  )
                })
                : ""
            }
          </CardContent>
        </Card>
      </DialogContent>
    </div>
  );
}

export const TraCuuPhieuXuat = (props) => {
  const { data } = props;
  return (
    <div className="tra-cuu-table">
      <DialogTitle variant="5"  >
        Chi tiết phiếu nhập
      </DialogTitle>
      <DialogContent>
        <Card>
          <CardContent>
            {
              data && data.length > 0 ?
                data.map(item => {
                  return (
                    <>
                      <table border='1' style={{ width: '-webkit-fill-available', marginBottom: "20px", marginTop: "10px" }}>
                        <tr>
                          <th>Số Phiếu Xuất</th>
                          <td>{item.journalExport_No_}</td>
                          <th>Số Tham Chiếu</th>
                          <td>{item.journalExport_DocumentNo}</td>
                        </tr>
                        <tr>
                          <th>Mã KH</th>
                          <td>{item.journalExport_CustomerNo}</td>
                          <th>Ngày Chứng Từ</th>
                          <td>{item.journalExport_DocumentDate}</td>
                        </tr>
                        <tr>
                          <th>Ngày Thực Hiện</th>
                          <td>{item.journalExport_PostingDate}</td>
                          <th>Mã kho</th>
                          <td>{item.journalExport_LocationNo}</td>
                        </tr>
                        <tr>
                          <th>Người Nhận Hàng</th>
                          <td>{item.journalExport_Receiver}</td>
                          <th>Số Xe</th>
                          <td>{item.journalExport_CarNo}</td>
                        </tr>
                        <tr>
                          <th>Tài Xế</th>
                          <td>{item.journalExport_Driver}</td>
                          <th>Container</th>
                          <td>{item.journalExport_Container}</td>
                        </tr>
                        <tr>
                          <th>Ghi chú</th>
                          <td>{item.journalExport_Description}</td>
                          <th>Diễn Giải KCS</th>
                          <td>{item.journalExport_Note}</td>
                        </tr>
                        <tr>
                          <th>Người Dùng</th>
                          <td>{item.journalExport_UserID}</td>
                        </tr>
                      </table>
                    </>
                  )
                })
                : ""
            }
          </CardContent>
        </Card>
      </DialogContent>
    </div>
  );
}

export const TraCuuHopDong = (props) => {
  const { data } = props;
  return (
    <div className="tra-cuu-table">
      <DialogTitle variant="h5">
        Chi Tiết Phiếu Nhập
      </DialogTitle>
      <DialogContent>
        <Card>
          <CardContent>
            {
              data && data.length > 0 ?
                data.map(item => {
                  return (
                    <>
                      <table border='1' style={{ width: '-webkit-fill-available', marginBottom: "20px", marginTop: "10px" }}>
                        <tr>
                          <th>Trạng Thái</th>
                          <td>{item.contract_Status}</td>
                          <th>Mã HĐ</th>
                          <td>{item.contract_No_}</td>
                        </tr>
                        <tr>
                          <th>Nội Dung</th>
                          <td>{item.contract_Name}</td>
                          <th>Ngày Lập</th>
                          <td>{item.contract_DocumentDate}</td>
                        </tr>
                        <tr>
                          <th>Nhân Viên</th>
                          <td>{item.contract_EmployeeNo}</td>
                          <th>Mã Khách Hàng</th>
                          <td>{item.contract_CustomerNo}</td>
                        </tr>
                        <tr>
                          <th>Tên Khách Hàng</th>
                          <td>{item.getCustomer_Name}</td>
                          <th>Loại Hợp Đồng</th>
                          <td>{item.contract_DocumentType}</td>
                        </tr>
                        <tr>
                          <th>Từ Ngày</th>
                          <td>{item.contract_FromDate}</td>
                          <th>Đến Ngày</th>
                          <td>{item.contract_ToDate}</td>
                        </tr>
                        <tr>
                          <th>Loại Tiền Tệ (Thuê Kho)</th>
                          <td>{item.contract_CurrencyNo}</td>
                          <th>Loại Tiền Tệ (Bốc Xếp)</th>
                          <td>{item.contract_CurrencyNoCarry}</td>
                        </tr>
                        <tr>
                          <th>Diễn Giải</th>
                          <td>{item.contract_Description}</td>
                          <th>Cảnh Báo Hết Hạn (Ngày)</th>
                          <td>{item.contract_DateNumberWarning}</td>
                        </tr>
                        <tr>
                          <th>Người Dùng</th>
                          <td>{item.contract_UserID}</td>
                        </tr>
                      </table>
                    </>
                  )
                })
                : ""
            }
          </CardContent>
        </Card>
      </DialogContent>
    </div >
  );
}