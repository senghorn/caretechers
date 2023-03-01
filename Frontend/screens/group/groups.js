import { SafeAreaView, StyleSheet, View } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { useState, useContext } from 'react';
import colors from '../../constants/colors';
import { addUserToGroup, fetchUserByEmail } from '../../services/api/user';
import UserContext from '../../services/context/UserContext';

export default function Groups({ navigation }) {
  const { setUser, user } = useContext(UserContext);
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
          color={colors.primary}
        >
          Create Group
        </Button>

        <View style={styles.form}>
          <TextInput
            right={<TextInput.Icon icon='home-heart' />}
            value={groupName}
            label={'Group ID'}
            activeUnderlineColor={colors.primary}
            underlineColor='grey'
            onChangeText={(text) => {
              setGroupName(text);
            }}
          />
          <TextInput
            right={<TextInput.Icon icon='lock' />}
            value={password}
            secureTextEntry={true}
            label={'Group Code'}
            activeUnderlineColor={colors.primary}
            underlineColor='grey'
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
          onPress={async () => {
            const result = await joinGroupHandler(user, groupName, password);
            if (result == true && user.email) {
              const fetchedUser = await fetchUserByEmail(user.email);
              setUser(fetchedUser);
              navigation.navigate('Home');
            }
          }}
          style={styles.createButton}
          color={colors.primary}
        >
          Join
        </Button>
      </SafeAreaView>
    </View>
  );
}

const joinGroupHandler = async (user, group, password) => {
  console.log(user);
  const joined = await addUserToGroup(user.email, group, password);

  if (joined == true) {
    return true;
  } else {
    console.log('join group failed');
    return false;
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
