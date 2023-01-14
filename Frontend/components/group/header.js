import { StyleSheet, View, Text } from "react-native";
import { useState } from "react";
import { Searchbar } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import COLORS from "../../constants/colors";

export default function Header() {
  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.titleText}>Groups</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
    alignItems: "center",
  },
  title: {
    width: "65%",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
