import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from './bottomNavigation';
import GoogleLogin from '../screens/google';

const Stack = createNativeStackNavigator();
export default function Navigation() {
  return (
    <Stack.Navigator screenOptions={{}} initialRouteName={'Home'}>
      <Stack.Screen name={'Login'} component={GoogleLogin} options={{ headerShown: false }} />
      <Stack.Screen name={'Home'} component={BottomNavigation} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
