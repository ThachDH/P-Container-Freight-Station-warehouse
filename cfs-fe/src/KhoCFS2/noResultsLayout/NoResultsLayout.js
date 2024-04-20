import * as React from "react";
import Logo from "../../assets/images/Untitled.png";
import {
  Button,
} from "@mui/material";

class NoResultsLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleRedirect() {
    window.location.pathname = '/overview'
  }
  render() {
    return (
      <div style={{ marginTop: "10vh" }}>
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={Logo} alt="logo" height="100%" />
        </div>
        <div>
          <div
            style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center', color: '#8b8b8b' }}>
            <div>
              <span style={{ fontSize: "30px" }}> Màn hình chức năng hiện đang phát triển </span>
            </div>
            <div>
              <span style={{ fontSize: "20px" }}> Vui lòng quay lại sau! </span>
            </div>
            <Button
              sx={{ borderRadius: "6px", marginTop: "2vh" }}
              variant="contained"
              size="large"
              onClick={() => this.handleRedirect()}
            >
              Trang chủ
            </Button>
          </div>

        </div>
      </div>
    );
  }
}
export default NoResultsLayout;