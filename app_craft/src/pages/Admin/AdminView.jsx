import React, { useState } from "react";
import NavigationBar from "../../components/NavigationBar";
import CreateAccount from "./component/CreateAccount";
import './AdminView.css'; 

function AdminView() {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

    const toggleOverlay = () => {
        setIsOverlayVisible(!isOverlayVisible);
    };

    return (
        <div className="adminView-container">
            <NavigationBar />
            <div className="content">
                <h1 className="title">Admin View</h1>
                <button className="green-button" onClick={toggleOverlay}>Create Account</button>
                {isOverlayVisible && <CreateAccount onClose={toggleOverlay} />}
            </div>
        </div>
    );
}

export default AdminView;