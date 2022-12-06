import { StyleSheet, View } from 'react-native';
import DateDisplay from './dateDisplay';
import DaySummary from './daySummary';

export default function Day({ dayOfWeek, dayOfMonth, volunteer }) {
  return (
    <View style={styles.container}>
      <View style={styles.layoutContainer}>
        <DateDisplay dayOfWeek={dayOfWeek} dayOfMonth={dayOfMonth} />
        <DaySummary volunteer={volunteer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    marginBottom: 24,
  },
  layoutContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});
