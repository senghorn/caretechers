import { format } from 'date-fns';
import { Text, View, StyleSheet } from 'react-native';

export default function MonthLabel({ date }) {
  const monthText = format(date, 'LLLL');
  return (
    <View style={styles.container}>
      <Text style={styles.monthText}>{monthText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E7F0F9',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 24,
  },
  monthText: {
    fontSize: 24,
    color: '#2196f3',
    fontWeight: '500',
  },
});
