import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { TextInput, Text, Button, Appbar } from 'react-native-paper';
import { addUserToGroup } from '../../services/api/user';
import colors from '../../constants/colors';

export default function JoinGroup({ navigation, route }) {
  const { user, group } = route.params;
  const [groupName, setGroupName] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    if (group != null) {
      setGroupName(group.name);
    }
  }, [group]);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Action
          icon='chevron-left'
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title='Join Your Group' />
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
          label={'Group Selected'}
          activeUnderlineColor='lightblue'
          underlineColor='lightblue'
          disabled
        />
        <TextInput
          right={<TextInput.Icon icon='lock' />}
          value={password}
          secureTextEntry={true}
          label={'Group Code'}
          activeUnderlineColor='lightblue'
          underlineColor='lightblue'
          onChange={(text) => {
            setPassword(text);
          }}
        />
      </View>
      <Text style={styles.text}>
        By joining a group, you agree to our Community Guidelines.
      </Text>
      <Button
        icon='check-all'
        mode='contained'
        onPress={() => joinGroupHandler(user, group, password, navigation)}
        style={styles.createButton}
        color='lightblue'
      >
        Join
      </Button>
    </SafeAreaView>
  );
}

const joinGroupHandler = async (user, group, password, navigation) => {
  const joined = await addUserToGroup(user.email, group.id, password);
  if (joined == true) {
    navigation.navigate('Home', { user: user });
  } else {
    console.log('join group failed');
  }
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
