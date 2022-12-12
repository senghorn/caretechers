import { useState } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { Button, Switch, TextInput } from 'react-native-paper';

export default function CreateTaskModal({ visible, setVisible, refresh }) {
  const [taskName, setTaskName] = useState('');
  const [everyVisit, setEveryVisit] = useState(true);
  const [loading, setLoading] = useState(false);
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.layoutContainer}>
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Create New Task</Text>
            <TextInput
              label="Task Name"
              value={taskName}
              onChangeText={(text) => setTaskName(text)}
              selectionColor="#2196f3"
              underlineColor="#2196f3"
              activeUnderlineColor="#2196f3"
            />
            <View style={styles.visitSwitchContainer}>
              <Text style={styles.visitSwitchText}>Occurs Every Visit</Text>
              <Switch value={everyVisit} onValueChange={() => setEveryVisit(!everyVisit)} color="#2196f3" />
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <Button
              mode="text"
              uppercase={false}
              disabled={loading}
              color="red"
              style={styles.cancelbutton}
              onPress={() => {
                setVisible(false);
              }}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              loading={loading}
              disabled={loading}
              uppercase={false}
              color="#2196f3"
              icon="checkbox-marked-circle-plus-outline"
              onPress={async () => {
                await createTask(taskName, everyVisit, setLoading);
                setTaskName('');
                setEveryVisit(true);
                setVisible(false);
                refresh();
              }}
            >
              Create Task
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const headers = {
  'Content-Type': 'application/json',
};

const createTask = async (title, everyVisit, setLoading) => {
  setLoading(true);
  const newTask = {
    title,
    description: title,
    start_date: '2023-1-31',
    is_recurring: true,
    recurring_type: everyVisit ? 'everytime' : 'monthly',
    day_of_week: 135,
  };

  try {
    await fetch('http://ec2-54-153-120-183.us-west-1.compute.amazonaws.com:3000/tasks/group/1', {
      method: 'POST',
      headers,
      body: JSON.stringify(newTask),
    });
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

const styles = StyleSheet.create({
  layoutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 150, 243, 0.7)',
  },
  container: {
    backgroundColor: '#fff',
    opacity: 1,
    width: '80%',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 12,
    flex: 0,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: '600',
    color: '#2196f3',
  },
  visitSwitchText: {
    fontSize: 14,
    fontWeight: '500',
  },
  visitSwitchContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  buttonsContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  cancelbutton: {
    width: '48%',
  },
});
