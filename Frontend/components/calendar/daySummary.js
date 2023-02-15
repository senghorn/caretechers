import { format, isBefore, isEqual, startOfDay } from 'date-fns';
import { useContext, useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Animated, TouchableHighlight, Touchable, Image } from 'react-native';
import { DateToVisitsContext } from '../../screens/calendar';
import { AntDesign } from '@expo/vector-icons';
import UserContext from '../../services/context/UserContext';
import config from '../../constants/config';

export default function DaySummary({
  date,
  navigation,
  override = false,
  visitInfoOverride = undefined,
  isLoadingOverride = true,
  errorOverride = false,
}) {
  const dateToVisitsMap = useContext(DateToVisitsContext);
  const user = useContext(UserContext);
  const key = format(date, 'yyyy-MM-dd');

  const [isLoading, setIsLoading] = useState(isLoadingOverride);
  const [visitInfo, setVisitInfo] = useState(visitInfoOverride);
  const [error, setError] = useState(errorOverride);

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
    return (
      <TouchableHighlight
        onPress={() => {
          volunteerForVisit(key, user);
          setVisitInfo({ ...visitInfo, visitor: user.email, first_name: user.first_name });
        }}
        style={styles.buttonContainer}
        underlayColor="#ededed"
        disabled={false}
      >
        <View style={styles.volunteerButton}>
          <AntDesign name="pluscircleo" size={16} color="#2196f3" />
          <Text style={styles.volunteerButtonText}>{`Volunteer to Visit`}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  let colorStyle = styles.futureDayColor;
  if (visitInfo.visitor && visitInfo.completedTaskCount === visitInfo.taskCount && inThePast)
    colorStyle = styles.completedDayColor;
  else if (isCurrentDay) colorStyle = styles.currentDayColor;
  else if (!visitInfo.visitor || inThePast) colorStyle = styles.missedDayColor;

  const completedTasks = visitInfo.completedTaskCount || 0;
  let taskLabel = visitInfo.taskCount
    ? inThePast
      ? `${completedTasks} / ${visitInfo.taskCount} Tasks Completed`
      : `${visitInfo.taskCount} Tasks`
    : 'No Tasks';

  return (
    <TouchableHighlight
      onPress={() => navigation.navigate('Visit', { date })}
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

const headers = {
  'Content-Type': 'application/json',
};

const volunteerForVisit = async (date, user) => {
  const newVisit = {
    date,
    userEmail: user.email,
  };

  try {
    await fetch(`${config.backend_server}/visits/group/${user.group_id}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newVisit),
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log('finished volunteering');
  }
};

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
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    borderRadius: 8,
  },
  volunteerButton: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: '#ededed',
    borderWidth: 1,
  },
  volunteerButtonText: {
    color: '#2196f3',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 8,
  },
});

const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};
