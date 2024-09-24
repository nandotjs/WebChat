import { io as socketIOClient } from 'socket.io-client';

const createClient = (token: string, username: string) => {
  const socket = socketIOClient('http://localhost:3000', {
    auth: { token: `Bearer ${token}` }
  });

  socket.on('connect', () => {
    console.log(`${username} connected`);
  });

  socket.on('loadPreviousMessages', (messages) => {
    console.log(`${username} received previous messages:`, messages);
  });

  socket.on('newMessage', (message) => {
    console.log(`${username} received new message:`, message);
  });

  socket.on('error', (error) => {
    console.error(`${username} error:`, error);
  });

  return socket;
};

const user1Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZWIzNTkzNmU5ZDE5NDM3ZjY4OTZjMCIsImlhdCI6MTcyNzEzNTc0NSwiZXhwIjoxNzI5NzI3NzQ1fQ.7l_g1XO_APWqveDKpCFW1sQL1r5EbXW4bdzDeEx7eSk';
const user2Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjFmZmVkZGRiMDIxY2Y2ZjRmYzQ3ZiIsImlhdCI6MTcyNzEzNTc2NywiZXhwIjoxNzI5NzI3NzY3fQ.53P1vfFo-5wh3Tatro_OmXbmyPwPb_2OlWeoVaRVCKU';

const user1Socket = createClient(user1Token, 'User1');
const user2Socket = createClient(user2Token, 'User2');

// Messages simulation 
setTimeout(() => {
  user1Socket.emit('sendMessage', 'Hello from User1!');
}, 2000);

setTimeout(() => {
  user2Socket.emit('sendMessage', 'Hi User1, this is User2!');
}, 4000);

// Manter o script rodando
setInterval(() => {}, 1000);