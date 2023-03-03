import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { ActivityIndicator } from 'react-native-paper';
import { IconButton, MD3Colors } from 'react-native-paper';
import Dialog from "react-native-dialog";
import DateTimePicker from '@react-native-community/datetimepicker';
const axios = require('axios').default;
const config = require('../constants/config').default;
import colors from '../constants/colors';

const MeasurementRow = ({timestamp, measurement, removeMeasurement}) => {
  return (
    <View style={styles.row}>
      <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Text style={{...styles.cell, ...styles.measurement}}>{measurement}</Text>
        <Text style={styles.cell}>{timestamp}</Text>
      </View>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        {/**
        <Button
          mode="contained"
          uppercase={false}
          color="#e3f2fd"
          icon="minus-box"
          onPress={() => removeMeasurement(timestamp)}
          style={{marginRight: '4%'}}
        >
          Edit
        </Button>
        */}
        <Button
          mode="contained"
          uppercase={false}
          color="#FF0D0E"
          icon="minus-box"
          onPress={() => removeMeasurement(timestamp)}
        >
          Delete
        </Button>
      </View>
    </View>
  );
};

export default function EditGraph({navigation, route}) {
  const {id, units, title, getGraphs} = route.params;

  const [graphData, setGraphData] = useState({});
  const [showEditDialogBox, setShowEditDialogBox] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
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

  const removeMeasurement = async (timestamp) => {
    let connection_string = config.backend_server + `/measurements/${id}/${timestamp}`;
    try {
      await axios.delete(connection_string);
    } catch (e) {
      console.log(e);
    }

    const graphDataCopy = JSON.parse(JSON.stringify(graphData));
    delete graphDataCopy[timestamp];
    setGraphData(graphDataCopy);
    await getGraphs()
  }

  const getMeasurements = async () => {
    let connection_string = config.backend_server + '/measurements/' + id;
    try {
      setIsLoading(true);
      const response = await axios.get(connection_string);
      setGraphData(response.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const addNewMeasurement = async () => {
    if (newMeasurement === null) {
      Alert.alert('Error', 'Measurement required!', [{text: 'OK', onPress: () => console.log('OK Pressed')}]);
    }

    for (const timestamp of Object.keys(graphData)) {
      if (dateToInsert === timestamp) {
        Alert.alert('Error', `Measurement already exists for ${dateToInsert}`, [{text: 'OK', onPress: () => console.log('OK Pressed')}]);
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
        date: newDateString
      });
      await getGraphs()
    } catch (e) {
      console.log(e);
    }

    setShowEditDialogBox(false);
    setNewDate(new Date(Date.now()));
    setDateToInsert(null);
    setNewMeasurement(null);
    setSaveLoading(false);
  };

  const deleteGraph = async () => {
    setDeleteLoading(true);
    let connection_string = config.backend_server + '/graphs/' + id;
    try {
      await axios.delete(connection_string);
    } catch (e) {
      console.log(e);
    }
    await getGraphs();
    setShowDeleteConfirmation(false);
    setDeleteLoading(false);
    navigation.goBack();
  };

  useEffect(() => {
    getMeasurements();
  }, [])

  return (
    <View style={{height: Dimensions.get('window').height, alignItems: 'center'}}>
      <View style={styles.header}>
        <View style={styles.titleView}>
          <Text style={styles.title}>{title}</Text>
          <Text>{units}</Text>
        </View>
        <View style={styles.buttonView}>
          <IconButton
            icon="delete"
            size={30}
            onPress={() => setShowDeleteConfirmation(true)}
          />
        </View>
      </View>
      <View style={styles.tableWrapper}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />
          ): (
            <ScrollView contentContainerStyle={styles.table}>
            {
                Object.keys(graphData).map((timestamp) => <MeasurementRow
                                                            key={`${timestamp}${graphData[timestamp]}`}
                                                            timestamp={timestamp}
                                                            measurement={graphData[timestamp]}
                                                            removeMeasurement={removeMeasurement}
                                                            >
                                                            </MeasurementRow>)
            }
            </ScrollView>
          )
        }

      </View>

      <View>
      <Dialog.Container visible={showDeleteConfirmation}>
      {
        deleteLoading ? (
          <ActivityIndicator size="large" color="#2196f3" style={{marginBottom: '10%'}} />
        ) : (
          <>
            <Dialog.Title>Are you sure you want to delete this graph? THIS CANNOT BE UNDONE!</Dialog.Title>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Dialog.Button label="No" onPress={() => setShowDeleteConfirmation(false)}/>
              <Dialog.Button label="Yes" onPress={deleteGraph}/>
            </View>
          </>
          )
        }
        </Dialog.Container>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '18%',
    width: '90%',
    justifyContent: 'space-between',
    borderBottomColor: colors.grayLight,
    borderBottomWidth: 2,
  },
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
    backgroundColor: '#2D78E9',
  },
  tableWrapper: {
    paddingTop: '2%',
    paddingBottom: '10%',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    marginTop: '3%',
    paddingBottom: '30%'
  },
  cell: {
    fontSize: '20%',
    color: 'white'
  },
  measurement: {
    fontWeight: 'bold',
    fontSize: '25%'
  },
  title: {
    fontWeight: 'bold',
    fontSize: '30%',
    textAlign: 'center'
  },
  titleView: {
    display: 'flex',
    alignItems: 'center'
  },
  buttonView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});
