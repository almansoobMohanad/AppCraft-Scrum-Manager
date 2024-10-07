import React from "react";
import PropTypes from "prop-types";
import '../css/AccountTable.css'; // Create and import a CSS file for styling if needed

function AccountTable({ title, accounts }) {
    return (
        <div className="account-table">
            <h2>{title}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account, index) => (
                        <tr key={index}>
                            <td>{account.username}</td>
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
            username: PropTypes.string.isRequired,
            isAdmin: PropTypes.bool.isRequired,
        })
    ).isRequired,
};

export default AccountTable;