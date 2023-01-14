import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import COLORS from "../constants/colors";
import Header from "../components/group/header";
import Icon from 'react-native-vector-icons/FontAwesome';

const Group = ({ navigation }) => {
  const groups = [
    { name: "The Caretechers", id: 1 },
    { name: "Brickbuster", id: 2 },
    { name: "Chamomile", id: 3 },
    { name: "Calibaz", id: 4 },
    { name: "My Phoenix", id: 5 },
    { name: "Jody Jody", id: 6 },
  ];

  const handlePress = (group) => {
    console.log(`Group ${group.name} pressed`);
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Text style={styles.subtitle}>Select a group!</Text>
      <View style={styles.groupContainer}>
        <View style={styles.groupCase} key="add">
          <TouchableOpacity
            style={styles.addGroup}
            onPress={() => { console.log("add group clicked"); }}
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
            >
            </TouchableOpacity>
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
    justifyContent: 'space-around'
  },
  icon: {
    alignSelf: 'flex-end',
  },
  addGroup: {
    backgroundColor: COLORS.coolGray,
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  groupList: {
    backgroundColor: COLORS.card,
    borderRadius: 40,
    padding: 10,
    borderWidth: 1,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignSelf: 'center',
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
    alignItems: 'center',
  },
});
