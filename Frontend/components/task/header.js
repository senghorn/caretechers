import { StyleSheet, View } from 'react-native';
import { Appbar, TextInput } from 'react-native-paper';

export default function Header({ title, navigation, editMode, setEditMode }) {
  return (
    <View style={styles.outerContainer}>
      <Appbar.Header style={styles.container}>
        <Appbar.Action
          icon="chevron-left"
          onPress={() => {
            navigation.navigate('Home');
          }}
        />
        {editMode ? (
          <TextInput style={styles.titleInput} label="Title" value={title} mode="outlined" />
        ) : (
          <Appbar.Content title={title} titleStyle={styles.titleText} />
        )}
        <Appbar.Action
          icon="pencil-box-multiple"
          onPress={() => {
            navigation.navigate('Home');
          }}
        />
        <Appbar.Action
          icon="delete-empty"
          onPress={() => {
            navigation.navigate('Home');
          }}
        />
      </Appbar.Header>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    shadowOffset: { width: 0, height: -10 },
    shadowColor: '#888',
    shadowOpacity: 0.1,
    zIndex: 999,
  },
  container: {
    backgroundColor: '#fff',
    flex: 0,
    width: '100%',
  },
  titleText: {
    fontWeight: '500',
    fontSize: 18,
  },
  titleInput: {
    flexGrow: 1,
    height: 40,
    marginRight: 16,
    marginBottom: 4,
    fontSize: 18,
  },
});
