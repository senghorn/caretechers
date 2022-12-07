import { format, isEqual, startOfDay } from 'date-fns';
import { View, Text, StyleSheet } from 'react-native';

export default function DateDisplay({ date }) {
  const isCurrentDay = isEqual(date, startOfDay(new Date()));
  const dayOfWeek = format(date, 'E').toUpperCase();
  const dayOfMonth = format(date, 'd');
  return (
    <View style={styles.container}>
      <View style={styles.flexContainer}>
        <Text style={isCurrentDay ? styles.currentDayWeekText : styles.dayOfWeekText}>{dayOfWeek}</Text>
        <View style={styles.dayOfMonth}>
          <Text style={isCurrentDay ? styles.currentDayText : styles.dayText}>{dayOfMonth}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 64,
    height: 56,
  },
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dayOfWeekText: {
    fontWeight: '400',
    fontSize: 12,
    color: '#888',
  },
  currentDayWeekText: {
    fontWeight: '400',
    fontSize: 12,
    color: '#2196f3',
  },
  currentDayText: {
    color: '#2196f3',
    fontWeight: '600',
    fontSize: 24,
  },
  dayText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 24,
  },
});
