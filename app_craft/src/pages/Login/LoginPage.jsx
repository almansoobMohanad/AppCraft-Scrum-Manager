import React, { useState } from 'react';
import './LoginPage.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig.js'; // Import Firebase auth
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState(''); // Renamed to email
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Email:', email); // Log email
        console.log('Password:', password); // Log password
        console.log('Firebase Auth:', auth); // Log Firebase auth object
        try {
            // Use Firebase Authentication to log in with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            navigate('/app'); // Navigate to the App page
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Invalid email or password');
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-page-box">
                <h1>Welcome to Meow Meow!</h1>
                <p>Please log in to access your account</p>
                <form onSubmit={handleSubmit}>
                    <div className="login-page-form-group">
                        <label htmlFor="email">Email:</label> {/* Updated label */}
                        <input
                            type="email" // Updated type to email
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
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