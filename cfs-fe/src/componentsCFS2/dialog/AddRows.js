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

class AddRows extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: {
        isOpen: false,
        message: 'lỗi không xác định!',
        duration: 5000,
        type: "info"
      },
      value: 1

    };

  }
  handleAdd() {
    this.setState({
      value: 1
    })
    this.props.handleCloseDialog();
    this.props.handleAddRows(this.state.value);
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
                Số dòng bạn muốn thêm
              </Typography>
              <TextField
                id="dialog-so-luong-dong"
                placeholder="nhập số dòng"
                value={this.state.value}
                onChange={(event) => this.setState({
                  value: event.target.value > 0 ? event.target.value : 1,
                })}
                inputProps={{
                  type: "number",
                  inputProps: {
                    min: 1
                  }
                }}
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
              // onChange={()}
              >
                Thêm
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
export default AddRows;