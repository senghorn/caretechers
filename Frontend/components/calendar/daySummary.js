import { isEqual, startOfDay } from 'date-fns';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function DaySummary({ date, volunteer = false }) {
  if (volunteer) {
    return (
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          uppercase={false}
          color="#fff"
          icon="plus-circle-outline"
          onPress={() => console.log('Volunteer to Visit')}
          style={styles.volunteerButton}
          contentStyle={styles.volunteerButtonContent}
          labelStyle={styles.volunteerButtonText}
        >
          Volunteer to Visit
        </Button>
      </View>
    );
  }

  const isCurrentDay = isEqual(date, startOfDay(new Date()));
  return (
    <View style={isCurrentDay ? styles.currentDayContainer : styles.container}>
      <View style={styles.pictureContainer}></View>
      <View>
        <Text style={styles.nameText}>John</Text>
        <Text>7 Tasks</Text>
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
