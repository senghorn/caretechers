import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from './BottomNavigation';
import GoogleLogin from '../../screens/google';
import RegisterUser from '../../screens/user/register-user';
import Groups from '../../screens/group/groups';
import CreateGroup from '../../screens/group/create-group';
import Visit from '../../screens/visit';
import Task from '../../screens/task';
import Settings from '../../screens/settings';
import UserAccount from '../../screens/user/user-account';
import GroupSettings from '../../screens/group/group-setting';
import { useState } from 'react';
import UserProvider from '../../services/providers/UserProvider';
import CalendarRefreshContext from '../../services/context/CalendarRefreshContext';
import TasksRefreshContext from '../../services/context/TasksRefreshContext';
import VisitTasksRefreshContext from '../../services/context/VisitTasksRefreshContext';
import VisitRefreshContext from '../../services/context/VisitRefreshContext';
import { RefreshProvider } from '../../services/context/RefreshContext';
import Note from '../../screens/note/note';
import NewNote from '../../screens/note/newNote';

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
    <UserProvider user={user} setUser={setUser}>
      <CalendarRefreshContext.Provider value={[refreshCalendar, setRefreshCalendar]}>
        <TasksRefreshContext.Provider value={[refreshTasks, setRefreshTasks]}>
          <VisitRefreshContext.Provider value={[refreshVisit, setRefreshVisit]}>
            <VisitTasksRefreshContext.Provider value={[refreshVisitTasks, setRefreshVisitTasks]}>
              <RefreshProvider>
                <Stack.Navigator screenOptions={{}} initialRouteName={'Login'}>
                  <Stack.Screen name={'Login'} component={GoogleLogin} options={{ headerShown: false }} />
                  <Stack.Screen name={'Home'} options={{ headerShown: false, gestureEnabled: false }}>
                    {(props) => <BottomNavigation {...props} setUser={setUser} />}
                  </Stack.Screen>
                  <Stack.Screen name={'RegisterUser'} component={RegisterUser} options={{ headerShown: false }} />
                  <Stack.Screen name={'Group'} component={Groups} options={{ headerShown: false, gestureEnabled: false }} />
                  <Stack.Screen
                    name={'CreateGroup'}
                    component={CreateGroup}
                    options={{ headerShown: false, gestureEnabled: false }}
                  />
                  <Stack.Screen name="Visit" component={Visit} options={{ headerShown: false }} />
                  <Stack.Screen name="Task" component={Task} options={{ headerShown: false }} />
                  <Stack.Screen name="Note" component={Note} options={{ headerShown: false }} />
                  <Stack.Screen name="New Note" component={NewNote} options={{ headerShown: false }} />
                  <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
                  <Stack.Screen name="UserAccount" component={UserAccount} options={{ headerShown: false }} />
                  <Stack.Screen name="GroupSettings" component={GroupSettings} options={{ headerShown: false }} />
                </Stack.Navigator>
              </RefreshProvider>
            </VisitTasksRefreshContext.Provider>
          </VisitRefreshContext.Provider>
        </TasksRefreshContext.Provider>
      </CalendarRefreshContext.Provider>
    </UserProvider>
  );
}
