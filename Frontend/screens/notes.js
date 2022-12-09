import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Text, Searchbar, Colors } from "react-native-paper";
import Task from "../components/tasks/task";
import { Dropdown } from "react-native-element-dropdown";
import COLORS from "../constants/colors";
import Header from "../components/notes/header";

export default function Notes() {

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.tasksContainer}>
        <Task title="Wifi code: 123123" />
        <Task title="Garage code: 321321" />
        <Task title="Door code: 123321" />
        <Task title="Operate Roomba: Click on play button" />
        <Task title="How to fix water heater: CLOSE gas pipe, slide the heater small glass window, turn on pilot and then use lighter to ignite the pilot. Hold on to pilot for 1mn." />
        <Task title="How to use AC: located in the second floor master bedroom. Adjust it accordingly." />
      </ScrollView>
      <Button
        mode="contained"
        uppercase={false}
        color="#2196f3"
        icon="checkbox-marked-circle-plus-outline"
        onPress={() => console.log("Create new note")}
        style={styles.createButton}
        labelStyle={styles.createButtonText}
      >
        Add New Note
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: "row",
    flexBasis: "auto",
  },
  box: {
    elevation: 0,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  tasksContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    marginTop: 16,
  },
  createButton: {
    marginVertical: 32,
    width: "40%",
    alignSelf: "center",
  },
  createButtonText: {
    fontSize: 14,
  },
});
