import * as React from "react";
import {
  Stack,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class ThongTinDonVi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storageList: [],
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    }
  }

  componentDidMount() {
    this.loadInfo();
  }

  loadInfo() {
    let url = window.root_url + `dashboard/infoLocation`;

    // fetch(url, {
    //   method: "POST",
    //   headers: {
    //     'Accept': 'application/json, text/plain, */*',
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
    //   },
    // })
    //   .then(async (res) => {
    //     if (!res.ok) {
    //       const text = await res.text();
    //       throw new Error(text);
    //     }
    //     return res.json();
    //   })
    //   .then(data => {
    //     this.setState({
    //       storageList: data.Location
    //     })
    //   })
    //   .catch(err => {
    //     if (JSON.parse(err.message).error.statusCode === 401) {
    //       localStorage.clear();
    //       window.location.assign('/login');
    //     } else {
    //       this.setState({
    //         alert: {
    //           isOpen: true,
    //           duration: 3000,
    //           message: 'Lỗi ' + JSON.parse(err.message).error.message,
    //           type: 'error'
    //         }
    //       });
    //     }
    //   });
  }

  //-------------------------------
  render() {
    return (
      <Grid sx={{ maxHeight: "350px", overflowY: 'scroll' }}>
        <Card sx={{ bgcolor: '	#F8F8FF' }} xs={5}>
          <CardContent>
            <Grid item  >
              {
                this.state.storageList.length !== 0 ?
                  this.state.storageList.map(item => {
                    return (
                      <>
                        <Stack direction={'row'} spacing={1} style={{ marginLeft: '3%', paddingTop: "15px" }}>
                          <Typography variant="h5" color="black">
                            Tên kho :
                          </Typography>
                          <Typography variant='h5' color="black" >
                            {item.Name}
                          </Typography>
                        </Stack>
                        <Stack direction='row' spacing={3} style={{ marginLeft: '3%' }} >
                          <Stack direction={'row'} spacing={1} alignItems='center'>
                            <Typography variant="h6" color="black">
                              Địa chỉ :
                            </Typography>
                            <Typography variant='h6' color="Gray" >
                              {item.Address}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Stack>
                          <Stack direction={'row'} spacing={1} alignItems='center' style={{ marginLeft: '3%' }}>
                            <Typography variant="h6" color="black">
                              Diện Tích :
                            </Typography>
                            <Typography variant='h6' color="Gray" >
                              {item.Description}
                            </Typography>
                          </Stack>
                        </Stack>
                      </>
                    )
                  })
                  : ""
              }
            </Grid>
          </CardContent>
        </Card>
        {/* -------------------- global alert -------------------- */}
        <Snackbar
          open={this.state.alert.isOpen}
          autoHideDuration={this.state.alert.duration}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          onClose={() => {
            this.setState({ alert: { ...this.state.alert, isOpen: false } })
          }}
        >
          <Alert
            severity={this.state.alert.type}
            sx={{ width: '100%' }}
          >
            {this.state.alert.message}
          </Alert>
        </Snackbar>
      </Grid>
    );
  }
}
export default ThongTinDonVi;