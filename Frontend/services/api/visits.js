import axios from 'axios';
import config from '../../constants/config';

const headers = {
  'Content-Type': 'application/json',
};

export const recordVisit = async (visitId, date, completedTasks, notes) => {
  try {
    const tasks = Object.keys(completedTasks).filter((taskId) => completedTasks[taskId]);
    await axios.post(`${config.backend_server}/visits/${visitId}/record`, { tasks, notes, date }, { headers });
  } catch (error) {
    console.log(error);
  }
};

export const deleteVisit = async (visitId) => {
  try {
    await axios.delete(`${config.backend_server}/visits/${visitId}`);
  } catch (error) {
    console.log(error);
  } finally {
    return;
  }
};

export const volunteerForVisit = async (date, user) => {
  const newVisit = {
    date,
    userEmail: user.email,
  };

  try {
    await fetch(`${config.backend_server}/visits/group/${user.group_id}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newVisit),
    });
  } catch (error) {
    console.log(error);
  }
};
