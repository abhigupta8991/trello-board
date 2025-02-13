import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../../firebase/config';
import { onValue, ref } from "firebase/database";
import Modal from '../../molecules/modal';

import "./boards.css";

const BoardWrapper = () => { 
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("board");
  const [selectedBoard, setSelectedBoard] = useState(null);

  const openModal = (type, boardId = null, listId = null, taskId = null) => {
    setModalType(type);
    setSelectedBoard(boardId);
    setModalOpen(true);
  };

  useEffect(() => {
    const query = ref(db, "projects");
    const unsubscribe = onValue(query, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProjects(data ? Object.entries(data).map(([id, board]) => ({ id, ...board })) : []);
      } else {
        setProjects([]);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className='board-wrapper'>
      {
        projects?.map((board, index) => {
          return (
            <Link to={`/projects`} state={board} key={index}>
              <div className='board-name'>
                  {board.name}
              </div>
            </Link>
          )
        })
      }
      <button className='empty-list empty-board' onClick={() => openModal("board")}>
        + Add new Board 
      </button>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        boardId={selectedBoard}
      />
    </div>
  )
}

export default BoardWrapper
