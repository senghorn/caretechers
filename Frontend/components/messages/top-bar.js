import { View, StyleSheet } from "react-native";
import { Text, Searchbar } from "react-native-paper";
import { useState } from "react";

export default function TopBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const onChangeSearch = (query) => setSearchQuery(query);

  return (
    <View style={styles.row}>
      <View style={styles.title}>
        <Text style={styles.titleText}>CareTechers</Text>
      </View>
      <View style={styles.search}>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.box}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  search: {
    width: "49%",
    padding: 8,
  },
  title: {
    marginLeft: "5%",
    width: "45%",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
