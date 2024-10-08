import React, { useState } from 'react';
import './LoginPage.css';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig.js';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accounts = await fetchAccounts();
            const account = accounts.find(acc => acc.username === username && acc.password === password);
            if (account) {
                console.log('Login successful');
                // onLogin(); // Call the onLogin prop
                navigate('/app'); // Navigate to the App page
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            console.error('Error fetching accounts:', error);
            setError('An error occurred while logging in');
        }
    };

    const fetchAccounts = async () => {
        const accountsList = [];
        const accountsSnapshot = await getDocs(collection(db, 'accounts'));
        accountsSnapshot.forEach((doc) => {
            accountsList.push({ id: doc.id, ...doc.data() });
        });
        return accountsList;
    };

    return (
        <div className="login-page-container">
            <div className="login-page-box">
                <h1>Welcome to Meow Meow!</h1>
                <p>Please log in to access your account</p>
                <form onSubmit={handleSubmit}>
                    <div className="login-page-form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                        />
                    </div>
                    <div className="login-page-form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    {error && <div className="login-page-error">{error}</div>}
                    <button type="submit" className="login-page-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;