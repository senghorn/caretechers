import { useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Tasks from '../components/visit/tasks';
import { getDateString, getHumanReadableDate } from '../utils/date';
import useSWR from 'swr';
import UserContext from '../services/context/UserContext';
import VisitTasksRefreshContext from '../services/context/VisitTasksRefreshContext';
import VisitRefreshContext from '../services/context/VisitRefreshContext';
import config from '../constants/config';
import Header from '../components/recordVisit/Header';
import { Button } from 'react-native-paper';
import colors from '../constants/colors';

const fetcher = (url, token) => fetch(url, token).then((res) => res.json());

/**
 * Visit recording screen that support visit completing and allow user to take notes of the visit.
 * @param {Object} navigation: React component for navigation
 * @returns
 */
export default function RecordVisit({ navigation }) {
  const date = new Date();
  const dateString = getDateString(date);

  const { user } = useContext(UserContext);

  const [, setRefreshVisitTasks] = useContext(VisitTasksRefreshContext);
  const [, setRefreshVisit] = useContext(VisitRefreshContext);

  const tasksURL = `${config.backend_server}/tasks/group/${user.curr_group}/range?start=${dateString}&end=${dateString}`;

  // Fetcher to retrieve visits information
  const { data: visits, mutate: visitMutate } = useSWR(
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

  const humanReadable = getHumanReadableDate(date, true);
  return (
    <View style={styles.outerContainer}>
      <Header visits={visits} navigation={navigation} />
      <View style={styles.contentContainer}>
        <Text style={styles.dateLabel}>{humanReadable}</Text>
        <Button
          icon="note"
          color={colors.lightYellow}
          uppercase={false}
          mode={'contained'}
          style={styles.goToNotesButton}
          onPress={() => {
            navigation.navigate('Record Visit Notes');
          }}
        >
          Record Notes
        </Button>
        <View style={styles.taskAndNotesContainer}>
          <Tasks
            tasks={tasks}
            tasksURL={tasksURL}
            dateString={dateString}
            navigation={navigation}
            isLoading={tasksLoading}
            error={tasksError}
            canCheck={true}
          />
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
  goToNotesButton: {
    marginTop: 12,
  },
});
