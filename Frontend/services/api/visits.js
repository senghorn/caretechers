import axios from 'axios';
import config from '../../constants/config';
import { schedulePushNotification } from '../notifications/schedule';

const headers = {
  'Content-Type': 'application/json',
};

export const recordVisit = async (visitId, date, completedTasks, notes, token) => {
  try {
    const tasks = Object.keys(completedTasks).filter((taskId) => completedTasks[taskId]);
    console.log(tasks, notes, date);
    const config = {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.post(`${config.backend_server}/visits/${visitId}/record`, { tasks, notes, date }, config);
  } catch (error) {
    console.log(error);
  }
};

export const deleteVisit = async (visitId, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    };
    await axios.delete(`${config.backend_server}/visits/${visitId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.log('delete error', token);
    console.log(error);
  } finally {
    return;
  }
};

export const volunteerForVisit = async (date, user, token) => {
  const newVisit = {
    date,
    userEmail: user.id,
  };
  console.log('user value', user);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    const result = await fetch(`${config.backend_server}/visits/group/${user.curr_group}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newVisit),
    });
    const data = await result.json();
    const visitId = data.insertId;
    if (date && user.first_name !== null) {
      schedulePushNotification(visitId, user.first_name, date);
    }
  } catch (error) {
    console.log(error);
  }
};
export const setVisitNotificationIdentifier = async (visitId, identifier, token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    await axios.put(`${config.backend_server}/visits/${visitId}/identifier`, { identifier }, { headers });
  } catch (error) {
    console.log(error);
  }
};

