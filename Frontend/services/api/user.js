import config from '../../constants/config';

const axios = require('axios').default;

/**
 * Sends create new user request to the backend server using the given
 * first name, last name , email and phone number.
 * @return True : on success
 *         False: on error
 */
export async function createUserWithGroup(
  first,
  last,
  email,
  phone,
  group,
  photo
) {
  try {
    const data = {
      email: email,
      firstName: first,
      lastName: last,
      phoneNum: phone,
      groupId: group,
      profilePic: photo,
    };
    let connection_string = config.backend_server + '/user';
    return await axios
      .post(connection_string, data)
      .then(function (response) {
        return true;
      })
      .catch(function (error) {
        console.log('create user error', error);
        return false;
      });
  } catch (error) {
    console.log('error', error.message);
  }
  return false;
}

/**
 * Sends create new user request to the backend server using the given
 * first name, last name , email and phone number.
 * @return True : on success
 *         False: on error
 */
export async function createUser(first, last, email, phone, photo) {
  try {
    const data = {
      email: email,
      firstName: first,
      lastName: last,
      phoneNum: phone,
      profilePic: photo,
    };
    let connection_string = config.backend_server + '/user';
    return await axios
      .post(connection_string, data)
      .then(function (response) {
        return true;
      })
      .catch(function (error) {
        return false;
      });
  } catch (error) {
    console.log('error', error.message);
  }
  return false;
}

/**
 * Sends a join group request to the server
 * @param {string} email 
 * @param {int} groupId 
 * @returns 
 */
export async function addUserToGroup(email, groupId, password) {
  const data = {
    groupId: Number(groupId),
  };
  try {
    let connection_string = config.backend_server + '/user/' + email + '/group';
    return await axios
      .post(connection_string, data)
      .then(function (response) {
        return true;
      })
      .catch(function (error) {
        return false;
      });
  } catch (error) {
    console.log('join group error ', error.message);
  }

  return false;
}
