import { push, ref, remove, set } from "firebase/database";
import { db } from "./config";

export const deleteCard = (boardId, listId, taskId) => {
  const taskRef = ref(db, `projects/${boardId}/lists/${listId}/tasks/${taskId}`);
  remove(taskRef)
    .then(() => console.log("Task deleted successfully"))
    .catch((error) => console.error("Error deleting task:", error));
};


export const addTaskToList = async (boardId, listId, taskName, taskDescription, assignee) => {
    const taskRef = ref(db, `projects/${boardId}/lists/${listId}/tasks`);
    const newTaskRef = push(taskRef);
    set(newTaskRef, {
      id: newTaskRef.key,
      name: taskName,
      description: taskDescription || "",
      assignee: assignee || "",
    });
};