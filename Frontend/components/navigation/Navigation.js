import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from './BottomNavigation';
import GoogleLogin from '../../screens/google';
import RegisterUser from '../../screens/register-user';
import Group from '../../screens/group';
import Visit from '../../screens/visit';
import Task from '../../screens/task';
import { useState } from 'react';
import UserProvider from '../../services/providers/UserProvider';
import CalendarRefreshContext from '../../services/context/CalendarRefreshContext';
import TasksRefreshContext from '../../services/context/TasksRefreshContext';

const initRefreshCalendar = () => {
  console.log('calendar refresh not set');
};

const initRefreshTasks = () => {
  console.log('tasks refresh not set');
};

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState({});
  const [refreshCalendar, setRefreshCalendar] = useState(() => initRefreshCalendar);
  const [refreshTasks, setRefreshTasks] = useState(() => initRefreshTasks);
  return (
    <UserProvider user={user}>
      <CalendarRefreshContext.Provider value={[refreshCalendar, setRefreshCalendar]}>
        <TasksRefreshContext.Provider value={[refreshTasks, setRefreshTasks]}>
          <Stack.Navigator screenOptions={{}} initialRouteName={'Login'}>
            <Stack.Screen name={'Login'} component={GoogleLogin} options={{ headerShown: false }} />
            <Stack.Screen name={'Home'} options={{ headerShown: false }}>
              {(props) => <BottomNavigation {...props} setUser={setUser} />}
            </Stack.Screen>
            <Stack.Screen name={'RegisterUser'} component={RegisterUser} options={{ headerShown: false }} />
            <Stack.Screen name={'Group'} component={Group} options={{ headerShown: false }} />
            <Stack.Screen name="Visit" component={Visit} options={{ headerShown: false }} />
            <Stack.Screen name="Task" component={Task} options={{ headerShown: false }} />
          </Stack.Navigator>
        </TasksRefreshContext.Provider>
      </CalendarRefreshContext.Provider>
    </UserProvider>
  );
}
