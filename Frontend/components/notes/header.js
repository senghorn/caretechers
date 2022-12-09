import { StyleSheet, View, Text } from "react-native";
import { useState } from "react";
import { Divider, Searchbar } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import COLORS from "../../constants/colors";

export default function Header() {
  const data = [
    { label: "Date", value: "1" },
    { label: "Alphabets", value: "2" },
    { label: "Relevant", value: "3" },
  ];
  const [sortValue, setSortValue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const onChangeSearch = (query) => setSearchQuery(query);
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Notes</Text>
        </View>
        <View style={styles.sort}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
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
        <View style={styles.search}>
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.box}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  titleText: {
    fontWeight: "500",
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
    alignItems: "center",
  },
  search: {
    width: "100%",
    padding: 8,
  },
  title: {
    marginLeft: "5%",
    width: "65%",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sort: {
    width: "30%",
  },
  header: {
    backgroundColor: COLORS.bgColor,
  },
  box: {
    width: "100%",
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
});
