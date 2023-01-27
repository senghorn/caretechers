import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import COLORS from "../constants/colors";
import Header from "../components/group/header";
import Icon from "react-native-vector-icons/FontAwesome";
import AddGroupModal from "../components/group/AddGroupModal";
import config from "../constants/config";
const axios = require("axios").default;

/**
 * Sends create new user request to the backend server using the given
 * first name, last name , email and phone number.
 * @return True : on success
 *         False: on error
 */
const createUser = async (first, last, email, phone, group) => {
  try {
    const data = {
      email: email,
      firstName: first,
      lastName: last,
      phoneNum: phone,
      groupId: group,
    };
    let connection_string = "http://" + config.backend_server + "/user";
    return await axios
      .post(connection_string, data)
      .then(function (response) {
        return true;
      })
      .catch(function (error) {
        console.log(error);
        return false;
      });
  } catch (error) {
    console.log('error', error.message);
  }
  return false;
};


const Group = ({ navigation, route }) => {
  const [groups, setGroups] = useState([]); // Groups the user are in
  const [selectedGroup, setGroupSelected] = useState(null);
  var { user } = route.params;
  const handlePress = (group) => {
    console.log(`Group ${group.name} pressed`);
    user["group"] = group.id;
    navigation.navigate("Home", { user: user });
  };
  useEffect(() => {
    if (selectedGroup != null) {
      const user_info = { "first": user.first, "last": user.last, "email": user.email, "phone": user.phone, "group": selectedGroup.id };
      user["group"] = selectedGroup.id;
      console.log(user);
      const created = createUser(user.first, user.last, user.email, user.phone, selectedGroup.id);
      if (created) {
        navigation.navigate("Home", { user: user });
      } else {
      }
    }
  }, [selectedGroup]);

  // Add a state variable to control the visibility of the add group modal
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <AddGroupModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setGroupSelected={setGroupSelected}
      />
      <Text style={styles.subtitle}>Select a group!</Text>
      <View style={styles.groupContainer}>
        <View style={styles.groupCase} key="add">
          <TouchableOpacity
            style={styles.addGroup}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Icon name="search-plus" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.groupName}>Add Group</Text>
        </View>
        {groups.map((group) => (
          <View style={styles.groupCase} key={group.id}>
            <TouchableOpacity
              style={styles.groupList}
              onPress={() => handlePress(group)}
            ></TouchableOpacity>
            <Text style={styles.groupName}>{group.name}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Group;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    marginTop: 50,
  },

  subtitle: {
    marginTop: 20,
    marginLeft: 15,
    fontWeight: "100",
    fontSize: 20,
  },
  groupContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  icon: {
    alignSelf: "flex-end",
  },
  addGroup: {
    backgroundColor: COLORS.coolGray,
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },
  groupList: {
    backgroundColor: COLORS.card,
    borderRadius: 40,
    padding: 10,
    borderWidth: 1,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignSelf: "center",
  },
  groupName: {
    fontWeight: "light",
    fontSize: 15,
    textAlign: "center",
    width: 80,
    maxHeight: 40,
  },
  groupCase: {
    margin: 10,
    alignItems: "center",
  },
});
