import React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import COLORS from "../constants/colors";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin({ navigation }) {
  const [accessToken, setAccessToken] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState(null);
  const googleBtn = require("../assets/google-btn1.png");

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "899499604143-ps7gl6ktu9796gticni41c10o1evfp2t.apps.googleusercontent.com",
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
      getUserData();
    } else {
      // TODO: Handle unsuccessful login
    }
  }, [response]);

  async function getUserData() {
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    userInfoResponse.json().then((data) => {
      setUserInfo(data);
      console.log("Logged in user's name: ", data.name);
      console.log("Logged in user's email: ", data.email);
      navigation.navigate("Home");
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
          <Text style={styles.loginContinueTxt}>Login to continue</Text>
          <TouchableOpacity
            onPress={() => {
              promptAsync();
            }}
            activeOpacity={0.7}
            style={styles.loginBtn}
          >
            <Image source={googleBtn} />
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
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
    textAlign: "center",
    fontWeight: "bold",
    color: COLORS.white,
    opacity: 1,
  },
  subWelcomeText: {
    fontSize: 22,
    textAlign: "center",
    color: COLORS.grayLight,
    opacity: 1,
  },
  loginContinueTxt: {
    fontSize: 21,
    textAlign: "center",
    color: COLORS.white,
    marginBottom: 16,
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
  // Login Btn Styles
  loginBtnWrapper: {
    height: 55,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  loginBtn: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 55,
    color: COLORS.dark,
  },
  loginText: {
    color: COLORS.gradientForm,
    fontSize: 16,
    fontWeight: "400",
  },
  forgotPassText: {
    color: COLORS.primary,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 15,
  },
  // footer
  footer: {
    position: "absolute",
    bottom: 20,
    textAlign: "center",
    flexDirection: "row",
  },
  footerText: {
    color: COLORS.gray,
    fontWeight: "bold",
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
    justifyContent: "center",
    marginBottom: 20,
  },
  mr7: {
    marginRight: 7,
  },
});
