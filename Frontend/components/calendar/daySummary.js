import { isEqual, startOfDay } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';
import { Button } from 'react-native-paper';

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

export default function DaySummary({ date, data, isLoading }) {
  if (isLoading) {
    return (
      <FadeInView style={styles.loadingContainer}>
        <View />
      </FadeInView>
    );
  }

  const [isVolunteer, setIsVolunteer] = useState(data.length === 0 || !data[0].visitor);

  let [visitInfo] = data;
  if (!visitInfo) {
    visitInfo = { taskCount: 0 };
  }
  if (isVolunteer) {
    return (
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          uppercase={false}
          color="#fff"
          icon="plus-circle-outline"
          onPress={() => setIsVolunteer(false)}
          style={styles.volunteerButton}
          contentStyle={styles.volunteerButtonContent}
          labelStyle={styles.volunteerButtonText}
        >
          {`Volunteer to Visit (${visitInfo.taskCount} Tasks)`}
        </Button>
      </View>
    );
  }

  const isCurrentDay = isEqual(date, startOfDay(new Date()));
  return (
    <View style={isCurrentDay ? styles.currentDayContainer : styles.container}>
      <View style={styles.pictureContainer}></View>
      <View>
        <Text style={styles.nameText}>{visitInfo.first_name}</Text>
        <Text>{visitInfo.taskCount} Tasks</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ededed',
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ededed',
  },
  currentDayContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#c8e5fc',
  },
  nameText: {
    fontWeight: '600',
  },
  pictureContainer: {
    height: 32,
    width: 32,
    backgroundColor: '#2196f3',
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
    justifyContent: 'center',
  },

  volunteerButtonContent: {
    height: '100%',
    width: '100%',
  },
  volunteerButtonText: {
    color: '#2196f3',
    fontWeight: '600',
  },
});
