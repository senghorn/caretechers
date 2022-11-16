import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import BottomNavigation from './components/bottomNavigation';
import React, {useState, useEffect} from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyABMnAsXYbgsDCxytM43ewN717YMZ3bX2Y",
  authDomain: "carecoord.firebaseapp.com",
  projectId: "carecoord",
  storageBucket: "carecoord.appspot.com",
  messagingSenderId: "899499604143",
  appId: "1:899499604143:web:442e998e0ea3fdaf92fc5a",
  measurementId: "G-0Q5YSNK95C"
};

const app = initializeApp(firebaseConfig);

export default function App() {
  
  const auth = getAuth();
  signInWithEmailAndPassword(auth, "testuser@gmail.com", "123123")
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
    console.log("Signed in works");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });


  return (
    <NavigationContainer>
      <BottomNavigation />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
