import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Input from '@material-ui/core/Input';

const useStyles = makeStyles((theme) => ({
    root: {
        background: "#543855",
        marginRight: "25px",
        padding: "20px",
        '& > *': {
            margin: theme.spacing(1),
        },
        width: "inherit",
    },
    dbBackup: {
        background: "#e88d72",
        color: "#543855",
        fontWeight: "900",
    },
    container: {
        background: "#fff",
        padding: "20px",

    }
}));

export default function DatabaseActions(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.container}>
                <Button variant="contained" color="primary">Register Device</Button>
                <Typography component="div" style={{ height: '1vh' }} />
                <div>Perform an offline "registration" of your Kobo device. Kobo requires a user be present in order to use the device. This creates that user. Updates will be reflected in the Users panel.</div>
            </Container>

            <Container maxWidth="lg" className={classes.container}>
                <Button disabled variant="contained" className={classes.dbBackup}>Backup Database</Button>
                <Typography component="div" style={{ height: '1vh' }} />
                <div>Create a backup of KoboReader.sqlite, the database for books and reading activity.</div>
            </Container>
        </div >
    );
}