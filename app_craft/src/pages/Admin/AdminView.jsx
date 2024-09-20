import React from "react";
import NavigationBar from "../../components/NavigationBar";
import './AdminView.css'; 

function AdminView() {
    return (
        <div className="adminView-container"> {/* Apply the container class */}
            <NavigationBar />
            <div className="content"> {/* Apply the content class */}
                <h1 className="title">Admin View</h1> {/* Apply the title class */}
            </div>
        </div>
    );
}

export default AdminView;
