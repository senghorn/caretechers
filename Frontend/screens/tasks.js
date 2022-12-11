import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import Header from '../components/tasks/header';
import Task from '../components/tasks/task';

const connectToBackend = async (selected, setRenderedTasks, setLoading) => {
  try {
    const result = await fetch('http://BACKEND:3000/tasks/group/1');
    let tasks = await result.json();
    if (selected === 'every') {
      tasks = tasks.filter((task) => task.recurring_type === 'everytime');
    } else {
      tasks = tasks.filter((task) => task.recurring_type !== 'everytime');
    }
    const renderedTasks = tasks.map((task) => (
      <Task title={task.description} key={task.id} reccurence={task.recurring_type} selected={selected} />
    ));

    setRenderedTasks(renderedTasks);
    setLoading(false);
  } catch (error) {
    console.log(error.message);
  }
};

export default function Tasks() {
  const [selected, setSelected] = useState('every');
  const [renderedTasks, setRenderedTasks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    connectToBackend(selected, setRenderedTasks, setLoading);
  }, [selected]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title="Every Visit" id="every" selected={selected} setSelected={setSelected} />
        <Header title="Scheduled" id="scheduled" selected={selected} setSelected={setSelected} />
      </View>
      <ScrollView style={styles.tasksContainer}>
        {loading ? <ActivityIndicator size="large" color="#2196f3" style={styles.loader} /> : renderedTasks}
      </ScrollView>
      <Button
        mode="contained"
        uppercase={false}
        color="#2196f3"
        icon="checkbox-marked-circle-plus-outline"
        onPress={() => console.log('Create new task')}
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
