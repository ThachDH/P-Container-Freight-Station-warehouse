import { io } from "socket.io-client";

const URL = process.env.SOCKET_HOST ?? "http://localhost:3007";
const socket = io(URL, { transport: ['websocket'] });

export const socketServices = {
    socket,
    connect
}

function connect(userId, terminalCode = null) {
    var data = {
        UserID: userId,
        access_token: localStorage.access_token
    };
    if (terminalCode !== null) {
        data['TerminalCode'] = terminalCode;
    }
    socket.emit('login_user', data);
}