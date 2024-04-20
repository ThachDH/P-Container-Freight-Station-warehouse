import * as React from "react";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { DataGrid } from '@mui/x-data-grid';
import ExportCSV from "../../components/caiDat/ExportCSV";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

import {
    Stack,
    Grid,
    Divider,
    TextField,
    Button,
    Box,
    Card,
    CardContent,
    InputAdornment,
} from "@mui/material";
import FixedPageName from "../../componentsCFS2/fixedPageName";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const initData = {
    ORDER_NO: "",
    BILLOFLADING: "",
    BOOKING_NO: "",
    CLASS_CODE: 0,
    CNTRNO: "",
    CREATE_BY: "",
    CUSTOMER_NAME: "",
    INV_NO: "",
    NOTE: "",
    VOYAGEKEY: "",
    Total_RT: '',
    OWNER_PHONE: '',
    OWNER: '',
    id: 0
}

class OrderUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            button_phonenumber: true,
            button_note: true,
            dataInput: initData,
            dataTable: [],
            dataTableDetail: [],
            ORDER_NO: '',
            CLASS_CODE: '',
            data: {
                OWNER_PHONE: ''
            },
            type: 1,
            dialog: {
                isOpen: false,
                type: 1,
            },
            // --------- alert state -------
            alert: {
                isOpen: false,
                message: 'Lỗi không xác định!',
                duration: 5000,
                type: 'info' // info / warning / error / success
            },
        };

        this.createRows = (data) => data.map((row, index) => ({
            STT: index + 1,
            id: index,
            ...row
        }),
        );
        this.columns_detail_nhap = [
            {
                field: "OWNER",
                headerName: "Chủ hàng",
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: 'HOUSE_BILL',
                headerName: 'House_Bill',
                align: "center",
                headerAlign: "center",
            },
            {
                field: "COMMODITYDESCRIPTION",
                headerName: "Tên hàng",
                align: "center",
                flex: 1,
                headerAlign: "center",
            },
            {
                field: "PIN_CODE",
                headerName: "Số kiện",
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "RT",
                headerName: "Tấn doanh thu (RT)",
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "CARGO_PIECE",
                headerName: "Tổng trọng lượng (Kg)",
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "CBM",
                headerName: "Tổng số khối M3",
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "ITEM_TYPE_CODE",
                headerName: "Loại hàng",
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "NOTE",
                headerName: "Ghi chú",
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
        ];
        this.columns_detail_xuat = [
            {
                field: "OWNER",
                headerName: "Chủ hàng",
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "BOOKING_FWD",
                headerName: "Booking_FWD",
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "COMMODITYDESCRIPTION",
                flex: 1,
                headerName: "Tên hàng",
                align: "center",
                headerAlign: "center",
            },
            {
                field: "PIN_CODE",
                headerName: "Số kiện",
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "RT",
                headerName: "Tấn doanh thu (RT)",
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "CARGO_PIECE",
                headerName: "Tổng trọng lượng (Kg)",
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "CBM",
                headerName: "Tổng số khối M3",
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "ITEM_TYPE_CODE",
                headerName: "Loại hàng",
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "NOTE",
                headerName: "Ghi chú",
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
        ];

    }

    handleSave() {
        let { dataInput } = this.state;
        let dataSend = {
            OWNER_PHONE: dataInput.OWNER_PHONE,
            ORDER_NO: dataInput.ORDER_NO,
            NOTE: dataInput.NOTE
        };

        fetch(window.root_url + `dt-order/updateDT_ORDER`, {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
            },
            body: JSON.stringify(dataSend),
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
                    let temp = this.state.dataTableDetail;
                    let newNOTE = this.state.dataInput.NOTE
                    temp.map(data => {
                        data.NOTE = newNOTE
                        return data;
                    })
                    this.setState({
                        dataTableDetail: temp,
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
                            message: response.Message,
                            type: "warning"

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
                            message: 'Lỗi ' + JSON.parse(err.message).error.message,
                            type: 'error'
                        }
                    });
                    this.loadDataParent_Code();
                }
            });

    }

    handleSearch() {
        let dataSend = {
            ORDER_NO: this.state.ORDER_NO,
        }
        fetch(window.root_url + `dt-order/get`, {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("userInfo")).token,
            },
            body: JSON.stringify(dataSend),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text);
                }
                return res.json();
            })
            .then((response) => {
                if (response.Status) {
                    let temp = this.createRows(response.Payload.header);
                    let tempDetail = this.createRows(response.Payload.details);
                    response.Payload.header.map(item => {
                        this.setState({
                            CLASS_CODE: item.CLASS_CODE,
                        });
                        return item;
                    });
                    this.setState({
                        dataTable: temp,
                        dataInput: temp[0],
                        dataTableDetail: tempDetail,
                        alert: {
                            isOpen: true,
                            message: response.Message,
                            type: 'success',
                            duration: 2000
                        }
                    })
                } else {
                    this.setState({
                        alert: {
                            isOpen: true,
                            duration: 3000,
                            message: response.Message,
                            type: 'warning',
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
                            message: 'Lỗi ' + JSON.parse(err.message).error.message,
                            type: 'error'
                        }
                    });
                }
            });
    }

    render() {
        return (
            <Box>
                <FixedPageName
                    pageName={this.props.MenuName}
                    breadcrumbs={this.props.ParentName + " / " + this.props.MenuName}
                ></FixedPageName>
                <Grid container spacing={1}>
                    <Grid item xs={3} >
                        <Card >
                            <CardContent>
                                <Grid display="flex" flexDirection="column" >
                                    <Stack component="form" direction="row" sx={{ mt: 1 }} spacing={1}>
                                        <TextField
                                            size="small"
                                            id="SEARCH_NUM"
                                            sx={{ width: '70%' }}
                                            value={this.state.ORDER_NO}
                                            label="Tìm theo số lệnh"
                                            onChange={(e) => {
                                                this.setState({ ORDER_NO: e.target.value.trim() })
                                            }}
                                        />
                                        <Divider orientation="vertical" />
                                        <Button type="button" variant="contained"
                                            sx={{ width: '30%' }}
                                            onClick={() => this.handleSearch()}>
                                            Tìm kiếm
                                        </Button>
                                    </Stack>
                                </Grid>
                            </CardContent>
                            <Divider textAlign="left" sx={{ mb: 1, mt: 1, fontSize: "18px" }} > Thông tin lệnh</Divider>
                            <CardContent>
                                <Grid container rowSpacing={1} columnSpacing={1}>
                                    <Grid item md={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            InputProps={{ readOnly: true }}
                                            id="VOYAGEKEY"
                                            value={this.state.dataInput.VOYAGEKEY} label="Tàu chuyến " />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextField
                                            key="BOOKING_NO"
                                            fullWidth
                                            label={this.state.CLASS_CODE === 1 ? "Số House_Bill" : "Số Booking_FWD"}
                                            value={this.state.CLASS_CODE === 1 ? this.state.dataInput.BILLOFLADING : this.state.dataInput.BOOKING_NO}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextField
                                            key="Total_RT"
                                            fullWidth
                                            InputProps={{ readOnly: true }}
                                            size="small"
                                            value={this.state.dataInput.Total_RT}
                                            label="Tấn doanh thu (RT)"
                                        />
                                    </Grid>
                                    <Grid item md={12}>
                                        <TextField
                                            key="OWNER"
                                            fullWidth
                                            InputProps={{ readOnly: true }}
                                            value={this.state.dataInput.OWNER}
                                            size="small"
                                            label="Chủ hàng"
                                        />
                                    </Grid>
                                    <Grid item md={12}>
                                        <TextField
                                            key="CUSTOMER_NAME"
                                            InputProps={{ readOnly: true }}
                                            fullWidth
                                            value={this.state.dataInput.CUSTOMER_NAME}
                                            size="small"
                                            label="ĐTTT"
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextField
                                            key="INV_NO"
                                            InputProps={{ readOnly: true }}
                                            fullWidth
                                            value={this.state.dataInput.INV_NO}
                                            size="small"
                                            label="Số hóa đơn"
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextField
                                            key="OWNER_PHONE"
                                            fullWidth
                                            value={this.state.dataInput.OWNER_PHONE}
                                            onChange={(e) => {
                                                this.setState({
                                                    dataInput: {
                                                        ...this.state.dataInput,
                                                        OWNER_PHONE: e.target.value
                                                    }
                                                })
                                            }}
                                            size="small"
                                            label="Số điện thoại"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment sx={{ position: 'absolute', right: '7px' }}>
                                                        <EditIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={12}>
                                        <TextField
                                            InputProps={{ readOnly: true }}
                                            key="CREATE_BY"
                                            fullWidth
                                            value={this.state.dataInput.CREATE_BY}
                                            startIcon={<EditIcon />}
                                            size="small"
                                            label="Người làm lệnh"
                                        />
                                    </Grid>
                                    <Grid item md={12}>
                                        <TextField
                                            key="OWNER_NOTE"
                                            fullWidth
                                            value={this.state.dataInput.NOTE}
                                            onChange={(e) => {
                                                this.setState({
                                                    dataInput: {
                                                        ...this.state.dataInput,
                                                        NOTE: e.target.value
                                                    }
                                                })
                                            }}
                                            size="small"
                                            label="Ghi chú"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment sx={{ position: 'absolute', right: '7px' }}>
                                                        <EditIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={9}>
                        <Card >
                            <CardContent >
                                <Stack direction="row" spacing={1} justifyContent="end"  >
                                    <ExportCSV csvData={this.state.dataTable} fileName="API"></ExportCSV>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        color="success"
                                        startIcon={<SaveIcon />}
                                        onClick={() => this.handleSave()}
                                    >
                                        Lưu
                                    </Button>
                                </Stack>
                                <Divider sx={{ marginBottom: 1, marginTop: 1 }} />
                                <DataGrid
                                    sx={{ '& .super-app.negative': { color: '#51cb52', }, '& .super-app.positive': { color: '#ff5c33', }, height: "41vh" }}
                                    hideFooter={true}
                                    className="m-table"
                                    rows={(this.state.dataTableDetail)
                                    }
                                    rowHeight={40}
                                    columns={this.state.CLASS_CODE === 1 ? this.columns_detail_nhap : this.columns_detail_xuat}
                                >
                                </DataGrid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
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
            </Box >
        );
    }
}

export default OrderUpdate;
