import { StyleSheet, View, Text } from 'react-native';
import { useState, useContext } from 'react';
import { TextInput } from 'react-native-paper';
import { Appbar } from 'react-native-paper';
import { RefreshContext } from '../../services/context/RefreshContext';

export default function Header({ navigation, route, title, sort, pin = false }) {
  // Sort drop down values
  const data = [
    { label: 'Date', value: '1' },
    { label: 'Alphabets', value: '2' },
    { label: 'Relevant', value: '3' },
  ];

  const { sortRefresh } = useContext(RefreshContext);

  // If true, sorts the notes ascending lexicographical order, otherwise descending
  const [sortAscending, sortSortAscending] = useState(true);
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
        {searchMode ? (
          <Appbar.Action
            icon="close"
            onPress={() => {
              setSearchMode(false);
            }}
          />
        ) : (
          <Appbar.Action
            icon="magnify"
            onPress={() => {
              setSearchMode(true);
            }}
          />
        )}
        {!searchMode && sort && (
          <Appbar.Action
            icon={'sort-alphabetical-variant'}
            onPress={() => {
              sortSortAscending(!sortAscending);
              sortRefresh(sortAscending ? 'ascending' : 'descending');
            }}
          />
        )}
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
