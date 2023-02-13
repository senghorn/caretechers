import { useState, useEffect, useContext, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import Note from '../../components/notes/note';
import COLORS from '../../constants/colors';
import Header from '../../components/notes/header';
import config from '../../constants/config';
import UserContext from '../../services/context/UserContext';
import useSWR from 'swr';
import { RefreshContext } from '../../services/context/RefreshContext';

const axios = require('axios').default;
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Notes({ navigation }) {
  // Grab user data from UserContext
  const user = useContext(UserContext);
  const { refresh } = useContext(RefreshContext);

  const { data, isLoading, error, mutate } = useSWR(
    config.backend_server + '/notes/group/' + user.group_id,
    fetcher
  );

  useEffect(() => {
    if (
      user != null &&
      !(Object.keys(user).length === 0) &&
      !isLoading &&
      data
    ) {
      setNotes(data);
    }
  }, [user, data, isLoading]);

  useEffect(() => {
    mutate();
  }, [refresh]);


  // Add a state variable to control the visibility of the modal
  const [modalVisible, setModalVisible] = useState(false);
  const [notes, setNotes] = useState(null);
  const [noteModified, setNoteModified] = useState(null);

  useEffect(() => {
    if (noteModified) {
      // Do something
      fetchNotes(user, setNotes);
      setNoteModified(null);
    }
  }, [noteModified]);

  // prop
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (user != null && user !== {}) {
      setRefreshing(true);
      await mutate();
      setRefreshing(false);
    }
  }, [user, mutate]);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.tasksContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading || notes === null ? (
          <ActivityIndicator
            size='large'
            color='#2196f3'
            style={styles.loader}
          />
        ) : (
          notes.map((note) => (
            <Note key={note.id} note={note} navigation={navigation} />
          ))
        )}
      </ScrollView>
      <Button
        mode='contained'
        uppercase={false}
        color='#2196f3'
        icon='checkbox-marked-circle-plus-outline'
        style={styles.createButton}
        labelStyle={styles.createButtonText}
        onPress={() => {
          navigation.navigate('Note', {
            note: { id: 'new', title: '', content: '' },
          });
        }}
      >
        Add New Note
      </Button>
    </View>
  );
}

const fetchNotes = async (user, setNotes) => {
  try {
    let connection_string =
      config.backend_server + '/notes/group/' + user.group_id;
    await axios.get(connection_string).then(function (response) {
      setNotes(response.data);
    });
  } catch (error) {
    console.log('Fetching note error', error.message);
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    flexBasis: 'auto',
  },
  box: {
    elevation: 0,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  tasksContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  createButton: {
    marginVertical: 32,
    width: '40%',
    alignSelf: 'center',
  },
  createButtonText: {
    fontSize: 14,
  },
});
