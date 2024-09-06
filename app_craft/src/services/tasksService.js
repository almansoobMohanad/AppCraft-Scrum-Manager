// src/services/tasksService.js
import { addDoc, collection, getFirestore } from "firebase/firestore"; 
import { db } from '../firebase/firebaseConfig'; //import Firebase config

//function to create a new task
export const createTask = async (taskData) => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), taskData);
    console.log("Task created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding task: ", error);
    throw new Error(error.message);
  }
};

//other task-related functions here
