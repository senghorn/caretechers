import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView, StyleSheet, TextInput, Text,Button } from "react-native";
import React, { useState, useEffect } from "react";
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

export default function LogIn() {
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
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>{userEmail}</Text>
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
      <Button title="Login" onPress={loginAuth}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#808080 ",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    alignItems: "center",
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
