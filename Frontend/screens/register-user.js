import { useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import colors from "../constants/colors";

export default function Inputs({ route, navigation }) {
  const { user } = route.params;
  const [state, setState] = useState({});
  const [phoneNumber, setPhoneNumber] = useState("");

  // Formats the text of the phone number to display nicely
  // E.g., 123-449-4910
  const formatPhoneNumber = (text) => {
    var cleaned = "";
    var match = text.match(/\d/g);
    if (match) {
      cleaned = match.join("");
      if (cleaned.length > 10) {
        cleaned = cleaned.substring(0, 10);
      }
    }
    if (cleaned.length >= 7) {
      cleaned =
        cleaned.slice(0, 3) +
        "-" +
        cleaned.slice(3, 6) +
        "-" +
        cleaned.slice(6);
    } else if (cleaned.length > 3) {
      cleaned = cleaned.slice(0, 3) + "-" + cleaned.slice(3);
    }
    setPhoneNumber(cleaned);
    state["phone"] = cleaned;
    setState(state);
  };

  state["email"] = user["email"];
  state["first"] = user["given_name"];
  state["last"] = user["family_name"];
  state["picture"] = user["picture"];

  const handleFirstName = (text) => {
    state["first"] = text;
    setState(state);
  };

  const handleLastName = (text) => {
    state["last"] = text;
    setState(state);
  };

  const handlePhone = (text) => {
    setPhone(text);
    state["phone"] = text;
  };

  // Handles create user button being pressed
  const submit = async () => {
    if (state["first"] == undefined) {
      alert("Please make to enter your first name");
    } else if (state["last"] == undefined) {
      alert("Please make to enter your last name");
    } else if (state["phone"] == undefined) {
      alert("Please make to enter your phone number");
    } else if (state["phone"].length < 12) {
      alert("Phone number is not valid");
    }
    else {
      navigation.navigate("Group",{ user: state });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Register with CareCoord!</Text>
      <Text style={styles.subtext}>Please fill up the information below</Text>
      <Divider />

      <Text style={styles.input}>Email: {state["email"]}</Text>

      <View style={styles.nameRow}>
        <TextInput
          style={styles.lastName}
          underlineColorAndroid="transparent"
          placeholder={state["first"]}
          onChangeText={handleFirstName}
        />
        <TextInput
          style={styles.firstName}
          underlineColorAndroid="transparent"
          placeholder={state["last"]}
          onChangeText={handleLastName}
        />
      </View>

      <TextInput
        style={styles.phone}
        underlineColorAndroid="transparent"
        placeholder="Enter Phone Number"
        display={"12344"}
        autoCapitalize="none"
        keyboardType="number-pad"
        value={phoneNumber}
        maxLength={12}
        onChangeText={(text) => formatPhoneNumber(text)}
      />
      <TouchableOpacity style={styles.submitButton} onPress={submit}>
        <Text style={styles.submitButtonText}> Join Caring Group </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    marginTop: 50,
  },
  nameRow: {
    margin: 12,
    flexDirection: "row",
    borderWidth: 1,
  },
  firstName: {
    height: 40,
    padding: 10,
    flex: 1,
  },
  lastName: {
    height: 40,
    padding: 10,
    flex: 1,
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
  },
  phone: {
    height: 40,
    margin: 12,
    padding: 10,
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor: colors.pink,
    padding: 10,
    margin: 15,
    marginTop: 30,
    height: 50,
    width: "50%",
    alignSelf: "center",
    borderRadius: 20,
    alignContent: "center",
    justifyContent: 'center'
  },
  submitButtonText: {
    color: "white",
    alignSelf: "center",
  },
  title: {
    fontWeight: "500",
    fontSize: 20,
    margin: 15,
  },
  subtext: {
    marginLeft: 15,
    fontWeight: "100",
    padding: 5,
  },
});