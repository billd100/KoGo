import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        background: "#543855",
        padding: "20px 20px",
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
}));

export default function BooksOverview(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <div className={classes.label}>Books In Database</div>
                        <div className={classes.labelValue}>{props.bookCount}</div>
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <div className={classes.label}>Books Finished</div>
                        <div className={classes.labelValue}>{props.booksFinished}</div>
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <div className={classes.label}>Books In Progress</div>
                        <div className={classes.labelValue}>{props.booksInProgress}</div>
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <div className={classes.label}>Total Time Spent Reading</div>
                        <div className={classes.labelValue}>{props.formatHours(props.totalTimeSpentReading)}</div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}