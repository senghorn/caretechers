import { Fragment, useContext } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Appbar, TextInput } from 'react-native-paper';
import config from '../../constants/config';
import CalendarRefreshContext from '../../services/context/CalendarRefreshContext';
import TasksRefreshContext from '../../services/context/TasksRefreshContext';
import VisitTasksRefreshContext from '../../services/context/VisitTasksRefreshContext';

export default function Header({ id, title, navigation, editMode, setEditMode, editTitle, setEditTitle, hideButtons, backTo }) {
  const [refreshTasks] = useContext(TasksRefreshContext);
  const [refreshVisitTasks] = useContext(VisitTasksRefreshContext);
  const [refreshCalendar] = useContext(CalendarRefreshContext);
  return (
    <View style={styles.outerContainer}>
      <Appbar.Header style={styles.container}>
        <Appbar.Action
          icon="chevron-left"
          onPress={() => {
            if (backTo) {
              navigation.navigate('Visit', { date: backTo });
            } else {
              navigation.navigate('Home');
            }
          }}
        />
        {editMode ? (
          <TextInput
            style={styles.titleInput}
            label="Title"
            value={editTitle}
            onChangeText={(text) => {
              setEditTitle(text);
            }}
            mode="outlined"
          />
        ) : (
          <Appbar.Content title={title} titleStyle={styles.titleText} />
        )}
        {!hideButtons && (
          <Fragment>
            <Appbar.Action
              icon="pencil-box-multiple"
              color="#1664a1"
              onPress={() => {
                setEditMode(!editMode);
              }}
            />
            <Appbar.Action
              icon="delete-empty"
              color="#D11A2A"
              onPress={() => {
                Alert.alert(
                  'Are you sure you want to delete this task?',
                  '', // <- this part is optional, you can pass an empty string
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Confirm',
                      onPress: async () => {
                        await deleteTask(id, refreshTasks, refreshVisitTasks, refreshCalendar);
                        if (backTo) {
                          navigation.navigate('Visit', { date: backTo });
                        } else {
                          navigation.navigate('Home');
                        }
                      },
                      style: 'destructive',
                    },
                  ],
                  {
                    cancelable: true,
                  }
                );
              }}
            />
          </Fragment>
        )}
      </Appbar.Header>
    </View>
  );
}

const headers = {
  'Content-Type': 'application/json',
};

const deleteTask = async (id, tasksMutate, refreshVisitTasks, refreshCalendar) => {
  const url = `${config.backend_server}/tasks/${id}`;
  const method = 'DELETE';
  try {
    await fetch(url, {
      method: method,
      headers,
    });
  } catch (error) {
    console.log(error);
  } finally {
    tasksMutate();
    refreshVisitTasks();
    refreshCalendar();
  }
};

const styles = StyleSheet.create({
  outerContainer: {
    shadowOffset: { width: 0, height: -10 },
    shadowColor: '#888',
    shadowOpacity: 0.1,
    zIndex: 999,
  },
  container: {
    backgroundColor: '#fff',
    flex: 0,
    width: '100%',
  },
  titleText: {
    fontWeight: '500',
    fontSize: 18,
  },
  titleInput: {
    flexGrow: 1,
    height: 40,
    marginRight: 16,
    marginBottom: 4,
    fontSize: 18,
  },
});
