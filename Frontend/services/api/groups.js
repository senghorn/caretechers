import config from '../../constants/config';

const axios = require('axios').default;
/**
 * Crates a new group given the name and visit frequency.
 * @param {string} groupName
 * @param {int} visit_frequency
 * @returns
 */
export async function createNewGroup(groupName, timezone, visit_frequency, token) {
  const data = {
    name: groupName,
    visitFrequency: visit_frequency,
    timeZone: timezone,
  };
  try {
    let connection_string = config.backend_server + '/groups/';
    return await axios
      .post(connection_string, data, {
        headers: { 'Authorization': 'Bearer ' + token }
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        return null;
      });
  } catch (error) {
    console.log('create group error ', error.message);
  }

  return null;
}
/**
 * fetches and return group information data. Returns null upon error.
 * @param {string} group_id
 * @returns
 */
export async function getGroupInfo(group_id) {
  try {
    let connection_string = config.backend_server + '/groups/info/' + group_id;
    return await axios
      .get(connection_string)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        return null;
      });
  } catch (error) {
    console.log('create group error ', error.message);
    return null;
  }
}

/**
 * Returns a password for joining a group. Returns null upon error.
 * @param {string} group_id
 * @returns
 */
export async function getGroupPassword(group_id) {
  try {
    let connection_string =
      config.backend_server + '/groups/password/' + group_id;
    return await axios
      .get(connection_string)
      .then(function (response) {
        if (response.data[0] != undefined) {
          return response.data[0].password;
        }
        return null;
      })
      .catch(function (error) {
        return null;
      });
  } catch (error) {
    console.log('create group error ', error.message);
    return null;
  }
}

/**
 * Resets the password. New password is generated by the server.
 * @param {string} group_id
 * @returns
 */
export async function resetGroupPassword(group_id, cookie) {
  try {
    let connection_string =
      config.backend_server + '/groups/passreset/' + group_id;
    return await axios
      .patch(connection_string, {}, {
        headers: { 'Authorization': 'Bearer ' + cookie }
      })
      .then(function (response) {
        if (response.data[0] != undefined) {
          return response.data[0].password;
        }
        return null;
      })
      .catch(function (error) {
        return null;
      });
  } catch (error) {
    console.log('create group error ', error.message);
    return null;
  }
}
