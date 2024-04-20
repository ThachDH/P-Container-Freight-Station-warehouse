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

class AlertPopup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }
  closeDialog() {
    this.props.handleCloseDialogAlert();
  }
  render() {
    return (
      <Dialog
        open={this.props.dialog.isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="confirm-popup"
      >
        <DialogContent>
          {this.props.is2Buttons && <ErrorIcon sx={{ color: "#ff3c00" }} />}
          <div>
            <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
              Thông Báo
            </Typography>
            {/* <div dangerouslySetInnerHTML={this.props.dialog.message}></div> */}
          </div>
        </DialogContent>
        <DialogContent>
          <DialogContentText>
            Vui lòng hãy nhập ít nhất một trường thông tin!!!
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
AlertPopup.defaultProps = { is2Buttons: true };
export default AlertPopup;