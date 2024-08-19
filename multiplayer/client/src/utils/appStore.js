import { configureStore } from '@reduxjs/toolkit';
import onlineGameReducer from './onlineGameSlice';
import boardReducer from './boardSlice';

const appStore = configureStore({
  reducer: {
    onlineGame: onlineGameReducer,
    board: boardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default appStore;
