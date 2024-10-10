import React, { useState } from "react";
import '../css/TimeRangeFilter.css';

function TimeRangeFilter({ onConfirm }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleConfirm = () => {
        // Pass the selected date range back to the parent component for further action
        onConfirm(startDate, endDate);
    };

    return (
        <div className="time-range-filter">
            <label htmlFor="startDate">From:</label>
            <input 
                type="date" 
                id="startDate" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
            />
            <label htmlFor="endDate">To:</label>
            <input 
                type="date" 
                id="endDate" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
            />
            <button onClick={handleConfirm}>Confirm</button>
        </div>
    );
}

export default TimeRangeFilter;
