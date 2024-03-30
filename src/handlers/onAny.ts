import { Socket } from "socket.io";

export const onAny = (socket: Socket) => socket.onAny((event, ...args) => console.log(`Event: id: ${event.id} , message: ${event.message}`));