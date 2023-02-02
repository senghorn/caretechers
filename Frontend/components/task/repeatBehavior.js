import { Fragment } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, List } from 'react-native-paper';
import RepeatItem from './repeatItem';
import { format, getDate, getDay, getMonth } from 'date-fns';

export default function RepeatBehavior({ id, data, isLoading, editMode, editRepeatTitle, setEditRepeat, setEditRepeatTitle }) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('Does not repeat');

  const dateToUse = !isLoading && data.length > 0 ? new Date(data[0].start_date) : new Date();

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
              title="Does not repeat"
              selected={title}
              setSelected={setTitle}
              editMode={editMode}
              setEditRepeatTitle={setEditRepeatTitle}
              setEditRepeat={() => {
                setEditRepeat(null);
              }}
              setExpanded={setExpanded}
            />
            <RepeatItem
              title="Daily"
              selected={title}
              setSelected={setTitle}
              editMode={editMode}
              setEditRepeatTitle={setEditRepeatTitle}
              setEditRepeat={() => {
                setEditRepeat({
                  separation_count: 0,
                  day_of_week: null,
                  week_of_month: null,
                  day_of_month: null,
                  month_of_year: null,
                  recurring_type: 'daily',
                  task_id: id,
                });
              }}
              setExpanded={setExpanded}
            />
            <RepeatItem
              title={`Weekly on ${format(dateToUse, 'EEEE')}`}
              selected={title}
              setSelected={setTitle}
              editMode={editMode}
              setEditRepeatTitle={setEditRepeatTitle}
              setEditRepeat={() => {
                setEditRepeat({
                  separation_count: 0,
                  day_of_week: getDay(dateToUse),
                  week_of_month: null,
                  day_of_month: -1,
                  month_of_year: null,
                  recurring_type: 'weekly',
                  task_id: id,
                });
              }}
              setExpanded={setExpanded}
            />
            <RepeatItem
              title={`Annually on ${format(dateToUse, 'MMMM qo')}`}
              selected={title}
              setSelected={setTitle}
              editMode={editMode}
              setEditRepeatTitle={setEditRepeatTitle}
              setEditRepeat={() => {
                setEditRepeat({
                  separation_count: 0,
                  day_of_week: -1,
                  week_of_month: null,
                  day_of_month: getDate(dateToUse),
                  month_of_year: getMonth(dateToUse),
                  recurring_type: 'yearly',
                  task_id: id,
                });
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
