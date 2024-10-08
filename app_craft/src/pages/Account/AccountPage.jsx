import React, { useState } from "react";
import NavigationBar from "../../components/NavigationBar";
import './AccountPage.css';
import changeDetails from './components/accountsDatabaseLogic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // run this: npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function AccountPage() {
    const [username, setUsername] = useState("User123");
    const [password, setPassword] = useState("Abcdefg1!");

    // States for handling new password input
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false); // For the new password visibility
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Password validation logic
    const validatePassword = (password) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#<>]{8,}$/;
        return strongPasswordRegex.test(password);
    };

    // Handle the password change
    const handleChangePassword = async () => {
        if (!validatePassword(newPassword)) {
            setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
            setSuccess(""); // Clear success message
            return;
        }

        try {
            const accountId = "dummyAccountId"; // Replace with actual account ID
            const account = await changeDetails(accountId);
            await account.changePassword(newPassword);
            setError(""); // Clear any previous errors
            setSuccess("Password changed successfully!"); // Show success message
            setPassword(newPassword);
        } catch (err) {
            console.error("Error changing password:", err);
            setError("Failed to change password. Please try again.");
            setSuccess(""); // Clear success message
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => setShowPassword((prevState) => !prevState);

    // Toggle new password visibility
    const toggleNewPasswordVisibility = () => setShowNewPassword((prevState) => !prevState);

    return (
        <div className="accountPage-container">
            <NavigationBar />
            <div className="content">
                <h1 className="title">Account Page</h1>

                {/* Display Username */}
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" value={username} readOnly /> {/* Username is not editable */}
                </div>

                {/* Display Password with toggle eye icon */}
                <div className="form-group password-field">
                    <label>Password</label>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}  // Toggle between text and password
                            value={password}
                            readOnly
                        />
                        <span className="toggle-password-icon" onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} /> {/* Icon switch */}
                        </span>
                    </div>
                </div>

                <div className="form-group password-field">
                    <label>New Password</label>
                    <div className="password-input-container">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                        <span className="toggle-password-icon" onClick={toggleNewPasswordVisibility}>
                            <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} /> {/* Icon switch for new password */}
                        </span>
                    </div>
                </div>

                {/* Error Message */}
                {error && <p style={{ color: "red" }}>{error}</p>}
                
                {/* Success Message */}
                {success && <p style={{ color: "green" }}>{success}</p>}

                {/* Button to change password */}
                <button className="change-password-button" onClick={handleChangePassword}>Change Password</button>
            </div>
        </div>
    );
}

export default AccountPage;


