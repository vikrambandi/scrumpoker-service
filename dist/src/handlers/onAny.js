"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onAny = void 0;
const onAny = (socket) => socket.onAny((event, ...args) => console.log(`Event: id: ${event.id} , message: ${event.message}`));
exports.onAny = onAny;
