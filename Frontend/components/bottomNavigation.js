import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Notes from "../screens/notes";
import Messages from "../screens/messages";
import Metrics from "../screens/metrics";
import Calendar from "../screens/calendar";
import Tasks from "../screens/tasks";

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigation({ route, navigation }) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Notes"
        component={Notes}
        initialParams={{user: route["params"]}}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="notebook" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        initialParams={{user: route["params"]}}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="android-messages"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="calendar-heart"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Metrics"
        component={Metrics}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-box" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={Tasks}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="checkbox-multiple-marked"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
