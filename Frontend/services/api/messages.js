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

/**
 * Returns relevant messages upon successful search of the given query.
 * Otherwise, returns null.
 * @param {string} group_id 
 * @param {string} query 
 * @returns 
 */
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
  return null;
}

/**
 * Sends a request to the server to pin the message of message_id
 * @param {string} message_id 
 * @returns 
 */
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

/**
 * Sends a request to the server to unpin the message of message_id
 * @param {string} message_id 
 * @returns 
 */
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

/**
 * Returns all pinned messages of the given group. Null upon error.
 * @param {string} group_id 
 * @returns []
 */
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


/**
 * Fetches users that are in the user's group. Upon success, it calls setUsers on all the received data.
 * It also calls setThisUser on the user that has id matches provided user.
 * @param {object} user 
 * @param {function} setUsers 
 * @param {function} setThisUser 
 * @param {string} cookie 
 * @returns 
 */
export async function FetchUsers(user, setUsers, setThisUser, cookie) {
  try {
    let connection_string =
      config.backend_server + '/messages/users/' + user.curr_group;
    let headers = {
      Authorization: `Bearer ${cookie}`,
    };
    return await axios.get(connection_string, {
      headers: headers,
      params: {
        groupId: user.curr_group
      }
    })
      .then((response) => {
        var users = {};
        response.data.forEach(function (newUser) {
          users[newUser.email] = {
            _id: newUser.email,
            name: newUser.first_name + ' ' + newUser.last_name,
            avatar: newUser.profile_pic ? newUser.profile_pic : '',
          };
          if (user.id === newUser.email) {
            setThisUser({
              _id: newUser.email,
              name: newUser.first_name + ' ' + newUser.last_name,
              avatar: newUser.profile_pic ? newUser.profile_pic : '',
            })
          }
        });

        setUsers(users);
        return response.data;
      })
      .catch((error) => {
        console.log('fetch user error', error);
      });
  } catch (error) {
    console.log(error.message);
  }

  return [];
}
