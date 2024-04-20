import { DeleteForever, Login } from "@mui/icons-material";
import {
  Paper,
  Grid,
  Divider,
  IconButton,
  Stack,
  Box,
  Button,
  Chip,
  Card,
  TextField,
  InputAdornment,
  CardContent,
  Dialog,
  DialogTitle,
  Typography,
  DialogActions,
} from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { useEffect } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import avatar from "../assets/images/LOGO_ICD3_MINI.jpg";
import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import WidgetsIcon from '@mui/icons-material/Widgets';
import "../assets/styles/responsive.scss";

export class AnimatePaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseOver: false
    }
  }

  mouseIn = () => { this.setState({ mouseOver: true }) }

  mouseOut = () => { this.setState({ mouseOver: false }) }

  render() {
    return (
      <Paper
        onMouseOver={this.mouseIn}
        onMouseOut={this.mouseOut}
        elevation={this.state.mouseOver ? 3 : 1}
        style={{ padding: '8px 4px 8px 12px' }}
      >
        {this.props.children}
      </Paper>
    );
  }
}

export class MlistItem extends React.Component {
  constructor(props) {
    super(props);

    this.colors = ['#2c86ff', '#1f7eb3', '#2c2c2c'];
    this.labelKeys = Object.keys(this.props.labels);
  }

  handleAction(data) {
    this.props.actionHandler(data);
  }

  renderItem = (item) => {
    let content = this.labelKeys.map((label, index) => (
      <Grid style={{ color: this.colors[index] }} key={label + index} item xs={index === 0 ? 3 : true}>
        {item[label]}
      </Grid>
    ));
    return (content)
  }

  renderFunction = (item, index) => {
    return (
      <>
        {
          this.props.actions.includes('edit') &&
          <IconButton key={'edit' + index} onClick={() => this.handleAction({ row: item, index: index, action: 'edit' })} aria-label="edit">
            <EditIcon key={'icon-edit' + index}></EditIcon>
          </IconButton>
        }
        {
          this.props.actions.includes('delete') &&
          <>
            <Divider key={'divider' + index} orientation="vertical" flexItem></Divider>
            <IconButton key={'delete' + index} onClick={() => this.handleAction({ row: item, index: index, action: 'delete' })} aria-label="delete">
              <DeleteForever key={'icon-delete' + index}></DeleteForever>
            </IconButton>
          </>
        }
      </>
    );
  }

  render() {
    let letter;
    return (
      <>
        <Stack spacing={1} direction='column'>
          <Stack justifyContent="space-between" direction='row'>
            <Stack direction="row" spacing={2}>
              {
                this.labelKeys.map((item, index) => (
                  <Chip key={'chip' + index} style={{ color: this.colors[index], borderColor: this.colors[index] }} variant="outlined" label={this.props.labels[item]}></Chip>
                ))
              }
            </Stack>
            {this.props.children}
          </Stack>
          <Box sx={{ maxHeight: "65vh", overflow: 'auto', padding: '8px' }}>
            <Grid container spacing={2} columnSpacing={2}>
              <Grid sx={{ padding: '12px' }} container spacing={2} columnSpacing={2}>
                {
                  this.props.dataSource.map((item, index) => {
                    let content;
                    if (letter !== item[this.labelKeys[0]].charAt(0).toUpperCase()) {
                      letter = item[this.labelKeys[0]].charAt(0).toUpperCase();
                      content = <Grid key={letter + '-' + index} item xs={12}>
                        <Divider>
                          <Chip label={letter}></Chip>
                        </Divider>
                      </Grid>;
                    }
                    return (
                      <>
                        {content}
                        <Grid key={index} item xs={(12 / this.props.column)}>
                          <AnimatePaper>
                            <Grid container spacing={1} justifyItems='stretch' alignItems='center'>
                              {this.renderItem(item)}
                              <Grid key={'function' + index} item>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
                                  {this.renderFunction(item, index)}
                                </Box>
                              </Grid>
                            </Grid>
                          </AnimatePaper>
                        </Grid>
                      </>
                    )
                  })
                }
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </>
    );
  }
}

export class RenderStorage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.dataSource ?? []
    }
  }

  renderLine(line) {
    return (
      ''
    );
  }

  render() {
    return (
      <Stack
        direction="column"
        divider={<Divider flexItem />}
      >
        {
          this.state.data.cells ?
            this.state.data.cells.map(item => {
              return this.renderLine(item);
            })
            :
            <TextField
              placeholder="Nhập số dãy"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AppRegistrationIcon />
                  </InputAdornment>
                ),
                endAdornment: (<InputAdornment onClick={(e) => { this.renderLine() }} position="end"><Login /></InputAdornment>)
              }}
              variant="standard"
              onChange={(e) => { this.lines = e.target.value }}
            />
        }
      </Stack>
    )
  }
}

export class CreateStorage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }

    this.lines = 0;
  }

  renderLine() {
    let initData = [];
    for (let i = 0; i < this.lines; i++) {
      initData.push(
        {
          bay: null,
          row: null,
          tier: null,
          inOut: null
        }
      )
    }
    this.setState({ data: initData })
  }

  render() {
    return (
      <Stack direction="column" justifyContent='center' justifyItems='center' alignItems='stretch' spacing={2}>
        {
          this.state.data.length === 0 ?
            <TextField
              placeholder="Nhập số dãy"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AppRegistrationIcon />
                  </InputAdornment>
                ),
                endAdornment: (<InputAdornment onClick={(e) => { this.renderLine() }} position="end"><Login /></InputAdornment>)
              }}
              variant="standard"
              onChange={(e) => { this.lines = e.target.value }}
            />
            :
            ''
        }
        {
          this.state.data.length !== 0 ?
            this.state.data.map((item, index) => {
              return (<CreateLine key={index} />)
            })
            :
            ''
        }
      </Stack>
    )
  }
}

function CreateLine(dataSource) {
  // const [data, setData] = useState(dataSource ?? {});
  const [laneCode, setLaneCode] = useState();
  const [bayCode, setBayCode] = useState();

  return (
    <Card>
      <CardContent>
        <Stack component="div" direction="row" spacing={1}>
          <TextField
            size="small"
            value={laneCode}
            helperText="Nhập mã dãy *(Bắt buộc)"
            InputLabelProps={{
              shrink: true,
            }}
            variant="standard"
            onChange={(e, value) => { setLaneCode(value) }}
          />
          <Divider orientation="vertical" />
          <TextField
            size="small"
            helperText="Nhập số hàng *(Bắt buộc)"
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
            value={bayCode}
            variant="standard"
            onChange={(e, value) => { setBayCode(value) }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

// --------------- start - content of terminal list ------------
export function TerminalList(props) {
  const item = [
    {
      name: "ICD PHUOC LONG 3",
      img: avatar
    },

  ];

  const handleListItemClick = (value) => {
    props.onSelected(value, props.dataName);
  };

  const closeDialog = () => {
    props.handleCloseDialog();
  };

  return (
    <Dialog
      open={props.terminalVisible}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle >Vui lòng chọn đơn vị đăng nhập</DialogTitle>
      <List sx={{ pt: 0, }}>
        {item.map((item) => (
          <ListItem
            style={{
              '.css-bshv44-MuiButtonBase-root-MuiListItem-root:hover': {
                backgroundColor: 'rgba(176,224,230, 0.55)',
              }
            }}
            onClick={() => handleListItemClick(item.name)}
            key={item.name}
          >
            <ListItemAvatar style={{ marginRight: '10px' }} >
              <Avatar src={item.img} alt="avatar" style={{ width: '105%' }} />
            </ListItemAvatar>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
      <DialogActions>
        <Button
          onClick={() => closeDialog()}
          variant="contained"
          sx={{
            marginLeft: "82%",
            marginTop: "2%",
          }}
        >Hủy</Button>
      </DialogActions>
    </Dialog>
  )
};
// --------------- end - content of terminal list ------------
// --------------- start - render custom transfer list ----------
export const MtransferList = (props) => {
  // const [leftList] = props
  // const [left, setLeft] = React.useState(leftList);
  // const [right, setRight] = React.useState([])

  return (
    <>
      <Paper>

      </Paper>
    </>
  );
}
// --------------- end - render custom transfer list ----------

//Binh(*note) - overrides CSS of the component
const theme = createTheme({
  components: {
    // Name of the component
    MuiPaper: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          cursor: "pointer",
          "&:hover": {
            backgroundColor: '#CFE8F3'
          }
        },
      },
    },
  },
});

export class BoxContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Paper
          elevation={6}
          sx={{ borderStyle: 'outset', marginBottom: "5px", marginLeft: "5px", width: "200px", height: "100px", borderRadius: "10px", position: "relative" }}
        >
          <Chip
            label={this.props.data.PalletNo}
            sx={{ position: "absolute", right: 0, bottom: 0 }}>
          </Chip>
          <div style={{ display: "flex", marginLeft: "10px" }} >
            <IconButton aria-label="box" size="large">
              <WidgetsIcon fontSize="inherit" />
            </IconButton>
            <div style={{ textAlign: "center", lineHeight: "center", marginTop: "10px" }}>
              <div style={{ textAlign: "left" }}> {this.props.data.label} </div>
              <div > {this.props.data.title} </div>
              <div > {this.props.data.content} </div>
            </div>
          </div>


        </Paper>
      </ThemeProvider>
    )
  }
}

export function DigitalClock(props) {
  const TimeIn = props.data;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalID = setInterval(() => {
      var seconds = Math.floor(Math.abs(new Date() - new Date(TimeIn)) / 1000)
      setTime(seconds);
    }, 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, [TimeIn]);

  const formatTime = (totalSeconds) => {
    var hour = Math.floor(totalSeconds / (60 * 60));
    var minute = Math.floor((totalSeconds - (hour * 3600)) / 60);
    var seconds = totalSeconds - ((hour * 3600) + (minute * 60));
    if (hour < 10)
      hour = "0" + hour;
    if (minute < 10)
      minute = "0" + minute;
    if (seconds < 10)
      seconds = "0" + seconds;
    return `${hour}h:${minute}ph`;
  };

  return (
    <Typography variant="h7" >
      {formatTime(time)}
    </Typography>

  );
}

export default DigitalClock;
