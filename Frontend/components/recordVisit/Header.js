import { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { getCurrentDateString } from '../../utils/date';
import UserContext from '../../services/context/UserContext';
import VisitTasksRefreshContext from '../../services/context/VisitTasksRefreshContext';
import VisitRefreshContext from '../../services/context/VisitRefreshContext';
import colors from '../../constants/colors';
import RecordVisitContext from '../../services/context/RecordVisitContext';
import { recordVisit } from '../../services/api/visits';
import CalendarRefreshContext from '../../services/context/CalendarRefreshContext';
import TodaysVisitorContext from '../../services/context/TodaysVisitorContext';
import SocketContext from '../../services/context/SocketContext';

export default function Header({ visits, navigation }) {
  const { user } = useContext(UserContext);
  const [socket] = useContext(SocketContext);

  const [refreshVisitTasks] = useContext(VisitTasksRefreshContext);
  const [refreshVisit] = useContext(VisitRefreshContext);
  const [refreshCalendar] = useContext(CalendarRefreshContext);

  const visit = visits && visits[0];

  const { visitNotes, setVisitNotes, visitTasks, setVisitTasks } = useContext(RecordVisitContext);

  const { refreshTodaysVisitor } = useContext(TodaysVisitorContext);

  const [recordingVisit, setRecordingVisit] = useState(false);

  return (
    <Appbar.Header style={styles.container}>
      <Appbar.Action
        icon="chevron-left"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Appbar.Content title={'Record Visit'} titleStyle={styles.titleText} />
      <Appbar.Action />
      <Button
        icon="heart"
        color={colors.primary}
        uppercase={false}
        mode={'contained'}
        loading={recordingVisit}
        disabled={recordingVisit}
        onPress={() => {
          Alert.alert(
            'Finish Visit?',
            'By clicking "Confirm", you affirm that you have visited the recipient today', // <- this part is optional, you can pass an empty string
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Confirm',
                onPress: async () => {
                  setRecordingVisit(true);
                  await recordVisit(visit.visitId, getCurrentDateString(), visitTasks, visitNotes, user.access_token);
                  socket.emit('refreshCalendar');
                  refreshVisit();
                  refreshVisitTasks();
                  refreshTodaysVisitor();
                  await refreshCalendar();
                  setRecordingVisit(false);
                  setVisitNotes('');
                  setVisitTasks({});
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
        style={{ marginRight: 8 }}
      >
        Finish
      </Button>
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  titleText: {
    fontWeight: '500',
    fontSize: 18,
  },
});
