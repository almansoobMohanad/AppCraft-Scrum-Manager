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

function createData(taskName, tags, priority, storyPoints, databaseID, description, type, history, assignee, stage, dateCreated = new Date()) {

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
    };
}


class LocalDatabase {
    constructor() {
        this.data = [];
        this.modifiedData = [];
    }

    async init() {
        await this.fetchData();
    }

    async fetchData() {
        const querySnapshot = await getDocs(collection(db, 'tasks'));
        querySnapshot.forEach((doc) => {
            this.data.push(createData(doc.data().name, doc.data().tags, doc.data().priority, doc.data().storyPoints, doc.id, doc.data().description, doc.data().type, doc.data().history, doc.data().assignee, doc.data().stage, doc.data().dateCreated));
        });
    }

    getData() {
        return this.data;
    }

    setData(data) {
        this.data = data;
    }

    async updateData() {
        this.data = [];
        await this.fetchData();
    }

    async addData(newData) {
        this.data.push(newData);
    }

    async removeData(index) {
        this.data.splice(index, 1);
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