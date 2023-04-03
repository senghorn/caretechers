import { isBefore, isEqual, startOfDay } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, Image } from 'react-native';
import colors from '../../constants/colors';
import { DateToVisitsContext } from '../../screens/calendar';
import { getDateString } from '../../utils/date';
import { FadeInView } from '../generic/FadeInView';
import VolunteerButton from '../visit/volunteerButton';

export default function DaySummary({
  date,
  navigation,
  override = false,
  visitInfoOverride = undefined,
  isLoadingOverride = true,
  errorOverride = false,
  visitFirst = false,
}) {
  const dateToVisitsMap = useContext(DateToVisitsContext);
  const key = getDateString(date);

  const [isLoading, setIsLoading] = useState(isLoadingOverride);
  const [visitInfo, setVisitInfo] = useState(visitInfoOverride);
  const [error, setError] = useState(errorOverride);

  if (visitInfoOverride) {
    console.log('visit info', visitInfoOverride);
  }

  useEffect(() => {
    if (isLoadingOverride) {
      setIsLoading(isLoadingOverride);
      setError(false);
    } else if (errorOverride) {
      setIsLoading(false);
      setError(errorOverride);
    } else {
      setIsLoading(false);
      setError(false);
      if (!visitInfoOverride) {
        setVisitInfo({ taskCount: 0, visitor: null });
      } else {
        setVisitInfo(visitInfoOverride);
      }
    }
  }, [isLoadingOverride, visitInfoOverride, errorOverride]);

  useEffect(() => {
    if (!override) {
      if (dateToVisitsMap === undefined) {
        setError(false);
        setIsLoading(true);
      } else if (dateToVisitsMap == 'error') {
        setError(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setError(false);
        const visit = dateToVisitsMap[key];
        if (!visit) {
          setVisitInfo({ taskCount: 0, visitor: null });
        } else {
          setVisitInfo(visit);
        }
      }
    }
  }, [dateToVisitsMap, key, override]);

  if (isLoading || (!visitInfo && !error)) {
    return (
      <FadeInView style={styles.loadingContainer}>
        <View />
      </FadeInView>
    );
  }

  const isCurrentDay = isEqual(date, startOfDay(new Date()));
  const inThePast = isBefore(date, new Date());

  if (!visitInfo.visitor && (!inThePast || isCurrentDay)) {
    return <VolunteerButton visitFirst={visitFirst} date={key} />;
  }

  let colorStyle = styles.futureDayColor;
  if (visitInfo.visitor && visitInfo.completedTaskCount === visitInfo.taskCount && inThePast && visitInfo.visitCompleted)
    colorStyle = styles.completedDayColor;
  else if (visitInfo.visitor && visitInfo.completedTaskCount !== visitInfo.taskCount && inThePast && visitInfo.visitCompleted)
    colorStyle = styles.almostCompletedDayColor;
  else if (isCurrentDay) colorStyle = styles.currentDayColor;
  else if (!visitInfo.visitor || inThePast) colorStyle = styles.missedDayColor;

  const completedTasks = visitInfo.completedTaskCount || 0;
  let taskLabel = visitInfo.taskCount
    ? inThePast
      ? `${completedTasks} / ${visitInfo.taskCount} Tasks Completed`
      : `${visitInfo.taskCount} Tasks`
    : 'No Tasks';

  const dateString = getDateString(date);
  return (
    <TouchableHighlight
      onPress={() => navigation.navigate('Visit', { dateString })}
      style={[styles.container, colorStyle]}
      underlayColor="#ededed"
    >
      <View style={styles.innerContainer}>
        <Image
          style={[styles.pictureContainer, !visitInfo.visitor && styles.missedDayColor]}
          source={{ uri: visitInfo.profile_pic }}
        />
        <View style={styles.flexLayout}>
          <Text style={styles.nameText}>{visitInfo.first_name || 'No Visitor'}</Text>
          <Text>{taskLabel}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ededed',
  },
  currentDayColor: {
    backgroundColor: '#c8e5fc',
  },
  futureDayColor: {
    backgroundColor: '#ededed',
  },
  missedDayColor: {
    backgroundColor: '#9B191942',
  },
  completedDayColor: {
    backgroundColor: '#199b1e42',
  },
  almostCompletedDayColor: {
    backgroundColor: colors.lightYellow,
  },
  nameText: {
    fontWeight: '600',
  },
  pictureContainer: {
    height: 32,
    width: 32,
    backgroundColor: '#fff',
    borderRadius: '100%',
    marginRight: 16,
  },
});
