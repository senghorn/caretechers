import { format } from 'date-fns';
import { Fragment, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import useSWR from 'swr';
import config from '../../constants/config';
import DateTimePicker from '@react-native-community/datetimepicker';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Description({ id, editMode }) {
  const { data, isLoading, error } = useSWR(`${config.backend_server}/tasks/group/1/task/${id}`, fetcher);

  return (
    <Fragment>
      <View style={styles.container}>
        <Text style={styles.header}>Description</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />
        ) : editMode ? (
          <TextInput
            multiline={true}
            numberOfLines={4}
            style={styles.descriptionBorder}
            label=""
            value={data[0].description}
            onChangeText={(text) => {}}
            selectionColor="#2196f3"
            underlineColor="#2196f3"
            activeUnderlineColor="#2196f3"
          />
        ) : (
          <View style={styles.descriptionBorderLocked}>
            <Text style={styles.description}>{data[0].description}</Text>
          </View>
        )}
        <Text style={styles.header}>Schedule</Text>
        <View style={styles.selectDateContainer}>
          <Text style={styles.takesPlaceText}>Starts {format(new Date(data[0].start_date), 'MMMM do, y')}</Text>
          {editMode && (
            <DateTimePicker testID="dateTimePicker" value={new Date()} mode={'date'} is24Hour={true} onChange={() => {}} />
          )}
        </View>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  selectDateContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  takesPlaceText: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 12,
    marginRight: 8,
  },
  container: {
    marginTop: 24,
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
  descriptionBorder: {
    marginTop: 8,
    marginBottom: 24,
    height: 160,
    backgroundColor: '#fff',
    borderColor: '#888',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 16,
  },
  descriptionBorderLocked: {
    marginTop: 8,
    marginBottom: 24,
    height: 160,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
  },
});
