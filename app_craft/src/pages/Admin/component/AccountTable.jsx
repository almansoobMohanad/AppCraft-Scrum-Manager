import React, { useState } from "react";
import PropTypes from "prop-types";
import '../css/AccountTable.css'; // Create and import a CSS file for styling if needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // run this: npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function AccountTable({ title, accounts, onDelete, graph, changePassword }) {
    const [passwordVisibility, setPasswordVisibility] = useState({});

    const togglePasswordVisibility = (index) => {
        setPasswordVisibility((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    return (
        <div className="account-table">
            <h2>{title}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Log Time Spent</th>
                        <th>Average Log Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account, index) => (
                        <tr key={index}>
                            {/* Username */}
                            <td className="username-column">{account.email}</td> 

                            {/* Password */}
                            <td className="password-column">
                                <div className="password-container">
                                    <span>
                                        {passwordVisibility[index] ? account.password : "*".repeat(10)}
                                    </span>
                                    <FontAwesomeIcon
                                        icon={passwordVisibility[index] ? faEye : faEyeSlash}
                                        onClick={() => togglePasswordVisibility(index)}
                                    />
                                </div>
                            </td>

                            {/* Log Time Spent */}
                            <td className="time-spent-column">{account.logTimeSpent}</td>

                            {/* Average Log Time */}
                            <td className="average-column">{account.averageLogTime}</td>

                            {/* Action */}
                            <td className="buttons-column">
                                <button 
                                    className="change-password-button"
                                    onClick={() => changePassword(account.id)}
                                >
                                    Change Password
                                </button>
                                <button 
                                    className="show-graph-button" 
                                    onClick={() => graph(account)}
                                >
                                    Graph
                                </button>
                                <button 
                                    className="delete-button" 
                                    onClick={() => onDelete(account.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

AccountTable.propTypes = {
    title: PropTypes.string.isRequired,
    accounts: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            isAdmin: PropTypes.bool.isRequired,
        })
    ).isRequired,
    onDelete: PropTypes.func.isRequired,
    graph: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
};

export default AccountTable;