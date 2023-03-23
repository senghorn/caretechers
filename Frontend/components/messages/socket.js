import { io } from "socket.io-client";
import config from "../../constants/config";

const URL = config.backend_messaging;

const createSocket = (user, token) => {
  return io(URL, {
    reconnectionDelayMax: 10000,
    auth: {
      token: token,
      username: user.id,
    },
    query: {
      groupId: user.curr_group,
    },
    autoConnect: true,
  });
};

export default createSocket;