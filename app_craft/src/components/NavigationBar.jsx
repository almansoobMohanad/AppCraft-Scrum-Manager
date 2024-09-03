import React from "react";
import './NavigationBar.css';
import accountIcon from '../assets/images/accountIcon.png';

const NavigationBar = () => {
    return (
        <header className="header">
            <nav className="navbar">
                <a href="/" className="nav-item active">
                <img src={accountIcon} alt="Account Icon" className="nav-icon" />
                <span>Account</span>
                </a>
                <a href="/" className="nav-item">
                    Backlog
                </a>
                <a href="/" className="nav-item">
                    Board
                </a>
                <a href="/" className="nav-item">
                    Admin
                </a>
            </nav>
        </header>
    );
}

export default NavigationBar;
