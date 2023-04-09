import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert, Share } from 'react-native';
import { Appbar, IconButton, Avatar, Divider, Text, TextInput, ActivityIndicator } from 'react-native-paper';
import { useState, useEffect, useContext } from 'react';
import { Bullets } from "react-native-easy-content-loader";
import colors from '../../constants/colors';
import UserContext from '../../services/context/UserContext';
import { resetGroupPassword } from '../../services/api/groups';
import { RemoveUserFromGroup, fetchUserByCookie } from '../../services/api/user';
import config from '../../constants/config';
import useSWR from 'swr';
import SocketContext from '../../services/context/SocketContext';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
const fetcher = (url, token) => fetch(url, token).then((res) => res.json());

export default function GroupSettings({ navigation }) {
  const { setUser, user } = useContext(UserContext);
  const { data, isLoading, error, mutate } = useSWR([config.backend_server + '/groups/info/' + user.curr_group,
  {
    headers: { 'Authorization': 'Bearer ' + user.access_token }
  }],
    ([url, token]) => fetcher(url, token));
  const [showAlert, setShowAlert] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [password, setPassword] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(isLoading);
  const [waitingToLeave, setWaitToLeave] = useState(false);
  const [socket, setSocket] = useContext(SocketContext);
  const [group, setGroup] = useState({
    name: '',
  });

  useEffect(() => {
    if (user != null && !isLoading && data) {
      setMembers(data);
      if (data.length > 0) {
        setPassword(data[0].password);
        setGroup({ name: data[0].name });
      }
    }
    setLoading(isLoading);
  }, [user, data, isLoading]);

  const LeaveGroup = async () => {
    if (user && user.id && user.curr_group) {
      const removed = await RemoveUserFromGroup(user.id, user.curr_group, user.access_token);
      if (removed == true) {
        const result = await fetchUserByCookie(user.access_token);
        if (result) {
          socket.disconnect();
          setSocket(null);
          setUser({
            "access_token": user.access_token, "curr_group": result.curr_group, "id": result.id,
            "first_name": result.first_name, "last_name": result.last_name, "profile_pic": result.profile_pic,
            "phone_num": result.phone_num, "groups": result.groups
          });
        } else {
          console.log('Fetch user data after removed group from failed');
        }
        navigation.navigate('GroupSelector');
      } else {
        alert('Cannot leave group.');
      }
    }
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      'Leave Group',
      'Are you sure you want to leave this group?',
      [
        {
          text: 'Cancel',
          onPress: handleCancelLeaveGroup,
          style: 'cancel',
        },
        {
          text: 'Leave',
          onPress: handleConfirmLeaveGroup,
          style: 'destructive',
        },
      ],
      { cancelable: false }
    )
  };
  const handleConfirmLeaveGroup = async () => {
    setWaitToLeave(true);
    await LeaveGroup();
    setWaitToLeave(false);
  };
  const handleCancelLeaveGroup = () => {
    setShowAlert(false);
  };

  const changeGroupNameHandler = () => {
    console.log('Change Group Name Pressed');
  };

  const onShare = async () => {
    const response = await axios.get(`${config.backend_server}/groups/token`, {
      headers: {
        'authorization': `Bearer ${user.access_token}`
      }
    });
    console.log(response.data);
    try {
      const result = await Share.share({
        message: `Join our caretaking group!\n\nexp://${config.ip}:19000/?token=${response.data}\n\nThis link will expire in 5 minutes!`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner
        color='#add8e6'
        visible={waitingToLeave}
        textStyle={styles.spinnerTextStyle}
        size={'large'}
      />
      <Appbar.Header style={styles.headerContainer}>
        <Appbar.Action
          icon={'arrow-left'}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title={'Group'} titleStyle={styles.title} />
        <Appbar.Action icon="dots-horizontal" onPress={() => { navigation.navigate('GroupSelector') }} />
      </Appbar.Header>
      <View style={styles.bodyContainer}>
        <ImageBackground
          resizeMode={'stretch'}
          imageStyle={{ borderBottomLeftRadius: 60, borderTopRightRadius: 60 }}
          source={require('../../assets/blue-background.jpg')}
        >
          <View style={styles.titleBox}>
            <Text style={styles.titleText}>{group.name}</Text>
            <TouchableOpacity onPress={changeGroupNameHandler}>
              <Text style={styles.changeName}>Change name</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View style={styles.buttonList}>
          <TextInput
            secureTextEntry={passwordVisible}
            value={password}
            right={
              <TextInput.Icon name={passwordVisible ? 'eye' : 'eye-off'} onPress={() => setPasswordVisible(!passwordVisible)} />
            }
            left={
              <TextInput.Icon
                name={'lock-reset'}
                onPress={async () => {
                  if (user && user.curr_group) {
                    setLoading(true);
                    const result = await resetGroupPassword(user.curr_group, user.access_token);
                    setPassword(result);
                    setLoading(false);
                  }
                }}
              />
            }
            disabled
            style={styles.passwordBox}
          />
          <View style={styles.buttonContainer}>
            <IconButton icon="account-plus" size={28} color={colors.primary} style={styles.iconButton} onPress={onShare} />
            <Text style={styles.buttonTitle}>Invite</Text>
          </View>
          <View style={styles.buttonContainer}>
            <IconButton icon="exit-to-app" size={28} color={colors.danger} style={styles.iconButton} onPress={handleLeaveGroup} />
            <Text style={styles.buttonTitle}>Leave</Text>
          </View>
        </View>
        <View style={styles.memberListBox}>
          <Text style={styles.membersTitle}>Members</Text>
          <Bullets active listSize={5} loading={loading} />
          <GroupMemberList members={members} />
        </View>
      </View>
      {showAlert &&
        Alert.alert(
          'Leave Group',
          'Are you sure you want to leave this group?',
          [
            {
              text: 'Cancel',
              onPress: handleCancelLeaveGroup,
              style: 'cancel',
            },
            {
              text: 'Leave',
              onPress: handleConfirmLeaveGroup,
              style: 'destructive',
            },
          ],
          { cancelable: false }
        )}
    </View>
  );
}

const GroupMemberList = ({ members }) => {
  return (
    <ScrollView style={styles.listContainer}>
      {members.map((member) => (
        <MemberItem user={member} key={member.first_name} />
      ))}
    </ScrollView>
  );
};

const MemberItem = ({ user }) => {
  const userPressedHandler = () => {
    console.log(`user ${user.name} pressed`);
  };
  return (
    <View>
      <TouchableOpacity style={styles.memberItem} onPress={userPressedHandler}>
        <Avatar.Image size={24} source={{ uri: user.profile_pic }} />
        <Text style={styles.username}>{user.first_name + ' ' + user.last_name}</Text>
      </TouchableOpacity>
      <Divider
        style={{
          marginLeft: 30,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.profileCard,
  },
  headerContainer: {
    flex: 0,
    backgroundColor: '#fff',
  },
  bodyContainer: {
    flex: 1,
  },
  titleBox: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: 150,
    borderBottomLeftRadius: 70,
    borderBottomEndRadius: 70,
    marginLeft: 20,
    marginRight: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.grayLight,
    alignSelf: 'center',
  },
  memberListBox: {
    margin: 20,
  },
  iconButton: {
    backgroundColor: colors.white,
  },
  buttonTitle: {
    alignSelf: 'center',
    marginTop: -6,
    fontSize: 12,
    color: colors.gray,
  },
  buttonContainer: {
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  buttonList: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  membersTitle: {
    fontWeight: '500',
    fontSize: 16,
  },
  listContainer: {
    marginTop: 20,
  },
  memberItem: {
    marginBottom: 10,
    borderRadius: 12,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    padding: 5,
    fontSize: 16,
    marginLeft: 10,
  },
  changeName: {
    fontSize: 12,
    color: colors.white,
    marginTop: 15,
  },
  title: {
    fontSize: 18,
  },
  passwordBox: {
    margin: 10,
    width: '60%',
    alignSelf: 'center',
  },
});
