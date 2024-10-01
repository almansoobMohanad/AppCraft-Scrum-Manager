import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig.js";

/**
 * Creates a new account document in the "accounts" collection.
 * 
 * @param {Object} accountData - The data for the new account.
 * @returns {Promise<string>} - The ID of the created account document.
 * @throws {Error} - Throws an error if the account creation fails.
 */
export default async function createAccount(accountData) {
    const { username, password } = accountData;

    // Server-side password validation
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#<>]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
        throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
    }

    // Check if username already exists
    const q = query(collection(db, "accounts"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        throw new Error("Username already exists. Please choose a different username.");
    }

    try {
        const docRef = await addDoc(collection(db, "accounts"), accountData);
        console.log("Account created with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding account: ", error);
        throw new Error(error.message);
    }
};