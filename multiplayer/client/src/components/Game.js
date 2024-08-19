import React from 'react';
import { Link } from 'react-router-dom/dist';

const Game = () => {
  const handleLocalGameClick = () => {
    window.location.href = 'https://saipavankalyan-tictactoe.netlify.app/';
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Select Game Environment</h2>
        <div className="buttons">
          <Link to={`onlinegame`} className="button">
            Online Game
          </Link>
          <button className="button" onClick={handleLocalGameClick}>
            Local Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;
