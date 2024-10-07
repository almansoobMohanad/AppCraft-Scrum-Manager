import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai"; // Import the cross icon
import createAccount from "../DatabaseFiles/accountDatabaseLogic";
import '../css/CreateAccount.css'; 

function CreateAccount({ onClose }) {
    const [accountData, setAccountData] = useState({ username: "", password: "", isAdmin: false });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAccountData({
            ...accountData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const validatePassword = (password) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#<>]{8,}$/;
        return strongPasswordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword(accountData.password)) {
            setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
            return;
        }
        try {
            await createAccount(accountData);
            setError(""); // Reset error state on successful account creation
            alert("Account created successfully!");
            onClose();
        } catch (err) {
            console.error("Error creating account:", err); // Log the error
            setError(err.message);
        }
    };

    return (
        <div className="overlay-create-account">
            <div className="createAccountForm-container">
                <AiOutlineClose className="close-button" onClick={onClose} /> {/* Use the cross icon */}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input type="text" name="username" value={accountData.username} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" name="password" value={accountData.password} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>
                            <input type="checkbox" name="isAdmin" checked={accountData.isAdmin} onChange={handleChange} />
                            Is Admin
                        </label>
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit">Create Account</button>
                </form>
            </div>
        </div>
    );
}

export default CreateAccount;