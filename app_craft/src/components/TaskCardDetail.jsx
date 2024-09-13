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
import EditTaskOverlay from './EditTaskOverLay.jsx';
import TaskFilter from './TaskFilter'; // Import TaskFilter component
import localDB from '../LocalDatabase'; // Import the LocalDatabase module

function createData(taskName, tags, priority, storyPoints, databaseID, description, type, history, assignee) {

    console.log('this is triggered');

    return {
        taskName,
        tags,
        priority,
        storyPoints,
        priorityNum: priority === 'Low' ? 1 : priority === 'Medium' ? 2 : priority === 'Important' ? 3 : 4,
        history,
        databaseID,
        description,
        type,
        assignee
    };
}

function Row({ row, onDelete, onTaskClick }) {
    const [open, setOpen] = useState(false);

    const handleDelete = async (e) => {
        e.stopPropagation(); // Prevent row click when clicking delete
        await backEndDeleteTask(row.databaseID);
        onDelete(row.databaseID);
    };

    return (
        <React.Fragment>
            <TableRow
                className="custom-row"
                sx={{ '& > *': { borderBottom: 'unset' } }}
                onClick={() => onTaskClick(row)} // Make the row clickable
                style={{ cursor: 'pointer' }}  // Change cursor to pointer to indicate it's clickable
            >
                <TableCell>
                <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent row click when expanding
                            setOpen(!open);
                        }}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.taskName}
                </TableCell>
                <TableCell colSpan={4} className="task-details">
                    <div className="task-details-container">
                        <span className="task-detail">{row.tags}</span>
                        <span className="task-detail">{row.priority}</span>
                        <span className="task-detail">{row.storyPoints}</span>
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
        tags: PropTypes.string.isRequired,
        storyPoints: PropTypes.number.isRequired,
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
    onTaskClick: PropTypes.func.isRequired,  // Add prop validation for the new click handler
};

export default function CollapsibleTable() {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [filters, setFilters] = useState({
        tags: [],         // Filter for tags (empty array means no filter)
        priority: '',     // Filter for priority (empty string means no filter)
        storyPoints: null // Filter for story points (null means no filter)
    });
    const [isEditOverlayVisible, setEditOverlayVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedRows = [];
            const querySnapshot = await getDocs(collection(db, "tasks"));
            querySnapshot.forEach((doc) => {
                const data = createData(doc.data().name, doc.data().tags, doc.data().priority, doc.data().storyPoints, doc.id, doc.data().description, doc.data().type, doc.data().history, doc.data().assignee);
                fetchedRows.push(data);
            });
            setRows(fetchedRows);
        };

        async function fetchDataFromDB() {
            await localDB.updateData();
            let data = localDB.getData();
            setRows(data);
            setFilteredRows(data);
            console.log("content:", data, "length:", data.length);
        }

        // fetchData(); // this one is using the old Firebase module
        fetchDataFromDB(); // this one is using the new LocalDatabase module
    }, []);

    const handleDelete = (databaseID) => {
        setRows((prevRows) => prevRows.filter((row) => row.databaseID !== databaseID));
        setFilteredRows((prevRows) => prevRows.filter((row) => row.databaseID !== databaseID));
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setEditOverlayVisible(true);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const applyFilters = () => {
        let filtered = rows;

        if (filters.tags.length > 0) {
            filtered = filtered.filter(task => filters.tags.some(tag => task.tag.includes(tag)));
        }

        if (filters.priority) {
            filtered = filtered.filter(task => task.priority === filters.priority);
        }

        if (filters.storyPoints !== null) {
            filtered = filtered.filter(task => task.storyPoint === filters.storyPoints);
        }

        setFilteredRows(filtered);
    };

    useEffect(() => {
        applyFilters();
    }, [filters, rows]);

    return (
        <div className="TableContainer">
            <TaskFilter onFilterChange={handleFilterChange} />
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
                        {filteredRows.map((row) => (
                            <Row key={row.databaseID} row={row} onDelete={handleDelete} onTaskClick={handleTaskClick} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Conditionally render the EditTaskOverlay */}
            {isEditOverlayVisible && selectedTask && (
                <EditTaskOverlay
                    task={selectedTask}
                    onClose={() => setEditOverlayVisible(false)}
                    onSave={(updatedTask) => { /* Handle save logic here */ }}
                />
            )}
        </div>
    );
}