import React, { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from '../../firebase/firebaseConfig'; // Firestore config
import NavigationBar from "../../components/NavigationBar";
import CreateAccount from "./component/CreateAccount";
import AccountTable from "./component/AccountTable"; // Import the new component
import TimeRangeFilter from "./component/TimeRangeFilter"; // Import the TimeRangeFilter component
import './AdminView.css'; 

function AdminView() {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [timeRange, setTimeRange] = useState({ start: "", end: "" });

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersData);
            setFilteredAccounts(accountsData);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const toggleOverlay = () => {
        setIsOverlayVisible(!isOverlayVisible);
    };

    const handleAccountCreation = (newUser) => {
        setUsers([...users, newUser]);
        setIsOverlayVisible(false);
    };

    const handleDelete = async (id) => {
        // Add confirmation for deletion
        const confirmDelete = window.confirm("Are you sure you want to delete this account?");
        if (!confirmDelete) {
            return; // If the user cancels, do nothing
        }

        try {
            // Proceed with deletion if confirmed
            await deleteDoc(doc(db, "users", id));
            setUsers(users.filter(user => user.id !== id));
            setFilteredAccounts(filteredAccounts.filter(account => account.id !== id));
            console.log("Account successfully deleted");
        } catch (error) {
            console.error("Error deleting account: ", error);
        }
    };

    const handleTimeRangeConfirm = (start, end) => {
        setTimeRange({ start, end });
        // For now, this is just a mockup - you'd filter accounts based on the time range in your real implementation
        console.log("Time range selected: ", start, end);
    };

    const adminUsers = users.filter(user => user.isAdmin);
    const memberUsers = users.filter(user => !user.isAdmin);

    return (
        <div className="adminView-container">
            <NavigationBar />
            <div className="content">
                <h1 className="title">Admin View</h1>

                {/* Create Account Button */}
                <button className="green-button" onClick={toggleOverlay}>Create Account</button>
                {isOverlayVisible && <CreateAccount onClose={toggleOverlay} onCreate={handleAccountCreation} />}

                {/* Time Range Filter */}
                <TimeRangeFilter onConfirm={handleTimeRangeConfirm} />
                

                {/* Member Accounts Table */}
                <AccountTable 
                    title="Member Accounts" 
                    accounts={memberUsers}
                    onDelete={handleDelete}
                    // Add the props for handling things like changing password and graph
                    graph={null}
                    changePassword={null}
                />
            </div>
        </div>
    );
}

export default AdminView;