import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert, Share, Switch } from 'react-native';
import {
  Appbar,
  IconButton,
  Avatar,
  Divider,
  Text,
  TextInput,
  Portal,
  Provider,
  Button,
  ActivityIndicator,
} from 'react-native-paper';
import { useState, useEffect, useContext } from 'react';
import { Bullets } from 'react-native-easy-content-loader';
import colors from '../../constants/colors';
import UserContext from '../../services/context/UserContext';
import { resetGroupPassword } from '../../services/api/groups';
import { RemoveUserFromGroup } from '../../services/api/user';
import config from '../../constants/config';
import useSWR from 'swr';
import SocketContext from '../../services/context/SocketContext';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import RoleBadge from '../../components/user/role-badge';
import ManageUserModal from '../../components/user/user-info-modal';
import { getUserRole, setUserDataInfo } from '../../utils/userController';
const fetcher = (url, token) => fetch(url, token).then((res) => res.json());
import DateTimePicker from '@react-native-community/datetimepicker';
import { subMonths } from 'date-fns';
import { getDateString } from '../../utils/date';

/**
 * Component for group settings screen that allow user to see group information and manage the settings.
 * @param {Object} navigation react navigator
 * @returns
 */
export default function GroupSettings({ navigation }) {
  const { setUser, user } = useContext(UserContext);
  const { data, isLoading, error, mutate } = useSWR(
    [
      config.backend_server + '/groups/info/active/' + user.curr_group,
      {
        headers: { Authorization: 'Bearer ' + user.access_token },
      },
    ],
    ([url, token]) => fetcher(url, token)
  );
  const [showVisitHistory, setShowVisitHistory] = useState(true);
  const [showVisitHistoryAfter, setShowVisitHistoryAfter] = useState(subMonths(new Date(), 1));

  let historyAfter = '';
  if (!showVisitHistory) {
    historyAfter = '?after=' + getDateString(showVisitHistoryAfter);
  }

  const {
    data: visitHistory,
    isLoading: visitHistoryLoading,
    error: visitHistoryError,
  } = useSWR(
    [
      config.backend_server + '/groups/comparison/' + user.curr_group + historyAfter,
      {
        headers: { Authorization: 'Bearer ' + user.access_token },
      },
    ],
    ([url, token]) => fetcher(url, token)
  );

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

  // Handler when user confirms to leave the group
  const LeaveGroup = async () => {
    if (user && user.id && user.curr_group) {
      const removed = await RemoveUserFromGroup(user.id, user.curr_group, user.access_token);
      if (removed === true) {
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

  // Handler for when leave button is pressed
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
    );
  };

  // Properly show and hide loader while leaving the group
  const handleConfirmLeaveGroup = async () => {
    setWaitToLeave(true);
    await LeaveGroup();
    setWaitToLeave(false);
  };
  const handleCancelLeaveGroup = () => {
    setShowAlert(false);
  };

  // Handles leave group by showing up alerts
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
      );
    }
  }, [showAlert]);

  const changeGroupNameHandler = () => {
    console.log('Change Group Name Pressed');
  };

  // Handler for invite button
  const onShare = async () => {
    const response = await axios.get(`${config.backend_server}/groups/token/${user.curr_group}`, {
      headers: {
        authorization: `Bearer ${user.access_token}`,
      },
    });
    console.log(response.data);
    try {
      const result = await Share.share({
        message: `Join our caretaking group!\n\nexp://${config.link_ip}:19000/?token=${response.data}\n\nThis link will expire in 5 minutes!`,
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
        <ManageUserModal selectedUser={selectedUser} setSelectedUser={setSelectedUser} user={user} />
      </Portal>
      <View style={styles.container}>
        <Spinner color="#add8e6" visible={waitingToLeave} textStyle={styles.spinnerTextStyle} size={'large'} />
        <Appbar.Header style={styles.headerContainer}>
          <Appbar.Action
            icon={'arrow-left'}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content title={'Group'} titleStyle={styles.title} />
          <Appbar.Action
            icon="dots-horizontal"
            onPress={() => {
              navigation.navigate('GroupSelector');
            }}
          />
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
              <IconButton
                icon="exit-to-app"
                size={28}
                color={colors.danger}
                style={styles.iconButton}
                onPress={handleLeaveGroup}
              />
              <Text style={styles.buttonTitle}>Leave</Text>
            </View>
          </View>
          <View style={styles.memberListBox}>
            <Text style={styles.membersTitle}>Members</Text>
            <View style={styles.inline}>
              <Text style={styles.showHistoryText}>Show all visit history</Text>
              <Switch value={showVisitHistory} onValueChange={() => setShowVisitHistory(!showVisitHistory)} />
            </View>
            {!showVisitHistory && (
              <View style={[styles.inline, { marginTop: 10 }]}>
                <Text style={styles.showHistoryText}>After</Text>
                <DateTimePicker
                  maximumDate={new Date()}
                  value={showVisitHistoryAfter}
                  onChange={(event, date) => {
                    setShowVisitHistoryAfter(date);
                  }}
                  mode={'date'}
                  display="default"
                  is24Hour={true}
                />
              </View>
            )}
            <Bullets active listSize={5} loading={loading} />
            <GroupMemberList
              visitHistory={visitHistory}
              visitHistoryLoading={visitHistoryLoading}
              members={members}
              setSelectedUser={setSelectedUser}
            />
          </View>
        </View>
      </View>
    </Provider>
  );
}

/**
 * Display member list and allow pressing on each user
 *
 * @param {List} members information
 * @param {Function} setSelectedUser when a user is pressed
 * @param {visitHistory} visitHistory of all users
 * @param {visitHistoryLoading} visitHistoryLoading
 * @returns
 */
const GroupMemberList = ({ members, setSelectedUser, visitHistory, visitHistoryLoading }) => {
  return (
    <ScrollView style={styles.listContainer}>
      {members.map((member) => (
        <MemberItem
          user={member}
          key={member.email}
          setSelectedUser={setSelectedUser}
          visitHistory={visitHistory}
          visitHistoryLoading={visitHistoryLoading}
        />
      ))}
    </ScrollView>
  );
};

/**
 * Display for each member in MemeberList
 * @returns
 */
const MemberItem = ({ user, setSelectedUser, visitHistory, visitHistoryLoading }) => {
  const userPressedHandler = () => {
    setSelectedUser(user);
  };

  const [history, setHistory] = useState(null);

  useEffect(() => {
    if (user && user.email && visitHistory) {
      const userHistory = visitHistory.filter((visit) => visit.member_id === user.email);
      setHistory(userHistory?.[0]);
    }
  }, [visitHistory, user]);

  let historySummary = null;
  if (history || visitHistoryLoading) {
    historySummary = (
      <View style={{ flex: 1, flexDirection: 'row', marginTop: 15, justifyContent: 'space-around' }}>
        {!visitHistoryLoading ? (
          <Text style={{ width: 60, textAlign: 'center', color: '#555' }}>{history.total_visits} visits</Text>
        ) : (
          <ActivityIndicator size="small" color="#add8e6" />
        )}
        {!visitHistoryLoading ? (
          <Text style={{ width: 120, textAlign: 'center', color: '#555' }}>{history.completed_visits} completed</Text>
        ) : (
          <ActivityIndicator size="small" color="#add8e6" />
        )}
        {!visitHistoryLoading ? (
          <Text style={{ width: 120, textAlign: 'center', color: '#555' }}>
            {history.total_visits === 0 ? 'N/A' : Math.ceil((history.completed_visits / history.total_visits) * 100) + '%'}{' '}
            completed
          </Text>
        ) : (
          <ActivityIndicator size="small" color="#add8e6" />
        )}
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity style={styles.memberItem} onPress={userPressedHandler}>
        <View style={styles.inlineMemberItem}>
          <View style={styles.inline}>
            <Avatar.Image size={34} source={{ uri: user.profile_pic }} />
            <Text style={styles.username}>{user.first_name + ' ' + user.last_name}</Text>
            {<RoleBadge group={user} />}
          </View>
        </View>
        {historySummary}
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
    flex: 0,
    height: '100%',
  },
  memberItem: {
    paddingVertical: 10,
  },
  username: {
    padding: 5,
    fontSize: 16,
    marginLeft: 10,
    flex: 5
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
  showHistoryText: {
    fontWeight: '400',
    fontSize: 14,
  },
  inline: {
    flexDirection: 'row',
    flex: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inlineMemberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
