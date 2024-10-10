import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai"; // Import the cross icon
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig"; // Import Firebase auth and Firestore
import '../css/CreateAccount.css'; 

function CreateAccount({ onClose }) {
    const [accountData, setAccountData] = useState({ email: "", password: "", isAdmin: false });
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
            // Register the user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, accountData.email, accountData.password);
            const user = userCredential.user;

            // Add user details to Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: accountData.email,
                password: accountData.password, // Storing passwxord directly is not recommended
                isAdmin: accountData.isAdmin,
                logTimeSpent: 0,
                averageLogTime: 0,

            });

            console.log("Account created successfully");
            onClose(); // Close the form
        } catch (error) {
            console.error("Error creating account:", error);
            setError("Error creating account. Please try again.");
        }
    };

    return (
        <div className="overlay-create-account">
            <div className="create-account-container">
                <div className="create-account-box">
                    <button className="close-button" onClick={onClose}>
                        <AiOutlineClose />
                    </button>
                    <h2>Create Account</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={accountData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={accountData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="isAdmin">Admin:</label>
                            <input
                                type="checkbox"
                                id="isAdmin"
                                name="isAdmin"
                                checked={accountData.isAdmin}
                                onChange={handleChange}
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <button type="submit" className="create-account-button">Create Account</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateAccount;