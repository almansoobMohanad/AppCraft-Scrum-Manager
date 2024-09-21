import React from "react";
import { addDoc, collection, getFirestore, doc, setDoc } from "firebase/firestore";
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
 * Provides functions to edit various details of an existing sprint document.
 * 
 * @param {string} sprintID - The ID of the sprint document to edit.
 * @returns {Object} - An object containing functions to edit the sprint details.
 */
export function editSprintDetails(sprintID) {
    const sprintRef = doc(db, 'sprints', sprintID);

    /**
     * Changes the name of the sprint.
     * 
     * @param {string} newName - The new name for the sprint.
     */
    const changeName = async (newName) => {
        setDoc(sprintRef, { name: newName }, { merge: true });
    }

    /**
     * Changes the start date of the sprint.
     * 
     * @param {string} newStartDate - The new start date for the sprint.
     */
    const changeStartDate = async (newStartDate) => {
        setDoc(sprintRef, { startDate: newStartDate }, { merge: true });
    }


    /**
     * Changes the end date of the sprint.
     * 
     * @param {string} newEndDate - The new end date for the sprint.
     */
    const changeEndDate = async (newEndDate) => {
        setDoc(sprintRef, { endDate: newEndDate }, { merge: true });
    }

    //change the status of the sprint
    // i forgot the 3 things... please change this line to the correct me :)
    /**
     * Changes the status of the sprint.
     * 
     * @param {string} newStatus - The new status for the sprint.
     */
    const changeStatus = async (newStatus) => {
        setDoc(sprintRef, { description: newStatus }, { merge: true });
    }

    //change the reference or add the reference of the task within the sprint
    // must use reference the taskID or else it'll mess with the database
    /**
     * Changes the task reference of the sprint.
     * 
     * @param {string} newReference - The new task reference for the sprint.
     */
    const changeReference = async (newReference) => {
        setDoc(sprintRef, { history: newReference}, { merge: true });
    }

    /**
     * Changes the product owner of the sprint.
     * 
     * @param {string} newOwner - The new product owner for the sprint.
     */
    const changeOwner = async (newOwner) => {
        setDoc(sprintRef, { owner: newOwner }, { merge: true });
    }

    /**
     * Changes the scrum master of the sprint.
     * 
     * @param {string} newMaster - The new scrum master for the sprint.
     */
    const changeMaster = async (newMaster) => {
        setDoc(sprintRef, { master: newMaster }, { merge: true });
    }

    return {
        changeName,
        changeStartDate,
        changeEndDate,
        changeStatus,
        changeReference,
        changeOwner,
        changeMaster,
    }
}