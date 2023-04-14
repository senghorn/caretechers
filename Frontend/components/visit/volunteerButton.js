import { Fragment, useContext, useState } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import CalendarRefreshContext from '../../services/context/CalendarRefreshContext';
import VisitRefreshContext from '../../services/context/VisitRefreshContext';
import TodaysVisitorContext from '../../services/context/TodaysVisitorContext';
import UserContext from '../../services/context/UserContext';
import { volunteerForVisit } from '../../services/api/visits';
import colors from '../../constants/colors';
import SocketContext from '../../services/context/SocketContext';

/**
 * Customized volunteer button that support volunteering to visit
 * @param {*} param0 
 * @returns 
 */
export default function VolunteerButton({ date, visitFirst = false }) {
  const [volunteerLoading, setVolunteerLoading] = useState(false);

  const [refreshCalendar] = useContext(CalendarRefreshContext);
  const [refreshVisit] = useContext(VisitRefreshContext);

  const { refreshTodaysVisitor } = useContext(TodaysVisitorContext);
  const { user } = useContext(UserContext);
  const [socket] = useContext(SocketContext);
  return (
    <TouchableHighlight
      onPress={async () => {
        try {
          setVolunteerLoading(true);
          await volunteerForVisit(date, user, user.access_token);
          socket.emit('refreshCalendar');
          if (visitFirst) {
            await refreshVisit();
            refreshCalendar();
          } else {
            await refreshCalendar();
            refreshVisit();
          }
          refreshTodaysVisitor();
          setVolunteerLoading(false);
        } catch (error) {
          console.log('Error volunteering for visit (from button):', error);
        }
      }}
      style={styles.buttonContainer}
      underlayColor="#ededed"
      disabled={false}
    >
      <View style={styles.volunteerButton}>
        {volunteerLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Fragment>
            <AntDesign name="pluscircleo" size={16} color="#2196f3" />
            <Text style={styles.volunteerButtonText}>Volunteer to Visit</Text>
          </Fragment>
        )}
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    borderRadius: 8,
    marginRight: 8,
  },
  volunteerButton: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: '#ededed',
    borderWidth: 1,
  },
  volunteerButtonText: {
    color: '#2196f3',
    fontWeight: '400',
    fontSize: 15,
    marginLeft: 8,
  },
});
