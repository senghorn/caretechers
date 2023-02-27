import { View, Text, StyleSheet, TouchableHighlight, Linking, Alert } from 'react-native';
import Header from '../components/visit/header';
import useSWR from 'swr';
import { format } from 'date-fns';
import DaySummary from '../components/calendar/daySummary';
import { AntDesign } from '@expo/vector-icons';
import SectionSelector from '../components/visit/sectionSelector';
import { Fragment, useContext, useEffect, useState } from 'react';
import Tasks from '../components/visit/tasks';

import config from '../constants/config';
import UserContext from '../services/context/UserContext';
import VisitTasksRefreshContext from '../services/context/VisitTasksRefreshContext';
import VisitRefreshContext from '../services/context/VisitRefreshContext';
import { getDateFromDateString, getDateString } from '../utils/date';
import colors from '../constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { deleteVisit } from '../services/api/visits';
import CalendarRefreshContext from '../services/context/CalendarRefreshContext';
import TodaysVisitorContext from '../services/context/TodaysVisitorContext';
import { ActivityIndicator } from 'react-native-paper';
import VisitNotes from '../components/visit/notes';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Visit({ route, navigation }) {
  const { dateString } = route.params;
  const date = getDateFromDateString(dateString);

  const [selected, setSelected] = useState('Tasks');

  const { user } = useContext(UserContext);

  const [, setRefreshVisitTasks] = useContext(VisitTasksRefreshContext);
  const [, setRefreshVisit] = useContext(VisitRefreshContext);

  const [refreshCalendar] = useContext(CalendarRefreshContext);

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

  const { refreshTodaysVisitor } = useContext(TodaysVisitorContext);

  const [isDropping, setIsDropping] = useState(false);

  useEffect(() => {
    setRefreshVisitTasks(() => taskMutate);
  }, [taskMutate]);

  const visit = visits && visits[0];

  const { isVisitorToday } = useContext(TodaysVisitorContext);

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
          visitFirst
        />
      </View>
      <View style={styles.messageContainer}>
        {visit && visit.visitor && visit.visitor !== user.email && (
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
        {isVisitorToday && visit.date === getDateString(new Date()) && (
          <TouchableHighlight
            underlayColor="#ededed"
            onPress={async () => {
              navigation.navigate('Record Visit');
            }}
            style={[styles.touchProperties, styles.marginRight]}
          >
            <View style={styles.recordButton}>
              {isDropping ? null : (
                <Fragment>
                  <MaterialCommunityIcons name="calendar-edit" size={16} color="green" />
                  <Text style={styles.recordButtonText}>Record Visit</Text>
                </Fragment>
              )}
            </View>
          </TouchableHighlight>
        )}
        {visit && visit.visitor === user.email && visit.date >= getDateString(new Date()) && (
          <TouchableHighlight
            underlayColor="#ededed"
            onPress={async () => {
              Alert.alert(
                'Retract visit sign-up?',
                'If so, you may want to ask another caretaker to pick up your slack', // <- this part is optional, you can pass an empty string
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Confirm',
                    onPress: async () => {
                      setIsDropping(true);
                      await deleteVisit(visit.visitId);
                      taskMutate();
                      refreshCalendar();
                      refreshTodaysVisitor();
                      await visitMutate();
                      setIsDropping(false);
                    },
                    style: 'destructive',
                  },
                ],
                {
                  cancelable: true,
                }
              );
            }}
            style={styles.touchProperties}
          >
            <View style={styles.cancelButton}>
              {isDropping ? (
                <Fragment>
                  <ActivityIndicator color={colors.danger} size="small" />
                </Fragment>
              ) : (
                <Fragment>
                  <MaterialCommunityIcons name="trash-can" size={16} color={colors.danger} />
                  <Text style={styles.cancelButtonText}>Drop Visit</Text>
                </Fragment>
              )}
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
          dateString={dateString}
          navigation={navigation}
          isLoading={tasksLoading}
          error={tasksError}
        />
      )}
      {selected === 'Notes' && (
        <View style={styles.visitNotesContainer}>
          <VisitNotes editMode={false} editContent={visit.visit_notes} />
        </View>
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
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 40,
    backgroundColor: 'red',
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
  cancelButton: {
    flex: 0,
    height: 32,
    width: 120,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  cancelButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.danger,
  },
  recordButton: {
    flex: 0,
    height: 32,
    width: 120,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#199b1e42',
  },
  recordButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: 'green',
  },
  marginRight: {
    marginRight: 16,
  },
});
