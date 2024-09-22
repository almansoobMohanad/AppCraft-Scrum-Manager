import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";  

async function deleteSprint(sprintId) {
    try {
        const sprintDocRef = doc(db, "sprints", sprintId);  //locate the sprint by ID
        await deleteDoc(sprintDocRef);  // Delete the document
        console.log(`Sprint with ID ${sprintId} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting sprint:", error);
    }
}
