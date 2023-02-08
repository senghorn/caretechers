import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { TextInput, Text, Button, Appbar } from 'react-native-paper';
import colors from '../constants/colors';

export default function Group({ navigation, route }) {
  const { user } = route.params;
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (user != null) {
      setGroupName(user.first + ' ' + user.last + ' Family');
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action
          icon='chevron-left'
          onPress={() => {
            navigation.navigate('Group', { user });
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
        By creating a group, you agree do our Community Guidelines.
      </Text>
      <Button
        icon='check-all'
        mode='contained'
        onPress={() => console.log('Pressed')}
        style={styles.createButton}
        color='lightblue'
      >
        Create Group
      </Button>
    </SafeAreaView>
  );
}

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
