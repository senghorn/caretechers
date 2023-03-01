import { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, RefreshControl, ScrollView, View } from 'react-native';
import { FAB, ActivityIndicator, Provider } from 'react-native-paper';
import Note from '../../components/notes/note';
import COLORS from '../../constants/colors';
import Header from '../../components/notes/header';
import config from '../../constants/config';
import UserContext from '../../services/context/UserContext';
import useSWR from 'swr';
import { NotesRefreshContext } from '../../services/context/NotesRefreshContext';
import { SearchNotes } from '../../services/api/notes';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Notes({ navigation, route }) {
  const { user } = useContext(UserContext);
  const { refresh, sort, searchMode } = useContext(NotesRefreshContext);
  const [searchResult, setSearchResult] = useState([]);
  const { data, isLoading, error, mutate } = useSWR(
    config.backend_server + '/notes/group/' + user.group_id,
    fetcher
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [notesList, setNotesList] = useState(null);
  const onRefresh = useCallback(async () => {
    if (user != null && user !== {}) {
      setRefreshing(true);
      await mutate();
      setRefreshing(false);
    }
  }, [user, mutate]);

  useEffect(() => {
    if (user != null && !isLoading && data) {
      let notes = data;
      if (searchMode && searchResult) {
        notes = searchResult;
      }
      const sortedNotes = sortNotes(notes, sort);
      setNotesList(
        <ScrollView
          style={styles.tasksContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {sortedNotes.map((note) => (
            <Note key={note.id} note={note} navigation={navigation} />
          ))}
        </ScrollView>
      );
    }
  }, [user, data, isLoading, sort, searchMode, searchResult]);

  useEffect(() => {
    mutate();
  }, [refresh]);

  useEffect(() => {
    if (searchQuery && searchQuery !== '') {
      const search = async () => {
        const result = await SearchNotes(searchQuery, user.group_id);
        setSearchResult(result);
      };

      search();
    }
  }, [searchQuery]);

  return (
    <Provider>
      <View style={styles.container}>
        <Header
          title={'Notes'}
          sort={true}
          navigation={navigation}
          setSearchQuery={setSearchQuery}
        />
        {isLoading && (
          <ActivityIndicator
            size='large'
            color='#2196f3'
            style={styles.loader}
          />
        )}
        {notesList}
        <FAB
          icon='note-plus-outline'
          style={styles.fab}
          color={'white'}
          onPress={() => {
            navigation.navigate('New Note', {
              note: { id: 'new', title: '', content: '' },
            });
          }}
        />
      </View>
    </Provider>
  );
}

function sortNotes(notes, sortingType) {
  switch (sortingType) {
    case 'Ascending':
      notes.sort((a, b) => a.title.localeCompare(b.title));
      return notes;
    case 'Descending':
      notes.sort((a, b) => b.title.localeCompare(a.title));
      return notes;
    case 'Latest Date':
      notes.sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited));
      return notes;
    case 'Earliest Date':
      notes.sort((a, b) => new Date(a.last_edited) - new Date(b.last_edited));
      return notes;
    default:
      return notes;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tasksContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
  loader: {
    marginTop: 40,
  },
});
