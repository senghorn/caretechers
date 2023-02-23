import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Button } from 'react-native-paper';
import Header from '../components/tasks/header';
import Task from '../components/tasks/task';
import config from '../constants/config';
import useSWR from 'swr';
import UserContext from '../services/context/UserContext';
import TasksRefreshContext from '../services/context/TasksRefreshContext';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Tasks({ navigation }) {
  const [selected, setSelected] = useState('every');
  const [renderedTasks, setRenderedTasks] = useState(null);

  const {user} = useContext(UserContext);

  const tasksURL = `${config.backend_server}/tasks/group/${user.group_id}`;

  const [, setRefreshTasks] = useContext(TasksRefreshContext);

  const { data, isLoading, error, mutate } = useSWR(tasksURL, fetcher);

  useEffect(() => {
    setRefreshTasks(() => mutate);
  }, [mutate]);

  const renderTasks = (tasks) => {
    if (selected === 'every') {
      tasks = tasks.filter((task) => task.rp_id && task.day_of_week === null);
    } else {
      tasks = tasks.filter((task) => !(task.rp_id && task.day_of_week === null));
    }
    const renderedTasks = tasks.map((task) => <Task title={task.title} key={task.id} navigation={navigation} id={task.id} />);
    setRenderedTasks(renderedTasks);
  };

  useEffect(() => {
    if (!isLoading && data) {
      renderTasks(data);
    }
  }, [isLoading, data, error, selected]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title="Every Visit" id="every" selected={selected} setSelected={setSelected} />
        <Header title="Scheduled" id="scheduled" selected={selected} setSelected={setSelected} />
      </View>
      <ScrollView style={styles.tasksContainer}>
        {isLoading ? <ActivityIndicator size="large" color="#2196f3" style={styles.loader} /> : renderedTasks}
      </ScrollView>
      <Button
        mode="contained"
        uppercase={false}
        color="#2196f3"
        icon="checkbox-marked-circle-plus-outline"
        onPress={() => navigation.navigate('Task', { title: '', id: 'new' })}
        style={styles.createButton}
        labelStyle={styles.createButtonText}
      >
        Add New Task
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 64,
  },
  headerContainer: {
    flexDirection: 'row',
    flexBasis: 'auto',
  },
  tasksContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  createButton: {
    marginVertical: 32,
  },
  createButtonText: {
    fontSize: 14,
  },
  loader: {
    marginTop: 96,
  },
});
