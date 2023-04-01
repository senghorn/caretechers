import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Notes from '../../screens/note/notes';
import Messages from '../../screens/messages';
import Metrics from '../../screens/metrics';
import Calendar from '../../screens/calendar';
import Tasks from '../../screens/tasks';
import { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import createSocket from '../messages/socket';
import TodaysVisitorContext from '../../services/context/TodaysVisitorContext';
import UserContext from "../../services/context/UserContext";
import SocketContext from '../../services/context/SocketContext';
import { getAPIAccessToken } from '../../services/storage/asyncStorage';

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigation({ route, navigation }) {
  const { isVisitorToday } = useContext(TodaysVisitorContext);
  const { user } = useContext(UserContext);
  const [socket, setSocket] = useContext(SocketContext);
  useEffect(() => {
    if (user) {
      const fetchToken = async () => {
        const token = await getAPIAccessToken();
        console.log('api access token', token);
        console.log('web token', token);
        const newSocket = createSocket(user, token);
        newSocket.connect();
        setSocket(newSocket);
      }
      fetchToken();
    } else {
      console.log('User is null');
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('connect_error', (err) => {
        if (err.message === 'invalid username') {
          console.log('failed to connect to message server');
        }
      });

      socket.on('disconnect', (reason) => {
        console.log(reason);
        socket.disconnect();
        if (reason === 'io server disconnect') {
        }
      });

      // Network clean up: This will clean up any necessary connections with server
      return () => {
        socket.disconnect();
        console.log('cleaning up');
      };
    }
  }, [socket]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Tab.Navigator>
        <Tab.Screen
          name='Notes'
          component={Notes}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name='notebook' color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name='Messages'
          component={Messages}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name='android-messages'
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name='Calendar'
          component={Calendar}
          navigation={navigation}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name='calendar-heart'
                color={color}
                size={26}
              />
            ),
            tabBarBadge: isVisitorToday,
          }}
        />
        <Tab.Screen
          name='Metrics'
          component={Metrics}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name='chart-box'
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name='Tasks'
          component={Tasks}
          navigation={navigation}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name='checkbox-multiple-marked'
                color={color}
                size={26}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
