import config from '../../constants/config';

const axios = require('axios').default;

/**
 * Asynchronously fetch messages given group id and last message id.
 * If last_message is null, fetch all message. Otherwise, fetch messages
 * that comes before the last_message.
 * params: group_id     - group to fetch messages from
 *         last_message - id of which last message fetched is
 */
export async function FetchMessages(
  group_id,
  last_message,
  setMessages,
  users
) {
  if (last_message == null) {
    try {
      let connection_string = config.backend_server + '/messages/fetch/' + group_id;
      return await axios
        .get(connection_string, {
          groupId: group_id,
        })
        .then((response) => {
          var messages = [];
          response.data.forEach(function (message) {
            messages.push({
              text: message.content,
              createdAt: message.date_time,
              _id: message.id,
              user: users[message.sender],
            });
          });
          setMessages(messages);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error.message);
    }
  }

  return null;
}

/*
 * Fetches more messages given last message id and group id
 */
export async function fetchMoreMessages(group_id, last_id, users) {
  try {
    if (!last_id) {
      return null;
    }
    let url = config.backend_server + `/messages/fetch/${group_id}/${last_id}`;
    const result = await axios.get(url);
    if (result.status == 200) {
      var messages = [];
      result.data.forEach(function (message) {
        messages.push({
          text: message.content,
          createdAt: message.date_time,
          _id: message.id,
          user: users[message.sender] ? users[message.sender] : { "_id": "Deleted user", "avatar": "", "name": "Deleted User" },
        });
      });
      console.log(messages);
      return messages;
    }
    else {
      console.log(result);
      return null;
    }
  } catch (error) {
    console.log(error)
  }
}

export async function searchMessage(group_id, query) {
  try {
    let url =
      config.backend_server + '/messages/search/' + group_id + '/' + query;
    const result = await axios.get(url);
    if (result.status == 200) {
      return result.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log('search message error', error);
  }
}

export async function PinMessage(message_id) {
  console.log(message_id);
  try {
    let url =
      config.backend_server + '/messages/pin/' + message_id;
    const result = await axios.post(url);
  } catch (error) {
    console.log('pin message error', error);
  }
  return true;
}

export async function UnpinMessage(message_id) {
  try {
    let url =
      config.backend_server + '/messages/unpin/' + message_id;
    await axios.post(url);
  } catch (error) {
    console.log('pin message error', error);
  }
  return true;
}

export async function GetPinnedMessages(group_id) {
  try {
    let url = config.backend_server + '/messages/pin/' + group_id;
    const result = await axios.get(url);
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.log('fetch pinned messages error', error);
  }
  return null;
}

export async function FetchUsers(group_id, setUsers) {
  try {
    let connection_string =
      config.backend_server + '/messages/users/' + group_id;
    return await axios
      .get(connection_string, {
        groupId: group_id,
      })
      .then((response) => {
        var users = {};
        response.data.forEach(function (user) {
          users[user.email] = {
            _id: user.email,
            name: user.first_name + ' ' + user.last_name,
            avatar: user.profile_pic ? user.profile_pic : '',
          };
        });

        setUsers(users);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }

  return [];
}
