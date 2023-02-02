import { Fragment } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Appbar, TextInput } from 'react-native-paper';

export default function Header({ title, navigation, editMode, setEditMode, editTitle, setEditTitle, hideButtons, backTo }) {
  return (
    <View style={styles.outerContainer}>
      <Appbar.Header style={styles.container}>
        <Appbar.Action
          icon="chevron-left"
          onPress={() => {
            if (backTo) {
              navigation.navigate('Visit', { date: backTo });
            } else {
              navigation.navigate('Home');
            }
          }}
        />
        {editMode ? (
          <TextInput
            style={styles.titleInput}
            label="Title"
            value={editTitle}
            onChangeText={(text) => {
              setEditTitle(text);
            }}
            mode="outlined"
          />
        ) : (
          <Appbar.Content title={title} titleStyle={styles.titleText} />
        )}
        {!hideButtons && (
          <Fragment>
            <Appbar.Action
              icon="pencil-box-multiple"
              color="#1664a1"
              onPress={() => {
                setEditMode(!editMode);
              }}
            />
            <Appbar.Action
              icon="delete-empty"
              color="#D11A2A"
              onPress={() => {
                Alert.alert(
                  'Are you sure you want to delete this task?',
                  '', // <- this part is optional, you can pass an empty string
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Confirm',
                      onPress: () => Alert.alert('Confirm Pressed'),
                      style: 'destructive',
                    },
                  ],
                  {
                    cancelable: true,
                  }
                );
              }}
            />
          </Fragment>
        )}
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
