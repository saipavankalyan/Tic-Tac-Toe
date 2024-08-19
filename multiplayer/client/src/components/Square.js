import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSquare } from '../utils/boardSlice';
import { setActive } from '../utils/onlineGameSlice';

const Square = ({ index, isWinning }) => {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.onlineGame.socket);
  const winner = useSelector((state) => state.board.winner);
  const status = useSelector((state) => state.onlineGame.status);
  const active = useSelector((state) => state.onlineGame.active);
  const value = useSelector((state) => state.board.squares[index]);
  const squares = useSelector((state) => state.board.squares);
  const symbol = useSelector((state) => state.onlineGame.symbol);

  const handleSquareClick = () => {
    if (squares[index] || winner !== null || status !== 'player' || !active) {
      return;
    }

    dispatch(setSquare({ index, symbol }));
    dispatch(setActive(false));
    socket.emit('move', { index, symbol });
  };

  const getClassName = () => {
    let classes = 'icon big shadow';
    if (isWinning) {
      classes += squares[index] === 'X' ? ' x' : ' o';
    } else {
      classes += ' square';
      if (value === 'X') classes += ' green';
      else classes += ' yellow';
    }
    return classes;
  };

  return (
    <button className={getClassName()} onClick={handleSquareClick}>
      {value ? value : ''}
    </button>
  );
};

export default Square;
