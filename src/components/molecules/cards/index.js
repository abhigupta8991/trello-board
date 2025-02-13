import React from 'react';
import { useDrag } from 'react-dnd';
import DeleteIcon from '../../../assets/deleteIcon';
import { deleteCard } from '../../../firebase/crud';

import "./cards.css";

const Card = ({ card, boardId, listId, onClick }) => {  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { ...card, boardId, listId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const deleteCardFromList = (event) => {
    event.stopPropagation()
    deleteCard(boardId, listId, card.id)
  }

  return (
    <div className='card-wrapper' onClick={onClick}>
      <div className='card' ref={drag} style={{
        opacity: isDragging ? 0.5 : 1,
      }}>
        <h4>{card.name}</h4>
        <button className='delete' onClick={deleteCardFromList}>
          <DeleteIcon/>
        </button>
      </div>
    </div>
  )
}

export default Card;
