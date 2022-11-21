import * as React from "react";
import { Button, View, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from "./bottomNavigation";
import LogIn from "../screens/login";

const Stack = createNativeStackNavigator();
export default function Navigation() {
  return (
    <Stack.Navigator screenOptions={{}} initialRouteName={"Login"}>
      <Stack.Screen
        name={"Login"}
        component={LogIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={"Home"}
        component={BottomNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
