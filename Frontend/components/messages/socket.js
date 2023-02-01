import { io } from "socket.io-client";
import config from "../../constants/config";

const URL = config.backend_messaging;

const createSocket = (user) => {
    return io(URL, {
      reconnectionDelayMax: 10000,
      auth: {
        token: user.token,
        username: user._id,
      },
      query: {
        groupId: user.groupId,
      },
      autoConnect: false,
    });
  };
  
  export default createSocket;