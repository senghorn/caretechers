import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from './BottomNavigation';
import GoogleLogin from '../../screens/google';
import RegisterUser from '../../screens/register-user';
import Groups from '../../screens/groups';
import Group from '../../screens/group';
import Visit from '../../screens/visit';
import Task from '../../screens/task';
import { useState } from 'react';
import UserProvider from '../../services/providers/UserProvider';
import CalendarRefreshContext from '../../services/context/CalendarRefreshContext';
import TasksRefreshContext from '../../services/context/TasksRefreshContext';
import VisitTasksRefreshContext from '../../services/context/VisitTasksRefreshContext';
import VisitRefreshContext from '../../services/context/VisitRefreshContext';

const initRefreshCalendar = () => {
  console.log('calendar refresh not set');
};

const initRefreshTasks = () => {
  console.log('tasks refresh not set');
};

const initRefreshVisit = () => {
  console.log('visit refresh not set');
};

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState({});
  const [refreshCalendar, setRefreshCalendar] = useState(() => initRefreshCalendar);
  const [refreshTasks, setRefreshTasks] = useState(() => initRefreshTasks);
  const [refreshVisitTasks, setRefreshVisitTasks] = useState(() => initRefreshTasks);
  const [refreshVisit, setRefreshVisit] = useState(() => initRefreshVisit);
  return (
    <UserProvider user={user}>
      <CalendarRefreshContext.Provider value={[refreshCalendar, setRefreshCalendar]}>
        <TasksRefreshContext.Provider value={[refreshTasks, setRefreshTasks]}>
          <VisitRefreshContext.Provider value={[refreshVisit, setRefreshVisit]}>
            <VisitTasksRefreshContext.Provider value={[refreshVisitTasks, setRefreshVisitTasks]}>
              <Stack.Navigator screenOptions={{}} initialRouteName={'Login'}>
                <Stack.Screen name={'Login'} component={GoogleLogin} options={{ headerShown: false }} />
                <Stack.Screen name={'Home'} options={{ headerShown: false }}>
                  {(props) => <BottomNavigation {...props} setUser={setUser} />}
                </Stack.Screen>
                <Stack.Screen name={'RegisterUser'} component={RegisterUser} options={{ headerShown: false }} />
                <Stack.Screen name={'Group'} component={Groups} options={{ headerShown: false }} />
                <Stack.Screen name={'CreateGroup'} component={Group} options={{headerShown: false}} />
                <Stack.Screen name="Visit" component={Visit} options={{ headerShown: false }} />
                <Stack.Screen name="Task" component={Task} options={{ headerShown: false }} />
              </Stack.Navigator>
            </VisitTasksRefreshContext.Provider>
          </VisitRefreshContext.Provider>
        </TasksRefreshContext.Provider>
      </CalendarRefreshContext.Provider>
    </UserProvider>
  );
}
