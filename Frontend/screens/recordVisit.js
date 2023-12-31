import { useContext, useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import SectionSelector from '../components/visit/sectionSelector';
import Tasks from '../components/visit/tasks';
import { getCurrentDateString, getDateString, getHumanReadableDate } from '../utils/date';
import useSWR from 'swr';
import UserContext from '../services/context/UserContext';
import VisitTasksRefreshContext from '../services/context/VisitTasksRefreshContext';
import VisitRefreshContext from '../services/context/VisitRefreshContext';
import config from '../constants/config';
import VisitNotes from '../components/visit/notes';
import colors from '../constants/colors';
import RecordVisitContext from '../services/context/RecordVisitContext';
import { recordVisit } from '../services/api/visits';
import CalendarRefreshContext from '../services/context/CalendarRefreshContext';
import TodaysVisitorContext from '../services/context/TodaysVisitorContext';
import SocketContext from '../services/context/SocketContext';

const fetcher = (url, token) => fetch(url, token).then((res) => res.json());

/**
 * Visit recording screen that support visit completing and allow user to take notes of the visit.
 * @param {Object} navigation: React component for navigation 
 * @returns 
 */
export default function RecordVisit({ navigation }) {
  const date = new Date();
  const dateString = getDateString(date);

  const [selected, setSelected] = useState('Tasks');

  const { user } = useContext(UserContext);
  const [socket] = useContext(SocketContext);

  const [refreshVisitTasks, setRefreshVisitTasks] = useContext(VisitTasksRefreshContext);
  const [refreshVisit, setRefreshVisit] = useContext(VisitRefreshContext);
  const [refreshCalendar] = useContext(CalendarRefreshContext);

  const tasksURL = `${config.backend_server}/tasks/group/${user.curr_group}/range?start=${dateString}&end=${dateString}`;

  // Fetcher to retrieve visits information
  const {
    data: visits,
    error: visitError,
    isLoading: visitLoading,
    mutate: visitMutate,
  } = useSWR(
    [
      `${config.backend_server}/visits/group/${user.curr_group}?start=${dateString}&end=${dateString}`,
      {
        headers: { Authorization: 'Bearer ' + user.access_token },
      },
    ],
    ([url, token]) => fetcher(url, token)
  );

  useEffect(() => {
    setRefreshVisit(() => visitMutate);
  }, [visitMutate]);

  const {
    data: tasks,
    error: tasksError,
    isLoading: tasksLoading,
    mutate: taskMutate,
  } = useSWR(
    [
      tasksURL,
      {
        headers: { Authorization: 'Bearer ' + user.access_token },
      },
    ],
    ([url, token]) => fetcher(url, token)
  );

  useEffect(() => {
    setRefreshVisitTasks(() => taskMutate);
  }, [taskMutate]);

  const visit = visits && visits[0];

  const { visitNotes, setVisitNotes, visitTasks, setVisitTasks } = useContext(RecordVisitContext);

  const { refreshTodaysVisitor } = useContext(TodaysVisitorContext);

  const [recordingVisit, setRecordingVisit] = useState(false);

  const humanReadable = getHumanReadableDate(date, true);
  return (
    <View style={styles.outerContainer}>
      <Appbar.Header style={styles.container}>
        <Appbar.Action
          icon="chevron-left"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title={'Record Visit'} titleStyle={styles.titleText} />
        <Appbar.Action />
        <Button
          icon="heart"
          color={colors.primary}
          uppercase={false}
          mode={'contained'}
          loading={recordingVisit}
          disabled={recordingVisit}
          onPress={() => {
            Alert.alert(
              'Finish Visit?',
              'By clicking "Confirm", you affirm that you have visited the recipient today', // <- this part is optional, you can pass an empty string
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Confirm',
                  onPress: async () => {
                    setRecordingVisit(true);
                    await recordVisit(visit.visitId, getCurrentDateString(), visitTasks, visitNotes, user.access_token);
                    socket.emit('refreshCalendar');
                    refreshVisit();
                    refreshVisitTasks();
                    refreshTodaysVisitor();
                    await refreshCalendar();
                    setRecordingVisit(false);
                    setVisitNotes('');
                    setVisitTasks({});
                    navigation.goBack();
                  },
                  style: 'destructive',
                },
              ],
              {
                cancelable: true,
              }
            );
          }}
          style={{ marginRight: 8 }}
        >
          Finish
        </Button>
      </Appbar.Header>
      <View style={styles.contentContainer}>
        <Text style={styles.dateLabel}>{humanReadable}</Text>
        <View style={styles.sectionSelectContainer}>
          <SectionSelector text="Tasks" selected={selected} setSelected={setSelected} />
          <View style={{ width: 48 }} />
          <SectionSelector text="Notes" selected={selected} setSelected={setSelected} />
        </View>
        <View style={styles.taskAndNotesContainer}>
          {selected === 'Tasks' && (
            <Tasks
              tasks={tasks}
              tasksURL={tasksURL}
              dateString={dateString}
              navigation={navigation}
              isLoading={tasksLoading}
              error={tasksError}
              canCheck={true}
            />
          )}
          {selected === 'Notes' && <VisitNotes editMode editContent={visitNotes} setEditContent={setVisitNotes} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    shadowOffset: { width: 0, height: -10 },
    shadowColor: '#888',
    shadowOpacity: 0.1,
    zIndex: 999,
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    backgroundColor: '#fff',
  },
  titleText: {
    fontWeight: '500',
    fontSize: 18,
  },
  contentContainer: {
    paddingTop: 16,
    paddingHorizontal: 8,
    flex: 0,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 18,
    fontWeight: '400',
  },
  sectionSelectContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  taskAndNotesContainer: {},
});
