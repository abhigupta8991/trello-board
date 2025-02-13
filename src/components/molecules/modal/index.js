import React, { useState } from "react";
import { db } from "../../../firebase/config";
import { ref, push, set, update } from "firebase/database";
import { addTaskToList } from "../../../firebase/crud";

import "./modal.css";

const Modal = ({ isOpen, onClose, type, boardId, listId, taskId, modalIsForm = true, cardToShow }) => {  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [error, setError] = useState("")

  if (!isOpen) return null;

  const handleSubmit = () => {
    if(name) {
      if (type === "board") {
        createBoard(name, description);
      } else if (type === "list") {
        addListToBoard(boardId, name);
      } else if (type === "card") {
        addTaskToList(boardId, listId, name, description, assignee);
      }
      handleClose();
    } else {
      setError("Name is Required")
    }
  };

  const handleClose = (e) => {
    onClose();
    setName('');
    setDescription('');
    setAssignee('')
  }

  const createBoard = (boardName) => {
    const boardRef = ref(db, "projects");
    const newBoardRef = push(boardRef);
    set(newBoardRef, { name: boardName, description: description, lists: {} });
  };

  const addListToBoard = (boardId, listName) => {
    const listRef = ref(db, `projects/${boardId}/lists`);
    const newListRef = push(listRef);
    set(newListRef, { name: listName, tasks: {} });
  };

  return (
    <div className="modal-overlay">
      {
        modalIsForm ? <div className="modal-content">
        <h2>{boardId ? "Edit" : "Add"} {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
        <input
          type="text"
          className="modal-name"
          placeholder="Enter name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <p className="name-error">{error}</p>
        {type !== "list" && (
          <textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        )}
        {type === "card" && (
          <input
            type="text"
            className="modal-name"
            placeholder="Enter Assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          />
        )}
        <button onClick={handleSubmit}>Save</button>
        <button className="close-btn" onClick={handleClose}>Close</button>
      </div> : 
      <div className="modal-content">
        <div className="card-details">
          <div className="card-descr">
            <h2>{cardToShow.name}</h2>
            <p>{cardToShow.description}</p>
          </div>
          <div className="assignee">{cardToShow.assignee}</div>
          <button className="close-btn" onClick={handleClose}>Close</button>
        </div>
      </div>
      }
    </div>
  );
};

export default Modal;