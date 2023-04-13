import { useContext } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import UserContext from '../../services/context/UserContext';

export default function EditGraphHeader({ navigation, title, units, deleteGraph }) {
  const { user } = useContext(UserContext);

  return (
    <View style={styles.outerContainer}>
      <Appbar.Header style={styles.container}>
        <Appbar.Action
          icon="chevron-left"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title={title} subtitle={units} titleStyle={styles.titleText} />
        <Appbar.Action
          icon="delete-empty"
          color="red"
          onPress={() => {
            Alert.alert(
              'Are you sure you want to permanently delete this graph?',
              'This cannot be undone', // <- this part is optional, you can pass an empty string
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Confirm',
                  onPress: async () => {
                    deleteGraph(user.access_token);
                  },
                  style: 'destructive',
                },
              ],
              {
                cancelable: true,
              }
            );
          }}
        />
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
    flex: 0,
  },
  titleInput: {
    flexGrow: 1,
    height: 40,
    marginRight: 16,
    marginBottom: 4,
    fontSize: 18,
  },
});
