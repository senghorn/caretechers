import { endOfWeek, format } from 'date-fns';
import { Text, StyleSheet } from 'react-native';

export default function WeekLabel({ date: weekStart }) {
  const weekEnd = endOfWeek(weekStart);
  const monthStart = format(weekStart, 'LLLL');
  const monthEnd = format(weekEnd, 'LLLL');

  const weekText = `${monthStart.toUpperCase()} ${format(weekStart, 'd')} - ${
    monthStart !== monthEnd ? monthEnd.toUpperCase() + ' ' : ''
  }${format(weekEnd, 'd')}`;

  return <Text style={styles.weekText}>{weekText}</Text>;
}

const styles = StyleSheet.create({
  weekText: {
    color: '#888',
    fontSize: 12,
    paddingLeft: 16,
    paddingBottom: 16,
  },
});
