import { Fragment } from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, List } from 'react-native-paper';
import useSWR from 'swr';
import config from '../../constants/config';
import RepeatItem from './repeatItem';
import { format } from 'date-fns';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function RepeatBehavior({ id, editMode, editRepeat, setEditRepeat }) {
  const { data, isLoading, error } = useSWR(`${config.backend_server}/tasks/${id}/repeats`, fetcher);

  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('Does not repeat');

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />
      ) : (
        <Fragment>
          <List.Accordion
            title={editMode ? editRepeat : title}
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
              setEditRepeat={setEditRepeat}
              setExpanded={setExpanded}
            />
            <RepeatItem
              title="Daily"
              selected={title}
              setSelected={setTitle}
              editMode={editMode}
              setEditRepeat={setEditRepeat}
              setExpanded={setExpanded}
            />
            <RepeatItem
              title={`Weekly on ${format(new Date(data[0].start_date), 'EEEE')}`}
              selected={title}
              setSelected={setTitle}
              editMode={editMode}
              setEditRepeat={setEditRepeat}
              setExpanded={setExpanded}
            />
            <RepeatItem
              title={`Annually on ${format(new Date(data[0].start_date), 'MMMM qo')}`}
              selected={title}
              setSelected={setTitle}
              editMode={editMode}
              setEditRepeat={setEditRepeat}
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
