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
        if (newType in taskTypes) {
            setDoc(dbRef, { type: newType }, { merge: true });
        } else {
            alert("Invalid task type");
            console.error("Invalid task type");
        }
    }

    const changeStage = async (newStage) => {
        if (newStage in taskStages) {
            setDoc(dbRef, { stage: newStage }, { merge: true });
        } else {
            alert("Invalid task stage");
            console.error("Invalid task stage");
        }
    }

    const changeStoryPoints = async (newStoryPoints) => {
        setDoc(dbRef, { storyPoints: newStoryPoints }, { merge: true });
    }

    const changePriority = async (newPriority) => {
        if (newPriority in priorities) {
            setDoc(dbRef, { priority: newPriority }, { merge: true });
        } else {
            alert("Invalid priority");
            console.error("Invalid priority");
        }
    }

    const changeTags = async (newTags) => {
        if (newTags in availableTags) {
            setDoc(dbRef, { tags: newTags }, { merge: true });
        }
    }

    const changeAssignee = async (newAssignee) => {
        setDoc(dbRef, { assignee: newAssignee }, { merge: true });
    }

    const changeDescription = async (newDescription) => {
        setDoc(dbRef, { description: newDescription }, { merge: true });
    }

    return {
        changeName,
        changeType,
        changeStage,
        changeStoryPoints,
        changePriority,
        changeTags,
        changeAssignee,
        changeDescription
    };
}