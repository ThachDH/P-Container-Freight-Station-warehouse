import * as React from "react";
import {
  Button,
  Stack,
  Card,
  CardContent,
  TextField,
  Typography,
  Dialog,
} from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

class NotePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: {
        isOpen: false,
        message: 'lỗi không xác định!',
        duration: 5000,
        type: "info"
      },
      value: this.props.preNote[this.props.data.id].NOTE ?? ''
    };

  }
  handleAdd() {
    this.props.handleCloseDialog(this.state.value);
    this.props.handleSave(this.state.value, this.props.data.HOUSE_BILL);
    this.setState({
      value: ''
    });
  }

  handleCloseDialog() {
    this.props.handleCloseDialog();

  }
  render() {
    return (
      <Dialog
        open={this.props.dialog.isOpen}
        scroll="paper"
        fullWidth maxWidth="xs"
      >
        <Card style={{ height: "25vh" }}>
          <CardContent >
            <Stack direction="column" spacing={2} >
              <Typography variant="h5">
                Ghi chú
              </Typography>
              <TextField
                id="note"
                placeholder="Vui lòng nhập ghi chú"
                value={this.state.value}
                onChange={(e) => this.setState({
                  value: e.target.value
                })}
              >
              </TextField>
              <Button
                type="button"
                variant="contained"
                startIcon={<DoneIcon />}
                style={{
                  position: "absolute",
                  right: "115px",
                  bottom: "10px"
                }}
                onClick={() => this.handleAdd()}
              >
                Xác nhận
              </Button>
              <Button
                type="button"
                variant="outlined"
                startIcon={<CloseIcon />}
                style={{
                  position: "absolute",
                  right: "12px",
                  bottom: "10px"
                }}
                onClick={() => this.handleCloseDialog()}
              >
                Hủy
              </Button>
            </Stack>
          </CardContent>
        </Card>

      </Dialog>
    )
  }
}
export default NotePopup;