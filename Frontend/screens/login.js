import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import COLORS from "../constants/colors";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyABMnAsXYbgsDCxytM43ewN717YMZ3bX2Y",
  authDomain: "carecoord.firebaseapp.com",
  projectId: "carecoord",
  storageBucket: "carecoord.appspot.com",
  messagingSenderId: "899499604143",
  appId: "1:899499604143:web:442e998e0ea3fdaf92fc5a",
  measurementId: "G-0Q5YSNK95C",
};

const app = initializeApp(firebaseConfig);

export default function LogIn({ navigation }) {
  const [text, onChangeText] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [userEmail, onChangeUserEmail] = React.useState(null);

  const auth = getAuth();
  const loginAuth = function () {
    signInWithEmailAndPassword(auth, text, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Signed In.");
        onChangeUserEmail(user.email);
        navigation.navigate("Home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
      });
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <View style={styles.wFull}>
          <View style={styles.row}>
            {/* <Logo width={55} height={55} style={styles.mr7} /> */}
            <Text style={styles.brandName}>CareCoord</Text>
          </View>
          <Text style={styles.loginContinueTxt}>Login in to continue</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
          />
          <TextInput
            style={styles.input}
            onChangeText={onChangePassword}
            value={password}
            secureTextEntry={true}
          />
          {/********************* LOGIN BUTTON *********************/}
          <TouchableOpacity
            onPress={loginAuth}
            activeOpacity={0.7}
            style={styles.loginBtn}
          >
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
        </View>
        {/***************** FORGOT PASSWORD BUTTON *****************/}
        <TouchableOpacity style={styles.forgotPassBtn}>
          <Text style={styles.forgotPassText}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={styles.footerText}> Don't have an account? </Text>
          {/******************** REGISTER BUTTON *********************/}
          <TouchableOpacity>
            <Text style={styles.signupBtn}>Sign Up</Text>
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
  },
  container: {
    padding: 15,
    width: "100%",
    position: "relative",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    color: COLORS.bgColor,
  },
  brandName: {
    fontSize: 42,
    textAlign: "center",
    fontWeight: "bold",
    color: COLORS.primary,
    opacity: 0.9,
  },
  loginContinueTxt: {
    fontSize: 21,
    textAlign: "center",
    color: COLORS.gray,
    marginBottom: 16,
    fontWeight: "bold",
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
