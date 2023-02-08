import { useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Searchbar, Button } from 'react-native-paper';
import COLORS from '../../constants/colors';
import config from '../../constants/config';
const axios = require('axios').default;

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

const AddGroupModal = ({ modalVisible, setModalVisible, setGroupSelected }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = (query) => setSearchQuery(query);
  const [groups, setGroups] = useState([]);
  fetchGroups(setGroups);
  return (
    <Modal visible={modalVisible} transparent={true} animationType='slide'>
      <SafeAreaView style={styles.modal}>
        <Searchbar
          placeholder='Search'
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBox}
        />
        <View style={styles.searchResult}>
          <ScrollView>
            {groups.map((group) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setGroupSelected(group);
                    setModalVisible(false);
                  }}
                  key={group.id}
                  style={styles.groupDisplay}
                >
                  <Text style={styles.groupName}>{group.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <Button
          key={'newGroup'}
          mode='contained'
          uppercase={false}
          color='#2196f3'
          icon='checkbox-marked-circle-plus-outline'
          style={styles.exitButton}
          onPress={() => console.log('create new group pressed')}
        >
          Create New Group
        </Button>

        <Button
          key={'exit'}
          mode='contained'
          uppercase={false}
          color={COLORS.danger}
          icon='exit-to-app'
          style={styles.exitButton}
          onPress={() => setModalVisible(false)}
        >
          Exit
        </Button>
      </SafeAreaView>
    </Modal>
  );
};

export default AddGroupModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
  },
  searchBox: {
    marginTop: 30,
    width: '90%',
    alignSelf: 'center',
  },
  searchResult: {
    width: '90%',
    height: '50%',
    backgroundColor: COLORS.card,
    alignSelf: 'center',
    marginTop: 10,
  },
  groupDisplay: {
    margin: 5,
    padding: 10,
    alignItems: 'center',
  },
  groupName: {
    alignSelf: 'center',
  },
  exitButton: {
    alignSelf: 'center',
    marginTop: 40,
  },
});
