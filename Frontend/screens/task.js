import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button } from 'react-native-paper';
import Description from '../components/task/description';
import Header from '../components/task/header';
import RepeatBehavior from '../components/task/repeatBehavior';
import config from '../constants/config';
import useSWR, { useSWRConfig } from 'swr';
import { format } from 'date-fns';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Task({ route, navigation }) {
  const { title, id, mutateString } = route.params;

  const { mutate } = useSWRConfig();

  const tasksMutate = () => {
    mutate(mutateString);
  };

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
  } = id ? useSWR(`${config.backend_server}/tasks/group/1/task/${id}`, fetcher) : undefined;

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
        navigation={navigation}
        hideButtons={id === 'new'}
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
              if (id === 'new') navigation.navigate('Home');
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

              if (id === 'new') {
                console.log(body);
              } else await editTask(id, body, setLoading, setEditMode, setTitleState, taskMutate, repeatMutate, tasksMutate);
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

const editTask = async (id, body, setLoading, setEditMode, setTitleState, taskMutate, repeatMutate, tasksMutate) => {
  setLoading(true);
  try {
    await fetch(`${config.backend_server}/tasks/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.log(error);
  } finally {
    await taskMutate();
    await repeatMutate();
    setTitleState(body.title);
    setLoading(false);
    setEditMode(false);
    tasksMutate();
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
