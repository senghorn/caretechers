import { io } from "socket.io-client";

const URL = "http://192.168.0.43:3001";
const socket = io(URL, {
    reconnectionDelayMax: 10000,
    auth: {
        token: "123"
    }, 
    autoConnect: false
});

export default socket;