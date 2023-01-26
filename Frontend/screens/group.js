import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { useState } from "react";
import COLORS from "../constants/colors";
import Header from "../components/group/header";
import Icon from "react-native-vector-icons/FontAwesome";
import AddGroupModal from "../components/group/AddGroupModal";


const Group = ({ navigation }) => {
  const [groups, setGroups] = useState([]);

  const handlePress = (group) => {
    console.log(`Group ${group.name} pressed`);
    navigation.navigate("Home");
  };

  // Add a state variable to control the visibility of the add group modal
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <AddGroupModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <Text style={styles.subtitle}>Select a group!</Text>
      <View style={styles.groupContainer}>
        <View style={styles.groupCase} key="add">
          <TouchableOpacity
            style={styles.addGroup}
            onPress={() => setModalVisible(true)}
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
