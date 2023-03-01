import { useContext, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Checkbox } from 'react-native-paper';
import RecordVisitContext from '../../services/context/RecordVisitContext';
import Task from '../tasks/task';

export default function Tasks({ tasks, dateString, isLoading, navigation, canCheck = false }) {
  if (isLoading) {
    return <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />;
  }
  if (tasks.length === 0) {
    return <Text style={styles.noTasksLabel}>No tasks assigned to this visit</Text>;
  }
  const renderedTasks = tasks.map((task, index) => (
    <TaskWrapper task={task} key={index} navigation={navigation} dateString={dateString} canCheck={canCheck} />
  ));
  return <ScrollView style={styles.container}>{renderedTasks}</ScrollView>;
}

function TaskWrapper({ task, navigation, dateString, canCheck }) {
  const { visitTasks, setVisitTasks } = useContext(RecordVisitContext);

  return (
    <View style={styles.checkboxContainer}>
      <View>
        {!canCheck ? (
          <Checkbox.Android status={task.taskCompleted ? 'checked' : 'unchecked'} color="#199b1e" disabled={true} />
        ) : (
          <Checkbox.Android
            status={!visitTasks[task.id] ? 'unchecked' : 'checked'}
            onPress={() => {
              const state = visitTasks[task.id];
              if (state !== null) {
                const newVisitTasks = { ...visitTasks, [task.id]: !state };
                setVisitTasks(newVisitTasks);
              } else {
                visitTasks[task.id] = true;
              }
            }}
            color="#199b1e"
          />
        )}
      </View>
      <Task showIcon={false} title={task.title} key={task.id} navigation={navigation} id={task.id} dateString={dateString} />
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
