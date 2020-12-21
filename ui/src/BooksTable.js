import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function BooksTable(props) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="right">Author</TableCell>
            <TableCell align="right">Hours Read</TableCell>
            <TableCell align="right">Percent Read</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.books.map((book) => (
            <TableRow key={book.Title}>
              <TableCell component="th" scope="row">
                {book.PercentRead === 100 ? <span>{book.Title}</span> : <span>{book.Title}</span>}
              </TableCell>
              <TableCell align="right">{book.Author}</TableCell>
              <TableCell align="right">{props.formatHours(book.TimeSpentReading)}</TableCell>
              <TableCell align="right">{book.PercentRead}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}