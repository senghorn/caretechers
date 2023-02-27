import axios from 'axios';
import config from '../../constants/config';

const headers = {
  'Content-Type': 'application/json',
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
