import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Stack,
  Card,
  CardContent,
  Checkbox,
  TextField,
  Divider,
  Grid
} from "@mui/material";
// import DecodeJWT from '../login/DecodeJWT'
import FixedPageName from "../../componentsCFS2/fixedPageName";
import MuiAlert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import Snackbar from '@mui/material/Snackbar';
import InputAdornment from '@mui/material/InputAdornment';
import CustomerSelect from '../../componentsCFS2/dialog/CustomerSelect';
import SaveIcon from '@mui/icons-material/Save';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
class ServiceConfi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customer_Pay: "*",
      dialog_Customer: {
        isOpen: false,
        type: 1
      },
      configService: [],
      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
      baseData: [],
      dataTable_Method: [],
      dataTable_Service: [],
      methodSelected: {},
      saveData: []
    };
    this.createRow = (data) => {
      return data.map((row, index) => {
        let temp = {
          STT: index + 1,
          id: index,
          ...row
        }
        return temp;
      }
      );
    };

    this.column_Method = [
      {
        field: 'STT',
        headerName: 'STT',
        align: "center",
        headerAlign: "center",
        width: 80,
      },
      {
        field: 'METHOD_CODE',
        headerName: 'Mã Phương án',
        align: "center",
        headerAlign: "center",
        flex: 1,
      },
      {
        field: 'METHOD_NAME',
        headerName: 'Tên Phương án',
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: 'QUANTITY',
        headerName: 'Số lượng',
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (param) => {
          let row = param.row;
          let count = this.state.configService?.filter(p => p.METHOD_CODE === row.METHOD_CODE).length
          return count;
        }
      },
    ];

    this.column_Service = [
      {
        field: 'STT',
        headerName: 'STT',
        align: "center",
        headerAlign: "center",
        width: 80,
      },
      {
        field: 'isAttach',
        headerName: 'Chọn',
        flex: 1,
        align: "center",
        headerAlign: "center",
        type: "action",
        renderCell: (params) => {
          return [
            <Checkbox
              key={params.row.METHOD_CODE}
              onChange={(e) => {
                if (Object.entries(this.state.methodSelected).length === 0) {
                  this.setState({
                    alert: {
                      type: 'warning',
                      message: 'Vui lòng chọn phương án!',
                      isOpen: true
                    }
                  });
                  return;
                };

                const { saveData, methodSelected, dataTable_Service } = this.state;
                let tempSaveData = saveData;
                tempSaveData = saveData.filter(p => {
                  if (p.METHOD_CODE === methodSelected.METHOD_CODE &&
                    p.ATTACH_SERVICE_CODE !== params.row.METHOD_CODE) {
                  }
                  return p;
                });

                tempSaveData.push(
                  {
                    METHOD_CODE: methodSelected.METHOD_CODE,
                    CUSTOMER_CODE: this.state.customer_Pay,
                    ATTACH_SERVICE_CODE: params.row.METHOD_CODE,
                    CREATE_BY: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "",
                    status: e.target.checked ? 'insert' : 'delete'
                  }
                );

                let updatedService = dataTable_Service.map(item => {
                  if (item.METHOD_CODE === params.row.METHOD_CODE) {
                    item.checked = !item.checked;
                  };
                  return item;
                });

                this.setState({
                  saveData: tempSaveData,
                  dataTable_Service: updatedService
                });
              }}
              checked={params.row.checked === true}
            ></Checkbox>
          ];
        }
      },
      {
        field: "METHOD_CODE",
        flex: 1,
        headerName: "Mã dịch vụ",
        align: "center",
        headerAlign: "center",
      },
      {
        field: "METHOD_NAME",
        flex: 1,
        headerName: "Tên dịch vụ",
        align: "center",
        headerAlign: "center",
      },
    ];
  }

  rowSelectHandle(row) {
    const { dataTable_Service, dataTable_Method, configService } = this.state;
    let arr = [];
    for (let i = 0; i < dataTable_Method.length; i++) {
      arr[`${dataTable_Method[i].METHOD_CODE}`] = configService.filter(e => e.METHOD_CODE === dataTable_Method[i].METHOD_CODE)
    }
    let tempTable = dataTable_Service.map(item => {
      if (item.checked) {
        delete item.checked
      }
      return item;
    });
    let tempArr = arr[row.METHOD_CODE];
      tempArr.map(item => {
      tempTable.filter(p => {
        if (p.METHOD_CODE === item.ATTACH_SERVICE_CODE) {
          p.checked = true
        } else {
        }
        return p;
      });
      return item;
    });
    this.setState({
      methodSelected: row,
      dataTable_Service: tempTable
    });
  }

  componentDidMount() {
    this.getData();
    this.handleLoadConfigService();
  }

  getData(customerCode = "*") {
    let url = window.root_url + `bs-method/view`;
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
      .then(response => {
        if (response.Status) {
          let methodes = this.createRow(response.Payload.filter(item => item.IS_SERVICE === false));
          let services = this.createRow(response.Payload.filter(item => item.IS_SERVICE === true));
          this.setState({
            dataTable_Method: methodes,
            dataTable_Service: services,
            baseData: response.Payload
          });
        }
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

  handleLoadConfigService(data) {	
    let dataSend = data ? data.CUSTOMER_CODE : this.state.customer_Pay	
    let url = window.root_url + `/config-attach-services/view`;	
    fetch(url, {	
      method: "POST",	
      headers: {	
        'Accept': 'application/json, text/plain, */*',	
        'Content-Type': 'application/json; charset=UTF-8',	
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,	
      },	
      body: JSON.stringify(dataSend)	
    })	
      .then(async (res) => {	
        if (!res.ok) {	
          const text = await res.text();	
          throw new Error(text);	
        }	
        return res.json();	
      })	
      .then(response => {	
        if (response.Status) {	
          let tempMethod = [...this.state.dataTable_Method];	
          let tempService = [...response.Payload];	
          for (let i = 0; i < tempMethod.length; i++) {	
            let count = tempService.filter(p => p.METHOD_CODE === tempMethod[i].METHOD_CODE).length;	
            tempMethod[i].count = count	
          };	
          this.setState({	
            configService: response.Payload	
          });	
        }	
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

  handleSave() {
    if (this.state.saveData.length === 0) {
      this.setState({
        alert: {
          isOpen: true,
          type: 'warning',
          message: 'Không có dữ liệu thay dổi!',
        }
      });
      return;
    };

    const { saveData } = this.state;
    let url = window.root_url + `config-attach-services/saveData`;

    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
      },
      body: JSON.stringify(saveData)
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(response => {
        if (response.Status) {
          this.setState({
            saveData: [],
            alert: {
              type: 'success',
              isOpen: true,
              message: response.Message
            }
          });
        } else {
          this.setState({
            alert: {
              type: 'warning',
              isOpen: true,
              message: response.Message
            }
          });
        };
        this.handleLoadConfigService();
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

  //-----------------------------------
  render() {
    console.log(this.state.dataTable_Service)
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Card style={{ marginBottom: "12px" }}>
          <CardContent>
            <Grid container>
              <Grid item xs={12}>
                <Stack mb={1} mt={1} direction="row" justifyContent="space-between" >
                  <TextField
                    size="small"
                    id="DTTT"
                    label="Đối tượng thanh toán"
                    onChange={(e) => {
                      this.setState({ customer_Pay: e.target.value })
                    }}
                    value={this.state.customer_Pay}
                    onKeyPress={(e) => {
                      if (e.code === "Enter") {

                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon
                            onClick={() => {
                              this.setState({
                                dialog_Customer: {
                                  isOpen: true,
                                }
                              })
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="button"
                    variant="outlined"
                    size="medium"
                    onClick={() => this.handleSave()}
                    startIcon={<SaveIcon />}
                    color="success"
                  >
                    Lưu
                  </Button>
                </Stack>
                <Stack direction="row" spacing={2} mt={1}>
                  <Grid item xs={5}  >
                    <Divider textAlign="center" sx={{ mb: 2 }}>Phương án công việc</Divider>
                    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                      <span  >Tìm kiếm:</span>
                      <TextField
                        size="small"
                        id="tim-kiem-method"
                        placeholder="Tìm kiếm mã phương án"
                        onChange={(e) => {
                          this.setState({ searchField: { METHOD_CODE: e.target.value } })
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                    <DataGrid
                      className="m-table"
                      rowHeight={53}
                      rows={(this.state.dataTable_Method)
                      }
                      columns={this.column_Method}
                      rowsPerPageOptions={[10, 25, 100]}
                      sx={{ height: "63vh" }}
                      columnVisibilityModel={{
                        ID: false
                      }}
                      onRowClick={(params) => {
                        this.rowSelectHandle(params.row)
                      }}
                    >
                    </DataGrid>
                  </Grid>
                  <Grid item xs={7}  >
                    <Divider textAlign="center" sx={{ mb: 2 }}>Danh sách dịch vụ đính kèm</Divider>
                    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                      <span  >Tìm kiếm:</span>
                      <TextField
                        size="small"
                        id="tim-kiem-service"
                        placeholder="Tìm kiếm dịch vụ đính kèm"
                        onChange={(e) => {
                          this.setState({ searchField: { METHOD_CODE: e.target.value } })
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                    <DataGrid
                      className="m-table"
                      rowHeight={53}
                      // hideFooterSelectedRowCount={false}
                      rows={(this.state.dataTable_Service)}
                      columns={this.column_Service}
                      rowsPerPageOptions={[10, 25, 100]}
                      sx={{ height: "63vh" }}
                      columnVisibilityModel={{
                        ID: false
                      }}
                    >
                    </DataGrid>
                  </Grid>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <CustomerSelect
          dialog={this.state.dialog_Customer}
          handleSelect={(data) => {
            this.getData(data);
            this.handleLoadConfigService(data);	
            if (Object.keys(data).length > 0) {
              this.setState({
                dialog_Customer: {
                  isOpen: false
                }
              })
            } else {
              this.setState({
                alert: {
                  isOpen: true,
                  message: 'Không có dữ liệu!',
                  duration: 2000,
                  type: 'error'
                }
              })
              return;
            }
          }}
          handleCloseDialog={() => {
            this.setState({
              dialog_Customer: {
                isOpen: false
              }
            })
          }} />

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
      </Box>
    );
  }
}
export default ServiceConfi;

