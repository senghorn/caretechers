import { io } from "socket.io-client";
import config from "../../constants/config";

const URL = config.backend_messaging;

const socket = io(URL, {
    reconnectionDelayMax: 10000,
    auth: {
        token: "123"
    }, 
    autoConnect: false
});

export default socket;