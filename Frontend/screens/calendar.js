import {
  addDays,
  isEqual,
  startOfWeek,
  startOfMonth,
  differenceInDays,
  subWeeks,
  addWeeks,
  startOfDay,
  subDays,
  endOfMonth,
  format,
} from 'date-fns';
import { uniqueId } from 'lodash';
import { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Day from '../components/calendar/day';
import Header from '../components/calendar/header';
import WeekLabel from '../components/calendar/weekLabel';
import MonthLabel from '../components/calendar/monthLabel';
import { FlatList } from 'react-native-bidirectional-infinite-scroll';

const createRenderingDataForFlatList = (startDate, endDate) => {
  const numDays = differenceInDays(endDate, startDate);

  const renderingDataForFlatList = [];

  // create data for all of the days between the start
  // and end date being displayed
  // for the React Native FlatList to render
  for (let i = 0; i <= numDays; i++) {
    const currentDate = addDays(startDate, i);
    const id = uniqueId();
    const types = ['day'];
    if (isEqual(currentDate, startOfWeek(currentDate))) types.push('week');
    if (isEqual(currentDate, startOfMonth(currentDate))) types.push('month');
    renderingDataForFlatList.push({
      id,
      types,
      date: currentDate,
    });
  }

  return renderingDataForFlatList;
};

function RenderDayFromData({ date, types }) {
  return (
    <View>
      {types.includes('month') && <MonthLabel date={date} />}
      {types.includes('week') && <WeekLabel date={date} />}
      {types.includes('day') && <Day date={date} />}
    </View>
  );
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [startDate, setStartDate] = useState(subWeeks(currentDate, 4));
  const [endDate, setEndDate] = useState(addWeeks(currentDate, 4));
  const [renderingDataForFlatList, setRenderingDataForFlatList] = useState(createRenderingDataForFlatList(startDate, endDate));
  const [currentDateDisplayed, setCurrentDateDisplayed] = useState(currentDate);

  const renderFlatListDay = ({ item }) => <RenderDayFromData date={item.date} types={item.types} />;
  const onViewableItemsChanged = ({ viewableItems }) => {
    setCurrentDateDisplayed(viewableItems[0].item.date);
  };
  const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged }]);

  return (
    <View style={styles.container}>
      <Header date={currentDateDisplayed} />
      <FlatList
        style={styles.scrollContainer}
        data={renderingDataForFlatList}
        renderItem={renderFlatListDay}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={5}
        onEndReached={() =>
          new Promise((resolve) => {
            const nextEnd = addDays(endDate, 14);
            const newDays = createRenderingDataForFlatList(addDays(endDate, 1), nextEnd);
            setRenderingDataForFlatList([...renderingDataForFlatList, ...newDays]);
            setEndDate(nextEnd);
            resolve();
          })
        }
        onStartReachedThreshold={5}
        onStartReached={() =>
          new Promise((resolve) => {
            const newStart = subDays(startDate, 14);
            const newDays = createRenderingDataForFlatList(newStart, subDays(startDate, 1));
            setRenderingDataForFlatList([...newDays, ...renderingDataForFlatList]);
            setStartDate(newStart);
            resolve();
          })
        }
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
    flexDirection: 'column',
  },
});
