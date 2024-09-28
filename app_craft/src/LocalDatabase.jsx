import { db } from './firebase/firebaseConfig.js';
import { collection, getDocs } from 'firebase/firestore';
// import React from 'react';

function dynamicSort(key, sortOrder = 'asc') {
    return function (a, b) {
        if (a[key] < b[key]) 
            return sortOrder === 'asc' ? -1 : 1;
        if (a[key] > b[key])
            return sortOrder === 'asc' ? 1 : -1;
        return 0;
    }
}

function createData(taskName, tags, priority, storyPoints, databaseID, description, type, history, assignee, stage, dateCreated = new Date(), status = "Not Started", logtimeSpent = 0) {

    return {
        taskName,
        tags,
        priority,
        storyPoints,
        priorityNum: priority === 'Low' ? 1 : priority === 'Medium' ? 2 : priority === 'Important' ? 3 : 4,
        history,
        databaseID,
        description,
        type,
        assignee,
        stage,
        dateCreated,
        status, // Force fallback here,
        logtimeSpent,
    };
}


class LocalDatabase {
    constructor() {
        this.data = [];
        this.modifiedData = [];
        this.updateCounter = 0; // Counter to track updates
    }

    async init() {
        await this.fetchData();
    }

    async fetchData() {
        this.data = [];
        const querySnapshot = await getDocs(collection(db, 'tasks'));
        querySnapshot.forEach((doc) => {
            this.data.push(createData(
                doc.data().name, 
                doc.data().tags, 
                doc.data().priority, 
                doc.data().storyPoints, 
                doc.id, 
                doc.data().description, 
                doc.data().type, 
                doc.data().history, 
                doc.data().assignee, 
                doc.data().stage, 
                doc.data().dateCreated,
                doc.data().status,
                doc.data().logtimeSpent
            ));
        });
        this.updateCounter++;
    }

    getData() {
        return this.data;
    }

    setData(data) {
        this.data = data;
        this.updateCounter++;
    }

    editData(dataID, data) {
        const dataToChangeIndex = this.data.findIndex(task => task.databaseID === dataID);
        if (dataToChangeIndex !== -1) {
            const dataToChange = this.data[dataToChangeIndex];
            const updatedData = {
                ...dataToChange,
                taskName: data.taskName,
                type: data.type,
                stage: data.stage,
                storyPoints: data.storyPoints,
                priority: data.priority,
                tags: data.tags,
                assignee: data.assignee,
                description: data.description,
                history: data.history,
                priorityNum: data.priority === 'Low' ? 1 : data.priority === 'Medium' ? 2 : data.priority === 'Important' ? 3 : 4,
                status: data.status,
                logtimeSpent: data.logtimeSpent,
            };
            this.data[dataToChangeIndex] = updatedData;
            this.updateCounter++;
        }
    }

    async updateData() {
        this.data = [];
        await this.fetchData();
        this.updateCounter++;
    }

    addData(newData) {
        this.data.push(newData);
        this.updateCounter++;
    }

    deleteData(databaseID) {
        this.data.filter(task => task.databaseID !== databaseID);
        this.updateCounter++;
    }

    getUpdateCounter() {
        return this.updateCounter;
    }

    filterTasks(tags, priority, storyPoints) {

        let filtered = this.data;

        if (tags.length > 0) {
            filtered = filtered.filter(task => tags.some(tag => task.tag.includes(tag)));
        }

        if (priority) {
            filtered = filtered.filter(task => task.priority === priority);
        }

        if (storyPoints !== null) {
            filtered = filtered.filter(task => task.storyPoint === storyPoints);
        }

        this.modifiedData = filtered;
    }

    getFilteredData() {
        return this.modifiedData;
    }

    sortData(key, sortOrder) {
        if (!key) this.modifiedData;
        if (sortOrder === 'desc') 
            this.modifiedData.sort(dynamicSort(key, sortOrder)).reverse();
        else
            this.modifiedData.sort(dynamicSort(key, sortOrder));
    }

}

const localDB = new LocalDatabase();
export default localDB;