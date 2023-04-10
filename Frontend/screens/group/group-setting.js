import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert, Share } from 'react-native';
import { Appbar, IconButton, Avatar, Divider, Text, TextInput, Modal, Portal, Provider, Button } from 'react-native-paper';
import { useState, useEffect, useContext } from 'react';
import { Bullets } from "react-native-easy-content-loader";
import colors from '../../constants/colors';
import UserContext from '../../services/context/UserContext';
import { resetGroupPassword } from '../../services/api/groups';
import { RemoveUserFromGroup } from '../../services/api/user';
import config from '../../constants/config';
import useSWR from 'swr';
import SocketContext from '../../services/context/SocketContext';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { AntDesign } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { setUserDataInfo } from '../../utils/userController';
const fetcher = (url, token) => fetch(url, token).then((res) => res.json());

export default function GroupSettings({ navigation }) {
  const { setUser, user } = useContext(UserContext);
  const { data, isLoading, error, mutate } = useSWR([config.backend_server + '/groups/info/active/' + user.curr_group,
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
  const [selectedUser, setSelectedUser] = useState(null);

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
        const result = await setUserDataInfo(setUser, user.access_token);
        if (result) {
          socket.disconnect();
          setSocket(null);
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

  useEffect(() => {
    if (showAlert) {
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
    }
  }, [showAlert])

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
    <Provider>
      <Portal>
        <ManageUserModal selectedUser={selectedUser} setSelectedUser={setSelectedUser} F />
      </Portal>
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
            <GroupMemberList members={members} setSelectedUser={setSelectedUser} />
          </View>
        </View>
      </View>
    </Provider>
  );
}

const GroupMemberList = ({ members, setSelectedUser }) => {
  return (
    <ScrollView style={styles.listContainer}>
      {members.map((member) => (
        <MemberItem user={member} key={member.first_name} setSelectedUser={setSelectedUser} />
      ))}
    </ScrollView>
  );
};

const MemberItem = ({ user, setSelectedUser }) => {

  const userPressedHandler = () => {
    setSelectedUser(user);
  };

  return (
    <View>
      <TouchableOpacity style={styles.memberItem} onPress={userPressedHandler}>
        <Avatar.Image size={34} source={{ uri: user.profile_pic }} />
        <Text style={styles.username}>{user.first_name + ' ' + user.last_name}</Text>
        {<RoleBadge group={user} />}
      </TouchableOpacity>
      <Divider
        style={{
          marginLeft: 30,
        }}
      />
    </View>
  );
};

const RoleBadge = ({ group }) => {
  if (group?.admin_status === 2) {
    return (
      <Avatar.Image size={34} source={require('../../assets/crown.png')} style={styles.roleBadge} />
    );
  } else if (group?.admin_status === 1) {
    return (<Avatar.Image size={34} source={require('../../assets/badge.png')} style={styles.roleBadge} />);
  } else {
    return (<Avatar.Image size={34} source={require('../../assets/circle.png')} style={styles.roleBadge} />)
  }
}

const ManageUserModal = ({ selectedUser, setSelectedUser }) => {
  const handleRemoveUser = () => {
    console.log('removeing user ', selectedUser);
  }
  const handleCancel = () => { };
  const removeUserHandler = () => {
    Alert.alert(
      'Remove User',
      'Are you sure you want to remove this user?',
      [
        {
          text: 'Cancel',
          onPress: handleCancel,
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: handleRemoveUser,
          style: 'destructive',
        },
      ],
      { cancelable: false }
    )
  }

  return (
    <Modal visible={(selectedUser !== null)} onDismiss={() => { setSelectedUser(null); }} contentContainerStyle={styles.modalContainerStyle}>
      <View style={styles.profileContainer}>
        <View style={styles.leftContainer}>
          <Avatar.Image size={65} source={{ uri: selectedUser?.profile_pic }} style={styles.photo} />
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{selectedUser?.first_name + ' ' + selectedUser?.last_name}</Text>
          </View>
          <TouchableOpacity style={styles.infoRow} onPress={() => { console.log('pressed') }}>
            <Ionicons name="call-outline" size={30} color="red" style={styles.infoIcon} />
            <Text style={styles.phone}>{selectedUser?.phone_num}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoRow} onPress={() => { console.log('pressed') }}>
            <Ionicons name="mail-outline" size={30} color="green" style={styles.infoIcon} />
            <Text style={styles.phone}>{selectedUser?.email}</Text>
          </TouchableOpacity>
          <View style={styles.infoRow}>
            <RoleBadge group={selectedUser} />
            <Text style={styles.role}>{selectedUser?.admin_status === 2
              ? "Admin"
              : selectedUser?.admin_status === 1
                ? "Co-Admin"
                : "Non-Admin"}</Text>
          </View>
        </View>
      </View>
      <View style={styles.manageButtons}>
        <Button style={styles.removeButton} color='red' onPress={removeUserHandler}>Remove User</Button>
      </View>
    </Modal>
  )
}
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
    justifyContent: 'space-between'
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
  roleBadge: {
    backgroundColor: 'transparent'
  },
  modalContainerStyle: {
    backgroundColor: 'white',
    padding: 20,
    minHeight: '30%',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1
  },

  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  leftContainer: {
    width: '40%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    display: 'flex',
  },
  nameRow: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  name: {
    fontSize: 24,
    color: colors.black,
  },
  phone: {
    fontSize: 14,
    color: 'gray',
  },
  manageButtons: {
    marginTop: 40,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  removeButton: {
    backgroundColor: colors.lightYellow
  },
  role: {
    marginLeft: 15,
    fontSize: 14,
    color: 'gray',
  }
});
