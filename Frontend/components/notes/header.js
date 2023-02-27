import { StyleSheet, View, Text } from 'react-native';
import { useState, useContext, useEffect } from 'react';
import { TextInput } from 'react-native-paper';
import { Appbar } from 'react-native-paper';
import { NotesRefreshContext } from '../../services/context/NotesRefreshContext';
import SortAction from '../generic/sortAction';
import colors from '../../constants/colors';
import { SearchNotes } from '../../services/api/notes';
import UserContext from '../../services/context/UserContext';


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

  const { sortRefresh, setSearchResult, setSearchMode } = useContext(NotesRefreshContext);
  const { user } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [iconSearchMode, setIconSearchMode] = useState(false);

  return (
    <View>
      <Appbar.Header style={styles.headerContainer}>
        <Appbar.Action
          icon={'account-cog'}
          onPress={() => {
            navigation.navigate('Settings');
          }}
        />
        {iconSearchMode ? (
          <TextInput
            style={styles.titleInput}
            label="Search"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              console.log(text);
            }}
            onEndEditing={async () => {
              if (user && user.group_id) {
                const result = await SearchNotes(searchQuery, user.group_id);
                setSearchResult(result);
              }
            }}
            autoFocus
            activeOutlineColor={colors.primary}
            mode="outlined"
          />
        ) : (
          <Appbar.Content title={title} titleStyle={styles.title} />
        )}
        {!iconSearchMode && sort && (
          <SortAction sortOptions={sortOptions} setSort={sortRefresh} />
        )}
        <Appbar.Action
          icon={iconSearchMode ? "close" : "magnify"}
          onPress={() => {
            setIconSearchMode(!iconSearchMode);
            setSearchMode(!iconSearchMode);
          }}
        />
        {!iconSearchMode && pin && (
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
