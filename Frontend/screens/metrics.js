import { View, Text, StyleSheet, ScrollView, Dimensions, Alert, RefreshControl } from 'react-native';
import { useState, useEffect, useContext, useCallback } from 'react';
import Graph from '../components/healthVitals/graph';
import { ActivityIndicator, FAB } from 'react-native-paper';
import colors from '../constants/colors';
import UserContext from '../services/context/UserContext';
import Dialog from 'react-native-dialog';
import Header from '../components/healthVitals/header';
const axios = require('axios').default;
const config = require('../constants/config').default;

/**
 * Component to display metrics and allow create new graph and measurements.
 * 
 * @param {Object} navigation: React component for navigation 
 * @returns 
 */
export default function Metrics({ navigation }) {
  const [showCreateNewGraphDialogBox, setShowCreateNewGraphDialogBox] = useState(false);
  const [graphs, setGraphs] = useState({});
  const [newTitle, setNewTitle] = useState(null);
  const [newUnits, setNewUnits] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newGraphLoading, setNewGraphLoading] = useState(false);

  const { user } = useContext(UserContext);

  const formatDate = (timestamp) => {
    return timestamp.slice(5).replace('-', '/');
  };

  // Handler for creating new graph button
  const createNewGraph = async (token) => {
    if (newTitle === null || newUnits === null) {
      Alert.alert('Error', 'Title and units required!', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
      return;
    }
    let graphId;
    setNewGraphLoading(true);
    try {
      let connection_string = config.backend_server + '/graphs';
      const response = await axios.post(
        connection_string,
        {
          groupId: user.curr_group,
          title: newTitle,
          units: newUnits,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );
      graphId = parseInt(response.data.graphId);
    } catch (e) {
      console.log(e);
      return;
    }

    let graphsCopy = JSON.parse(JSON.stringify(graphs));
    graphsCopy[graphId] = {
      title: newTitle,
      units: newUnits,
      data: [],
    };
    setGraphs(graphsCopy);
    setShowCreateNewGraphDialogBox(false);
    setNewTitle(null);
    setNewUnits(null);
    setNewGraphLoading(false);
  };

  // Fetches graphs and update graphs 
  const getGraphs = async (token) => {
    let connection_string = config.backend_server + '/graphs/' + user.curr_group + '?limit=7';
    try {
      const response = await axios.get(connection_string, {
        withCredentials: true,
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      setGraphs(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetcher = async (token) => {
    await getGraphs(token);
  };

  useEffect(() => {
    if (user !== null && user !== {} && user.access_token) {
      setIsLoading(true);
      fetcher(user.access_token);
      setIsLoading(false);
    }
  }, [user]);

  const onRefresh = useCallback(async () => {
    if (user !== null && user !== {} && user.access_token) {
      setRefreshing(true);
      await fetcher(user.access_token);
      setRefreshing(false);
    }
  }, [user]);

  const [refreshing, setRefreshing] = useState(false);

  return (
    <View style={styles.container}>
      <Header onPress={getGraphs} navigation={navigation} />
      <View>
        <Dialog.Container visible={showCreateNewGraphDialogBox}>
          {newGraphLoading ? (
            <ActivityIndicator size="large" color="#2196f3" style={{ marginBottom: '10%' }} />
          ) : (
            <>
              <Dialog.Title style={{ marginBottom: '10%' }}>Create a new graph</Dialog.Title>
              <Dialog.Input placeholder="Title" onChangeText={(newTitle) => setNewTitle(newTitle)} />
              <Dialog.Input placeholder="Units" onChangeText={(newUnits) => setNewUnits(newUnits)} />
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Dialog.Button label="Cancel" onPress={() => setShowCreateNewGraphDialogBox(false)} />
                <Dialog.Button label="Save" onPress={() => createNewGraph(user.access_token)} />
              </View>
            </>
          )}
        </Dialog.Container>
      </View>

      <View style={styles.scrollContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />
        ) : (
          <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} style={styles.scrollPadding} />}
          >
            {Object.keys(graphs).map((key) => (
              <Graph
                key={key}
                id={key}
                title={graphs[key].title}
                units={graphs[key].units}
                labels={graphs[key].data.map((data) => formatDate(data.timestamp))}
                data={graphs[key].data.map((data) => data.measurement)}
                navigation={navigation}
                getGraphs={getGraphs}
                graphData={graphs}
              />
            ))}
          </ScrollView>
        )}
      </View>
      <FAB
        icon="chart-box-plus-outline"
        style={styles.fab}
        color="#fff"
        onPress={() => {
          setShowCreateNewGraphDialogBox(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  scrollContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },
  scrollPadding: {
    paddingTop: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: '30%',
  },
  button: {
    backgroundColor: colors.card,
  },
  loader: {
    height: '100%',
    transform: [{ translateY: -16 }],
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});
