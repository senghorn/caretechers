import { useState, useEffect, useContext, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { FAB, ActivityIndicator } from 'react-native-paper';
import Note from '../../components/notes/note';
import COLORS from '../../constants/colors';
import Header from '../../components/notes/header';
import config from '../../constants/config';
import UserContext from '../../services/context/UserContext';
import { fetchNotes } from '../../services/api/notes';
import useSWR from 'swr';
import { RefreshContext } from '../../services/context/RefreshContext';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Notes({ navigation }) {
  // Grab user data from UserContext
  const { user } = useContext(UserContext);
  const { refresh, sort } = useContext(RefreshContext);

  const { data, isLoading, error, mutate } = useSWR(config.backend_server + '/notes/group/' + user.group_id, fetcher);

  useEffect(() => {
    if (user != null && !(Object.keys(user).length === 0) && !isLoading && data) {
      if (sort != 'none') {
        setNotes(sortNotesByTitle(data, sort));
      } else {
        setNotes(data);
      }
    }
  }, [user, data, isLoading]);

  useEffect(() => {
    mutate();
  }, [refresh]);

  useEffect(() => {
    if (notes && sort) {
      setNotes(sortNotesByTitle(notes, sort == 'ascending'));
    }
  }, [sort, notes]);

  const [notes, setNotes] = useState(null);
  const [noteModified, setNoteModified] = useState(null);

  useEffect(() => {
    if (noteModified) {
      fetchNotes(user, setNotes);
      setNoteModified(null);
    }
  }, [noteModified]);

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
      <Header title={'Notes'} sort={true} navigation={navigation} />
      <ScrollView style={styles.tasksContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {isLoading || notes === null ? (
          <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />
        ) : (
          notes.map((note) => <Note key={note.id} note={note} navigation={navigation} />)
        )}
      </ScrollView>
      <FAB
        icon="note-plus-outline"
        style={styles.fab}
        color={'white'}
        onPress={() => {
          navigation.navigate('Note', {
            note: { id: 'new', title: '', content: '' },
          });
        }}
      />
    </View>
  );
}
/**
 * Sorts the given notes and returns the sorted notes
 * @param {JSON} notes
 * @param {Boolean} ascending
 * @returns
 */
function sortNotesByTitle(notes, ascending = true) {
  // Sort the notes by title in ascending or descending order
  notes.sort(function (a, b) {
    var titleA = a.title.toUpperCase();
    var titleB = b.title.toUpperCase();
    if (titleA < titleB) {
      return ascending ? -1 : 1;
    }
    if (titleA > titleB) {
      return ascending ? 1 : -1;
    }
    return 0;
  });

  return notes;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
});
