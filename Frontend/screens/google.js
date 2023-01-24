import React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import COLORS from "../constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import config from "../constants/config";
const axios = require("axios").default;
WebBrowser.maybeCompleteAuthSession();

const checkExistingUser = async (email) => {
  let connection_string = "http://" + config.backend_server + "/user/" + email;
  await axios
    .get(connection_string)
    .then(function (response) {
      return true;
    })
    .catch(function (error) {
      // handle error
      console.log(email + " does not exist.");
      return false;
    });
};

export default function GoogleLogin({ navigation }) {
  const [accessToken, setAccessToken] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "899499604143-nq831c8qd2u72r9h6842ion24rgcj8me.apps.googleusercontent.com",
    iosClientId:
      "899499604143-5oqn70f2r4uu7lp1mbajpkv15ks3p368.apps.googleusercontent.com",
    androidClientId:
      "899499604143-q5b803tsomq5k9tu0vv0fjb0ap1551gm.apps.googleusercontent.com",
    webClientId:
      "899499604143-ps7gl6ktu9796gticni41c10o1evfp2t.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
    } else {
      // TODO: Handle unsuccessful login
    }
  }, [response]);

  React.useEffect(() => {
    if (accessToken != null) {
      getUserData();
    }
  }, [accessToken]);

  async function getUserData() {
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    await userInfoResponse.json().then(async (data) => {
      setUserInfo(data);
      const exist = await checkExistingUser(data["email"]);
      if (exist) {
        navigation.navigate("Home");
      } else {
        navigation.navigate("RegisterUser", { user: data });
      }
    });
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <View style={styles.wFull}>
          <View style={styles.row}>
            <Text style={styles.welcomeText}>Welcome to CareCoord!</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subWelcomeText}>Let's get started.</Text>
          </View>
          <View style={styles.row}>
            <Image
              style={styles.image}
              source={require("../assets/caretaker.png")}
            />
          </View>
          <FontAwesome.Button
            name="google"
            backgroundColor="#FFFFFF"
            size={35}
            iconStyle={styles.icon}
            onPress={() => {
              promptAsync();
            }}
          >
            <Text style={styles.loginText}>Login with Google</Text>
          </FontAwesome.Button>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Proudly presented by the Caretechers
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.bgColor,
  },
  container: {
    padding: 15,
    width: "100%",
    position: "relative",
    flex: 1,
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    opacity: 1,
  },
  subWelcomeText: {
    fontSize: 22,
    color: COLORS.grayLight,
    opacity: 1,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    height: 55,
    paddingVertical: 0,
  },
  loginBtn: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    height: 55,
    color: COLORS.dark,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gradientForm,
  },
  loginText: {
    color: COLORS.gray,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 30,
  },
  // footer
  footer: {
    position: "relative",
    bottom: -100,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  footerText: {
    color: COLORS.white,
  },
  signupBtn: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  // utils
  wFull: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  mr7: {
    marginRight: 7,
  },
  image: {
    marginBottom: 40,
    width: "100%",
    height: 380,
    resizeMode: "stretch",
    borderRadius: 10,
  },
  icon: {
    height: 35,
    color: COLORS.bgColor,
  },
});
