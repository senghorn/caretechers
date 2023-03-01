import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Fragment } from 'react';
import { getLabel, getNextDateFromRepeatBehavior, REPEAT_CODES } from '../../utils/tasks';
import { getDateFromDateString, getHumanReadableDate } from '../../utils/date';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Feather } from '@expo/vector-icons';

export default function Task({ title, id, dateString, navigation, showIcon, repeatBehavior }) {
  if (!title) return null;
  return (
    <TouchableHighlight
      style={styles.taskContainer}
      underlayColor="#e3f2fd"
      onPress={() => navigation.navigate('Task', { title, id, dateString })}
    >
      <Fragment>
        <View style={styles.topLayout}>
          <View style={styles.taskTitleContainer}>
            {showIcon && <AntDesign name="checkcircleo" size={16} color="black" />}
            <Text style={styles.taskText}>{title}</Text>
          </View>
          <MaterialCommunityIcons name="heart-cog-outline" size={16} color="#2196f3" />
        </View>
        <RepeatBehaviorSubHeader repeatBehavior={repeatBehavior} />
      </Fragment>
    </TouchableHighlight>
  );
}

const noRepeat = getLabel(REPEAT_CODES.NEVER, undefined);

function RepeatBehaviorSubHeader({ repeatBehavior }) {
  if (repeatBehavior) {
    const upcomingDay = getHumanReadableDate(
      getNextDateFromRepeatBehavior(repeatBehavior.recurring_type, getDateFromDateString(repeatBehavior.start_date))
    );
    const repeatLabel = getLabel(repeatBehavior.recurring_type, getDateFromDateString(repeatBehavior.start_date));
    return (
      <View style={styles.repeatContainer}>
        <Text style={styles.subText}>{upcomingDay.charAt(0).toUpperCase() + upcomingDay.slice(1)}</Text>
        {repeatLabel !== noRepeat && (
          <View style={styles.repeatPattern}>
            <Feather name="repeat" size={14} color="black" />
            <Text style={[styles.repeatLabel, styles.subText]}>{repeatLabel}</Text>
          </View>
        )}
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  taskTitleContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskContainer: {
    backgroundColor: '#ededed',
    borderRadius: 8,
    paddingRight: 16,
    paddingVertical: 14,
    marginVertical: 4,
  },
  repeatContainer: {
    marginTop: 4,
    marginLeft: 16,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  repeatPattern: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '50%',
  },
  repeatLabel: {
    marginLeft: 4,
  },
  topLayout: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskText: {
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 16,
    width: '80%',
  },
  subText: {
    fontWeight: '400',
    fontSize: 13,
    color: '#494F55',
  },
});
