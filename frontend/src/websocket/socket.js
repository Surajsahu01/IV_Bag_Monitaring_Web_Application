import { io } from "socket.io-client";

const socket = io('https://iv-bag-monitaring.onrender.com', {
  transports: ['websocket'],
  reconnection: true
});

export default socket;
