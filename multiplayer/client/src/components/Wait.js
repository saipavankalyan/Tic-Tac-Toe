import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { disconnectSocket } from '../utils/socket';
import { setMode, reset } from '../utils/boardSlice';
import {
  setRoomId,
  setStatus,
  setSymbol,
  setActive,
  setViewerCount,
  setOpponentLeft,
  clearState,
} from '../utils/onlineGameSlice';

const Wait = () => {
  const { roomId } = useParams();
  const socket = useSelector((state) => state.onlineGame.socket);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let timer;
    socket.on('room-joined', ({ roomId, mode, status, symbol, active }) => {
      console.log(roomId, mode, status, symbol, active);
      dispatch(setRoomId(roomId));
      dispatch(setMode(mode));
      dispatch(setStatus(status));
      if (status === 'player') {
        dispatch(setSymbol(symbol));
        dispatch(setActive(active));
      }
      navigate(`/board/${roomId}`);
    });

    socket.on('viewer-join', ({ count }) => {
      console.log('viewer joined', count);
      dispatch(setViewerCount(count));
    });

    socket.on('viewer-left', ({ count }) => {
      console.log('viewer left', count);
      dispatch(setViewerCount(count));
    });

    socket.on('player-left', () => {
      console.log('player left');
      timer = setTimeout(() => {
        dispatch(clearState());
        dispatch(reset());
        socket.disconnect();
        // disconnectSocket();
        navigate('/');
      }, 3000);
      dispatch(setOpponentLeft(true));
    });

    return () => {
      socket.off('room-joined');
      dispatch(setOpponentLeft(false));
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="wait">
      <p>Created Room with ID: {roomId}</p>
      <p>Share this room ID with your friend to play</p>
      <p>Waiting for another player to join...</p>
    </div>
  );
};

export default Wait;
