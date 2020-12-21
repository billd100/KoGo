import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import BooksTable from './BooksTable';
import BooksOverview from './BooksOverview';
import Users from './Users';
import DatabaseActions from './DatabaseActions';
import Error from './Error';

class MainContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            books: [],
            users: [],
            booksFinished: 0,
            booksInProgress: 0,
            bookCount: 0,
            totalTimeSpentReading: 0,

            databaseLocation: '',
            databaseConnectionErrors: [],
        };
    }

    componentDidMount() {
        fetch("/get-book-count")
            .then(res => res.json())
            .then(result => {
                this.setState({ bookCount: result.Count });
            })
            .catch((error) => {
                this.setState((prevState, props) => ({
                    databaseConnectionErrors: prevState.databaseConnectionErrors.concat("Error getting book count")
                }));
            });

        fetch("/get-books")
            .then(res => res.json())
            .then(res => {
                let booksFinished = 0;
                let booksInProgress = 0;
                let totalTimeSpentReading = 0;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].PercentRead === 100) {
                        booksFinished++;
                    } else {
                        booksInProgress++;
                    }

                    totalTimeSpentReading += res[i].TimeSpentReading;
                }
                this.setState({ books: res, booksFinished: booksFinished, booksInProgress: booksInProgress, totalTimeSpentReading: totalTimeSpentReading });
            })
            .catch((error) => {
                this.setState((prevState, props) => ({
                    databaseConnectionErrors: prevState.databaseConnectionErrors.concat("Error getting books")
                }));
            });

        fetch("/get-users")
            .then(res => res.json())
            .then(result => {
                this.setState({ users: result });
            })
            .catch((error) => {
                this.setState((prevState, props) => ({
                    databaseConnectionErrors: prevState.databaseConnectionErrors.concat("Error getting users")
                }));
            });
    }


    formatHours(totalSeconds) {
        let hours = totalSeconds / 60 / 60;
        let minutes = (hours - Math.trunc(hours)) * 60;
        if (hours < 1 && Math.floor(minutes) === 0) {
            return totalSeconds + "s";
        }
        return Math.trunc(hours) + "h" + " " + Math.round(minutes) + "m"
    }

    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <Typography component="div" style={{ height: '5vh' }} />
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <Users users={this.state.users} />
                    </Grid>
                    <Grid item xs={6}>
                        {this.state.databaseConnectionErrors.length > 0 &&
                            <Error errors={this.state.databaseConnectionErrors} />
                        }
                        <BooksOverview bookCount={this.state.bookCount} booksFinished={this.state.booksFinished} booksInProgress={this.state.booksInProgress} totalTimeSpentReading={this.state.totalTimeSpentReading} formatHours={this.formatHours} />
                        <Typography component="div" style={{ height: '5vh' }} />
                        <BooksTable books={this.state.books} formatHours={this.formatHours} />
                    </Grid>
                    <Grid item xs={3}>
                        <DatabaseActions />
                    </Grid>
                </Grid>
            </React.Fragment>
        );

    }

}

export default MainContainer;