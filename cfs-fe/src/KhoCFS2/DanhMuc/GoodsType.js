import * as React from "react";
import ConfirmPopup from "../../componentsCFS2/dialog/ConfirmPopup";
import * as moment from "moment";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from '@mui/x-data-grid';
import ExportCSV from "../../components/caiDat/ExportCSV";
import {
  Box,
  Button,
  Stack,
  Card,
  CardContent,
  Grid,
  TextField,
  Divider
} from "@mui/material";
import FixedPageName from "../../componentsCFS2/fixedPageName";
import MuiAlert from '@mui/material/Alert';
import AddRows from "../../componentsCFS2/dialog/AddRows";
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class GoodsType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmPopup: {
        isOpen: false,
      },
      fromDate: moment().subtract(1, "days"),
      toDate: moment(),
      dialog: {
        isOpen: false,
        data: null,
        type: 0,
      },
      dialogAlert: {
        isOpen: false,
        data: null,
        type: 0,
      },
      dataTable: [],
      data: {
        ITEM_TYPE_NAME: '',
        ITEM_TYPE_CODE: '',
      },
      searchField: {
        ITEM_TYPE_CODE: '',
        ITEM_TYPE_NAME: '',
      },

      // --------- alert state -------
      alert: {
        isOpen: false,
        message: 'Lỗi không xác định!',
        duration: 5000,
        type: 'info' // info / warning / error / success
      },
    };
    this.columns = [

      {
        field: "STT",
        headerName: "STT",
        width: 100,
        align: "center",
        headerAlign: "center",
        editable: false,
      },
      {
        field: "ITEM_TYPE_CODE",
        headerName: "Loại hàng",
        flex: 1,
        editable: true
      },
      {
        field: "ITEM_TYPE_NAME",
        headerName: 'Tên hàng hoá',
        flex: 1,
        editable: true
      },
      {
        field: "ID",
        headerName: "ID",
        editable: false,
      },
    ]

    this.createRows = (data) => data.map((row, index) => ({
      STT: index + 1,
      id: index,
      ...row
    }),
    );
  }

  rowSelectHandle(idx, status) {
    const { dataTable } = this.state;
    let updateData = dataTable;
    updateData[idx]['isChecked'] = status;
    this.setState({
      dataTable: updateData
    })
  }

  //Binh(*note) - lifeCycle
  componentDidMount() {
    this.handleViewData();
  }

  handleAddRow(rowCount) {
    let { dataTable } = this.state;
    let newRow = [];
    for (let i = 0; i < rowCount; i++) {
      let newData = {
        ...this.state.data,
        id: dataTable.length + i,
        STT: dataTable.length + i + 1,
        status: 'insert',
      }
      newRow.push(newData);
    }
    let mergeDataTable = [...newRow, ...dataTable].map((item, idx) => {
      item.id = idx;
      item.STT = idx + 1;
      return item;
    });
    this.setState({
      dataTable: mergeDataTable
    })
  }

  handleViewData() {
    let url = window.root_url + `bs-item-types/view`;
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
        if (data.length > 0) {
          let temp = this.createRows(data);
          this.setState({
            dataTable: temp,
            alert: {
              isOpen: true,
              type: "success",
              duration: 3000,
              message: "Nạp dữ liệu thành công!"
            },
          })
        }
        else {
          this.setState({
            dataTable: [],
            alert: {
              type: 'warning',
              message: 'Không tìm thấy dữ liệu!',
              duration: 3000,
              isOpen: true
            }
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
    let url = window.root_url + `bs-item-types/insertAndUpdate`;
    let { dataTable } = this.state;
    let checkColumn = {
      ITEM_TYPE_CODE: 'Loại sản phẩm',
      ITEM_TYPE_NAME: 'Tên sản phẩm',
    };
    let arr = [];
    let dataSend = dataTable.filter(p => p.status === 'insert' || p.status === 'update').map(data => {
      data[data.status === 'insert' ? 'CREATE_BY' : 'UPDATE_BY'] = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).name : "";
      if (arr.length === 0) {
        Object.keys(checkColumn).map((key) => {
          return !data[key] ? arr.push(checkColumn[key]) : [];
        });
      }
      return data;
    });
    if (arr.length > 0) {
      this.setState({
        alert: {
          isOpen: true,
          duration: 3000,
          message: arr.join(', ') + " không được để trống",
          type: "error"
        }
      })
      return;
    }

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
          let newDatas = dataTable.map((item, index) => {
            let returnValue = response.Payload.find(p => p.ITEM_TYPE_CODE === item.ITEM_TYPE_CODE && p.ITEM_TYPE_NAME === item.ITEM_TYPE_NAME);
            if (returnValue !== undefined) {
              item.ID = returnValue.ID;
              item.id = index;
              delete item.status;
            }
            return item;
          });
          this.setState({
            dataTable: newDatas,
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message,
              type: "success"
            }
          })
        } else {
          this.setState({
            alert: {
              isOpen: true,
              duration: 3000,
              message: response.Message !== '' ? response.Message : 'Không có dữ liệu',
              type: "error"
            }
          })
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
              message: 'Không có dữ liệu được cập nhật',
              type: 'error'
            }
          });
        }
      });
  }

  handleDelete() {
    let url = window.root_url + `bs-item-types/delete`;
    let { dataTable } = this.state;
    let dataSend = dataTable.filter(p => p.isChecked === true && p.status !== "insert").map(item => {
      let obj = {};
      obj["ID"] = item.ID;
      return obj;
    });

    if (!dataSend.length) {
      let clearedData = dataTable.filter(p => p.status === "insert" && p.isChecked !== true);
      clearedData = clearedData.map((item, i) => {
        item.STT = i + 1;
        return item;
      });
      this.setState({ dataTable: clearedData });
      return;
    }
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
      .then(data => {
        let temp = dataTable.filter(p => p.isChecked !== true);
        temp = temp.map((item, idx) => {
          item.STT = idx + 1;
          return item;
        });
        this.setState({
          dataTable: temp,
          alert: {
            isOpen: true,
            message: "Xóa dữ liệu thành công",
            duration: 2000,
            type: 'success',
          }
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
              message: 'Lỗi ' + JSON.parse(err.message).error.message,
              type: 'error'
            }
          });
        }
      });
  }

  //-----------------------------------
  render() {
    return (
      <Box>
        <FixedPageName
          pageName={this.props.MenuName}
          breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
        ></FixedPageName>
        <Card style={{ marginBottom: "12px" }}>
          <CardContent>
            <Grid container>
              <Grid item xs={12} spacing={2}>
                <Stack mb={1} direction="row" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>Tìm kiếm:</span>
                    <TextField
                      size="small"
                      id="tim-kiem"
                      onChange={(e) => {
                        this.setState({ searchField: { ITEM_TYPE_CODE: e.target.value.trim() } })
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon
                              onClick={() => { this.setState({ tableFilter: Object.assign({}, this.tableFilter) }) }}
                              style={{ cursor: "default" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <ExportCSV csvData={this.state.dataTable} fileName="DM-Loai-Hang-Hoa"></ExportCSV>
                    <Divider orientation="vertical" />
                    <Button
                      size="small"
                      className="m-btn m-secondary"
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        this.setState({
                          dialog: {
                            isOpen: true,
                            data: null,
                            type: 0,
                          },
                        });
                      }}
                      startIcon={<AddIcon />}
                    >
                      Thêm dòng
                    </Button>

                    <Button
                      size="small"
                      type="button"
                      variant="outlined"
                      onClick={() => this.handleSave()}
                      startIcon={<SaveIcon />}
                      color="success"
                    >
                      Lưu
                    </Button>

                    <Divider orientation="vertical" />
                    <Button
                      size="small"
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        this.setState({
                          confirmPopup: {
                            isOpen: true,
                            message: 'Bạn có muốn xóa dữ liệu?'
                          }
                        })
                      }}
                      startIcon={<DeleteIcon />}
                      color="error"
                    >
                      Xóa dòng
                    </Button>
                  </Stack>
                </Stack>
                <Divider />
                <Grid item mt={1} md={12}>
                  <DataGrid
                    className="m-table"
                    rows={(this.state.dataTable)
                      .filter(data => data.ITEM_TYPE_CODE.toUpperCase().includes(this.state.searchField.ITEM_TYPE_CODE.toUpperCase()))

                    }
                    rowHeight={35}
                    columns={this.columns}
                    columnVisibilityModel={{
                      ID: false
                    }}
                    sx={{ height: "63vh" }}
                    onCellEditCommit={(params) => {
                      let temp = [...this.state.dataTable];
                      temp.map(data => {
                        if (params.id === data.id) {
                          data[params.field] = params.value.trim();
                          if (data.status !== 'insert') {
                            data.status = 'update'
                          }
                        }
                        return true;
                      });
                      this.setState({ dataTable: temp })
                    }}
                    checkboxSelection
                    disableSelectionOnClick
                    onSelectionModelChange={(ids) => {
                      let { dataTable } = this.state;
                      dataTable.map(item => item['isChecked'] = ids.indexOf(item.id) >= 0);
                      this.setState({
                        dataTable: dataTable
                      })
                    }}
                  >
                  </DataGrid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <ConfirmPopup
          dialog={this.state.confirmPopup}
          text={'XÁC NHẬN'}
          handleCloseDialog={(type) => {
            if (type === "agree") {
              this.setState({
                confirmPopup: {
                  isOpen: false
                }
              })
              this.handleDelete();
            } else {
              this.setState({
                confirmPopup: {
                  isOpen: false
                }
              })
            }
          }}
        />
        <AddRows
          dialog={this.state.dialog}
          handleCloseDialog={() => {
            this.setState({
              dialog: {
                isOpen: false,
                data: null,
                type: 0,
              },
            });
          }}
          handleAddRows={(rowCount) => this.handleAddRow(rowCount)}
        >
        </AddRows>
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
    )
  }
}
GoodsType.defaultProps = { multiple: true };
export default GoodsType;