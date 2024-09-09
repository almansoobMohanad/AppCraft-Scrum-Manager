import React from "react";
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
import { retrieveTask } from '../services/tasksService.js';
import { db } from '../firebase/firebaseConfig.js';
import { getDocs, collection } from 'firebase/firestore';
import './TaskCardDetail.css';


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

const rows = []
const querySnapshot = await getDocs(collection(db, "tasks"));
    querySnapshot.forEach((doc) => {
        const data = createData(doc.data().name, doc.data().tags, doc.data().priority, doc.data().storyPoints);
        console.log(data);
        rows.push(data);
});

export default function CollapsibleTable() {
    return (
        <div className="TableContainer">
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <div className="TableHeader">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Task Name</TableCell>
                                <TableCell align="right">Tag</TableCell>
                                <TableCell align="right">Priority</TableCell>
                                <TableCell align="right">Story Point</TableCell>
                            </TableRow>
                        </TableHead>
                    </div>
                    <div className="TableBody">
                        <TableBody>
                            {rows.map((row) => (
                                <Row key={row.taskName} row={row} />
                            ))}
                        </TableBody>
                    </div>
                </Table>
            </TableContainer>
        </div>
    );
}
