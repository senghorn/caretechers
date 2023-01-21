import { io } from "socket.io-client";

const URL = "http://10.18.5.175:3001";
const socket = io(URL, { autoConnect: false });

export default socket;