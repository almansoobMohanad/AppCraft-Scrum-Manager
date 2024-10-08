import { addDoc, collection, getFirestore, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig.js";

const changeDetails = async (accountId) => {
    const account = doc(db, 'accounts', accountId);

    const changeUserName = async (newUserName) => {
        await setDoc(account, { username: newUserName }, { merge: true });
    };

    const changePassword = async (newPassword) => {
        await setDoc(account, { password: newPassword }, { merge: true });
    };

    const changeRoles = async (newRoles) => {
        await setDoc(account, { roles: newRoles }, { merge: true });
    };

    const changeContributionTime = async (newLogTime) => {
        await setDoc(account, { logTime: newLogTime }, { merge: true });
    };

    const changeContributionTimeHistory = async (newLogTimeHistory) => {
        await setDoc(account, { logTimeHistory: newLogTimeHistory }, { merge: true });
    };

    return { 
        changeUserName, 
        changePassword, 
        changeRoles,
        changeContributionTime,
        changeContributionTimeHistory
    };
}

export default changeDetails;