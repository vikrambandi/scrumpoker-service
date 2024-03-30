// import express from 'express';
// import dotenv from 'dotenv';
// import { createServer } from 'node:http';
// import { fileURLToPath } from 'node:url';
// import { dirname, join } from 'node:path';
// import { Server } from 'socket.io';
// import { resolve } from 'path';
// import cors from 'cors'
// import helmet from 'helmet'

// import { CONNECTION } from 'shared/constants';
// import { onAny, onDisconnect } from './handlers';


// // App Variables
// dotenv.config()

// // initializing the express app
// const app = express();
// const port = process.env.PORT || 3001;

// // using the dependencies
// app.use(helmet());
// app.use(cors());
// app.use(express.json())


// const server = createServer(app);
// const io = new Server(server);

// server.removeAllListeners();

// app.use(express.static('pages'));
// app.use(express.static('static'));

// app.get('/', (req, res) => {
//   res.sendFile(join(__dirname, 'pages/index.html'));
//   // res.send('<h1>response</h1>')
// });


// const roomId = 1234;

// io.on(CONNECTION, (socket) => {
//   console.log('a user connected id:', socket.id);
//   onDisconnect(socket)
//   onAny(socket)
//   socket.on('userConnected', (...args) => console.log('user connected', args))
//   socket.on('joinRoom', ({ userId, roomId }) => {
//     socket.join(roomId);
//     console.log(`User joined room ${roomId}`);
//   }).emit('joinRoom', roomId);
// });

// server.listen(port, () => {
//   io.fetchSockets().then(sockets => sockets.forEach(socket => socket.disconnect()));
//   console.log(`server running at http://localhost:${port}`);
// });

import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { resolve } from 'path';
import cors from 'cors'
import helmet from 'helmet'

import { CONNECTION } from 'shared/constants';
import { onAny, onDisconnect } from './handlers';



// App Variables
dotenv.config()

// initializing the express app
const app = express();
const port = process.env.PORT || 3001;

// using the dependencies
app.use(helmet());
app.use(cors());
app.use(express.json())
app.use(express.static('pages'));
app.use(express.static('static'));


const server = createServer(app);
const io = new Server(server);

// server.removeAllListeners();
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

const users = new Set<string>()


io.disconnectSockets();

io.on('connection', (socket) => {
  console.log('a user connected id:', socket.id);
  /*
  * Add user to list on connections
  */
  users.add(socket.id)
  socket.emit('userConnected', socket.id)
  io.emit('usersList', [...users])

  // onDisconnect(socket)
  socket.on('disconnect', () => {
    console.log('user disconnected id:', socket.id);
    /*
    * Remove  user to list on connections
    */
    users.delete(socket.id)
  });

  onAny(socket)
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
    socket.emit('joinRoom');
  });
});

server.listen(port, () => {
  io.fetchSockets().then(sockets => sockets.forEach(socket => socket.disconnect()));
  console.log(`server running at http://localhost:${port}`);
});