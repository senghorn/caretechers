import { addHours } from 'date-fns';
import * as Notifications from 'expo-notifications';
import { getDateFromDateString } from '../../utils/date';
import { setVisitNotificationIdentifier } from '../api/visits';
import UserContext from '../context/UserContext';
import { useContext } from 'react';

export async function schedulePushNotification(visitId, name, dateString) {
  const date = addHours(getDateFromDateString(dateString), 9);
  const { user } = useContext(UserContext);
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${name}, today's visit day ❤️`,
      body: 'Click here to view visit info',
      data: { url: 'Visit', params: { dateString } },
    },
    trigger: date,
  });

  await setVisitNotificationIdentifier(visitId, identifier, user.access_token);
}

export async function cancelPushNotification(identifier) {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}
