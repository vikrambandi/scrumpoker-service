"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDisconnect = void 0;
const onDisconnect = (socket) => socket.on('disconnect', () => {
    console.log('user disconnected id:', socket.id);
});
exports.onDisconnect = onDisconnect;
