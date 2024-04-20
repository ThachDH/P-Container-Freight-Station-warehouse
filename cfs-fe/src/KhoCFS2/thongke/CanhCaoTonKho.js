import * as React from "react";
import {
  Stack,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const columns = [
  {
    id: 'customer_WarningCode',
    label: "Mã KH",
    minWidth: 95
  },
  {
    id: 'customer_WarningName',
    label: "Tên KH",
    minWidth: 150
  },
  {
    id: 'customer_WarningHiringDate',
    label: "Ngày thuê kho",
    minWidth: 95
  },
  {
    id: 'customer_WarningDay',
    label: "Số ngày đến hạn",
    minWidth: 50
  },
];

class CanhCaoTonKho extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activedTab: "1",
      page: 0,
      rowsPerPage: 10,
      dataTable: [],
    }
  }
  handleChangeTab(event, newValue) {
    this.setState({ activedTab: newValue });
  }

  handleChangePage(event, newPage) {
    this.setState({ page: newPage });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  }

  render() {
    return (
      <Box sx={{ flexGrow: 1, bgcolor: '	#F8F8FF', display: 'flex', width: 700, height: 500 }}
      >
        <TabContext value={this.state.activedTab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", marginLeft: 1 }}>
            <TabList
              orientation="vertical"
              onChange={(event, newValue) =>
                this.handleChangeTab(event, newValue)
              }
              textColor="text.secondary"
              variant="scrollable"

              aria-label="Canh Bao Han Ton Kho tabs"
            >
              <Tab label="Hạn Tồn Kho dưới 10 ngày" value="1" sx={{ backgroundColor: '#66CC66', height: 70, marginTop: 3.5 }} />
              <Tab label="Hạn Tồn Kho dưới 20 ngày" value="2" sx={{ backgroundColor: '#66CC99	', height: 70 }} />
              <Tab label="Hạn Tồn Kho dưới 30 ngày" value="3" sx={{ backgroundColor: '#66CCCC	', height: 70 }} />
              <Tab label="Hạn Tồn Kho dưới 40 ngày" value="4" sx={{ backgroundColor: '#66CCFF', height: 70 }} />
            </TabList>
          </Box>
          <TabPanel value="1" >
            <Card>
              <CardContent>
                <Stack>
                  <Stack direction={'row'} spacing={3}>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Tên KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        Hồ Đức B
                      </Typography>
                    </Stack>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Mã KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        MH370
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Ngày thuê kho :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      21/2/2022
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Số ngày đến hạn :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      10
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ mt: 1 }}>
              <CardContent>
                <Stack>
                  <Stack direction={'row'} spacing={3}>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Tên KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        Nguyễn Văn A
                      </Typography>
                    </Stack>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Mã KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        MH370
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Ngày thuê kho :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      21/2/2022
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Số ngày đến hạn :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      7
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ mt: 1 }}>
              <CardContent>
                <Stack>
                  <Stack direction={'row'} spacing={3}>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Tên KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        Nguyễn Văn A
                      </Typography>
                    </Stack>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Mã KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        MH370
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Ngày thuê kho :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      21/2/2022
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Số ngày đến hạn :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      9
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="2">
            <Card>
              <CardContent>
                <Stack>
                  <Stack direction={'row'} spacing={3}>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Tên KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        Trần Văn B
                      </Typography>
                    </Stack>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Mã KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        CH123
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Ngày thuê kho :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      22/4/2021
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Số ngày đến hạn :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      20
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ mt: 1 }}>
              <CardContent>
                <Stack>
                  <Stack direction={'row'} spacing={3}>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Tên KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        Nguyễn Thị Thu
                      </Typography>
                    </Stack>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Mã KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        CH331
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Ngày thuê kho :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      11/1/2019
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Số ngày đến hạn :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      16
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ mt: 1 }}>
              <CardContent>
                <Stack>
                  <Stack direction={'row'} spacing={3}>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Tên KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        Đinh Đức B
                      </Typography>
                    </Stack>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Mã KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        HT123
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Ngày thuê kho :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      11/8/2020
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Số ngày đến hạn :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      18
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="3">
            <Card>
              <CardContent>
                <Stack>
                  <Stack direction={'row'} spacing={3}>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Tên KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        Nguyễn Thế C
                      </Typography>
                    </Stack>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Mã KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        TH123
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Ngày thuê kho :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      12/4/2012
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Số ngày đến hạn :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      30
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ mt: 1 }}>
              <CardContent>
                <Stack>
                  <Stack direction={'row'} spacing={3}>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Tên KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        Hùng Thế C
                      </Typography>
                    </Stack>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Mã KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        TO123
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Ngày thuê kho :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      12/6/2021
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Số ngày đến hạn :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      28
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ mt: 1 }}>
              <CardContent>
                <Stack>
                  <Stack direction={'row'} spacing={3}>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Tên KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        Thôi Đi Mà
                      </Typography>
                    </Stack>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Mã KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        WE123
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Ngày thuê kho :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      13/3/2021
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Số ngày đến hạn :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      25
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="4">
            <Card>
              <CardContent>
                <Stack>
                  <Stack direction={'row'} spacing={3}>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Tên KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        Nguyễn Việt C
                      </Typography>
                    </Stack>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Mã KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        RE123
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Ngày thuê kho :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      11/6/2021
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Số ngày đến hạn :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      40
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ mt: 1 }}>
              <CardContent>
                <Stack>
                  <Stack direction={'row'} spacing={3}>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Tên KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        Vũ Thế Hải
                      </Typography>
                    </Stack>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Mã KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        QW123
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Ngày thuê kho :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      3/12/2021
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Số ngày đến hạn :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      37
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ mt: 1 }}>
              <CardContent>
                <Stack>
                  <Stack direction={'row'} spacing={3}>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Tên KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        Đinh Việt C
                      </Typography>
                    </Stack>
                    <Stack direction={'row'}>
                      <Typography variant="h5" color="black">
                        Mã KH :
                      </Typography>
                      <Typography variant='h5' color='gray' >
                        QQ123
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Ngày thuê kho :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      11/2/2021
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} spacing={1}>
                    <Typography variant="h5" color="black">
                      Số ngày đến hạn :
                    </Typography>
                    <Typography variant='h5' color='gray' >
                      35
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </TabPanel>
        </TabContext>
      </Box >
    );
  }
}
export default CanhCaoTonKho;