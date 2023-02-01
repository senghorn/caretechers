import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Checkbox } from 'react-native-paper';

export default function Tasks({ tasks, isLoading, error }) {
  if (isLoading) {
    return <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />;
  }
  if (tasks.length === 0) {
    return <Text style={styles.noTasksLabel}>No tasks assigned to this visit</Text>;
  }
  const renderedTasks = tasks.map((task, index) => <Task task={task} key={index} />);
  return <ScrollView style={styles.container}>{renderedTasks}</ScrollView>;
}

function Task({ task }) {
  return (
    <View style={styles.checkboxContainer}>
      <Checkbox.Android status={task.taskCompleted ? 'checked' : 'unchecked'} color="#199b1e" />
      <Text style={styles.checkboxLabel}>{task.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    alignSelf: 'center',
    height: 40,
    width: 40,
    backgroundColor: 'red',
    marginRight: 40,
    marginLeft: 40,
  },
  checkboxContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  container: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 4,
  },
  loader: {
    marginTop: 96,
  },
  noTasksLabel: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 18,
    color: '#888',
  },
});
