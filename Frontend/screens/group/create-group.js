import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { TextInput, Text, Button, Appbar } from 'react-native-paper';
import colors from '../../constants/colors';

export default function CreateGroup({ navigation, route }) {
  const { user } = route.params;
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (user != null) {
      if (user.given_name == null) {
        setGroupName(user.first + ' ', user.last + ' Family');
      } else {
        setGroupName(user.given_name + ' ' + user.family_name + ' Family');
      }
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action
          icon='chevron-left'
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title='Create Your Group' />
      </Appbar.Header>
      <View style={styles.description}>
        <Text style={styles.text}>
          Your group is where you and your family coordinate caretaking.
        </Text>
        <Text style={styles.text}>Make yours and start coordinating.</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          right={<TextInput.Icon icon='home-heart' />}
          value={groupName}
          onChangeText={(text) => setGroupName(text)}
          label={'Group Name'}
          activeUnderlineColor='lightblue'
          underlineColor='lightblue'
        />
      </View>
      <Text style={styles.text}>
        By creating a group, you agree to our Community Guidelines.
      </Text>
      <Button
        icon='check-all'
        mode='contained'
        onPress={() => createGroup(groupName, user)}
        style={styles.createButton}
        color='lightblue'
      >
        Create Group
      </Button>
    </SafeAreaView>
  );
}

const createGroup = (groupName, user) => {
  console.log('Creating group ', groupName);
};

const styles = StyleSheet.create({
  container: {},
  appbar: {
    backgroundColor: colors.lightBlue,
  },
  form: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    padding: 20,
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  text: {
    alignSelf: 'center',
    fontSize: 10,
  },
  createButton: {
    marginTop: 10,
    margin: 10,
  },
  description: {
    marginTop: 20,
  },
});
