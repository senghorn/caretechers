import { View, StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Day from '../components/calendar/day';

export default function Calendar() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.weekText}>OCTOBER 22 - 28</Text>
      <Day dayOfWeek="SUN" dayOfMonth={22} />
      <Day dayOfWeek="MON" dayOfMonth={23} />
      <Day dayOfWeek="TUE" dayOfMonth={24} />
      <Day dayOfWeek="WED" dayOfMonth={25} />
      <Day dayOfWeek="THU" dayOfMonth={26} volunteer={true} />
      <Day dayOfWeek="FRI" dayOfMonth={27} />
      <Day dayOfWeek="SAT" dayOfMonth={28} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 0,
    paddingRight: 16,
    paddingTop: 64,
    flexDirection: 'column',
  },
  weekText: {
    color: '#888',
    fontSize: 12,
    paddingLeft: 16,
    paddingBottom: 16,
  },
});
