import { useState } from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Appbar, TextInput } from 'react-native-paper';
import colors from '../../constants/colors';
import SortAction from '../generic/sortAction';

export default function Header({ navigation, sortOptions, setSort, query, setQuery }) {
  const [searchMode, setSearchMode] = useState(false);
  return (
    <View style={styles.outerContainer}>
      <Appbar.Header style={styles.container}>
        <Appbar.Action
          icon={'account-cog'}
          onPress={() => {
            navigation.navigate('Settings');
          }}
        />
        {searchMode ? (
          <TextInput
            style={styles.titleInput}
            dense
            label="Search Tasks"
            value={query}
            autoFocus
            activeOutlineColor={colors.primary}
            onChangeText={(text) => {
              setQuery(text);
            }}
            mode="outlined"
          />
        ) : (
          <Appbar.Content title="Tasks" titleStyle={styles.titleText} />
        )}
        {!searchMode && <SortAction sortOptions={sortOptions} setSort={setSort} />}
        {searchMode ? (
          <Appbar.Action
            icon="close"
            onPress={() => {
              setQuery('');
              setSearchMode(false);
            }}
          />
        ) : (
          <Appbar.Action
            icon="magnify"
            color="#000"
            onPress={() => {
              setSearchMode(true);
            }}
          />
        )}
      </Appbar.Header>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 0,
    width: '100%',
  },
  titleText: {
    fontWeight: '500',
    fontSize: 20,
  },
  outerContainer: {
    shadowOffset: { width: 0, height: -10 },
    shadowColor: '#888',
    shadowOpacity: 0.1,
    zIndex: 999,
  },
  titleInput: {
    flexGrow: 1,
    marginRight: 16,
    marginBottom: 4,
    fontSize: 18,
  },
});
