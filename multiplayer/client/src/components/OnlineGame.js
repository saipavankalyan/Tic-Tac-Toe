import React, { useEffect, useState } from 'react';
import { connectSocket } from '../utils/socket';
import { Link, useNavigate } from 'react-router-dom/dist';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from '../utils/onlineGameSlice';

const OnlineGame = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [inputRoomId, setInputRoomId] = useState('');
  const socket = useSelector((state) => state.onlineGame.socket);
  const [isValidRoom, setIsValidRoom] = useState(true);

  useEffect(() => {
    const socketInstance = connectSocket();
    socketInstance.on('connect', () => {
      console.log('Connected to server with id: ', socketInstance.id);
      dispatch(setSocket(socketInstance));
    });

    socketInstance.on('room-found', (found, roomId) => {
      if (found) {
        console.log(inputRoomId);
        navigate(`/wait/${roomId}`);
      } else {
        console.log('Room not found');
        alert('Room not found');
      }
    });

    return () => {
      socketInstance.off('connect');
      setIsButtonClicked(false);
      setIsValidRoom(true);
    };
  }, []);

  const handleJionRoomClick = () => {
    setIsButtonClicked(true);
  };

  const handleJoin = () => {
    if (!inputRoomId) {
      alert('Please enter a valid room id');
      return;
    }

    socket.emit('join-room', inputRoomId);
  };

  return (
    <div className="modal">
      {!isButtonClicked ? (
        <div className="modal-content">
          <h2>Select Game Mode</h2>
          <div className="buttons">
            <Link to={'/mode'} className="button">
              Create Room
            </Link>
            <button onClick={handleJionRoomClick} className="button">
              Join Room
            </button>
          </div>
        </div>
      ) : (
        <div className="modal-content">
          <h2>Join Game</h2>
          <input
            className="text-input"
            type="text"
            placeholder="Enter Room ID"
            value={inputRoomId}
            onChange={(e) => setInputRoomId(e.target.value)}
          />
          <button onClick={handleJoin} className="button">
            Let's Go!
          </button>
        </div>
      )}
    </div>
  );
};

export default OnlineGame;
