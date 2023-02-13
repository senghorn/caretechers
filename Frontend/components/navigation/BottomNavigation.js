import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Notes from '../../screens/note/notes';
import Messages from '../../screens/messages';
import Metrics from '../../screens/metrics';
import Calendar from '../../screens/calendar';
import Tasks from '../../screens/tasks';
import { useEffect } from 'react';
import config from '../../constants/config';

const axios = require('axios').default;

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigation({ route, navigation, setUser }) {
  useEffect(() => {
    async function fetchData(id, setUser) {
      try {
        let connection_string = config.backend_server + '/user/groupId/' + id;
        const response = await axios.get(connection_string);
        setUser(response.data);
      } catch (error) {
        console.log(error);
        console.log('Fetching user data unsuccessful.');
      }
    }
    if (route && route.params && route.params.user) fetchData(route.params.user.email, setUser);
  }, [route.params]);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Notes"
        component={Notes}
        initialParams={{ user: route['params'] }}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="notebook" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        initialParams={{ user: route['params'] }}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="android-messages" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        navigation={navigation}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="calendar-heart" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Metrics"
        component={Metrics}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chart-box" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={Tasks}
        navigation={navigation}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="checkbox-multiple-marked" color={color} size={26} />,
        }}
      />
    </Tab.Navigator>
  );
}
