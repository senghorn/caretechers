import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import Navigation from './components/navigation/Navigation';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StyleSheet } from 'react-native';
import colors from './constants/colors';

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView />
      <SafeAreaView style={styles.container}>
        <Navigation />
      </SafeAreaView>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
});
