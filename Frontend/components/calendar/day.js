import { format, isEqual, startOfDay } from 'date-fns';
import { StyleSheet, View } from 'react-native';
import DateDisplay from './dateDisplay';
import DaySummary from './daySummary';

export default function Day({ date }) {
  const isCurrentDay = isEqual(date, startOfDay(new Date()));
  return (
    <View>
      {isCurrentDay && (
        <View style={styles.todayContainer}>
          <View style={styles.todayCircle} />
          <View style={styles.todayLine} />
        </View>
      )}
      <View style={styles.container}>
        <View style={styles.layoutContainer}>
          <DateDisplay date={date} />
          <DaySummary date={date} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    marginBottom: 24,
    marginRight: 20,
  },
  layoutContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  todayContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 64,
    marginRight: 16,
    marginBottom: 8,
    overflow: 'hidden',
  },
  todayCircle: {
    height: 16,
    width: 16,
    backgroundColor: 'red',
    borderRadius: '100%',
  },
  todayLine: {
    height: 2,
    width: '100%',
    backgroundColor: 'red',
  },
});
