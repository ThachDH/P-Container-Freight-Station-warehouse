import * as React from "react";
import {
  Stack,
  Divider,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import FixedPageName from "../../componentsCFS2/fixedPageName";
import { Link } from "react-router-dom";


class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  //--------------------------------------
  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>

        <Grid container>
          <Card
            style={{ marginBottom: "12px" }}
            sx={{
              minWidth: '60%',
            }}>
            <CardContent>
              <Typography variant="h5" textAlign="left">Phiếu nhập kho</Typography>
              <Divider style={{ paddingTop: "10px" }}></Divider>
              <Stack style={{ marginLeft: "5px", marginRight: "5px", paddingTop: "10px" }}>
                <Stack direction="row" justifyContent="space-between" style={{ paddingTop: "25px" }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>I2111230001</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Đang kiểm đến 10/10 CTN</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Xếp vào kho 10/10 CTN</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Stack direction={{ sm: 'row' }} spacing={{ xs: 0.5, sm: 0.5, md: 0.5 }} alignItems="center">
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => this.luu()}
                        startIcon={<CheckIcon />}
                      >
                        Báo cáo lệnh
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        component={Link}
                        to="/rept/tally-query"
                        startIcon={<CheckIcon />}
                      >
                        Báo cáo kiểm đến
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => this.luu()}
                        startIcon={<CheckIcon />}
                      >
                        Báo cáo lưu trữ
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>

                <Stack direction="row" justifyContent="space-between" style={{ paddingTop: "25px" }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography>I2111220001</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography>Đang kiểm đến 2/2 CTN</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography>Xếp vào kho 2/2 CTN</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Stack direction={{ sm: 'row' }} spacing={{ xs: 0.5, sm: 0.5, md: 0.5 }} alignItems="center">
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => this.luu()}
                        startIcon={<CheckIcon />}
                      >
                        Báo cáo lệnh
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        component={Link}
                        to="/rept/tally-query"
                        startIcon={<CheckIcon />}
                      >
                        Báo cáo kiểm đến
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => this.luu()}
                        startIcon={<CheckIcon />}
                      >
                        Báo cáo lưu trữ
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          <Card
            style={{ marginBottom: "12px", marginLeft: "10px" }}
            sx={{
              minWidth: '39.3%',
            }}
          >
            <CardContent>
              <Typography variant="h5" textAlign="left">Phiếu xuất</Typography>
              <Divider textAlign="left" style={{ paddingTop: "10px" }}></Divider>
              <Stack style={{ marginLeft: "5px", marginRight: "5px", paddingTop: "10px" }}>
                <Stack direction="row" justifyContent="space-between" style={{ paddingTop: "25px" }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>E2111220001</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Xuất CNT 2/2</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Stack direction={{ sm: 'row' }} spacing={{ xs: 0.5, sm: 0.5, md: 0.5 }} alignItems="center">
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => this.luu()}
                        startIcon={<CheckIcon />}
                      >
                        Chi tiết lệnh
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => this.luu()}
                        startIcon={<CheckIcon />}
                      >
                        Picking list
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => this.luu()}
                        startIcon={<CheckIcon />}
                      >
                        Chi tiết xuất
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

        </Grid>
      </Box>
    );
  }
}

export default OrderList;