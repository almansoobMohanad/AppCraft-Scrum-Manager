import React, { useState, useEffect } from "react";
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
import { db } from '../firebase/firebaseConfig.js';
import { getDocs, collection, onSnapshot, doc } from 'firebase/firestore';
import './TaskCardDetail.css';
import backEndDeleteTask from './backEndDeleteTask'; // Corrected import path
import DeleteTaskButton from "./DeleteTaskButton.jsx";

function createData(taskName, tag, priority, storyPoint, databaseID) {
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
        databaseID,
    };
}

function Row({ row, onDelete }) {
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        await backEndDeleteTask(row.databaseID);
        onDelete(row.databaseID);
    };

    return (
        <React.Fragment>
            <TableRow className="custom-row" sx={{ '& > *': { borderBottom: 'unset' } }}>
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
                <TableCell colSpan={4} className="task-details">
                    <div className="task-details-container">
                        <span className="task-detail">{row.tag}</span>
                        <span className="task-detail">{row.priority}</span>
                        <span className="task-detail">{row.storyPoint}</span>
                        <DeleteTaskButton className="delete-button" onClick={handleDelete}></DeleteTaskButton>
                    </div>
                </TableCell>
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
        tag: PropTypes.string.isRequired,
        storyPoint: PropTypes.number.isRequired,
        priority: PropTypes.string.isRequired,
        history: PropTypes.arrayOf(
            PropTypes.shape({
                changedBy: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }),
        ).isRequired,
        taskName: PropTypes.string.isRequired,
        databaseID: PropTypes.string.isRequired,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default function CollapsibleTable() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            do {
                const querySnapshot = await getDocs(collection(db, "tasks"));
                const fetchedRows = [];
                querySnapshot.forEach((doc) => {
                    const data = createData(doc.data().name, doc.data().tags, doc.data().priority, doc.data().storyPoints, doc.id);
                    fetchedRows.push(data);
                });
                setRows(fetchedRows);
            } while (true);
        };

        fetchData();
    }, []);

    const handleDelete = (databaseID) => {
        setRows((prevRows) => prevRows.filter((row) => row.databaseID !== databaseID));
    };

    return (
        <div className="TableContainer">
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead className="table-head">
                        <TableRow>
                            <TableCell />
                            <TableCell>Task Name</TableCell>
                            <TableCell colSpan={4} className="task-details">
                                <div className="task-details-container">
                                    <span className="task-detail">Tag</span>
                                    <span className="task-detail">Priority</span>
                                    <span className="task-detail">Story Point</span>
                                    <span className="task-detail">_______</span> {/* Empty span for alignment */}
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <Row key={row.databaseID} row={row} onDelete={handleDelete} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}