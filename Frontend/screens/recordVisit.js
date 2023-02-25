import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import SectionSelector from '../components/visit/sectionSelector';
import Tasks from '../components/visit/tasks';
import { getDateString, getHumanReadableDate } from '../utils/date';
import useSWR from 'swr';
import UserContext from '../services/context/UserContext';
import VisitTasksRefreshContext from '../services/context/VisitTasksRefreshContext';
import VisitRefreshContext from '../services/context/VisitRefreshContext';
import config from '../constants/config';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function RecordVisit({ navigation }) {
  const date = new Date();
  const dateString = getDateString(date);

  const [selected, setSelected] = useState('Tasks');

  const { user } = useContext(UserContext);

  const [, setRefreshVisitTasks] = useContext(VisitTasksRefreshContext);
  const [, setRefreshVisit] = useContext(VisitRefreshContext);

  const tasksURL = `${config.backend_server}/tasks/group/${user.group_id}/range?start=${dateString}&end=${dateString}`;

  const {
    data: visits,
    error: visitError,
    isLoading: visitLoading,
    mutate: visitMutate,
  } = useSWR(`${config.backend_server}/visits/group/${user.group_id}?start=${dateString}&end=${dateString}`, fetcher);

  useEffect(() => {
    setRefreshVisit(() => visitMutate);
  }, [visitMutate]);

  const { data: tasks, error: tasksError, isLoading: tasksLoading, mutate: taskMutate } = useSWR(tasksURL, fetcher);

  useEffect(() => {
    setRefreshVisitTasks(() => taskMutate);
  }, [taskMutate]);

  const visit = visits && visits[0];

  const humanReadable = getHumanReadableDate(date, true);
  return (
    <View style={styles.outerContainer}>
      <Appbar.Header style={styles.container}>
        <Appbar.Action
          icon="chevron-left"
          onPress={() => {
            navigation.navigate('Home');
          }}
        />
        <Appbar.Content title={'Record Visit'} titleStyle={styles.titleText} />
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
