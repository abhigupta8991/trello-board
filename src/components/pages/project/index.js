import React, { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom';
import { off, onValue, ref } from 'firebase/database';
import { db } from '../../../firebase/config';
import Modal from '../../molecules/modal';
import List from '../list';

import "./lists.css";

const ProjectBoard = () => {
  const location = useLocation();
  const { state } = location;
  const [lists, setLists] = useState();
  const [selectedList, setSelectedList] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("list");

  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;
    const listsRef = ref(db, `projects/${id}/lists`);
    onValue(listsRef, (snapshot) => {
      if (snapshot.exists()) {
        setLists(Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data })));
      } else {
        setLists([]);
      }
    });

    return () => off(listsRef);
  }, [id]);

  const openModal = (type, listId = null) => {
    setModalType(type);
    setSelectedList(listId);
    setModalOpen(true);
  };

  return (
    <>
      <div className='project-details'>
        <h2 className='project-name'>Project: <span>{state.name}</span></h2>
        <p className='project-description'>{state.description}</p>
      </div>
      <div className='project-wrapper'>
        <div className='project-board'>
          {lists?.map((list) => {
            return (
              <List list={list} boardId={id} listId={list.id}/>
            )
          })}
          <div className='empty-list' onClick={() => openModal("list", id)}>
            + Add a List
          </div>
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            type={modalType}
            boardId={id}
            listId={selectedList}
          />
        </div>
      </div>
    </>
  )
}

export default ProjectBoard
