import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom/dist';
import { setMode } from '../utils/boardSlice';
import { setRoomId } from '../utils/onlineGameSlice';

const Mode = () => {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.onlineGame.socket);
  const navigate = useNavigate();
  // const roomId = useSelector((state) => state.onlineGame.roomId);

  const handleClassicClick = () => {
    console.log('socket id', socket.id);
    dispatch(setMode('classic'));
    socket.emit('create-room', 'classic');
  };

  const handleEndlessClick = () => {
    dispatch(setMode('endless'));
    socket.emit('create-room', 'endless');
  };

  useEffect(() => {
    socket.on('room-created', (roomId) => {
      console.log('room created with id: ', roomId);
      dispatch(setRoomId(roomId));
      navigate(`/wait/${roomId}`);
    });

    return () => {
      socket.off('room-created');
    };
  }, []);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Select Game Mode</h2>
        <div className="buttons">
          <button onClick={handleClassicClick} className="button">
            Classic
          </button>
          <button onClick={handleEndlessClick} className="button">
            Endless
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mode;
