import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Notes from '../../screens/notes';
import Messages from '../../screens/messages';
import Metrics from '../../screens/metrics';
import Calendar from '../../screens/calendar';
import Tasks from '../../screens/tasks';
import { useState, useEffect } from 'react';
import config from '../../constants/config';
import UserContext from '../../services/context/UserContext';

const axios = require('axios').default;

// Create a component that will provide the context
function UserProvider({ children, user }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigation({ route, navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData(id, setUser) {
      let connection_string =  config.backend_server + '/user/groupId/' + id;
      return await axios
        .get(connection_string)
        .then(function (response) {
          setUser(response.data);
        })
        .catch(function (error) {
          console.log('Fetching user data unsuccessful.');
          return false;
        });
    }
    if (route && route.params && route.params.user) fetchData(route.params.user.email, setUser);
  }, [route.params]);

  return (
    <UserProvider user={user}>
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
    </UserProvider>
  );
}
