import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import Navigation from './components/navigation/Navigation';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <Navigation />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
