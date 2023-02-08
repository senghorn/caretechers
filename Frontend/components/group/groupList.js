import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { List } from 'react-native-paper';
import colors from '../../constants/colors';

export default function GroupList({ groups, setSelectedGroup }) {
  return (
    <View style={styles.container}>
      <ScrollView>
        {groups.map((group) => {
          return (
            <GroupItem
              group={group}
              key={group.id}
              setSelectedGroup={setSelectedGroup}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const GroupItem = ({ group, setSelectedGroup }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedGroup(group);
      }}
      style={styles.itemContainer}
    >
      <List.Item
        title={group.name}
        left={(props) => <List.Icon {...props} icon='account-group' />}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  itemContainer: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colors.lightBlue,
    marginBottom: 10,
  },
});
