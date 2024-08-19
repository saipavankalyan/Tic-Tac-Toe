import { stat } from 'fs';
import { createServer } from 'http';
import { Server } from 'socket.io';

const clientURL = 'http://localhost:3001';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const users = new Map();
const games = new Map();

const generateRoomId = () => Math.random().toString(36).substring(2, 9);

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);
  users[socket.id] = {
    socket: socket,
    roomId: null,
    status: null,
  };
  // console.log(games);

  socket.on('create-room', (mode) => {
    const roomId = generateRoomId();
    socket.join(roomId);
    games.set(roomId, {
      mode: mode,
      players: [socket.id],
      viewersCount: 0,
      prevWinner: 'X',
    });
    users[socket.id].roomId = roomId;
    users[socket.id].status = 'player';
    console.log(`User ${socket.id} created room ${roomId} with mode ${mode}`);
    socket.emit('room-created', roomId);
  });

  socket.on('join-room', (roomId) => {
    console.log(`User ${socket.id} joining room ${roomId}`);
    const room = games.get(roomId);
    if (!room) {
      console.log(`Room ${roomId} not found`);
      socket.emit('room-found', false);
      return;
    }
    socket.emit('room-found', true, roomId);

    if (room.players[0] === socket.id) {
      return;
    }

    const numClients = room.players.length;
    socket.join(roomId);
    users[socket.id].roomId = roomId;

    if (numClients < 2) {
      room.players.push(socket.id);
      users[socket.id].status = 'player';
      console.log(
        `User ${socket.id} joined room ${roomId} with mode ${room.mode} as player`
      );
      //notify p1
      users[room.players[0]].socket.emit('room-joined', {
        roomId: roomId,
        mode: room.mode,
        status: 'player',
        symbol: 'X',
        active: true,
      });
      //notify p2
      socket.emit('room-joined', {
        roomId: roomId,
        mode: room.mode,
        status: 'player',
        symbol: 'O',
        active: false,
      });
    } else {
      // viewer
      room.players.push(socket.id);
      users[socket.id].status = 'viewer';
      console.log(
        `User ${socket.id} joined room ${roomId} with mode ${room.mode} as viewer`
      );
      room.viewersCount += 1;
      socket.emit('room-joined', { roomId, mode: room.mode, status: 'viewer' });
      io.to(roomId).emit('viewer-join', { count: room.viewersCount });
    }
  });

  socket.on('move', ({ index, symbol }) => {
    const user = users[socket.id];
    if (!user) {
      return;
    }
    const { roomId } = user;
    console.log(
      `User ${socket.id} made a move in room ${roomId} with symbol ${symbol} on index ${index}`
    );
    socket.to(roomId).emit('move', index, symbol);
  });

  socket.on('winner', (winner) => {
    const user = users[socket.id];
    if (!user) {
      return;
    }
    const { roomId } = user;
    console.log(`User ${winner} won in room ${roomId}`);
  });

  socket.on('new-game', (winner) => {
    const user = users[socket.id];
    if (!user) {
      return;
    }

    const { roomId } = user;
    const room = games.get(roomId);
    console.log(`User ${socket.id} requested a new game in room ${roomId}`);

    const p1 = room.players[0];
    const p2 = room.players[1];

    if (socket.id == p1) {
      console.log('new game by player1');
    } else if (socket.id == p2) {
      console.log('new game by player2');
    }

    if (!winner || winner == 'Tie') winner = room.prevWinner;

    // new game first turn should go to player who didn't win last game. If prevwinner is null, then first turn should go to player who played second in last game
    if (winner === 'X') {
      users[p2].socket.emit('new-game', { active: true, status: 'player' });
      users[p1].socket.emit('new-game', { active: false, status: 'player' });
      room.prevWinner = 'X';
    } else if (winner === 'O') {
      users[p1].socket.emit('new-game', { active: true, status: 'player' });
      users[p2].socket.emit('new-game', { active: false, status: 'player' });
      room.prevWinner = 'O';
      room.prevWinner = room.prevWinner === 'X' ? 'O' : 'X';
    }

    //emit new game event to all viewers
    socket.to(roomId).emit('new-game', {
      active: false,
      status: 'viewer',
    });
    console.log('New game started in room:', room);
  });

  socket.on('reset-game', () => {
    const user = users[socket.id];
    if (!user) {
      return;
    }
    const { roomId } = user;
    console.log(`User ${socket.id} requested a reset in room ${roomId}`);
    const room = games.get(roomId);
    room.prevWinner = 'X';
    const p1 = room.players[0];
    const p2 = room.players[1];
    users[p1].socket.emit('reset-game', { active: true, status: 'player' });
    users[p2].socket.emit('reset-game', { active: false, status: 'player' });
    //emit reset event to all viewers
    socket.to(roomId).emit('reset-game', {
      active: false,
      status: 'viewer',
    });
    console.log('Game reset in room:', room);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const user = users[socket.id];
    if (!user) {
      return;
    }
    const { roomId, status } = user;
    const room = games.get(roomId);
    if (!room) {
      return;
    }
    if (status === 'viewer') {
      room.viewersCount -= 1;
      //remove user from players in the room
      const index = room.players.indexOf(socket.id);
      if (index > -1) {
        room.players.splice(index, 1);
      }
      console.log(
        `Viewer ${socket.id} left room ${roomId}. Viewer count: ${room.viewersCount}`
      );
      io.to(roomId).emit('viewer-left', { count: room.viewersCount });
    }
    //if player disconnects, notify other player and delete room
    else {
      console.log('player disconnected in room:', room);
      io.to(roomId).emit('player-left');
      if (room) {
        const p1 = room.players[0];
        const p2 = room.players[1];
        if (socket.id === p1) {
          users[p1].roomId = null;
          users[p1].status = null;
        }
        if (socket.id === p2) {
          users[p2].roomId = null;
          users[p2].status = null;
        }
      }
      games.delete(roomId);
      users.delete(socket.id);
    }
    // console.log(users.size);
    // console.log(games.size);
  });
});

httpServer.listen(3000, () => {
  console.log('Server listening on port 3000');
});
