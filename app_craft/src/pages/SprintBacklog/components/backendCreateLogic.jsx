import React from "react";
import { addDoc, collection, getFirestore } from "firebase/firestore"; 
import { db } from '../firebase/firebaseConfig'; //import Firebase config

export default function sprintCreate() {
    const createSprint = async (sprintData) => {
        try {
            const docRef = await addDoc(collection(db, "sprints"), sprintData);
            console.log("Sprint created with ID: ", docRef.id);
            return docRef.id;
        } catch (error) {
            console.error("Error adding sprint: ", error);
            throw new Error(error.message);
        }
    };
}