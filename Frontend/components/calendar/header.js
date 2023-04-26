import { format, startOfDay } from 'date-fns';
import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import UserContext from '../../services/context/UserContext';
import CalendarRefreshContext from '../../services/context/CalendarRefreshContext';
import VisitRefreshContext from '../../services/context/VisitRefreshContext';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Header({ date, setInitDate, navigation }) {
  const { user } = useContext(UserContext);
  const [refreshCalendar] = useContext(CalendarRefreshContext);
  const [refreshVisit] = useContext(VisitRefreshContext);
  const [showDatePicker, setShowDatePicker] = useState(false);
  return (
    <View style={styles.outerContainer}>
      <Appbar.Header style={styles.container}>
        <Appbar.Action
          icon={'account-cog'}
          onPress={() => {
            navigation.navigate('Settings');
          }}
        />

        {showDatePicker ? (
          <Appbar.Content
            title={
              <DateTimePicker
                testID="dateTimePicker2"
                onChange={(event, date) => {
                  if (event.type === 'set') {
                    setInitDate(startOfDay(date));
                  }
                  setShowDatePicker(false);
                }}
                value={new Date()}
                mode={'date'}
                display="compact"
                is24Hour={true}
              />
            }
          />
        ) : (
          <Appbar.Content
            title={format(date, 'LLLL Y')}
            titleStyle={styles.titleText}
            onPress={() => {
              setShowDatePicker(true);
            }}
          />
        )}
        <Appbar.Action
          icon="calendar"
          onPress={() => {
            setInitDate(startOfDay(new Date()));
          }}
        />
        <Appbar.Action
          icon="refresh"
          onPress={() => {
            refreshCalendar();
            refreshVisit();
          }}
        />
      </Appbar.Header>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    shadowOffset: { width: 0, height: -10 },
    shadowColor: '#888',
    shadowOpacity: 0.1,
    zIndex: 999,
  },
  container: {
    backgroundColor: '#fff',
  },
  titleText: {
    fontWeight: '500',
    fontSize: 20,
  },
});
