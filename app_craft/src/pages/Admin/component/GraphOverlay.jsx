import React from "react";
import PropTypes from "prop-types";

function GraphOverlay({ onClose, selectedAccount }) {
    return (
        <div className="graph-overlay">
            <div className="graph-container">
                <h2>Graph for Member : {selectedAccount.username}</h2>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

GraphOverlay.prototype = {
    onClose: PropTypes.func.isRequired,
    selectedAccount: PropTypes.object,
};

export default GraphOverlay;