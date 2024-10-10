import React from "react";
import { addDoc, collection, getFirestore, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig.js";

/** 
 *This file is responsible for handling sprint data in the Firestore database. 
 *It includes functions to create a new sprint and edit various details of an existing sprint. 
 *The functions utilize Firebase Firestore to perform CRUD operations on the sprint documents.
 */


/**
 * Creates a new sprint document in the "sprints" collection.
 * 
 * @param {Object} sprintData - The data for the new sprint.
 * @returns {Promise<string>} - The ID of the created sprint document.
 * @throws {Error} - Throws an error if the sprint creation fails.
 */
export default async function createSprint(sprintData) {
    try {
        const docRef = await addDoc(collection(db, "sprints"), sprintData);
        console.log("Sprint created with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding sprint: ", error);
        throw new Error(error.message);
    }
};

/**
 * Deletes a sprint document from the "sprints" collection.
 * 
 * @param {string} sprintId - The ID of the sprint to delete.
 * @throws {Error} - Throws an error if the sprint deletion fails.
 */
export async function deleteSprint(sprintId) {
    try {
        const sprintDocRef = doc(db, "sprints", sprintId);  // Locate the sprint by ID
        await deleteDoc(sprintDocRef);  // Delete the document
        console.log(`Sprint with ID ${sprintId} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting sprint:", error);
    }
}

/**
 * Provides functions to edit various details of an existing sprint document.
 * 
 * @param {string} sprintID - The ID of the sprint document to edit.
 * @returns {Object} - An object containing functions to edit the sprint details.
 */
export function editSprintDetails(sprintID) {
    const sprintRef = doc(db, 'sprints', sprintID);

    const changeName = async (newName) => {
        await setDoc(sprintRef, { name: newName }, { merge: true });
    };

    const changeStartDate = async (newStartDate) => {
        await setDoc(sprintRef, { startDate: newStartDate }, { merge: true });
    };

    const changeEndDate = async (newEndDate) => {
        await setDoc(sprintRef, { endDate: newEndDate }, { merge: true });
    };

    const changeReference = async (newReference) => {
        await setDoc(sprintRef, { reference: newReference }, { merge: true });
    };

    const changeOwner = async (newOwner) => {
        await setDoc(sprintRef, { productOwner: newOwner }, { merge: true });
    };

    const changeMaster = async (newMaster) => {
        await setDoc(sprintRef, { scrumMaster: newMaster }, { merge: true });
    };

    const changeMembers = async (newMembers) => {
        await setDoc(sprintRef, { members: newMembers}, { merge: true })
    }

    const changeTasks = async (newTasks) => {
        await setDoc(sprintRef, { tasks: newTasks }, { merge: true });
    }

    const changeStatus = async (newStatus) => {
        const validStatuses = ['Not Started', 'Active', 'Comepleted'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error(`Invalid status: ${newStatus}. Status must be one of ${validStatuses.join(', ')}.`);
        }
        await setDoc(sprintRef, { status: newStatus }, { merge: true });
    };

    return {
        changeName,
        changeStartDate,
        changeEndDate,
        changeReference,
        changeOwner,
        changeMaster,
        changeMembers,
        changeTasks,
        changeStatus,

    }
}

// fetching sprints from the server
export async function fetchSprints() {
    const sprintsList = [];
    const sprintsSnapshot = await getDocs(collection(db, 'sprints'));
    sprintsSnapshot.forEach((doc) => {
        sprintsList.push({ id: doc.id, ...doc.data() });
    });
    return sprintsList;
}

/**
 * Fetch tasks from a specific sprint
 * 
 * @param {string} sprintId - The ID of the sprint
 * @returns {Array} - The tasks within the sprint
 */
export async function fetchTasksInSprint(sprintId) {
    try {
        const sprintRef = doc(db, "sprints", sprintId);
        const sprintSnap = await getDoc(sprintRef);

        if (sprintSnap.exists()) {
            const sprintData = sprintSnap.data();
            const tasks = sprintData.tasks || []; //tasks are stored in an array right...? yes... yes they are
            console.log("Tasks in sprint:", tasks);
            return tasks;
        } else {
            console.log("No such sprint found!");
        }
    } catch (error) {
        console.error("Error fetching tasks in sprint:", error);
    }
}

// Function to fetch users from Firestore
export async function fetchUsers() {
    const usersList = [];
    const usersSnapshot = await getDocs(collection(db, 'users'));
    usersSnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
    });
    return usersList;
}
