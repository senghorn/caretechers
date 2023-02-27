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
