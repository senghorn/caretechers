import { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { ActivityIndicator } from 'react-native-paper';
import UserContext from '../services/context/UserContext';
const axios = require('axios').default;
const config = require('../constants/config').default;
import colors from '../constants/colors';
import EditGraphHeader from '../components/healthVitals/editGraphHeader';

/**
 * Display component a measurement row
 * 
 * @param {Object} timestamp  
 * @param {Object} measurement component
 * @param {Function} removeMeasurement(timestamp, auth_token) handler when user press delete a measurement
 * @returns 
 */
const MeasurementRow = ({ timestamp, measurement, removeMeasurement }) => {
  const { user } = useContext(UserContext);
  return (
    <View style={styles.row}>
      <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Text style={{ ...styles.cell, ...styles.measurement }}>{measurement}</Text>
        <Text style={styles.cell}>{timestamp}</Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Button
          mode="contained"
          uppercase={false}
          color={colors.pinkishRed}
          icon="minus-box"
          onPress={() => {
            removeMeasurement(timestamp, user.access_token);
          }}
        >
          Delete
        </Button>
      </View>
    </View>
  );
};

/**
 *  Graph editor screen that support changes in a health vitals graph.
 * @param {*} param0 
 * @returns 
 */
export default function EditGraph({ navigation, route }) {
  const { id, units, title, getGraphs } = route.params;
  const { user } = useContext(UserContext);
  const [graphData, setGraphData] = useState({});
  const [showEditDialogBox, setShowEditDialogBox] = useState(false);
  const [newMeasurement, setNewMeasurement] = useState(null);
  const [newDate, setNewDate] = useState(new Date(Date.now()));
  const [dateToInsert, setDateToInsert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = new Date(selectedDate);
    const month = currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1;
    const date = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate();

    const dateString = `${currentDate.getFullYear()}-${month}-${date}`;
    setDateToInsert(dateString);
    setNewDate(selectedDate);
  };

  // Sends a remove measurement qpi request to backend given timestamp and auth token
  const removeMeasurement = async (timestamp, token) => {
    let connection_string = config.backend_server + `/measurements/${id}/${timestamp}`;
    try {
      await axios.delete(connection_string, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      console.log('error removing measurement', e);
    }

    const graphDataCopy = JSON.parse(JSON.stringify(graphData));
    delete graphDataCopy[timestamp];
    setGraphData(graphDataCopy);
    await getGraphs(token);
  };

  // Fetches all the measurements in this graph
  const getMeasurements = async (token) => {
    let connection_string = config.backend_server + '/measurements/' + id;
    try {
      setIsLoading(true);
      const response = await axios.get(connection_string, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGraphData(response.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const addNewMeasurement = async () => {
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
    const newDateString = newDate.toISOString().slice(0, 10).replace('T', ' ');
    graphDataCopy[newDateString] = parseInt(newMeasurement).toFixed(2);
    setGraphData(graphDataCopy);
    setSaveLoading(true);
    try {
      let connection_string = config.backend_server + '/measurements/' + id;
      await axios.post(connection_string, {
        measurement: newMeasurement,
        date: newDateString,
      });
      await getGraphs();
    } catch (e) {
      console.log(e);
    }

    setShowEditDialogBox(false);
    setNewDate(new Date(Date.now()));
    setDateToInsert(null);
    setNewMeasurement(null);
    setSaveLoading(false);
  };

  // Sends a delete graph api request to completely remove graph
  const deleteGraph = async (token) => {
    setDeleteLoading(true);
    let connection_string = config.backend_server + '/graphs/' + id;
    try {
      await axios.delete(connection_string, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      console.log(e);
    }
    await getGraphs(token);
    setDeleteLoading(false);
    navigation.goBack();
  };

  useEffect(() => {
    getMeasurements(user.access_token);
  }, []);

  return (
    <View style={styles.outercontainer}>
      <EditGraphHeader navigation={navigation} title={title} units={units} deleteGraph={deleteGraph} />
      {isLoading ? (
        <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />
      ) : (
        <ScrollView style={styles.scrollcontainer}>
          <View style={styles.table}>
            {Object.keys(graphData).map((timestamp) => (
              <MeasurementRow
                key={`${timestamp}${graphData[timestamp]}`}
                timestamp={timestamp}
                measurement={graphData[timestamp]}
                removeMeasurement={removeMeasurement}
              ></MeasurementRow>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '2%',
    paddingBottom: '2%',
    paddingHorizontal: '8%',
    marginBottom: '2%',
    borderRadius: 10,
    backgroundColor: colors.lightBlue,
  },
  tableWrapper: {},
  loader: {
    paddingTop: 64,
  },
  outercontainer: {
    flex: 1,
  },
  scrollcontainer: {
    flex: 0,
    paddingTop: 16,
    marginBottom: 20,
  },
  table: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  cell: {
    fontSize: 16,
    color: colors.dark,
  },
  measurement: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  title: {
    fontWeight: 'bold',
    fontSize: '30%',
    textAlign: 'center',
  },
  titleView: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
