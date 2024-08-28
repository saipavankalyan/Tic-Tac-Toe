import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSquare,
  setOccupiedSquares,
  setPrevSquare,
  clearSquare,
} from '../utils/boardSlice';
import { setActive } from '../utils/onlineGameSlice';
import { toast } from 'react-toastify';

const Square = ({ index, isWinning }) => {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.onlineGame.socket);
  const winner = useSelector((state) => state.board.winner);
  const status = useSelector((state) => state.onlineGame.status);
  const active = useSelector((state) => state.onlineGame.active);
  const value = useSelector((state) => state.board.squares[index]);
  const squares = useSelector((state) => state.board.squares);
  const symbol = useSelector((state) => state.onlineGame.symbol);
  const mode = useSelector((state) => state.board.mode);
  const occupiedSquares = useSelector((state) => state.board.occupiedSquares);
  const prevSquare = useSelector((state) => state.board.prevSquare);

  const validMoves = {
    0: [1, 3, 4],
    1: [0, 2, 4],
    2: [1, 4, 5],
    3: [0, 4, 6],
    4: [0, 1, 2, 3, 5, 6, 7, 8],
    5: [2, 4, 8],
    6: [3, 4, 7],
    7: [4, 6, 8],
    8: [4, 5, 7],
  };

  const validateMove = (prevSquare, newSquare) => {
    return validMoves[prevSquare].some((square) => square === newSquare);
  };

  const handleSquareClick = () => {
    toast.dismiss();
    if (winner !== null || status !== 'player' || !active) {
      if (winner !== null) toast.warn('Game over');
      else if (status !== 'player') toast.warn("You are a viewer, can't play");
      else if (!active) toast.warn('Wait for your turn');
      return;
    }

    if (mode === 'endless' && occupiedSquares.length > 2) {
      if (prevSquare === null) {
        // can move any of current occupied positions
        if (!occupiedSquares.includes(index)) {
          toast.warn('You need to move one of your existing pieces');
          return;
        }
        dispatch(setPrevSquare(index));
        socket.emit('highlight', index);
        return;
      } else {
        //check for retreat
        if (index === prevSquare) {
          dispatch(setPrevSquare(null));
          socket.emit('unhighlight', prevSquare);
          return;
        }
        const newSquare = squares[index];
        //new square should be empty
        if (newSquare) {
          toast.warn('Move your piece to an empty square');
          return;
        }
        //move should be valid
        if (!validateMove(prevSquare, index)) {
          toast.warn('Invalid move');
          return;
        }
        dispatch(clearSquare(prevSquare));
        dispatch(setSquare({ index, symbol }));
        socket.emit('move-existing', prevSquare, index, symbol);
        // remove prevsquare from occupied squares and add new square
        const newOccupiedSquares = occupiedSquares.filter(
          (square) => square !== prevSquare
        );
        dispatch(setOccupiedSquares([...newOccupiedSquares, index]));
        dispatch(setPrevSquare(null));
        dispatch(setActive(false));
      }
    } else {
      if (squares[index] !== null) {
        toast.warn('Square already occupied');
        return;
      }
      dispatch(setSquare({ index, symbol }));
      dispatch(setActive(false));
      dispatch(setOccupiedSquares([...occupiedSquares, index]));
      socket.emit('move', { index, symbol });
    }
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
    if (prevSquare === index) {
      if (squares[index] === 'X') classes += ' highlight-green';
      else classes += ' highlight-yellow';
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
