import { createSlice } from '@reduxjs/toolkit';

const onlineGameSlice = createSlice({
  name: 'onlineGame',
  initialState: {
    socket: null,
    roomId: null,
    status: null, // 'player' or 'viewer'
    symbol: null, // 'X' or 'O'
    active: false, // true if it's your turn
    inputRoomId: '',
    viewerCount: 0,
    gameReady: false,
    opponentLeft: false,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setSymbol: (state, action) => {
      state.symbol = action.payload;
    },
    setActive: (state, action) => {
      state.active = action.payload;
    },
    setInputRoomId: (state, action) => {
      state.inputRoomId = action.payload;
    },
    setViewerCount: (state, action) => {
      state.viewerCount = action.payload;
    },
    setGameReady: (state, action) => {
      state.gameReady = action.payload;
    },
    setOpponentLeft: (state, action) => {
      state.opponentLeft = action.payload;
    },
    clearState: (state) => {
      state.socket = null;
      state.roomId = null;
      state.status = null;
      state.symbol = null;
      state.active = false;
      state.inputRoomId = '';
      state.viewerCount = 0;
      state.gameReady = false;
      state.opponentLeft = false;
    },
  },
});

export const {
  setSocket,
  setRoomId,
  setStatus,
  setSymbol,
  setActive,
  setInputRoomId,
  setViewerCount,
  setGameReady,
  setOpponentLeft,
  clearState,
} = onlineGameSlice.actions;

export default onlineGameSlice.reducer;
