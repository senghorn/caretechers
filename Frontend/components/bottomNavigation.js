import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Notes from '../screens/notes';
import Messages from '../screens/messages';
import Metrics from '../screens/metrics';
import Calendar from '../screens/calendar';
import Tasks from '../screens/tasks';
import LogIn from '../screens/login'

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Notes"
        component={Notes}
        options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="notebook" color={color} size={26} /> }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="android-messages" color={color} size={26} /> }}
      />
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="calendar-heart" color={color} size={26} /> }}
      />
      <Tab.Screen
        name="Metrics"
        component={Metrics}
        options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chart-box" color={color} size={26} /> }}
      />
      <Tab.Screen
        name="Tasks"
        component={Tasks}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="checkbox-multiple-marked" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Login"
        component={LogIn}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" color={color} size={26} />,
        }}
      />
    </Tab.Navigator>
  );
}
