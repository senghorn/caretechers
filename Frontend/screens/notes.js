import { SafeAreaView, StyleSheet, TextInput, Text } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { Button } from "react-native-paper";

export default function Notes() {
  const [text, onChangeText] = React.useState("testuser@gmail.com");
  const [password, onChangePassword] = React.useState("123123");
  const [userEmail, onChangeUserEmail] = React.useState("empty");

  const auth = getAuth();
  const signInGoogle = function () {
    signInWithEmailAndPassword(auth, text, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Signed In.");
        onChangeUserEmail(user.email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
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
      <Button title="Hello" onPress={signInGoogle}  color="#f194ff" />
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
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
