import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button } from 'react-native-paper';
import Description from '../components/task/description';
import Header from '../components/task/header';
import RepeatBehavior from '../components/task/repeatBehavior';
import config from '../constants/config';
import useSWR from 'swr';
import { differenceInDays, format, isSameDay, max, startOfDay } from 'date-fns';
import UserContext from '../services/context/UserContext';
import CalendarRefreshContext from '../services/context/CalendarRefreshContext';
import TasksRefreshContext from '../services/context/TasksRefreshContext';
import VisitTasksRefreshContext from '../services/context/VisitTasksRefreshContext';
import { getCurrentDateString, getDateFromDateString, getDateString } from '../utils/date';
import VisitRefreshContext from '../services/context/VisitRefreshContext';
import { getLabel, REPEAT_CODES } from '../utils/tasks';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Task({ route, navigation }) {
  const { title, id, dateString } = route.params;

  let hideEditButtons = false;
  if (dateString) {
    const dayDiff = differenceInDays(startOfDay(getDateFromDateString(dateString)), startOfDay(new Date()));
    hideEditButtons = dayDiff < 0; // disable task deletion/editing if task has already occurred in a past visit
  }

  const [refreshCalendar] = useContext(CalendarRefreshContext);

  const [refreshTasks] = useContext(TasksRefreshContext);

  const [refreshVisitTasks] = useContext(VisitTasksRefreshContext);

  const [refreshVisit] = useContext(VisitRefreshContext);

  const { user } = useContext(UserContext);

  const [titleState, setTitleState] = useState(title);

  const [loading, setLoading] = useState(false);

  const [editMode, setEditMode] = useState(id === 'new');
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState('');
  const [editStartDate, setEditStartDate] = useState(new Date());
  const [editRepeat, setEditRepeat] = useState(null);
  const [editRepeatTitle, setEditRepeatTitle] = useState(getLabel(REPEAT_CODES.NEVER, undefined));

  useEffect(() => {
    if (!editMode) {
      setEditRepeat(null);
      setEditStartDate(new Date());
    }
  }, [editMode]);

  const {
    data: taskData,
    isLoading: isTaskLoading,
    error: taskError,
  } = id ? useSWR(`${config.backend_server}/tasks/group/${user.group_id}/task/${id}`, fetcher) : undefined;

  useEffect(() => {
    if (id !== 'new') {
      if (!isTaskLoading && !taskError && taskData && taskData.length > 0) {
        setTitleState(taskData[0].title);
        setEditDescription(taskData[0].description);
        setEditStartDate(getDateFromDateString(taskData[0].start_date));
      }
    }
  }, [id, taskData, isTaskLoading, taskError]);

  const {
    data: repeatsData,
    isLoading: isRepeatsLoading,
    error: repeatsError,
  } = id ? useSWR(`${config.backend_server}/tasks/${id}/repeats`, fetcher) : undefined;

  useEffect(() => {
    if (id !== 'new') {
      if (!isRepeatsLoading && !repeatsError && repeatsData) {
        if (repeatsData.length > 0) {
          if (repeatsData[0].id) setEditRepeat(repeatsData[0]);
          else {
            setEditRepeat(null);
          }
        } else {
          setEditRepeat(null);
        }
      }
    }
  }, [id, repeatsData, isRepeatsLoading, repeatsError]);

  return (
    <View style={styles.container}>
      <Header
        id={id}
        navigation={navigation}
        hideButtons={id === 'new' || hideEditButtons}
        title={titleState}
        editMode={editMode}
        setEditMode={setEditMode}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
      />
      <ScrollView style={styles.scrollContainer}>
        <Description
          id={id}
          data={taskData}
          isLoading={isTaskLoading}
          error={taskError}
          editMode={editMode}
          editDescription={editDescription}
          setEditDescription={setEditDescription}
        />
        {!hideEditButtons && (
          <RepeatBehavior
            id={id}
            data={repeatsData}
            isLoading={isRepeatsLoading}
            error={repeatsError}
            editMode={editMode}
            editStartDate={editStartDate}
            setEditStartDate={setEditStartDate}
            editRepeat={editRepeat}
            setEditRepeat={setEditRepeat}
            editRepeatTitle={editRepeatTitle}
            setEditRepeatTitle={setEditRepeatTitle}
          />
        )}
      </ScrollView>
      {editMode && (
        <View style={styles.buttonsContainer}>
          <Button
            mode="text"
            uppercase={false}
            disabled={loading}
            color="red"
            style={styles.cancelbutton}
            onPress={() => {
              if (id === 'new') navigation.goBack();
              else setEditMode(false);
            }}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            loading={loading}
            disabled={loading}
            uppercase={false}
            color="#2196f3"
            icon={id === 'new' ? 'heart-plus' : 'content-save-all'}
            onPress={async () => {
              console.log(editRepeat);
              const body = {
                title: editTitle,
                description: editDescription,
                start_date: getDateString(max([editStartDate, new Date()])),
                repeat_pattern: editRepeat,
                groupId: user.group_id,
              };

              console.log(body);

              await saveTask(
                id,
                body,
                user,
                setLoading,
                setEditMode,
                setTitleState,
                refreshTasks,
                refreshVisitTasks,
                refreshCalendar,
                refreshVisit,
                navigation
              );
            }}
          >
            {id === 'new' ? 'Create Task' : 'Save Task'}
          </Button>
        </View>
      )}
    </View>
  );
}

const headers = {
  'Content-Type': 'application/json',
};

const saveTask = async (
  id,
  body,
  user,
  setLoading,
  setEditMode,
  setTitleState,
  tasksMutate,
  refreshVisitTasks,
  refreshCalendar,
  refreshVisit,
  navigation
) => {
  setLoading(true);
  const url =
    id === 'new'
      ? `${config.backend_server}/tasks/group/${user.group_id}`
      : `${config.backend_server}/tasks/${id}?end_date=${getCurrentDateString()}`;
  const method = id === 'new' ? 'POST' : 'PUT';
  let newId = id;
  try {
    const result = await fetch(url, {
      method: method,
      headers,
      body: JSON.stringify(body),
    });
    const data = await result.json();
    newId = data.insertId;
  } catch (error) {
    console.log(error);
  } finally {
    tasksMutate();
    refreshCalendar();
    if (id === 'new') {
      navigation.navigate('Home');
    } else {
      navigation.navigate('Task', { title: body.title, id: newId });
      await refreshVisit();
      await refreshVisitTasks();
      setTitleState(body.title);
      setLoading(false);
      setEditMode(false);
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  scrollContainer: {
    marginBottom: 16,
  },
  buttonsContainer: {
    marginBottom: 40,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
