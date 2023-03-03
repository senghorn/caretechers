import config from '../../constants/config';

import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
};

/**
 * Sends create new user request to the backend server using the given
 * first name, last name , email and phone number.
 * @return True : on success
 *         False: on error
 */
export async function createUserWithGroup(first, last, email, phone, group, photo) {
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

export async function fetchUserByEmail(email) {
  let connection_string = config.backend_server + '/user/groupId/' + email;
  return await axios
    .get(connection_string)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return null;
    });
}

/**
 * Sends a join group request to the server
 * @param {string} email
 * @param {int} groupId
 * @returns
 */
export async function addUserToGroup(email, groupName, password) {
  const data = {
    groupName: groupName,
    groupPassword: password
  };
  try {
    // /:userId/group/join'
    let connection_string = config.backend_server + '/user/' + email + '/group/join';
    return await axios
      .post(connection_string, data)
      .then(function (response) {
        return true;
      })
      .catch(function (error) {
        console.log(error);
        return false;
      });
  } catch (error) {
    console.log('join group error ', error.message);
  }

  return false;
}

export async function UpdateUserData(email, first_name, last_name, phone, group_id, profile_pic) {
  const data = {
    email: email,
    firstName: first_name,
    lastName: last_name,
    phoneNum: phone,
    groupId: group_id,
    profilePic: profile_pic,
  };
  try {
    let connection_string = config.backend_server + '/user/' + email;
    return await axios
      .patch(connection_string, data)
      .then(function (response) {
        return true;
      })
      .catch(function (error) {
        console.log(error);
        return false;
      });
  } catch (error) {
    console.log('join group error ', error.message);
  }

  return false;
}

export async function RemoveUserFromGroup(user_id, group_id) {
  let url = config.backend_server + '/user/' + user_id + '/' + group_id;
  try {
    const result = await axios.delete(url);
    if (result.status == 204) {
      console.log('User Left Group Successfully');
      return true;
    } else if (result.status == 404) {
      console.log('remove user results in 404 error code.');
      return false;
    }
  } catch (error) {
    console.log('remove user causes error', error.message);
  }
  return false;
}

export async function setUserNotificationIdentifier(userId, identifier) {
  try {
    await axios.put(`${config.backend_server}/user/${userId}/identifier`, { identifier }, { headers });
  } catch (error) {
    console.log(error);
  }
}
