import { Fragment, useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, List } from 'react-native-paper';
import RepeatItem from './repeatItem';
import {
  getLabel,
  getNextDateFromRepeatBehavior,
  getRepeatBehaviorObject,
  REPEAT_CODES,
  translateRepeatBehaviorToString,
} from '../../utils/tasks';
import { getDateFromDateString, getHumanReadableDate } from '../../utils/date';
import { format, isSameDay, isToday, isTomorrow, max } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

/**
 * Component that supports repeat behavior options for a task
 * @param {Object} navigation: React component for navigation
 * @returns
 */
export default function RepeatBehavior({
  id,
  data,
  isLoading,
  editMode,
  editStartDate,
  setEditStartDate,
  editRepeatTitle,
  setEditRepeatTitle,
  editRepeat,
  setEditRepeat,
}) {
  const [expanded, setExpanded] = useState(false);
  const [dateToUse, setDateToUse] = useState(
    !isLoading && data.length > 0 ? getDateFromDateString(data[0].start_date) : new Date()
  );
  const [title, setTitle] = useState(
    !isLoading ? (editMode ? editRepeatTitle : translateRepeatBehaviorToString(data[0], dateToUse)) : 'Loading...'
  );

  useEffect(() => {
    if (!editMode) {
      setExpanded(false);
    }
  }, [editMode]);

  useEffect(() => {
    if (editMode) {
      setDateToUse(max([editStartDate, new Date()]));
    } else {
      setDateToUse(!isLoading && data.length > 0 ? getDateFromDateString(data[0].start_date) : new Date());
    }
  }, [editMode, editStartDate, isLoading, data]);

  useEffect(() => {
    if (isLoading) {
      setTitle('Loading...');
    } else {
      if (editMode) {
        setTitle(editRepeatTitle);
      } else {
        setEditRepeatTitle(translateRepeatBehaviorToString(data[0], dateToUse));
        setTitle(translateRepeatBehaviorToString(data[0], dateToUse));
      }
    }
  }, [isLoading, editMode, editRepeatTitle, dateToUse]);

  const isData = !editMode && !isLoading && data && data.length > 0;

  const startDate = isData ? getDateFromDateString(data[0].start_date) : undefined;
  const upcoming = isData ? getNextDateFromRepeatBehavior(data[0].recurring_type, startDate) : undefined;
  const showUpcomingDate = isData ? !editMode && data[0].recurring_type !== null : false;

  let startLabel = 'Starts';
  if (!editMode && isData) {
    if (data[0].recurring_type === null) {
      startLabel = 'Takes place';
    }
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />
      ) : (
        <Fragment>
          <Text style={styles.header}>Schedule</Text>
          {showUpcomingDate && <Text style={styles.takesPlaceText}>Upcoming visit - {getHumanReadableDate(upcoming)}</Text>}
          <View style={styles.selectDateContainer}>
            <Text style={styles.takesPlaceText}>
              {startLabel} {!editMode && getHumanReadableDate(startDate, showUpcomingDate)}
            </Text>
            {editMode && (
              <DateTimePicker
                testID="dateTimePicker"
                value={editMode ? editStartDate : startDate}
                onChange={(event, date) => {
                  setEditStartDate(date);
                  const recurringType =
                    (editRepeat && editRepeat.recurring_type) ||
                    (data && data.length > 0 && data[0].recurring_type) ||
                    REPEAT_CODES.NEVER;
                  setEditRepeat(getRepeatBehaviorObject(recurringType, date, id));
                  setEditRepeatTitle(getLabel(recurringType, date));
                }}
                mode={'date'}
                display="compact"
                style={{ paddingRight: 20 }}
                is24Hour={true}
                minimumDate={new Date()}
              />
            )}
          </View>
          <List.Accordion
            title={title}
            style={styles.descriptionBorder}
            left={(props) => (
              <List.Icon {...props} icon={title === getLabel(REPEAT_CODES.NEVER, undefined) ? 'repeat-off' : 'repeat'} />
            )}
            right={editMode ? null : (props) => <Text />}
            expanded={expanded}
            onPress={() => {
              if (!editMode) {
                setExpanded(false);
              } else setExpanded(!expanded);
            }}
          >
            <RepeatItem
              title={getLabel(REPEAT_CODES.NEVER, dateToUse)}
              selected={title}
              setSelected={setTitle}
              editMode={editMode}
              setEditRepeatTitle={setEditRepeatTitle}
              setEditRepeat={() => {
                setEditRepeat(getRepeatBehaviorObject(REPEAT_CODES.NEVER, dateToUse, id));
              }}
              setExpanded={setExpanded}
            />
            <RepeatItem
              title={getLabel(REPEAT_CODES.DAY, dateToUse)}
              selected={title}
              setSelected={setTitle}
              editMode={editMode}
              setEditRepeatTitle={setEditRepeatTitle}
              setEditRepeat={() => {
                setEditRepeat(getRepeatBehaviorObject(REPEAT_CODES.DAY, dateToUse, id));
              }}
              setExpanded={setExpanded}
            />
            <RepeatItem
              title={getLabel(REPEAT_CODES.WEEK, dateToUse)}
              selected={title}
              setSelected={setTitle}
              editMode={editMode}
              setEditRepeatTitle={setEditRepeatTitle}
              setEditRepeat={() => {
                setEditRepeat(getRepeatBehaviorObject(REPEAT_CODES.WEEK, dateToUse, id));
              }}
              setExpanded={setExpanded}
            />
            <RepeatItem
              title={getLabel(REPEAT_CODES.MONTH, dateToUse)}
              selected={title}
              setSelected={setTitle}
              editMode={editMode}
              setEditRepeatTitle={setEditRepeatTitle}
              setEditRepeat={() => {
                setEditRepeat(getRepeatBehaviorObject(REPEAT_CODES.MONTH, dateToUse, id));
              }}
              setExpanded={setExpanded}
            />
            <RepeatItem
              title={getLabel(REPEAT_CODES.ANNUAL, dateToUse)}
              selected={title}
              setSelected={setTitle}
              editMode={editMode}
              setEditRepeatTitle={setEditRepeatTitle}
              setEditRepeat={() => {
                setEditRepeat(getRepeatBehaviorObject(REPEAT_CODES.ANNUAL, dateToUse, id));
              }}
              setExpanded={setExpanded}
            />
            {/* <RepeatItem
              title="Every weekday (Monday to Friday)"
              selected={title}
              setSelected={setTitle}
              setExpanded={setExpanded}
            /> */}
            {/* <RepeatItem title="Custom" selected={title} setSelected={setTitle} setExpanded={setExpanded} /> */}
          </List.Accordion>
        </Fragment>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  loader: {
    marginTop: 48,
  },
  header: {
    fontSize: 18,
    color: '#1664a1',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
  },
  descriptionBorder: {},
  takesPlaceText: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 12,
  },
  selectDateContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});
