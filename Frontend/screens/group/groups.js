import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { useState } from 'react';
import colors from '../../constants/colors';
import { addUserToGroup } from '../../services/api/user';

export default function Groups({ navigation, route }) {
  const { user } = route.params;
  const [groupName, setGroupName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Button
          icon='home-plus'
          mode='contained'
          onPress={() => {
            navigation.navigate('CreateGroup', { user });
          }}
          style={styles.header}
          color='lightblue'
        >
          Create Group
        </Button>

        <View style={styles.form}>
          <TextInput
            right={<TextInput.Icon icon='home-heart' />}
            value={groupName}
            label={'Group ID'}
            activeUnderlineColor='lightblue'
            underlineColor='lightblue'
            onChangeText={(text) => {
              setGroupName(text);
            }}
          />
          <TextInput
            right={<TextInput.Icon icon='lock' />}
            value={password}
            secureTextEntry={true}
            label={'Group Code'}
            activeUnderlineColor='lightblue'
            underlineColor='lightblue'
            onChangeText={(text) => {
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
          onPress={() =>
            joinGroupHandler(user, groupName, password, navigation)
          }
          style={styles.createButton}
          color='lightblue'
        >
          Join
        </Button>
      </SafeAreaView>
    </View>
  );
}

const joinGroupHandler = async (user, group, password, navigation) => {
  const joined = await addUserToGroup(user.email, group, password);
  if (joined == true) {
    navigation.navigate('Home', { user: user });
  } else {
    console.log('join group failed');
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmWhite,
    overflow: 'scroll',
  },
  header: {
    marginTop: 10,
    margin: 10,
  },
  searchInput: {
    width: '95%',
    alignSelf: 'center',
  },
  topItem: {
    marginTop: 70,
  },
  form: {
    marginTop: 20,
    marginBottom: 20,
  },
  text: {
    alignSelf: 'center',
    fontSize: 10,
  },
  createButton: {
    marginTop: 10,
    margin: 10,
  },
});
