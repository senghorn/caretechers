import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { useState, useEffect } from 'react';
import GroupList from '../components/group/groupList';
import colors from '../constants/colors';
import config from '../constants/config';

const axios = require('axios').default;

export default function Groups({ navigation, route }) {
  const { user } = route.params;
  const [searchValue, setSearchValue] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchGroups(setGroups);
  }, []);

  useEffect(() => {
    if (selectedGroup != null) {
      console.log('selected ' + selectedGroup.name);
    }
  }, [selectedGroup]);

  const searchGroup = () => {
    // TODO: calls backend to search for groups and display them
    // using setGroups
    console.log('searching for ' + searchValue);
  };

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

        <TextInput
          label={'Find Group'}
          style={styles.searchInput}
          mode={'outlined'}
          right={<TextInput.Icon icon='magnify' />}
          value={searchValue}
          onChangeText={(text) => {
            setSearchValue(text);
          }}
          onSubmitEditing={searchGroup}
          activeOutlineColor='lightblue'
        ></TextInput>

        <GroupList groups={groups} setSelectedGroup={setSelectedGroup} />
      </SafeAreaView>
    </View>
  );
}

// Fetches all the groups
const fetchGroups = async (setGroups) => {
  try {
    let connection_string = config.backend_server + '/groups/15';
    await axios.get(connection_string).then(function (response) {
      setGroups(response.data);
    });
  } catch (error) {
    console.log(error.message);
  }
};

/**
 * Sends create new user request to the backend server using the given
 * first name, last name , email and phone number.
 * @return True : on success
 *         False: on error
 */
const createUser = async (first, last, email, phone, group, photo) => {
  try {
    const data = {
      email: email,
      firstName: first,
      lastName: last,
      phoneNum: phone,
      groupId: group,
      profilePic: photo,
    };
    let connection_string = config.backend_server + '/user';
    return await axios
      .post(connection_string, data)
      .then(function (response) {
        return true;
      })
      .catch(function (error) {
        console.log('create user error', error);
        return false;
      });
  } catch (error) {
    console.log('error', error.message);
  }
  return false;
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
});
