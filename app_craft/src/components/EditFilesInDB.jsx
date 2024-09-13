import React from "react";
import { db } from '../firebase/firebaseConfig.js';
import { getDocs, collection, doc, setDoc } from 'firebase/firestore';

export function EditFilesInDB(taskID) {
    const dbRef =  doc(db, 'tasks', taskID);

    const taskTypes = ['Story', 'Bug'];
    const taskStages = ['Planning', 'Development', 'Testing', 'Integration'];
    const priorities = ['Low', 'Medium', 'Important', 'Urgent'];
    const availableTags = ['Frontend', 'Backend', 'API', 'Database', 'Framework', 'Testing', 'UI', 'UX'];

    const changeName = async (newName) => {
        setDoc(dbRef, { name: newName }, { merge: true });
    }

    const changeType = async (newType) => {

        setDoc(dbRef, { type: newType }, { merge: true });

    }

    const changeStage = async (newStage) => {

  
        setDoc(dbRef, { stage: newStage }, { merge: true });
    }

    const changeStoryPoints = async (newStoryPoints) => {
        setDoc(dbRef, { storyPoints: newStoryPoints }, { merge: true });
    }

    const changePriority = async (newPriority) => {

        setDoc(dbRef, { priority: newPriority }, { merge: true });

    }

    const changeTags = async (newTags) => {

        setDoc(dbRef, { tags: newTags }, { merge: true });

    }

    const changeAssignee = async (newAssignee) => {
        setDoc(dbRef, { assignee: newAssignee }, { merge: true });
    }

    const changeDescription = async (newDescription) => {
        setDoc(dbRef, { description: newDescription }, { merge: true });
    }

    const changeHistory = async (newHistory) => {
        setDoc(dbRef, { history: newHistory}, { merge: true });
    }

    return {
        changeName,
        changeType,
        changeStage,
        changeStoryPoints,
        changePriority,
        changeTags,
        changeAssignee,
        changeDescription,
        changeHistory,
    };
}