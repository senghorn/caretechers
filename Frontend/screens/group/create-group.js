import { useEffect, useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { TextInput, Text, Button, Appbar } from 'react-native-paper';
import colors from '../../constants/colors';
import { createNewGroup } from '../../services/api/groups';
import { addUserToGroup } from '../../services/api/user';
import { setUserDataInfo } from '../../utils/userController';
import UserContext from '../../services/context/UserContext';
import SocketContext from '../../services/context/SocketContext';
import Spinner from 'react-native-loading-spinner-overlay';
export default function CreateGroup({ navigation, route }) {
  const { user, setUser } = useContext(UserContext);
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useContext(SocketContext);
  useEffect(() => {
    if (user != null && user.first_name) {
      setGroupName(user.first_name + ' ' + user.last_name + ' Family');
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <Spinner
        color='#add8e6'
        visible={loading}
        textStyle={styles.spinnerTextStyle}
        size={'large'}
      />
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
          activeUnderlineColor={colors.primary}
          underlineColor='grey'
        />
      </View>
      <Text style={styles.text}>
        By creating a group, you agree to our Community Guidelines.
      </Text>
      <Button
        icon='check-all'
        mode='contained'
        onPress={async () => {
          setLoading(true);
          const create = await createGroup(groupName, user);
          if (create) {
            await setUserDataInfo(setUser, user.access_token);
            socket.disconnect();
            setSocket(null);
            setLoading(false);
            navigation.navigate('Home');
          }
          setLoading(false);
        }}
        style={styles.createButton}
        color={colors.primary}
      >
        Create Group
      </Button>
    </SafeAreaView>
  );
}

/**
 * Creates a new group given the name, timezone and visit frequency.
 * Then, adds user to the created group.
 * @param {string} groupName
 * @param {json} user
 */
const createGroup = async (groupName, user) => {
  const timezone = 'America/Denver';
  const result = await createNewGroup(groupName, timezone, 4, user.id, user.access_token);
  if (result) {
    return true;
  }

  return false;
};

const styles = StyleSheet.create({
  container: {},
  appbar: {
    backgroundColor: colors.bgColor,
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
