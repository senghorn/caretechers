import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import {
  Appbar,
  IconButton,
  Avatar,
  Divider,
  Text,
  TextInput,
} from 'react-native-paper';
import { useState, useEffect, useContext } from 'react';
import colors from '../../constants/colors';
import UserContext from '../../services/context/UserContext';

export default function GroupSettings({ navigation }) {
  const [showAlert, setShowAlert] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [members, setMembers] = useState([
    { name: 'Seng Rith' },
    { name: 'Aaron Heo' },
  ]);
  const [group, setGroup] = useState({
    name: 'Misty Family',
    password: 'secret1234',
    timezone: 'America/Chicago',
  });
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user && user.group_id) {
    }
  }, [user]);

  const LeaveGroup = async () => {
    console.log('user leaving group!');
  };

  const handleLeaveGroup = () => {
    setShowAlert(true);
  };
  const handleConfirmLeaveGroup = async () => {
    await LeaveGroup();
    setShowAlert(false);
  };
  const handleCancelLeaveGroup = () => {
    setShowAlert(false);
  };

  const changeGroupNameHandler = () => {
    console.log('Change Group Name Pressed');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.headerContainer}>
        <Appbar.Action
          icon={'arrow-left'}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title={'Group'} titleStyle={styles.title} />
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
            value={group.password}
            right={
              <TextInput.Icon
                name={passwordVisible ? 'eye' : 'eye-off'}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
            left={
              <TextInput.Icon
                name={'lock-reset'}
                onPress={() => {
                  console.log('reset pass pressed');
                }}
              />
            }
            disabled
            style={styles.passwordBox}
          />
          <View style={styles.buttonContainer}>
            <IconButton
              icon='exit-to-app'
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
        <MemberItem user={member} key={member.name} />
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
        <Avatar.Image size={24} />
        <Text style={styles.username}>{user.name}</Text>
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
    width: '70%',
    alignSelf: 'center',
  },
});
