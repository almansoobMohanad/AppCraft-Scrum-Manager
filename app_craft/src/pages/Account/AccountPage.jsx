import React from "react";
import NavigationBar from "../../components/NavigationBar";
import './AccountPage.css';
import changeDetails from './changeDetails.jsx'; // import the things to change the details of the account

function AccountPage() {
    return (
        <div className="accountPage-container"> {/* Apply the container class */}
            <NavigationBar />
            <div className="content"> {/* Apply the content class */}
                <h1 className="title">Account Page</h1> {/* Apply the title class just for now!!! */}
            </div>
        </div>
    );
}

export default AccountPage;
