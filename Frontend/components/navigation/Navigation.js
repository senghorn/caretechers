import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from './BottomNavigation';
import GoogleLogin from '../../screens/google';
import RegisterUser from '../../screens/user/register-user';
import Groups from '../../screens/group/groups';
import GroupSelector from '../../screens/group/group-selector';
import CreateGroup from '../../screens/group/create-group';
import Visit from '../../screens/visit';
import Task from '../../screens/task';
import Settings from '../../screens/settings';
import UserAccount from '../../screens/user/user-account';
import GroupSettings from '../../screens/group/group-setting';
import Metrics from '../../screens/metrics';
import EditGraph from '../../screens/editGraph';
import { useEffect, useState } from 'react';
import UserProvider from '../../services/providers/UserProvider';
import CalendarRefreshContext from '../../services/context/CalendarRefreshContext';
import TasksRefreshContext from '../../services/context/TasksRefreshContext';
import VisitTasksRefreshContext from '../../services/context/VisitTasksRefreshContext';
import VisitRefreshContext from '../../services/context/VisitRefreshContext';
import SocketContext from '../../services/context/SocketContext';
import InviteLinkContext from '../../services/context/InviteLinkContext';
import { NotesRefreshProvider } from '../../services/context/NotesRefreshContext';
import Note from '../../screens/note/note';
import NewNote from '../../screens/note/newNote';
import RecordVisit from '../../screens/recordVisit2';
import PinnedMessages from '../../screens/pinnedMessages';
import useSWR from 'swr';
import { fetcher } from '../../utils/dataFetching';
import { getDateString } from '../../utils/date';
import config from '../../constants/config';
import TodaysVisitorContext from '../../services/context/TodaysVisitorContext';
import RecordVisitContext from '../../services/context/RecordVisitContext';
import { setUserNotificationIdentifier } from '../../services/api/user';
import createSocket from '../messages/socket';
import RecordVisitNotes from '../recordVisit/VisitNotes';

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

export default function Navigation({ expoPushToken, inviteToken }) {
  const [user, setUser] = useState(null);
  const [refreshCalendar, setRefreshCalendar] = useState(() => initRefreshCalendar);
  const [refreshTasks, setRefreshTasks] = useState(() => initRefreshTasks);
  const [refreshVisitTasks, setRefreshVisitTasks] = useState(() => initRefreshTasks);
  const [refreshVisit, setRefreshVisit] = useState(() => initRefreshVisit);
  const [dateString, setDateString] = useState(getDateString(new Date()));
  const [groupId, setGroupId] = useState('');
  const [socket, setNewSocket] = useState(null);

  const setSocket = (new_socket) => {
    if (socket) {
      // Ensuring that we only have one living socket!
      socket.disconnect();
    }
    setNewSocket(new_socket);
  };

  useEffect(() => {
    if (socket) {
      socket.on('refreshCalendar', () => {
        refreshCalendar();
      });
    }
  }, [socket, refreshCalendar]);

  useEffect(() => {
    if (user && user.access_token && !socket) {
      const newSocket = createSocket(user, user.access_token);
      newSocket.connect();
      setSocket(newSocket);
    }
  }, [user, socket]);

  // { data: null, error: false, isLoading: true, mutate: () => { } } :
  const { data, mutate } = useSWR(
    [
      `${config.backend_server}/visits/group/${groupId}?start=${dateString}&end=${dateString}`,
      {
        headers: { Authorization: `Bearer ${user?.access_token}` },
      },
    ],
    ([url, token]) => fetcher(url, token)
  );

  useEffect(() => {
    if (user && user.curr_group) {
      setGroupId(user.curr_group);
    }
  }, [user]);

  useEffect(() => {
    if (groupId) {
      mutate();
    }
  }, [groupId]);

  useEffect(() => {
    if (user && user.id) {
      setUserNotificationIdentifier(user.id, expoPushToken);
    }
  }, [user, expoPushToken]);

  const [refreshTodaysVisitor] = useState(() => mutate);
  const [isVisitorToday, setIsVisitorToday] = useState(false);

  useEffect(() => {
    if (data && data.length > 0 && data[0].visitor === user.id && !data[0].visitCompleted) {
      setIsVisitorToday(true);
    } else setIsVisitorToday(false);
  }, [data]);

  const [visitNotes, setVisitNotes] = useState('');
  const [visitTasks, setVisitTasks] = useState({});

  return (
    <UserProvider user={user} setUser={setUser}>
      <SocketContext.Provider value={[socket, setSocket]}>
        <TodaysVisitorContext.Provider value={{ isVisitorToday, refreshTodaysVisitor }}>
          <CalendarRefreshContext.Provider value={[refreshCalendar, setRefreshCalendar]}>
            <TasksRefreshContext.Provider value={[refreshTasks, setRefreshTasks]}>
              <VisitRefreshContext.Provider value={[refreshVisit, setRefreshVisit]}>
                <VisitTasksRefreshContext.Provider value={[refreshVisitTasks, setRefreshVisitTasks]}>
                  <NotesRefreshProvider>
                    <RecordVisitContext.Provider
                      value={{
                        visitNotes,
                        setVisitNotes,
                        visitTasks,
                        setVisitTasks,
                      }}
                    >
                      <InviteLinkContext.Provider value={inviteToken}>
                        <Stack.Navigator screenOptions={{}} initialRouteName={'Login'}>
                          <Stack.Screen name={'Login'} component={GoogleLogin} options={{ headerShown: false }} />
                          <Stack.Screen
                            name={'Home'}
                            component={BottomNavigation}
                            options={{ headerShown: false, gestureEnabled: false }}
                          />
                          <Stack.Screen name={'RegisterUser'} component={RegisterUser} options={{ headerShown: false }} />
                          <Stack.Screen
                            name={'Group'}
                            component={Groups}
                            options={{ headerShown: false, gestureEnabled: false }}
                          />
                          <Stack.Screen
                            name={'CreateGroup'}
                            component={CreateGroup}
                            options={{ headerShown: false, gestureEnabled: false }}
                          />
                          <Stack.Screen name="Visit" component={Visit} options={{ headerShown: false }} />
                          <Stack.Screen name="Record Visit" component={RecordVisit} options={{ headerShown: false }} />
                          <Stack.Screen name="Record Visit Notes" component={RecordVisitNotes} options={{ headerShown: false }} />
                          <Stack.Screen name="Task" component={Task} options={{ headerShown: false }} />
                          <Stack.Screen name="Note" component={Note} options={{ headerShown: false }} />
                          <Stack.Screen name="New Note" component={NewNote} options={{ headerShown: false }} />
                          <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
                          <Stack.Screen name="UserAccount" component={UserAccount} options={{ headerShown: false }} />
                          <Stack.Screen name="GroupSettings" component={GroupSettings} options={{ headerShown: false }} />
                          <Stack.Screen name="Metrics" component={Metrics} options={{ headerShown: false }} />
                          <Stack.Screen name="EditGraph" component={EditGraph} options={{ headerShown: false }} />
                          <Stack.Screen name="PinnedMessages" component={PinnedMessages} options={{ headerShown: false }} />
                          <Stack.Screen name="GroupSelector" component={GroupSelector} options={{ headerShown: false }} />
                        </Stack.Navigator>
                      </InviteLinkContext.Provider>
                    </RecordVisitContext.Provider>
                  </NotesRefreshProvider>
                </VisitTasksRefreshContext.Provider>
              </VisitRefreshContext.Provider>
            </TasksRefreshContext.Provider>
          </CalendarRefreshContext.Provider>
        </TodaysVisitorContext.Provider>
      </SocketContext.Provider>
    </UserProvider>
  );
}
