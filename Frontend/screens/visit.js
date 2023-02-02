import { View, Text, StyleSheet, TouchableHighlight, Linking, Alert, ScrollView } from 'react-native';
import Header from '../components/visit/header';
import useSWR from 'swr';
import { format } from 'date-fns';
import DaySummary from '../components/calendar/daySummary';
import { AntDesign } from '@expo/vector-icons';
import SectionSelector from '../components/visit/sectionSelector';
import { useContext, useEffect, useState } from 'react';
import Tasks from '../components/visit/tasks';

import config from '../constants/config';
import UserContext from '../services/context/UserContext';
import TasksRefreshContext from '../services/context/TasksRefreshContext';
import VisitTasksRefreshContext from '../services/context/VisitTasksRefreshContext';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Visit({ route, navigation }) {
  const { date } = route.params;

  const dateString = format(date, 'yyyy-MM-dd');

  const [selected, setSelected] = useState('Tasks');

  const user = useContext(UserContext);

  const [, setRefreshVisitTasks] = useContext(VisitTasksRefreshContext);

  const tasksURL = `${config.backend_server}/tasks/group/${user.group_id}/range?start=${dateString}&end=${dateString}`;

  const {
    data: visits,
    error: visitError,
    isLoading: visitLoading,
  } = useSWR(`${config.backend_server}/visits/group/${user.group_id}?start=${dateString}&end=${dateString}`, fetcher);

  const { data: tasks, error: tasksError, isLoading: tasksLoading, mutate } = useSWR(tasksURL, fetcher);

  useEffect(() => {
    setRefreshVisitTasks(() => mutate);
  }, [mutate]);

  const visit = visits && visits[0];

  return (
    <View style={styles.container}>
      <Header date={date} navigation={navigation} />
      <View style={styles.daySummaryContainer}>
        <DaySummary
          override
          date={date}
          navigation={navigation}
          visitInfoOverride={visit}
          errorOverride={visitError}
          isLoadingOverride={visitLoading}
        />
      </View>
      <View style={styles.messageContainer}>
        {visit && (
          <TouchableHighlight
            underlayColor="#ededed"
            onPress={async () => {
              const url = `sms:${visit.phone}`;
              const supported = await Linking.canOpenURL(url);
              if (supported) {
                await Linking.openURL(url);
              } else {
                Alert.alert('Cannot open texting app');
              }
            }}
            style={styles.touchProperties}
          >
            <View style={styles.messageButton}>
              <AntDesign name="message1" size={20} color="#199b1e" />
              <Text style={styles.messageButtonText}>Message {visit.first_name}</Text>
            </View>
          </TouchableHighlight>
        )}
      </View>
      <View style={styles.sectionSelectContainer}>
        <SectionSelector text="Tasks" selected={selected} setSelected={setSelected} />
        <View style={{ width: 48 }} />
        <SectionSelector text="Notes" selected={selected} setSelected={setSelected} />
      </View>
      {selected === 'Tasks' && (
        <Tasks
          tasks={tasks}
          tasksURL={tasksURL}
          date={date}
          navigation={navigation}
          isLoading={tasksLoading}
          error={tasksError}
        />
      )}
      {selected === 'Notes' && (
        <ScrollView style={styles.visitNotesContainer}>
          <Text style={styles.visitNotes}>{visit.visit_notes}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: 'red',
    marginBottom: 40,
  },
  visitNotesContainer: {
    backgroundColor: '#ededed',
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    marginBottom: 40,
  },
  visitNotes: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionSelectContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  daySummaryContainer: {
    height: 72,
    width: '80%',
    marginLeft: '10%',
    marginTop: 24,
    marginBottom: 16,
  },
  messageContainer: {
    flex: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchProperties: {
    borderRadius: 8,
  },
  messageButton: {
    flex: 0,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#199b1e24',
  },
  messageButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#199b1e',
  },
});
