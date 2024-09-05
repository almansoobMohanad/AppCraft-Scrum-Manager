import React from "react";
import { getDatabase, ref, child, get } from "firebase/database";
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';



const dbRef = ref(getDatabase());

// change `tasks/${taskId}` to the path of the task you want to get

get(child(dbRef, `tasks/${taskId}`)).then((snapshot) => {
    if (snapshot.exists()) {
        console.log(snapshot.val());
        createData('Dummy Task 1', "Front-end", "Low", 10) // replace this with the data you get from the database
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error(error);
});

function createData(taskName, tag, priority, storyPoint) {
    return {
        taskName,
        tag,
        priority,
        storyPoint,
        history: [
            {
                date: '2020-01-05',
                changedBy: '11091700',
            },
            {
                date: '2020-01-02',
                changedBy: 'Anonymous',
            },
        ],
    };
}

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>
            <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
            >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">
            {row.taskName}
            </TableCell>
            <TableCell align="right">{row.tag}</TableCell>
            <TableCell align="right">{row.priority}</TableCell>
            <TableCell align="right">{row.storyPoint}</TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                    History
                </Typography>
                <Table size="small" aria-label="purchases">
                    <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Changed By</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {row.history.map((historyRow) => (
                        <TableRow key={historyRow.date}>
                        <TableCell component="th" scope="row">
                            {historyRow.date}
                        </TableCell>
                        <TableCell>{historyRow.changedBy}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </Box>
            </Collapse>
            </TableCell>
        </TableRow>
        </React.Fragment>
    );
    }

    Row.propTypes = {
    row: PropTypes.shape({
        tag: PropTypes.number.isRequired,
        storyPoint: PropTypes.number.isRequired,
        priority: PropTypes.number.isRequired,
        history: PropTypes.arrayOf(
        PropTypes.shape({
            changedBy: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
        }),
        ).isRequired,
        taskName: PropTypes.string.isRequired
    }).isRequired,
    };

    // need to make logic to get data from database and place it as an array in rows

    const rows = [
    createData('Dummy Task 1', "Front-end", "Low", 10),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
    createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
    createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
    createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
    ];

    export default function CollapsibleTable() {
    return (
        <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
            <TableHead>
            <TableRow>
                <TableCell />
                <TableCell>Task Name</TableCell>
                <TableCell align="right">Tag</TableCell>
                <TableCell align="right">Priority</TableCell>
                <TableCell align="right">Story Point</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <Row key={row.taskName} row={row} />
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}
