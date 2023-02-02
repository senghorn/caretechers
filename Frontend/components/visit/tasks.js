import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Checkbox } from 'react-native-paper';
import Task from '../tasks/task';

export default function Tasks({ tasks, date, isLoading, navigation }) {
  if (isLoading) {
    return <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />;
  }
  if (tasks.length === 0) {
    return <Text style={styles.noTasksLabel}>No tasks assigned to this visit</Text>;
  }
  const renderedTasks = tasks.map((task, index) => <TaskWrapper task={task} key={index} navigation={navigation} date={date} />);
  return <ScrollView style={styles.container}>{renderedTasks}</ScrollView>;
}

function TaskWrapper({ task, navigation, date }) {
  return (
    <View style={styles.checkboxContainer}>
      <View>
        <Checkbox.Android status={task.taskCompleted ? 'checked' : 'unchecked'} color="#199b1e" />
      </View>
      <Task backTo={date} showIcon={false} title={task.title} key={task.id} navigation={navigation} id={task.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
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
