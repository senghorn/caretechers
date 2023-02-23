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

export default function Header({ id, title, navigation, editMode, setEditMode, editTitle, setEditTitle, hideButtons }) {
  const [refreshTasks] = useContext(TasksRefreshContext);
  const [refreshVisitTasks] = useContext(VisitTasksRefreshContext);
  const [refreshVisit] = useContext(VisitRefreshContext);
  const [refreshCalendar] = useContext(CalendarRefreshContext);
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
                        await deleteTask(id, refreshTasks, refreshVisit, refreshVisitTasks, refreshCalendar);
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

const deleteTask = async (id, tasksMutate, refreshVisit, refreshVisitTasks, refreshCalendar) => {
  const currDate = getCurrentDateString();
  const url = `${config.backend_server}/tasks/${id}?end_date=${currDate}`;
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
    refreshVisit();
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
