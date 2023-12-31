import { SafeAreaView, StyleSheet, View } from 'react-native';
import { TextInput, Text, Button, Appbar } from 'react-native-paper';
import { useState, useContext, useEffect } from 'react';
import colors from '../../constants/colors';
import { addUserToGroup } from '../../services/api/user';
import UserContext from '../../services/context/UserContext';
import InviteLinkContext from '../../services/context/InviteLinkContext';
import axios from 'axios';
import config from '../../constants/config'
import SocketContext from '../../services/context/SocketContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { setUserDataInfo } from '../../utils/userController';

/**
 * This component displays options for joining or creating group.
 * @param {Object} react component for navigating between screen 
 * @returns 
 */
export default function Groups({ navigation }) {
  const { setUser, user } = useContext(UserContext);
  const [inviteLinkContext, setInviteToken] = useContext(InviteLinkContext);
  const [groupName, setGroupName] = useState('');
  const [password, setPassword] = useState('');
  const [socket, setSocket] = useContext(SocketContext);
  const [loading, setLoading] = useState(false);
  const [navigateHome, setNavigateHome] = useState(false);
  useEffect(() => {
    if (user && navigateHome) {
      socket.disconnect();
      setSocket(null);
      navigation.navigate('Home');
    }
  }, [user, navigateHome]);

  const processInviteLink = async () => {
    if (inviteLinkContext) {
      try {
        const response = await axios.get(`${config.backend_server}/groups/info/token/${inviteLinkContext}`, {
          headers: {
            'authorization': `Bearer ${user.access_token}`
          }
        });
        if (user.groups.map(group => group.name).includes(response.data.groupName)) {
          navigation.navigate('Home')
        }
        setGroupName(response.data.groupName);
        setPassword(response.data.groupPassword);
      } catch (e) {
        console.log('process invite link error', e);
        console.log('COULD NOT FETCH NAME AND PASSWORD FROM LINK.');
      }
    }
  }

  useEffect(() => {
    if (inviteLinkContext) {
      processInviteLink();
    }
  }, [inviteLinkContext]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Spinner
          color='#add8e6'
          visible={loading}
          textStyle={styles.spinnerTextStyle}
          size={'large'}
        />
        <Appbar style={styles.headerContainer}>
          <Appbar.BackAction onPress={() => navigation.navigate("GroupSelector")} />
          <Appbar.Content title="Join group" titleStyle={styles.title} />
        </Appbar>
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
            setLoading(true);
            const joined = await joinGroupHandler(user, groupName, password);
            if (joined == true && user.id) {
              const result = await setUserDataInfo(setUser, user.access_token);
              if (result) {
                socket.disconnect();
                setSocket(null);
                setNavigateHome(true);
              } else {
                console.log('Fetch user data error');
              }

            } else {
              alert('Group name and/or password are incorrect!');
            }
            setLoading(false);
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

/**
 * Handles joining group given user with id, access_token, group and password
 * @param {*} user 
 * @param {*} group 
 * @param {*} password 
 * @returns 
 */
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
  headerContainer: {
    backgroundColor: 'transparent',
    flex: 0,
    width: '100%',
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
  spinnerTextStyle: {
    color: '#FFF',
    fontSize: 12
  },
});
