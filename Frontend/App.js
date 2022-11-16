import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import BottomNavigation from './components/bottomNavigation';

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
