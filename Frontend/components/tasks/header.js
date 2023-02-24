import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import SortAction from '../generic/sortAction';

export default function Header({ navigation, sortOptions, setSort }) {
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
        <Appbar.Content title="Tasks" titleStyle={styles.titleText} />
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
            color="#000"
            onPress={() => {
              setSearchMode(true);
            }}
          />
        )}
        {!searchMode && <SortAction sortOptions={sortOptions} setSort={setSort} />}
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
});
