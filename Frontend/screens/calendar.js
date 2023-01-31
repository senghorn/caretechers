import {
  addDays,
  isEqual,
  startOfWeek,
  startOfMonth,
  differenceInDays,
  startOfDay,
  subDays,
  startOfYear,
  endOfYear,
  addMonths,
  isSameYear,
  subWeeks,
  format,
  addWeeks,
} from 'date-fns';
import { uniqueId } from 'lodash';
import { createContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Day from '../components/calendar/day';
import Header from '../components/calendar/header';
import WeekLabel from '../components/calendar/weekLabel';
import MonthLabel from '../components/calendar/monthLabel';
import { FlatList } from 'react-native-bidirectional-infinite-scroll';
import useSWR from 'swr';

const DateToVisitsContext = createContext();

const renderFlatListDay = ({ item }) => <RenderDayFromData date={item.date} types={item.types} />;

export default function Calendar() {
  const [initDate, setInitDate] = useState(startOfDay(new Date()));
  const [startDate, setStartDate] = useState(startOfYear(initDate));
  const [endDate, setEndDate] = useState(endOfYear(initDate));
  const [renderingDataForFlatList, setRenderingDataForFlatList] = useState(
    createRenderingDataForFlatList(initDate, addMonths(initDate, 12))
  );
  const [currentDateDisplayed, setCurrentDateDisplayed] = useState(initDate);
  const [dateToVisitsMap, setDateToVisitsMap] = useState(undefined);

  const startDateString = format(subWeeks(startDate, 2), 'yyyy-MM-dd');
  const endDateString = format(addWeeks(endDate, 2), 'yyyy-MM-dd');

  useEffect(() => {
    setStartDate(startOfYear(initDate));
    setEndDate(endOfYear(initDate));
    setRenderingDataForFlatList(createRenderingDataForFlatList(initDate, addMonths(initDate, 12)));
    flatListRef.current.scrollToIndex({ animated: false, index: 0 });
  }, [initDate]);

  const { data, error, isLoading } = useSWR(
    `http://192.168.86.238:3000/visits/group/1?start=${startDateString}&end=${endDateString}`,
    fetcher
  );

  useEffect(() => {
    if (data) setDateToVisitsMap(getDateToVisitsMap(data));
    else if (isLoading) setDateToVisitsMap(undefined);
    else if (error) setDateToVisitsMap('error');
  }, [data, error, isLoading]);
  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentDateDisplayed(viewableItems[0].item.date);
    }
  };

  useEffect(() => {
    if (!isSameYear(currentDateDisplayed, endDate)) {
      setEndDate(endOfYear(currentDateDisplayed));
    }

    if (!isSameYear(currentDateDisplayed, startDate)) {
      setStartDate(startOfYear(currentDateDisplayed));
    }
  }, [currentDateDisplayed]);

  const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged }]);

  const flatListRef = useRef();

  return (
    <View style={styles.container}>
      <Header date={currentDateDisplayed} setInitDate={setInitDate} />
      <DateToVisitsContext.Provider value={dateToVisitsMap}>
        <FlatList
          ref={flatListRef}
          style={styles.scrollContainer}
          data={renderingDataForFlatList}
          renderItem={renderFlatListDay}
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={4}
          onEndReached={() =>
            updateEndRendering(renderingDataForFlatList, setRenderingDataForFlatList, createRenderingDataForFlatList)
          }
          onStartReachedThreshold={4}
          onStartReached={() =>
            updateStartRendering(renderingDataForFlatList, setRenderingDataForFlatList, createRenderingDataForFlatList)
          }
          showsVerticalScrollIndicator={true}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        />
      </DateToVisitsContext.Provider>
    </View>
  );
}

export { DateToVisitsContext };

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

const getDateToVisitsMap = (visitData) => {
  const visitMap = {};
  visitData.forEach((visit) => {
    return (visitMap[visit.date] = visit);
  });
  return visitMap;
};

const fetcher = (...args) => fetch(...args).then((res) => res.json());

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

const updateStartRendering = (renderingDataForFlatList, setRenderingDataForFlatList, createRenderingDataForFlatList) => {
  return new Promise((resolve) => {
    const firstDate = renderingDataForFlatList[0].date;
    const newFirstDate = subDays(firstDate, 14);
    const newDays = createRenderingDataForFlatList(newFirstDate, subDays(firstDate, 1));
    const renderingData = [...newDays, ...renderingDataForFlatList];
    setRenderingDataForFlatList(renderingData);
    resolve();
  });
};

const updateEndRendering = (renderingDataForFlatList, setRenderingDataForFlatList, createRenderingDataForFlatList) => {
  return new Promise((resolve) => {
    const lastDate = renderingDataForFlatList[renderingDataForFlatList.length - 1].date;
    const newLastDate = addDays(lastDate, 14);
    const newDays = createRenderingDataForFlatList(addDays(lastDate, 1), newLastDate);
    const renderingData = [...renderingDataForFlatList, ...newDays];
    setRenderingDataForFlatList(renderingData);
    resolve();
  });
};
