import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { disconnectSocket } from '../utils/socket';
import Square from './Square';
import {
  setSquare,
  clearSquares,
  setWinner,
  updateScore,
  clearScore,
  reset,
  newGame,
  setPrevSquare,
  clearSquare,
} from '../utils/boardSlice';
import { setActive, clearState } from '../utils/onlineGameSlice';

const Board = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector((state) => state.board.mode);
  const active = useSelector((state) => state.onlineGame.active);
  const squares = useSelector((state) => state.board.squares);
  const symbol = useSelector((state) => state.onlineGame.symbol);
  const status = useSelector((state) => state.onlineGame.status);
  const socket = useSelector((state) => state.onlineGame.socket);
  const score = useSelector((state) => state.board.score);
  const winner = useSelector((state) => state.board.winner);
  const viewerCount = useSelector((state) => state.onlineGame.viewerCount);
  const opponentLeft = useSelector((state) => state.onlineGame.opponentLeft);
  const [winningCombo, setWinningCombo] = useState([]);

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  useEffect(() => {
    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        dispatch(setWinner(squares[a]));
        dispatch(updateScore(squares[a]));
        setWinningCombo([a, b, c]);
        socket.emit('winner', squares[a]);
        return;
      }
    }

    if (!squares.includes(null)) {
      dispatch(setWinner('Tie'));
      dispatch(updateScore('Tie'));
      socket.emit('winner', 'Tie');
    }
  }, [squares]);

  useEffect(() => {
    socket.on('move', (index, symbol) => {
      dispatch(setSquare({ index, symbol }));
      if (status === 'player') {
        dispatch(setActive(true));
      }
    });

    socket.on('reset-game', ({ active, status }) => {
      if (status === 'player') {
        dispatch(setActive(active));
      }
      dispatch(reset());
      setWinningCombo([]);
    });

    socket.on('new-game', ({ active, status }) => {
      if (status === 'player') {
        dispatch(setActive(active));
      }
      dispatch(newGame());
      setWinningCombo([]);
    });

    socket.on('highlight', (index) => {
      dispatch(setPrevSquare(index));
    });

    socket.on('unhighlight', (index) => {
      dispatch(setPrevSquare(null));
    });

    socket.on('move-existing', (prevSquare, newSquare, symbol) => {
      dispatch(clearSquare(prevSquare));
      dispatch(setSquare({ index: newSquare, symbol }));
      dispatch(setPrevSquare(null));
      if (status === 'player') {
        dispatch(setActive(true));
      }
    });

    return () => {
      socket.off('move');
      socket.off('reset-game');
      socket.off('new-game');
      socket.off('highlight');
      socket.off('unhighlight');
      socket.off('move-existing');
    };
  }, []);

  const getTurnClasses = () => {
    let classes = 'turn';
    if (status === 'player') {
      if (active) {
        if (symbol === 'X') {
          classes += ' x';
        } else {
          classes += ' o';
        }
      } else {
        if (symbol === 'X') {
          classes += ' o';
        } else {
          classes += ' x';
        }
      }
    } else {
      classes += ' tie';
    }
    return classes;
  };

  const handleResetGameClick = () => {
    if (status !== 'player') {
      return;
    }
    dispatch(setWinner(null));
    dispatch(clearSquares());
    dispatch(setActive(false));
    setWinningCombo([]);
    dispatch(clearScore());
    socket.emit('reset-game');
  };

  const handleNewGameClick = () => {
    if (status !== 'player') {
      return;
    }
    socket.emit('new-game', winner);
    dispatch(setWinner(null));
    dispatch(clearSquares());
    dispatch(setActive(false));

    setWinningCombo([]);
  };

  const handleExitRoomClick = () => {
    dispatch(clearState());
    reset();
    socket.disconnect();
    disconnectSocket();
    navigate('/');
  };

  return (
    <div>
      {opponentLeft ? (
        <div className="leave-room">
          <p>Opponent Left :(</p>
          <p>Leaving Room !!</p>
        </div>
      ) : (
        <>
          <h2 className="mode">{mode} mode</h2>
          <div className="board">
            <div className={getTurnClasses()}>
              {status === 'player' ? (
                active ? (
                  <div>Your Turn</div>
                ) : (
                  <div>Opponent's Turn</div>
                )
              ) : (
                <div>Viewer</div>
              )}
            </div>
            <button onClick={handleResetGameClick} className="reset">
              Reset
            </button>
            <button onClick={handleNewGameClick} className="new-game">
              New Game
            </button>
            {/* 9 squares */}
            {squares.map((square, index) => (
              <Square
                key={index}
                index={index}
                isWinning={winningCombo.includes(index)}
              />
            ))}
            <div className="score x bold">
              <p>X</p>
              <p>{score.X} wins</p>
            </div>
            <div className="score tie bold">
              <p>Ties</p>
              <p>{score.Tie}</p>
            </div>
            <div className="score o bold">
              <p>O</p>
              <p>{score.O} wins</p>
            </div>
          </div>
          {viewerCount > 0 && (
            <div className="tile">Viewer Count: {viewerCount}</div>
          )}
          <div>
            <button className="button exit-room" onClick={handleExitRoomClick}>
              Exit Room
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Board;
