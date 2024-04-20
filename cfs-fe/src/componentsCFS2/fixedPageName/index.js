import "./index.scss";
import * as React from "react";
import { Box, Typography, Breadcrumbs } from "@mui/material";

class FixedPageName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Box
        className="fixed-page-name"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        <Typography component="h1" variant="h5">
          {this.props.pageName}
        </Typography>
        <div role="presentation">
          <Breadcrumbs aria-label="breadcrumb">
            <Typography color="text.primary">
              {this.props.breadcrumbs}
            </Typography>

            {/* <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Typography color="text.primary">Khách Hàng</Typography> */}
          </Breadcrumbs>
        </div>
      </Box>
    );
  }
}

export default FixedPageName;
