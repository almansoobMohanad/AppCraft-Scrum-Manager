import React, { useState } from "react";
import '../cssFiles/NavigationBar.css';
import accountIcon from '../assets/images/accountIcon.png'; // Adjust the path according to your file structure
import backlogIcon from '../assets/images/backlogIcon.png'; // Adjust the path according to your file structure
import kanbanIcon from '../assets/images/kanbanIcon.png'; // Adjust the path according to your file structure
import adminIcon from '../assets/images/adminIcon.png'; // Adjust the path according to your file structure

const NavigationBar = () => {
    const [activeItem, setActiveItem] = useState("Account"); // Default active item

    const handleItemClick = (e, item) => {
        e.preventDefault(); // Prevent page reload
        setActiveItem(item);
    };

    return (
            <header className="header">
                <div className="lightblue-bar"></div> {/* Light blue vertical bar */}
                <nav className="navbar">
                    <a 
                        href="/" 
                        className={`nav-item ${activeItem === "Account" ? "active" : ""}`}
                        onClick={(e) => handleItemClick(e, "Account")}
                    >
                        <img src={accountIcon} alt="Account Icon" className="nav-icon" />
                        <span>Account</span>
                    </a>
                    <a 
                        href="/" 
                        className={`nav-item ${activeItem === "Backlog" ? "active" : ""}`}
                        onClick={(e) => handleItemClick(e, "Backlog")}
                    >
                        <img src={backlogIcon} alt="Backlog Icon" className="nav-icon" />
                        <span>Backlog</span>
                    </a>
                    <a 
                        href="/" 
                        className={`nav-item ${activeItem === "Board" ? "active" : ""}`}
                        onClick={(e) => handleItemClick(e, "Board")}
                    >
                        <img src={kanbanIcon} alt="Kanban Board Icon" className="nav-icon" />
                        <span>Board</span>
                    </a>
                    <a 
                        href="/" 
                        className={`nav-item ${activeItem === "Admin" ? "active" : ""}`}
                        onClick={(e) => handleItemClick(e, "Admin")}
                    >
                        <img src={adminIcon} alt="Admin Icon" className="nav-icon" />
                        <span>Admin</span>
                    </a>
                </nav>
            </header>
    );
}

export default NavigationBar;