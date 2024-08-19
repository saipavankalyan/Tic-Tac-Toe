import { io } from 'socket.io-client';
import { SERVER_URL } from './constants';

let socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SERVER_URL);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket = undefined;
  }
};
