import { addHours } from 'date-fns';
import * as Notifications from 'expo-notifications';
import { getDateFromDateString } from '../../utils/date';
import { setVisitNotificationIdentifier } from '../api/visits';

export async function schedulePushNotification(visitId, name, dateString, token) {
  const date = addHours(getDateFromDateString(dateString), 9);
  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${name}, today's visit day ❤️`,
        body: 'Click here to view visit info',
        data: { url: 'Visit', params: { dateString } },
      },
      trigger: date,
    });

    await setVisitNotificationIdentifier(visitId, identifier, token);
  } catch (error) {
    console.log('Error scheduling notification: ', error);
  }
}

export async function cancelPushNotification(identifier) {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}
