import { format } from 'date-fns';
import { Fragment, useContext } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Appbar, TextInput } from 'react-native-paper';
import config from '../../constants/config';
import CalendarRefreshContext from '../../services/context/CalendarRefreshContext';
import TasksRefreshContext from '../../services/context/TasksRefreshContext';
import VisitRefreshContext from '../../services/context/VisitRefreshContext';
import VisitTasksRefreshContext from '../../services/context/VisitTasksRefreshContext';
import { getCurrentDateString } from '../../utils/date';
import UserContext from '../../services/context/UserContext';
import SocketContext from '../../services/context/SocketContext';

/**
 * Tasks screen header component that allow editing modes
 *
 * @param {Object} navigation: React component for navigation
 * @returns
 */
export default function Header({ id, title, navigation, editMode, setEditMode, editTitle, setEditTitle, hideButtons }) {
  const [refreshTasks] = useContext(TasksRefreshContext);
  const [refreshVisitTasks] = useContext(VisitTasksRefreshContext);
  const [refreshVisit] = useContext(VisitRefreshContext);
  const [refreshCalendar] = useContext(CalendarRefreshContext);
  const { user } = useContext(UserContext);
  const [socket] = useContext(SocketContext);
  return (
    <View style={styles.outerContainer}>
      <Appbar.Header style={styles.container}>
        <Appbar.Action
          icon="chevron-left"
          onPress={() => {
            navigation.goBack();
          }}
        />
        {editMode ? (
          <TextInput
            style={[styles.titleInput, hideButtons ? { maxWidth: '80%' } : { maxWidth: '61%' }]}
            dense
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
              color="#2196f3"
              onPress={() => {
                setEditMode(!editMode);
              }}
            />
            <Appbar.Action
              icon="delete-empty"
              color="#D11A2A"
              onPress={() => {
                Alert.alert(
                  'Delete this task from upcoming visits?',
                  '', // <- this part is optional, you can pass an empty string
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Confirm',
                      onPress: async () => {
                        await deleteTask(
                          id,
                          refreshTasks,
                          refreshVisit,
                          refreshVisitTasks,
                          refreshCalendar,
                          user.access_token,
                          socket
                        );
                        navigation.goBack();
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

// Handles deleting a tasks by sending backend api request to backend
const deleteTask = async (id, tasksMutate, refreshVisit, refreshVisitTasks, refreshCalendar, token, socket) => {
  const currDate = getCurrentDateString();
  const url = `${config.backend_server}/tasks/${id}?end_date=${currDate}`;
  const method = 'DELETE';

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    await fetch(url, {
      method: method,
      headers,
    });
  } catch (error) {
    console.log(error);
  } finally {
    tasksMutate();
    refreshVisit();
    refreshVisitTasks();
    refreshCalendar();
    socket.emit('refreshCalendar');
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
    marginRight: 16,
    marginBottom: 4,
    fontSize: 18,
  },
});
