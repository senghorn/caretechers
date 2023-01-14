import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  View,
} from "react-native";
import COLORS from "../constants/colors";
import Header from "../components/group/header";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Group = ({navigation}) => {
  const groups = [
    { name: "Group 1", id: 1 },
    { name: "Group 2", id: 2 },
    { name: "Group 3", id: 3 },
    { name: "Group 4", id: 4 },
    { name: "Group 5", id: 5 },
    { name: "Group 6", id: 6 },
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
        {groups.map((group) => (
          <TouchableOpacity
            style={styles.groupList}
            key={group.id}
            onPress={() => handlePress(group)}
          >
            <Text style={styles.groupName}>{group.name}</Text>
          </TouchableOpacity>
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
    margin: 15,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  groupList: {
    backgroundColor: COLORS.card,
    borderRadius: 40,
    padding: 10,
    borderWidth: 1,
    width: 80,
    height: 80,
    marginRight: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  groupName: {
    fontWeight: "light",
    fontSize: 15,
    textAlign: "center",
  },
});
