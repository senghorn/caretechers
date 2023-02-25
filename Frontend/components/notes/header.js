import { StyleSheet, View, Text } from 'react-native';
import { useState, useContext } from 'react';
import { TextInput } from 'react-native-paper';
import { Appbar } from 'react-native-paper';
import { NotesRefreshContext } from '../../services/context/NotesRefreshContext';
import SortAction from '../generic/sortAction';

export default function Header({ navigation, route, title, sort, pin = false }) {
  const SORT_LABELS = {
    ascending: 'Ascending',
    descending: 'Descending',
    latest_date: 'Latest Date',
    earliest_date: 'Earliest Date'
  };
  const sortOptions = Object.values(SORT_LABELS).map((value) => {
    return { label: value, value };
  });

  const { sortRefresh } = useContext(NotesRefreshContext);

  // If true, sorts the notes ascending lexicographical order, otherwise descending
  const [sortType, setSortType] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  return (
    <View>
      <Appbar.Header style={styles.headerContainer}>
        <Appbar.Action
          icon={'account-cog'}
          onPress={() => {
            navigation.navigate('Settings');
          }}
        />
        {searchMode ? (
          <TextInput
            style={styles.titleInput}
            label="Search"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              console.log(text);
            }}
            onEndEditing={() => {
              console.log('Search queried of text:', searchQuery);
            }}
            mode="outlined"
          />
        ) : (
          <Appbar.Content title={title} titleStyle={styles.title} />
        )}
        {!searchMode && sort && (
          <SortAction sortOptions={sortOptions} setSort={sortRefresh} />
        )}
        <Appbar.Action
          icon={searchMode ? "close" : "magnify"}
          onPress={() => {
            setSearchMode(!searchMode);
          }}
        />
        {!searchMode && pin && (
          <Appbar.Action
            icon="pin"
            onPress={() => {
              console.log('open pinned messages');
            }}
          />
        )}
      </Appbar.Header>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 0,
    backgroundColor: '#fff',
  },
  outerContainer: {
    shadowOffset: { width: 0, height: -10 },
    shadowColor: '#888',
    shadowOpacity: 0.1,
    zIndex: 999,
  },
  title: {
    fontWeight: '500',
    fontSize: 20,
  },
  titleInput: {
    flexGrow: 1,
    height: 40,
    marginRight: 16,
    marginBottom: 4,
    fontSize: 18,
  },
});
