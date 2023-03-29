import {
  addDays,
  isEqual,
  startOfWeek,
  startOfMonth,
  differenceInDays,
  startOfDay,
  startOfYear,
  endOfYear,
  addMonths,
  isSameYear,
  subWeeks,
  format,
  addWeeks,
} from 'date-fns';
import { uniqueId } from 'lodash';
import { createContext, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Header from '../components/calendar/header';
import useSWR from 'swr';
import ScrollableScreen from '../components/calendar/scrollableScreen';

import config from '../constants/config';
import UserContext from '../services/context/UserContext';
import CalendarRefreshContext from '../services/context/CalendarRefreshContext';
import { getDateString } from '../utils/date';
import RecordVisitPrompt from '../components/calendar/recordVisitPrompt';
import { useRoute } from '@react-navigation/native';

const DateToVisitsContext = createContext();

export default function Calendar({ navigation }) {
  const [initDate, setInitDate] = useState(startOfDay(new Date()));
  const [startDate, setStartDate] = useState(startOfYear(initDate));
  const [endDate, setEndDate] = useState(endOfYear(initDate));
  const [renderingDataForFlatList, setRenderingDataForFlatList] = useState(
    createRenderingDataForFlatList(initDate, addMonths(initDate, 12))
  );
  const [currentDateDisplayed, setCurrentDateDisplayed] = useState(initDate);
  const [dateToVisitsMap, setDateToVisitsMap] = useState(undefined);

  const startDateString = getDateString(subWeeks(startDate, 2));
  const endDateString = getDateString(addWeeks(endDate, 2));

  const [resetScreen, setResetScreen] = useState(false);

  const { user } = useContext(UserContext);

  const [, setRefreshCalendar] = useContext(CalendarRefreshContext);

  useEffect(() => {
    setResetScreen(true);
    setStartDate(startOfYear(initDate));
    setEndDate(endOfYear(initDate));
    setRenderingDataForFlatList(createRenderingDataForFlatList(initDate, addMonths(initDate, 12)));
  }, [initDate]);

  useEffect(() => {
    setResetScreen(false);
  }, [renderingDataForFlatList]);

  const { data, error, isLoading, mutate } = useSWR(
    [`${config.backend_server}/visits/group/${user.curr_group}?start=${startDateString}&end=${endDateString}`, {
      headers: { 'Authorization': 'Bearer ' + user.access_token }
    }],
    fetcher
  );

  useEffect(() => {
    setRefreshCalendar(() => mutate);
  }, [mutate]);

  useEffect(() => {
    if (data) setDateToVisitsMap(getDateToVisitsMap(data));
    else if (isLoading) setDateToVisitsMap(undefined);
    else if (error) setDateToVisitsMap('error');
  }, [data, error, isLoading]);

  useEffect(() => {
    if (!isSameYear(currentDateDisplayed, endDate)) {
      setEndDate(endOfYear(currentDateDisplayed));
    }

    if (!isSameYear(currentDateDisplayed, startDate)) {
      setStartDate(startOfYear(currentDateDisplayed));
    }
  }, [currentDateDisplayed]);

  return (
    <View style={styles.container}>
      <Header date={currentDateDisplayed} setInitDate={setInitDate} navigation={navigation} />
      <DateToVisitsContext.Provider value={dateToVisitsMap}>
        {!resetScreen && (
          <ScrollableScreen
            renderingDataForFlatList={renderingDataForFlatList}
            setRenderingDataForFlatList={setRenderingDataForFlatList}
            createRenderingDataForFlatList={createRenderingDataForFlatList}
            setCurrentDateDisplayed={setCurrentDateDisplayed}
            resetScreen={resetScreen}
            setResetScreen={setResetScreen}
            navigation={navigation}
          />
        )}
      </DateToVisitsContext.Provider>
      <RecordVisitPrompt navigation={navigation} />
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

const fetcher = (url, token) => fetch(url, token).then((res) => res.json());

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
