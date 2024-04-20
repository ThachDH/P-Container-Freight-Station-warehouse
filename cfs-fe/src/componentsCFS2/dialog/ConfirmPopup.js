import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import InfoIcon from "@mui/icons-material/Info";

class ConfirmPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  closeDialog(params) {
    if (this.props.dialog.type === 2) {
      this.props.handleCloseDialog(params, this.props.dialog)
    } else {
      this.props.handleCloseDialog(params);
    }
  }
  render() {
    return (
      <Dialog
        open={this.props.dialog.isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="confirm-popup"
        fullWidth
        maxWidth={this.props.dialog.type === 1 ? 'sm' : 'xs'}
      >
        <DialogTitle>
          Thông báo!
        </DialogTitle>
        <DialogContent>
          {this.props.is2Buttons && <HelpIcon sx={{ color: "#ef5350" }} />}
          {!this.props.is2Buttons && <InfoIcon sx={{ color: "#ff9800" }} />}
          <div>
            <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
              {this.props.text}
            </Typography>
            <span style={{ fontSize: 15 }}> {this.props.dialog.message} </span>
          </div>
        </DialogContent>
        {this.props.is2Buttons && (
          <DialogActions>
            <Button
              onClick={() => this.closeDialog("agree")}
              autoFocus
              variant="contained"
              color='success'
            >
              Đồng ý
            </Button>
            <Button
              onClick={() => this.closeDialog("disagree")}
              variant='contained'>
              Không
            </Button>
          </DialogActions>
        )}
        {!this.props.is2Buttons && (
          <DialogActions>
            <Button
              onClick={() => this.closeDialog()}
              autoFocus
              variant="contained"
            >
              OK
            </Button>
          </DialogActions>
        )}
      </Dialog>
    );
  }
}
ConfirmPopup.defaultProps = { is2Buttons: true };
export default ConfirmPopup;
