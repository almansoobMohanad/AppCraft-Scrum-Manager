import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BurndownChart({ sprintId }) {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchSprintData = async () => {
            if (sprintId) {
                const sprintRef = doc(db, 'sprints', sprintId);
                const sprintSnapshot = await getDoc(sprintRef);
                if (sprintSnapshot.exists()) {
                    const sprintData = sprintSnapshot.data();
                    setTasks(sprintData.tasks || []);
                }
            }
        };

        fetchSprintData();
    }, [sprintId]);

    const totalStoryPoints = tasks.reduce((acc, task) => acc + parseInt(task.storyPoints), 0);
    const completedStoryPoints = tasks
        .filter((task) => task.status === 'Completed')
        .reduce((acc, task) => acc + parseInt(task.storyPoints), 0);

    const data = {
        labels: ['Total Story Points', 'Completed Story Points'],
        datasets: [
            {
                label: 'Story Points',
                data: [totalStoryPoints, completedStoryPoints],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="burndown-chart-container">
            <h3>Burndown Chart</h3>
            <Bar data={data} options={options} />
        </div>
    );
}

export default BurndownChart;