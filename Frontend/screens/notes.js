import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Colors } from "react-native-paper";
import Task from "../components/tasks/task";


export default function Notes() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Alphabetical", value: "alpha" },
    { label: "Date", value: "date" },
  ]);

  const updateSearch = (search) => {
    setSearch(search);
    console.log("searching");
    console.log(search);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      </View>
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
    alignItems: "center",
    paddingTop: 64,
  },
  bar: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginHorizontal: "1%",
    marginBottom: 6,
    minWidth: "48%"
  },
  headerContainer: {
    flexDirection: "column",
    flexBasis: "auto",
    width: "40%",
  },
  tasksContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    marginTop: 16,
  },
  createButton: {
    marginVertical: 32,
  },
  createButtonText: {
    fontSize: 14,
  },
});
