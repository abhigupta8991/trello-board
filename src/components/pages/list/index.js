import React, { useEffect, useState } from 'react'
import { off, onValue, ref } from 'firebase/database';
import { useDrop } from 'react-dnd';

import { db } from '../../../firebase/config';
import { addTaskToList, deleteCard } from '../../../firebase/crud';
import Card from '../../molecules/cards'
import Modal from '../../molecules/modal';

const List = ({list, listId, boardId}) => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("card");
  const [modalIsForm, setModalIsForm] = useState(true);
  const [cardToShow, setCardToShow] = useState({})

  const openModal = (type, taskId = null, isContent, card) => {
    isContent && setModalIsForm(false);
    isContent && setCardToShow(card)
    setModalType(type);
    setSelectedCard(taskId);
    setModalOpen(true);

  };

  useEffect(() => {
      if (!boardId || !listId) return;
  
      const cardsRef = ref(db, `projects/${boardId}/lists/${listId}/tasks`);
      onValue(cardsRef, (snapshot) => {
        if (snapshot.exists()) {
          setCards(Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data })));
        } else {
          setCards([]);
        }
      });
  
      return () => off(cardsRef);
    }, [boardId, listId]);

    const [, drop] = useDrop(() => ({
      accept: "CARD",
      drop: (item) => moveCard(item, list.id),
    }));
  
    const moveCard = (card, newListId) => {
      if (card.listId !== newListId) {
        deleteCard(boardId, card.listId, card.id);
        addTaskToList(boardId, newListId, card.name, card.description, card.assignee);
      }
    };

  return (
    <div className='list' ref={drop}>
      <div className='list-title'>{list.name}</div>
        <div className='cards'>
          {cards.map((card, index) => {
            return (
              <Card card={card} boardId={boardId} listId={list.id} onClick={() => openModal(null,null,true, card)}/>
            )
          })}
        </div>
      <div className='add-card' onClick={() => openModal("card")}>+ Add a Card</div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        boardId={boardId}
        listId={listId}
        taskId={selectedCard}
        modalIsForm={modalIsForm}
        cardToShow={cardToShow}
      />
    </div>
  )
}

export default List
