import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button,Text  } from "react-native-paper";
import Task from "../components/tasks/task";
import { SearchBar } from "@rneui/themed";
import { Dropdown } from "react-native-element-dropdown";

export default function Notes() {
  const [search, setSearch] = useState("");
  const updateSearch = (search) => {
    setSearch(search);
    console.log(search.nativeEvent.text);
  };

  const data = [
    { label: "Date", value: "1" },
    { label: "Alphabets", value: "2" },
    { label: "Relevant", value: "3" },
  ];
  const [sortValue, setSortValue] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Notes</Text>
        </View>
        <View style={styles.search}>
          <SearchBar
            placeholder="Search..."
            onEndEditing={updateSearch}
            value={search}
            lightTheme
            platform="ios"
          />
        </View>
        <View style={styles.sort}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={data}
            labelField="label"
            valueField="value"
            placeholder="Sort By"
            value={sortValue}
            onChange={(item) => {
              setSortValue(item.value);
            }}
          />
        </View>
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
  search: {
    width: "40%",
  },
  title:{
    marginLeft: 2,
    width: "28%",
  },
  titleText:{
    fontSize: 26,
    fontWeight: "bold"
  },  
  sort: {
    width: "20%",
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
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
