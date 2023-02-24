import { Fragment, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Button } from 'react-native-paper';
import HeaderDep from '../components/tasks/headerdep';
import Task from '../components/tasks/task';
import config from '../constants/config';
import useSWR from 'swr';
import UserContext from '../services/context/UserContext';
import TasksRefreshContext from '../services/context/TasksRefreshContext';
import { getCurrentDateString } from '../utils/date';
import Header from '../components/tasks/header';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Tasks({ navigation }) {
  const [selected, setSelected] = useState('every');
  const [renderedTasks, setRenderedTasks] = useState(null);

  const { user } = useContext(UserContext);

  const tasksURL = `${config.backend_server}/tasks/group/${user.group_id}?after_date=${getCurrentDateString()}`;

  const [, setRefreshTasks] = useContext(TasksRefreshContext);

  const { data, isLoading, error, mutate } = useSWR(tasksURL, fetcher);

  useEffect(() => {
    setRefreshTasks(() => mutate);
  }, [mutate]);

  const renderTasks = (tasks) => {
    console.log(tasks[2]);
    const renderedTasks = tasks.map((task) => (
      <Task title={task.title} key={task.id} navigation={navigation} id={task.id} repeatBehavior={task} />
    ));
    setRenderedTasks(renderedTasks);
  };

  useEffect(() => {
    if (!isLoading && data) {
      renderTasks(data);
    }
  }, [isLoading, data, error, selected]);

  return (
    <Fragment>
      <Header navigation={navigation} />
      <View style={styles.container}>
        <ScrollView style={styles.tasksScrollContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />
          ) : (
            <View style={styles.tasksContainer}>{renderedTasks}</View>
          )}
        </ScrollView>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  tasksScrollContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
  },
  tasksContainer: {
    marginTop: 16,
  },
  loader: {
    marginTop: 96,
  },
});
