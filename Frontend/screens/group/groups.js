import { SafeAreaView, StyleSheet, View } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { useState, useContext } from 'react';
import colors from '../../constants/colors';
import { addUserToGroup, fetchUserByCookie } from '../../services/api/user';
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
            label={'Group Name'}
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
            const joined = await joinGroupHandler(user, groupName, password);
            if (joined == true && user.id) {
              const result = await fetchUserByCookie(user.access_token);
              setUser(result);
              setUser({
                "access_token": user.access_token, "curr_group": result.curr_group, "id": result.id,
                "first_name": result.first_name, "last_name": result.last_name, "profile_pic": result.profile_pic,
                "phone_num": result.phone_num
              });
              navigation.navigate('Home');
            } else {
              alert('Group name and password are incorrect!');
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
  const joined = await addUserToGroup(user.id, group, password, user.access_token);

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
