import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../../firebase/firebaseConfig'; // Firestore config
import NavigationBar from "../../components/NavigationBar";
import CreateAccount from "./component/CreateAccount";
import AccountTable from "./component/AccountTable"; // Import the new component
import './AdminView.css'; 

function AdminView() {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "accounts"), (snapshot) => {
            const accountsData = snapshot.docs.map(doc => doc.data());
            setAccounts(accountsData);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const toggleOverlay = () => {
        setIsOverlayVisible(!isOverlayVisible);
    };

    const handleAccountCreation = (newAccount) => {
        setAccounts([...accounts, newAccount]);
        setIsOverlayVisible(false);
    };

    const adminAccounts = accounts.filter(account => account.isAdmin);
    const memberAccounts = accounts.filter(account => !account.isAdmin);

    return (
        <div className="adminView-container">
            <NavigationBar />
            <div className="content">
                <h1 className="title">Admin View</h1>
                <button className="green-button" onClick={toggleOverlay}>Create Account</button>
                {isOverlayVisible && <CreateAccount onClose={toggleOverlay} onCreate={handleAccountCreation} />}
                <AccountTable title="Admin Accounts" accounts={adminAccounts} />
                <AccountTable title="Member Accounts" accounts={memberAccounts} />
            </div>
        </div>
    );
}

export default AdminView;