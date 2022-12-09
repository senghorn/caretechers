import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import Header from '../components/tasks/header';
import Task from '../components/tasks/task';

const connectToBackend = async () => {
  const result = await fetch('http://<BACKEND_ADDR>:3000/tasks/group/1');
  const data = await result.text();
  console.log(data);
};

export default function Tasks() {
  const [selected, setSelected] = useState('every');
  connectToBackend();
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title="Every Visit" id="every" selected={selected} setSelected={setSelected} />
        <Header title="Scheduled" id="scheduled" selected={selected} setSelected={setSelected} />
      </View>
      <ScrollView style={styles.tasksContainer}>
        <Task title="Take out trash" />
        <Task title="Clean dishes" />
        <Task title="Fetch mail" />
        <Task title="Give mom medicine" />
        <Task title="Check pantry" />
        <Task title="Check thermostat" />
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
});
