import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import Navigation from './components/navigation/Navigation';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import colors from './constants/colors';
import { Asset } from 'expo-asset';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const navigationRef = useRef();
  const responseListener = useRef();
  const [inviteToken, setInviteToken] = useState(null);

  const [imagesLoaded] = useImages([
    require('./assets/abstract_background.jpg'),
    require('./assets/caretaker.png'),
    require('./assets/blue-background.jpg'),
    require('./assets/badge.png'),
    require('./assets/crown.png'),
    require('./assets/circle.png'),
    require('./assets/house.jpg')
  ]);

  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const samePage = notification.request.content.data.url === navigationRef.current?.getCurrentRoute().name;
      return { shouldShowAlert: !samePage, shouldPlaySound: true, shouldSetBadge: true };
    },
  });

  // used for deep linking
  const url = Linking.useURL();
  useEffect(() => {
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
      params = {},
      match;
    while (match = regex.exec(url)) {
      params[match[1]] = match[2];
    }
    setInviteToken(params.token)
  }, [url]);


  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const url = response.notification.request.content.data.url;
      const params = response.notification.request.content.data.params;
      navigationRef.current?.navigate(url, params);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Navigation expoPushToken={expoPushToken} inviteToken={inviteToken} />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
});

function useImages(images) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Asset.loadAsync(images)
      .then(() => setLoaded(true))
      .catch(setError);
  }, []);

  return [loaded, error];
}
