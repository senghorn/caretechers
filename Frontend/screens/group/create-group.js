import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { TextInput, Text, Button, Appbar } from 'react-native-paper';
import colors from '../../constants/colors';
import { createNewGroup } from '../../services/api/groups';
import { addUserToGroup } from '../../services/api/user';

export default function CreateGroup({ navigation, route }) {
  const { user } = route.params;
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (user != null) {
      if (user.given_name == null) {
        setGroupName(user.first + ' ' + user.last + ' Family');
      } else {
        setGroupName(user.given_name + ' ' + user.family_name + ' Family');
      }
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
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
        onPress={() => createGroup(groupName, user, navigation)}
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
const createGroup = async (groupName, user, navigation) => {
  // TODO: get visit frequency and group password below
  const timezone = 'America/Denver';
  const result = await createNewGroup(groupName, timezone, 4);
  if (result.groupId != null) {
    const joinGroupWithRetry = async (
      userEmail,
      groupId,
      maxAttempts = 3,
      attempt = 1
    ) => {
      const joined = await addUserToGroup(userEmail, groupId, 1);
      if (joined) {
        navigation.navigate('Home', { user: user });
      } else {
        console.log(`Join group failed on attempt ${attempt}`);
        if (attempt < maxAttempts) {
          setTimeout(async () => {
            await joinGroupWithRetry(
              userEmail,
              groupId,
              maxAttempts,
              attempt + 1
            );
          }, 2000);
        } else {
          console.log(
            `Maximum attempts (${maxAttempts}) reached. Join group failed.`
          );
        }
      }
    };

    joinGroupWithRetry(user.email, result.groupId, 3);
  }
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
