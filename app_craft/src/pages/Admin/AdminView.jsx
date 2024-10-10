import React, { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc} from "firebase/firestore";
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
            const accountsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

    const handleDelete = async (id) => {
        // Add confirmation for deletion
        const confirmDelete = window.confirm("Are you sure you want to delete this account?");
        if (!confirmDelete) {
            return; //if the user cancels, do ntg
        }

        try {
            // proceed with deletion if confirmed
            await deleteDoc(doc(db, "accounts", id));
            setAccounts(accounts.filter(account => account.id !== id));
            console.log("Account successfully deleted");
        } catch (error) {
            console.error("Error deleting account: ", error);
        }
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
                <AccountTable title="Member Accounts" 
                    accounts={memberAccounts}
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