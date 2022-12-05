import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Text, Searchbar, Colors } from "react-native-paper";
import Task from "../components/tasks/task";
import { Dropdown } from "react-native-element-dropdown";
import COLORS from "../constants/colors";


export default function Notes() {
  const data = [
    { label: "Date", value: "1" },
    { label: "Alphabets", value: "2" },
    { label: "Relevant", value: "3" },
  ];
  const [sortValue, setSortValue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const onChangeSearch = (query) => setSearchQuery(query);
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Notes</Text>
        </View>
        <View style={styles.search}>
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.box}
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
              console.log(item);
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
    width: "49%",
    padding:8
  },
  box :{
    elevation:0,
    borderWidth: 1,
    borderColor:COLORS.grayLight
  },  
  title: {
    marginLeft: "5%",
    width: "23%",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
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
