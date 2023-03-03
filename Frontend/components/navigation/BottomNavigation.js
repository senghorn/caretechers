import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Notes from '../../screens/note/notes';
import Messages from '../../screens/messages';
import Metrics from '../../screens/metrics';
import Calendar from '../../screens/calendar';
import Tasks from '../../screens/tasks';
import { useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import TodaysVisitorContext from '../../services/context/TodaysVisitorContext';

const axios = require('axios').default;

const Tab = createMaterialBottomTabNavigator();

export default function BottomNavigation({ route, navigation }) {
  const { isVisitorToday } = useContext(TodaysVisitorContext);

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
