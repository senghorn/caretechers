import config from '../../constants/config';

const axios = require('axios').default;
/**
 * Crates a new group given the name and visit frequency.
 * @param {string} groupName
 * @param {int} visit_frequency
 * @returns
 */
export async function createNewGroup(groupName, timezone, visit_frequency) {
  const data = {
    name: groupName,
    visitFrequency: visit_frequency,
    timeZone: timezone,
  };
  try {
    let connection_string = config.backend_server + '/groups/';
    return await axios
      .post(connection_string, data)
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

export async function resetGroupPassword(group_id) {
  try {
    let connection_string =
      config.backend_server + '/groups/passreset/' + group_id;
    return await axios
      .patch(connection_string)
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
