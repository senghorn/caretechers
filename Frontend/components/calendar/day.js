import { format, isEqual, startOfDay } from 'date-fns';
import { StyleSheet, View } from 'react-native';
import DateDisplay from './dateDisplay';
import DaySummary from './daySummary';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Day({ volunteer, date }) {
  const dateString = format(date, 'yyyy-MM-dd');
  const { data, error, isLoading } = useSWR(
    `http://localhost:3000/visits/group/1?start=${dateString}&end=${dateString}`,
    fetcher
  );

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
          {<DaySummary isLoading={isLoading} date={date} volunteer={volunteer} data={data} />}
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
