import { View, Text, StyleSheet } from 'react-native';

export default function DateDisplay({ dayOfWeek, dayOfMonth }) {
  return (
    <View style={styles.container}>
      <View style={styles.flexContainer}>
        <Text style={styles.dayOfWeekText}>{dayOfWeek}</Text>
        <View style={styles.dayOfMonth}>
          <Text style={styles.currentDayText}>{dayOfMonth}</Text>
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
  currentDayText: {
    // color: '#2196f3',
    color: 'black',
    fontWeight: '600',
    fontSize: 24,
  },
});
