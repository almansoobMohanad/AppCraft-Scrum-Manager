import React from "react";
import NavigationBar from "../../components/NavigationBar";
import './SprintBoard.css'; 

function SprintBoard() {
    return (
        <div className="sprintBoard-container"> {/* Apply the container class */}
            <NavigationBar />
            <div className="content"> {/* Apply the content class */}
                <h1 className="title">Sprint Board</h1> {/* Apply the title class */}
            </div>
        </div>
    );
}

export default SprintBoard;
