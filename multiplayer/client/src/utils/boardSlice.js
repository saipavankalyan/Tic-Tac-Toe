import { createSlice } from '@reduxjs/toolkit';

const boardSlice = createSlice({
  name: 'board',
  initialState: {
    squares: Array(9).fill(null),
    winner: null,
    score: { X: 0, O: 0, Tie: 0 },
    occupiedSquares: [],
    prevSquare: null,
    mode: null, // 'classic' or 'endless'
  },
  reducers: {
    setSquare: (state, action) => {
      const { index, symbol } = action.payload;
      state.squares[index] = symbol;
    },
    clearSquares: (state) => {
      state.squares = Array(9).fill(null);
    },
    setWinner: (state, action) => {
      state.winner = action.payload;
    },
    updateScore: (state, action) => {
      const winner = action.payload;
      if (winner === 'X' || winner === 'O') {
        state.score[winner] += 1;
      } else if (winner === 'Tie') {
        state.score.Tie += 1;
      }
    },
    clearScore: (state) => {
      state.score = { X: 0, O: 0, Tie: 0 };
    },
    setOccupiedSquares: (state, action) => {
      state.occupiedSquares = action.payload;
    },
    setPrevSquare: (state, action) => {
      state.prevSquare = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    newGame: (state) => {
      state.squares = Array(9).fill(null);
      state.winner = null;
      state.occupiedSquares = [];
      state.prevSquare = null;
    },
    reset: (state) => {
      state.squares = Array(9).fill(null);
      state.winner = null;
      state.score = { X: 0, O: 0, tie: 0 };
      state.occupiedSquares = [];
      state.prevSquare = null;
      state.mode = null;
    },
  },
});

export const {
  setSquare,
  clearSquares,
  setWinner,
  updateScore,
  clearScore,
  setOccupiedSquares,
  setPrevSquare,
  setMode,
  newGame,
  reset,
} = boardSlice.actions;

export default boardSlice.reducer;
