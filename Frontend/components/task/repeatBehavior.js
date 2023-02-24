import { Fragment, useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, List } from 'react-native-paper';
import RepeatItem from './repeatItem';
import { getLabel, getRepeatBehaviorObject, REPEAT_CODES } from '../../utils/tasks';
import { getDateFromDateString } from '../../utils/date';
import { max } from 'date-fns';

export default function RepeatBehavior({
  data,
  isLoading,
  editMode,
  editStartDate,
  editRepeatTitle,
  setEditRepeat,
  setEditRepeatTitle,
}) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState(getLabel(REPEAT_CODES.NEVER, undefined));
  const [dateToUse, setDateToUse] = useState(
    !isLoading && data.length > 0 ? getDateFromDateString(data[0].start_date) : new Date()
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

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />
      ) : (
        <Fragment>
          <List.Accordion
            title={editMode ? editRepeatTitle : title}
            style={styles.descriptionBorder}
            left={(props) => <List.Icon {...props} icon={title === 'Does not repeat' ? 'repeat-off' : 'repeat'} />}
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
                setEditRepeat(getRepeatBehaviorObject(REPEAT_CODES.NEVER, dateToUse));
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
                setEditRepeat(getRepeatBehaviorObject(REPEAT_CODES.DAY, dateToUse));
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
                setEditRepeat(getRepeatBehaviorObject(REPEAT_CODES.WEEK, dateToUse));
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
                setEditRepeat(getRepeatBehaviorObject(REPEAT_CODES.ANNUAL, dateToUse));
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
          {/* {title !== 'Does not repeat' && data[0].end_date && (
            <Text style={styles.takesPlaceText}>Until {format(new Date(data[0].end_date), 'MMMM do, y')}</Text>
          )} */}
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
});
