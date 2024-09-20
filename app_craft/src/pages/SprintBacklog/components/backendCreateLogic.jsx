import React from "react";
import { addDoc, collection, getFirestore } from "firebase/firestore"; 
import { db } from '../firebase/firebaseConfig'; //import Firebase config

//function to create a new sprint
export default createSprint = async (sprintData) => {
    try {
        const docRef = await addDoc(collection(db, "sprints"), sprintData);
        console.log("Sprint created with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding sprint: ", error);
        throw new Error(error.message);
    }
};

//other sprint-related functions here
export function editSprintDetails(sprintID) {
    const sprintRef = doc(db, 'sprints', sprintID);

    const changeName = async (newName) => {
        setDoc(sprintRef, { name: newName }, { merge: true });
    }

    const changeStartDate = async (newStartDate) => {
        setDoc(sprintRef, { startDate: newStartDate }, { merge: true });
    }

    const changeEndDate = async (newEndDate) => {
        setDoc(sprintRef, { endDate: newEndDate }, { merge: true });
    }

    //change the status of the sprint
    // i forgot the 3 things... please change this line to the correct me :)
    const changeStatus = async (newStatus) => {
        setDoc(sprintRef, { description: newStatus }, { merge: true });
    }

    //change the reference or add the reference of the task within the sprint
    // must use reference the taskID or else it'll mess with the database
    const changeReference = async (newReference) => {
        setDoc(sprintRef, { history: newReference}, { merge: true });
    }

    //change the product owner of the sprint
    const changeOwner = async (newOwner) => {
        setDoc(sprintRef, { owner: newOwner }, { merge: true });
    }

    //change the scrum master of the sprint
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