import React from "react";
import NavigationBar from "../../components/NavigationBar";
import './AccountPage.css'; ;

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
