import { addHours, addSeconds } from 'date-fns';
import * as Notifications from 'expo-notifications';
import { getDateFromDateString } from '../../utils/date';

export async function schedulePushNotification(name, dateString) {
  const date = addSeconds(new Date(), 9);

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${name}, today's visit day ❤️`,
      body: 'Click here to view visit info',
      data: { url: 'Visit', params: { dateString } },
    },
    trigger: date,
  });
}
