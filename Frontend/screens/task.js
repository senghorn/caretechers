import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button } from 'react-native-paper';
import Description from '../components/task/description';
import Header from '../components/task/header';
import RepeatBehavior from '../components/task/repeatBehavior';
import config from '../constants/config';
import useSWR, { useSWRConfig } from 'swr';
import { format } from 'date-fns';
import UserContext from '../services/context/UserContext';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Task({ route, navigation }) {
  const { title, id, mutateString, backTo } = route.params;

  const { mutate } = useSWRConfig();

  const tasksMutate = () => {
    mutate(mutateString);
  };

  const user = useContext(UserContext);

  const [titleState, setTitleState] = useState(title);

  const [loading, setLoading] = useState(false);

  const [editMode, setEditMode] = useState(id === 'new');
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState('');
  const [editStartDate, setEditStartDate] = useState(new Date());
  const [editRepeat, setEditRepeat] = useState(null);
  const [editRepeatTitle, setEditRepeatTitle] = useState('Does not repeat');

  const {
    data: taskData,
    isLoading: isTaskLoading,
    error: taskError,
    mutate: taskMutate,
  } = id ? useSWR(`${config.backend_server}/tasks/group/${user.group_id}/task/${id}`, fetcher) : undefined;

  useEffect(() => {
    if (id !== 'new') {
      if (!isTaskLoading && !taskError && taskData && taskData.length > 0) {
        setTitleState(taskData[0].title);
        setEditDescription(taskData[0].description);
        setEditStartDate(new Date(taskData[0].start_date));
      }
    }
  }, [id, taskData, isTaskLoading, taskError]);

  const {
    data: repeatsData,
    isLoading: isRepeatsLoading,
    error: repeatsError,
    mutate: repeatMutate,
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
        backTo={backTo}
        hideButtons={id === 'new'}
        title={titleState}
        editMode={editMode}
        setEditMode={setEditMode}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        tasksMutate={tasksMutate}
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
          editStartDate={editStartDate}
          setEditStartDate={setEditStartDate}
        />
        <RepeatBehavior
          id={id}
          data={repeatsData}
          isLoading={isRepeatsLoading}
          error={repeatsError}
          editMode={editMode}
          editRepeat={editRepeat}
          setEditRepeat={setEditRepeat}
          editRepeatTitle={editRepeatTitle}
          setEditRepeatTitle={setEditRepeatTitle}
        />
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
              if (id === 'new') navigation.navigate(backTo || 'Home');
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
            color="#1664a1"
            icon={id === 'new' ? 'checkbox-marked-circle-plus-outline' : 'content-save-all'}
            onPress={async () => {
              const body = {
                title: editTitle,
                description: editDescription,
                start_date: format(editStartDate, 'yyyy-MM-dd'),
                repeat_pattern: editRepeat,
              };

              await saveTask(
                id,
                body,
                user,
                setLoading,
                setEditMode,
                setTitleState,
                taskMutate,
                repeatMutate,
                tasksMutate,
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
  taskMutate,
  repeatMutate,
  tasksMutate,
  navigation
) => {
  setLoading(true);
  const url = id === 'new' ? `${config.backend_server}/tasks/group/${user.group_id}` : `${config.backend_server}/tasks/${id}`;
  const method = id === 'new' ? 'POST' : 'PUT';
  try {
    await fetch(url, {
      method: method,
      headers,
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.log(error);
  } finally {
    tasksMutate();
    if (id === 'new') {
      navigation.navigate('Home');
    } else {
      await taskMutate();
      await repeatMutate();
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
