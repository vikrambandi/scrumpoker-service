"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_http_1 = require("node:http");
const node_path_1 = require("node:path");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const constants_1 = require("shared/constants");
const handlers_1 = require("./handlers");
// App Variables
dotenv_1.default.config();
// initializing the express app
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// using the dependencies
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const server = (0, node_http_1.createServer)(app);
const io = new socket_io_1.Server(server);
const serverSockets = new Set();
server.removeAllListeners();
app.use(express_1.default.static('pages'));
app.use(express_1.default.static('static'));
app.get('/', (req, res) => {
    res.sendFile((0, node_path_1.join)(__dirname, 'pages/index.html'));
});
const roomId = 1234;
io.on(constants_1.CONNECTION, (socket) => {
    console.log('a user connected id:', socket.id);
    (0, handlers_1.onDisconnect)(socket);
    (0, handlers_1.onAny)(socket);
    socket.on('userConnected', (...args) => console.log('userConencted', args));
    socket.on('joinRoom', ({ userId, roomId }) => {
        socket.join(roomId);
        console.log(`User joined room ${roomId}`);
    }).emit('joinRoom', roomId);
});
server.listen(port, () => {
    io.fetchSockets().then(sockets => sockets.forEach(socket => socket.disconnect()));
    console.log(`server running at http://localhost:${port}`);
});
