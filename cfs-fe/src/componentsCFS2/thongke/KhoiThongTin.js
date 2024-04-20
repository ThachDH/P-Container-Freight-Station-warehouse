import PropTypes from 'prop-types';

// material-ui
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
// assets
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// import TreeItem from '@mui/lab/TreeItem';
// import TreeView from '@mui/lab/TreeView';
// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const KhoiThongTin = (props) => {
    const { color, title, count, percentage, isLoss, unit } = props;
    return (
        <Box >
            <Stack spacing={0.5}>
                <Typography variant="h6" >
                    {title}
                </Typography>
                <Grid container alignItems="center">
                    <Grid item >
                        <Stack direction={'row'} spacing={1}>
                            <Typography variant="h4" color="inherit">
                                {count}
                            </Typography>
                            <Typography variant='h6' color='inherit' >
                                {unit}
                            </Typography>

                            {percentage ? (
                                <Grid item>
                                    <Chip
                                        variant="combined"
                                        color={color}
                                        icon={
                                            isLoss ?
                                                <FallOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} /> :
                                                <RiseOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />
                                        }
                                        label={`${percentage}%`}
                                        sx={{ ml: 1.25, pl: 1 }}
                                        size="small"
                                    />
                                </Grid>
                            ) : ""}

                        </Stack>

                    </Grid>
                </Grid>
            </Stack>

        </Box>)
};

KhoiThongTin.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    count: PropTypes.string,
    percentage: PropTypes.number,
    isLoss: PropTypes.bool,
};

KhoiThongTin.defaultProps = {
    color: 'primary'
};

export default KhoiThongTin;
