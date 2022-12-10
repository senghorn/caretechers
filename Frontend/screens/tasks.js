import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import Header from '../components/tasks/header';
import Task from '../components/tasks/task';

const connectToBackend = async (selected, setRenderedTasks) => {
  try {
    const result = await fetch('http://BACKEND:3000/tasks/group/1');
    const tasks = await result.json();
    const renderedTasks = tasks.map((task) => <Task title={task.description} key={task.id} />);
    setRenderedTasks(renderedTasks);
  } catch (error) {
    console.log(error.message);
  }
};

export default function Tasks() {
  const [selected, setSelected] = useState('every');
  const [renderedTasks, setRenderedTasks] = useState(null);

  useEffect(() => {
    connectToBackend(selected, setRenderedTasks);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title="Every Visit" id="every" selected={selected} setSelected={setSelected} />
        <Header title="Scheduled" id="scheduled" selected={selected} setSelected={setSelected} />
      </View>
      <ScrollView style={styles.tasksContainer}>{renderedTasks}</ScrollView>
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
});
