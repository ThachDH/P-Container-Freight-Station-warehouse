import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  DialogContentText
} from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';

class AlertPopupWareHouse extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }
  closeDialog() {
    this.props.handleCloseDialogAlert_W();
  }

  render() {
    return (
      <Dialog
        open={this.props.dialogAlert.isOpen_W}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="confirm-popup"
      >
        <DialogContent>
          {this.props.is2Buttons && <ErrorIcon sx={{ color: "#ff3c00" }} />}
          <div>
            <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
              Lỗi
            </Typography>
            {/* <div dangerouslySetInnerHTML={this.props.dialog.message}></div> */}
          </div>
        </DialogContent>
        <DialogContent>
          <DialogContentText>
            Hiện tại ô bạn chọn không có dữ liệu!!!
          </DialogContentText>
        </DialogContent>
        {this.props.is2Buttons && (
          <DialogActions>
            <Button onClick={this.closeDialog.bind(this)} autoFocus variant="contained">
              Thoát
            </Button>
          </DialogActions>
        )}
      </Dialog >
    );
  };
};
AlertPopupWareHouse.defaultProps = { is2Buttons: true };
export default AlertPopupWareHouse;