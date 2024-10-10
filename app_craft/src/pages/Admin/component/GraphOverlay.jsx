import React from "react";
import { useState , useEffect } from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import '../css/GraphOverlay.css'; // Create and import a CSS file for styling if needed
import { plugins, Ticks } from "chart.js";

function GraphOverlay({ onClose, selectedAccount }) {
    const [labels, setLabels] = useState([]);
    const [hoursSpent, setHoursSpent] = useState([]);

    useEffect(() => {
        const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const hoursSpent = [5, 10, 15, 20, 25, 30, 35];

        setLabels(labels);
        setHoursSpent(hoursSpent);

    }, [hoursSpent, labels]);

    const data = {
        labels: labels,
        datasets: [
            {
                data: hoursSpent,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className="graph-overlay">
            <div className="graph-container">
                <button className="overlay-close"onClick={onClose}>Close</button>
                <h2>Hours Spent</h2>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}

GraphOverlay.prototype = {
    onClose: PropTypes.func.isRequired,
    selectedAccount: PropTypes.object,
};

export default GraphOverlay;