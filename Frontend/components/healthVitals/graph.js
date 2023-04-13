import { useState, useContext } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Button } from 'react-native-paper';
import { ActivityIndicator, FAB } from 'react-native-paper';
import AddDataButton from './addDataButton';
import Dialog from 'react-native-dialog';
import DateTimePicker from '@react-native-community/datetimepicker';
import UserContext from '../../services/context/UserContext';
const config = require('../../constants/config').default;
const axios = require('axios').default;

export default function Graph({ id, title, units, labels, data, navigation, getGraphs, graphData }) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
      },
    ],
    legend: [`${units}`],
  };

  const { user } = useContext(UserContext);
  const chartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#2D78E9',
    backgroundGradientTo: '#add8e6',
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  const getInitialDateToInsert = () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1;
    const date = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate();
    return `${currentDate.getFullYear()}-${month}-${date}`;
  };

  const [showEditDialogBox, setShowEditDialogBox] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [newMeasurement, setNewMeasurement] = useState(null);
  const [newDate, setNewDate] = useState(new Date(Date.now()));
  const [dateToInsert, setDateToInsert] = useState(getInitialDateToInsert());

  const onDateChange = (event, selectedDate) => {
    const currentDate = new Date(selectedDate);
    const month = currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1;
    const date = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate();

    const dateString = `${currentDate.getFullYear()}-${month}-${date}`;
    console.log(dateString);
    setDateToInsert(dateString);
    setNewDate(selectedDate);
  };

  const addNewMeasurement = async (token) => {
    if (newMeasurement === null) {
      Alert.alert('Error', 'Measurement required!', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
    }

    for (const timestamp of Object.keys(graphData)) {
      if (dateToInsert === timestamp) {
        Alert.alert('Error', `Measurement already exists for ${dateToInsert}`, [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        return;
      }
    }

    const graphDataCopy = JSON.parse(JSON.stringify(graphData));
    graphDataCopy[dateToInsert] = parseInt(newMeasurement).toFixed(2);
    setSaveLoading(true);
    try {
      let connection_string = config.backend_server + '/measurements/' + id;
      await axios.post(
        connection_string,
        {
          measurement: newMeasurement,
          date: dateToInsert,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await getGraphs(token);
    } catch (e) {
      console.log(e);
    }

    setShowEditDialogBox(false);
    setNewDate(new Date(Date.now()));
    setDateToInsert(null);
    setNewMeasurement(null);
    setSaveLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>{title}</Text>
        <Button
          mode="contained"
          color="#2196f3"
          icon="pencil-outline"
          style={styles.button}
          onPress={() => navigation.navigate('EditGraph', { id, units, title, getGraphs })}
        >
          Edit
        </Button>
      </View>

      {(data && data.length) > 0 ? (
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 20}
          height={Dimensions.get('window').height / 3}
          withShadow="false"
          chartConfig={chartConfig}
          style={styles.graph}
        />
      ) : (
        <Text style={styles.nodata}>No data yet! Add a measurement to get started</Text>
      )}
      <AddDataButton setShowEditDialogBox={setShowEditDialogBox} />

      <Dialog.Container visible={showEditDialogBox}>
        {saveLoading ? (
          <ActivityIndicator size="large" color="#2196f3" style={{ marginBottom: '10%' }} />
        ) : (
          <>
            <Dialog.Title style={{ marginBottom: '10%' }}>Enter a new measurement</Dialog.Title>
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Dialog.Input
                placeholder="Measurement"
                style={{ width: 100 }}
                onChangeText={(newMeasurement) => setNewMeasurement(newMeasurement)}
              />
              <DateTimePicker testID="dateTimePicker" value={newDate} mode="date" onChange={onDateChange} display="spinner" />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Dialog.Button label="Cancel" onPress={() => setShowEditDialogBox(false)} />
              <Dialog.Button label="Save" onPress={() => addNewMeasurement(user.access_token)} />
            </View>
          </>
        )}
      </Dialog.Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 32,
  },
  graph: {
    marginVertical: 8,
    borderRadius: 16,
  },
  titleBar: {
    width: Dimensions.get('window').width - 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '500',
    fontSize: 20,
  },
  button: {
    alignSelf: 'center',
  },
  nodata: {
    marginVertical: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#888',
  },
});
