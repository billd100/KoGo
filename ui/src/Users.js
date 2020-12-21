import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        background: "#543855",
        padding: "20px 20px",
        marginLeft: "25px",
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    label: {
        fontSize: "1.25em",
        color: "#543855",
    },
    labelValue: {
        fontSize: "2.5em",
        color: "#e88d72",
    },
    tableHead: {
        color: "#543855",
    },
    userHeader: {
        fontSize: "1.5em",
        color: "#fff",
        marginBottom: "10px",
    },
    tableRow: {
        display: "table",
        width: "100%",
    }
}));

export default function BooksOverview(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.userHeader}>Users</div>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableBody>
                        {props.users.map((user) => (
                            <div>
                                <TableRow key={user.Id} className={classes.tableRow}>
                                    <TableCell component="th" scope="row">User Id</TableCell>
                                    <TableCell align="right">{user.Id}</TableCell>
                                </TableRow>

                                <TableRow key={user.Id} className={classes.tableRow}>
                                    <TableCell component="th" scope="row">Display Name</TableCell>
                                    <TableCell align="right">{user.DisplayName}</TableCell>
                                </TableRow>

                                <TableRow key={user.Id} className={classes.tableRow}>
                                    <TableCell component="th" scope="row">Email</TableCell>
                                    <TableCell align="right">{user.Email}</TableCell>
                                </TableRow>

                                <TableRow key={user.Id} className={classes.tableRow}>
                                    <TableCell component="th" scope="row">Device Id</TableCell>
                                    <TableCell align="right">{user.DeviceId}</TableCell>
                                </TableRow>
                            </div>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}