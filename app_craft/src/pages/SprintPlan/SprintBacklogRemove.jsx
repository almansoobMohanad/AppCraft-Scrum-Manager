/**
 * Remove a task from the sprint backlog and move it to the product backlog.
 * 
 * @param {string} taskId - The ID of the task to remove from the sprint.
 * @throws {Error} - Throws an error if the task update fails.
 */
export async function removeTaskFromSprintBacklog(taskId) {
    try {
        const taskRef = doc(db, "tasks", taskId);

        await updateDoc(taskRef, {
            status: null,
        });

        console.log(`Task ${taskId} removed from sprint backlog and moved back to product backlog.`);
    } catch (error) {
        console.error("Error removing task from sprint backlog:", error);
    }
}

