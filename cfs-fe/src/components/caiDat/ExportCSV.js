import React from 'react'
// import {Button} from 'react-bootstrap/Button';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Button } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Excel from 'exceljs';

const columnsTK = [
  { header: 'STT', key: 'STT' },
  { header: 'Số Container', key: 'CNTRNO' },
  { header: 'Kích cỡ', key: 'CNTRSZTP' },
  { header: 'Tên tàu', key: 'VESSEL_NAME' },
  { header: 'Chuyến', key: 'INBOUND_OUTBOUND' },
  { header: 'Đại lý', key: 'CONSIGNEE' },
  { header: 'House_Bill/Booking', key: 'HB_BK' },
  { header: 'Loại hàng', key: 'ITEM_TYPE_CODE' },
  { header: 'Mô tả hàng hoá', key: 'COMMODITYDESCRIPTION' },
  { header: 'Chủ hàng', key: 'CUSTOMER_NAME' },
  { header: 'Số lượng', key: 'CARGO_PIECE' },
  { header: 'Đơn vị tính', key: 'UNIT_CODE' },
  { header: 'Trọng lượng', key: 'CARGO_WEIGHT' },
  { header: 'Số khối', key: 'CBM' },
  { header: 'Kho', key: 'WAREHOUSE_CODE' },
  { header: 'Ngày nhập kho', key: 'TIME_IN' },
  { header: 'TLHQ', key: 'TLHQ' },
  { header: 'Số tờ khai', key: 'DECLARE_NO' },
  { header: 'Số phiếu nhập', key: 'RECEIPT_NO' },
  { header: 'Số lệnh', key: 'ORDER_NO' },
  { header: 'Tồn kho', key: 'STOCK_TIME' },
  { header: 'Ghi chú', key: 'NOTE' },
];

const columnsNK = [
  { header: 'STT', key: 'STT' },
  { header: 'Số Container', key: 'CNTRNO' },
  { header: 'Kích cỡ', key: 'CNTRSZTP' },
  { header: 'Tên tàu', key: 'VESSEL_NAME' },
  { header: 'Chuyến', key: 'INBOUND_OUTBOUND' },
  { header: 'Đại lý', key: 'CONSIGNEE' },
  { header: 'House_Bill/Booking', key: 'HB_BK' },
  { header: 'Loại hàng', key: 'ITEM_TYPE_CODE' },
  { header: 'Chủ hàng', key: 'CUSTOMER_NAME' },
  { header: 'Số lượng', key: 'CARGO_PIECE' },
  { header: 'Đơn vị tính', key: 'UNIT_CODE' },
  { header: 'Trọng lượng', key: 'CARGO_WEIGHT' },
  { header: 'Số khối', key: 'CBM' },
  { header: 'Kho', key: 'WAREHOUSE_CODE' },
  { header: 'Ngày nhập kho', key: 'TIME_IN' },
  { header: 'Số tờ khai', key: 'DECLARE_NO' },
  { header: 'Số phiếu nhập', key: 'RECEIPT_NO' },
  { header: 'Số lệnh', key: 'ORDER_NO' },
  { header: 'Ghi chú', key: 'NOTE' },
];

const wsName = "Sheet1";
class ExportCSV extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      excelColumn: this.props.isInOut === 'S' ? columnsTK : columnsNK,
    };
  }

  //Thoilc(*Note)-Chức năng export excel
  async exportExcelV2(csvData, fileName, dataTemp) {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    if (dataTemp) {
      const workbook = new Excel.Workbook();
      // creating one worksheet in workbook
      const worksheet = workbook.addWorksheet(wsName);
      // add worksheet columns
      // each columns contains header and its mapping key from data
      worksheet.columns = this.state.excelColumn;
      for (let i = 0; i < worksheet.getRow(1)._cells.length; i++) {
        worksheet.getCell(`${worksheet.getRow(1)._cells[i]._address}`).fill = {
          type: 'pattern',
          pattern: 'darkTrellis',
          fgColor: { argb: 'FFFFFF00' },
          bgColor: { argb: '87CEFA' }
        };
      }
      worksheet.getRow(1).font = { name: 'Times New Roman', size: 12, bold: true };
      // loop through all of the columns and set the alignment with width.
      worksheet.columns.forEach(column => {
        column.width = column.header.length + 20;
        column.alignment = { horizontal: 'center' };
      });
      // loop through data and add each one to worksheet
      csvData.forEach(singleData => {
        worksheet.addRow(singleData);
      });
      if (dataTemp) {
        worksheet.addRow({
          ITEM_TYPE_CODE: dataTemp.ITEM_TYPE_CODE,
          CUSTOMER_NAME: dataTemp.CUSTOMER_NAME,
          CARGO_PIECE: dataTemp.CARGO_PIECE,
          CARGO_WEIGHT: dataTemp.CARGO_WEIGHT,
          CBM: dataTemp.CBM,
        });
      }
      // loop through all of the rows and set the outline style.
      worksheet.eachRow({ includeEmpty: false }, row => {
        // store each cell to currentCell
        const currentCell = row._cells;
        // loop through currentCell to apply border only for the non-empty cell of excel
        currentCell.forEach(singleCell => {
          // store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
          const cellAddress = singleCell._address;
          // apply border
          worksheet.getCell(cellAddress).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });
      if (dataTemp) {
        worksheet.getRow(csvData.length + 2).font = { name: 'Times New Roman', size: 14, bold: true, color: { argb: 'FF0000' } };
      }
      // write the content using writeBuffer
      const buf = await workbook.xlsx.writeBuffer();
      // download the processed file
      FileSaver.saveAs(new Blob([buf]), `${fileName}` + fileExtension);
    } else {
      const ws = XLSX.utils.json_to_sheet(csvData);
      const wb = { Sheets: { wsName: ws }, SheetNames: [wsName] };
      // write the content using writeBuffer
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      // download the processed file
      FileSaver.saveAs(data, fileName + fileExtension);
    }
  }

  //--------------------------
  render() {
    return (
      <Button size="medium" className="m-btn m-secondary" marginRight="15px" type="button" variant="outlined" onClick={() => this.exportExcelV2(this.props.csvData, this.props.fileName, this.props.dataTemp)} startIcon={<CloudDownloadIcon />}>Xuất Excel</Button>
    );
  }
}
export default ExportCSV;