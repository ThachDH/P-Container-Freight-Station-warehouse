import * as React from "react";
import FlagIcon from '@mui/icons-material/Flag';

import {
  Button,
  Stack,
  Grid,
  Box
} from "@mui/material";
import "./headSelectGate.scss";



class SelecteGate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [],
      selectedRow: {},
      selectedGate: {
        GATE_NAME: '',
      },
      isOpen: false,
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
      isHide: false,
      valueGate: '',
    };

  }
  handleSelectedGate(data) {
    this.props.handleSelected(data);
  }

  handleHide() {
    this.setState({
      isHide: !this.state.isHide
    })
  }

  componentDidMount() {
    this.handleLoadData();
  }
  handleLoadData() {
    let url = window.root_url + `bs-gates/view`;
    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(data => {
        this.setState({
          dataTable: data,
          alert: {
            isOpen: true,
            type: "success",
            duration: 3000,
            message: "Nạp dữ liệu thành công!"
          },
        })
      })
      .catch(err => {
        if (JSON.parse(err.message).error.statusCode === 401) {
          localStorage.clear();
          window.location.assign('/login');
        } else {
          this.setState({
            alert: {
              isOpen: true,
              duration: 3000,
              message: JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }

  render() {
    return (

      <Box style={{ position: "relative", }}>
        <Grid container spacing={2} >
          <Grid container
            className={`test__class ${this.state.isHide ? 'hide' : ''}`}
          >
            <Stack direction='row' sx={{ gap: '4px' }}>
              {this.state.dataTable.map(item => {
                return (
                  <Button
                    key={item.GATE_NAME}
                    type="button"
                    variant="outlined"
                    style={{ margin: "10px 0 0 10px" }}
                    startIcon={<FlagIcon />}
                    onClick={() => {
                      this.handleSelectedGate(item);
                      this.handleHide();
                      this.setState({ valueGate: item.GATE_NAME })
                    }}
                  >
                    {item.GATE_NAME}
                  </Button>
                )
              })}
            </Stack>
          </Grid>

          {this.state.isHide && (
            <Stack direction='row' spacing={2} style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)" }}>
              <Button

                type="button"
                variant="outlined"
                startIcon={<FlagIcon />}
                onClick={() => {
                  this.handleHide();
                  this.handleSelectedGate();
                  this.props.clearData();
                }}
              >
                {this.state.valueGate}
              </Button>
            </Stack>
          )}
        </Grid>
      </Box >
    )
  }
}
export default SelecteGate;