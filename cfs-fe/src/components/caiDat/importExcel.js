import React from 'react'
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { read, utils } from 'xlsx';
class ImportExcel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //Thoilc(*Note)-Import excel
  handleImport = ($event) => {
    let flag = false;
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result, { type: "array" });
        const sheets = wb.SheetNames;
        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          this.handleData(rows);
          flag = true;
        }
      }
      reader.readAsArrayBuffer(file);
    }
    if (!flag) {
      $event.target.value = null;
    }
  }

  handleData(data) {
    this.props.handleLoadImport(data);
  }

  render() {
    return (
      <Button
        variant="outlined"
        component="label"
        startIcon={<CloudUploadIcon />}>
        Import Excel
        <input hidden accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" multiple type="file"
          onChange={this.handleImport}
        />
      </Button>
    );

  }
}
export default ImportExcel;
