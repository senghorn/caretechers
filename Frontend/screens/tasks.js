import { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ActivityIndicator, FAB, Provider } from 'react-native-paper';
import Task from '../components/tasks/task';
import config from '../constants/config';
import useSWR from 'swr';
import UserContext from '../services/context/UserContext';
import TasksRefreshContext from '../services/context/TasksRefreshContext';
import { getCurrentDateString, getDateFromDateString } from '../utils/date';
import Header from '../components/tasks/header';
import ViewSetter from '../components/tasks/viewSetter';
import { getNextDateFromRepeatBehavior, REPEAT_CODES } from '../utils/tasks';
import colors from '../constants/colors';

const fetcher = (url, token) => fetch(url, token).then((res) => res.json());

const getFilteredTasks = (tasks, filter) => {
  switch (filter) {
    case REPEAT_CODES.NEVER:
      return tasks.filter((task) => task.rp_id === null);
    case null:
      return tasks;
    default:
      return tasks.filter((task) => task.recurring_type === filter);
  }
};

const SORT_LABELS = {
  due: 'Due Date',
  alphabet: 'Alphabetical',
  repeat: 'Repeat Behavior',
};

const sortOptions = Object.values(SORT_LABELS).map((value) => {
  return { label: value, value };
});

const getNextDate = (task) => {
  return getNextDateFromRepeatBehavior(task.recurring_type, getDateFromDateString(task.start_date));
};

export default function Tasks({ navigation }) {
  const [renderedTasks, setRenderedTasks] = useState(null);

  const { user } = useContext(UserContext);

  const tasksURL = `${config.backend_server}/tasks/group/${user.curr_group}?after_date=${getCurrentDateString()}`;

  const [, setRefreshTasks] = useContext(TasksRefreshContext);

  const { data, isLoading, error, mutate } = useSWR([tasksURL, {
    headers: { 'Authorization': 'Bearer ' + user.access_token }
  }], ([url, token]) => fetcher(url, token));

  const [filter, setFilter] = useState(null);

  const [sort, setSort] = useState(SORT_LABELS.due);

  const [query, setQuery] = useState('');

  useEffect(() => {
    setRefreshTasks(() => mutate);
  }, [mutate]);

  const renderTasks = (tasks) => {
    const filteredTasks = getFilteredTasks(tasks, filter).filter((task) =>
      task.title.toLowerCase().includes(query.toLowerCase())
    );
    switch (sort) {
      case SORT_LABELS.alphabet:
        filteredTasks.sort((task1, task2) => task1.title.localeCompare(task2.title));
        break;
      case SORT_LABELS.repeat:
        filteredTasks.sort((task1, task2) => {
          if (task1.recurring_type === null) return -1;
          else if (task2.recurring_type === null) return 1;
          return task1.recurring_type.localeCompare(task2.recurring_type);
        });
        break;
      default:
        filteredTasks.sort((task1, task2) => getNextDate(task1) - getNextDate(task2));
        break;
    }
    const renderedTasks = filteredTasks.map((task) => (
      <Task title={task.title} key={task.id} navigation={navigation} id={task.id} repeatBehavior={task} />
    ));
    setRenderedTasks(renderedTasks);
  };

  useEffect(() => {
    if (!isLoading && data) {
      renderTasks(data);
    }
  }, [isLoading, data, error, filter, sort, query]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (user != null && user !== {}) {
      setRefreshing(true);
      await mutate();
      setRefreshing(false);
    }
  }, [user, mutate]);

  return (
    <Provider>
      <Header navigation={navigation} sortOptions={sortOptions} setSort={setSort} query={query} setQuery={setQuery} />
      <View style={styles.container}>
        <View style={styles.controlContainer}>
          <ViewSetter setFilter={setFilter} />
        </View>
        <ScrollView
          style={styles.tasksScrollContainer}
          keyboardShouldPersistTaps="always"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />
          ) : (
            <View style={styles.tasksContainer}>{renderedTasks}</View>
          )}
        </ScrollView>
      </View>
      <FAB
        icon="heart-plus-outline"
        style={styles.fab}
        color="#fff"
        onPress={() => {
          navigation.navigate('Task', { title: '', id: 'new' });
        }}
      />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  controlContainer: {
    flex: 0,
    flexDirection: 'row',
    width: '100%',
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 48,
    zIndex: 999,
  },
  tasksScrollContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
  },
  tasksContainer: {
    marginTop: 0,
  },
  loader: {
    marginTop: 96,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});
