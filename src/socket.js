import { io } from 'socket.io-client';

// Initialize the socket connection to the backend
const socket = io(process.env.REACT_APP_SOCKET_URL, {
  transports: ['websocket', 'polling'], // Ensures cross-browser compatibility
});

export default socket;
