import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Fragment } from 'react';

export default function Task({ title, id, navigation, mutateString, showIcon, backTo }) {
  if (!title) return null;
  return (
    <TouchableHighlight
      style={styles.taskContainer}
      underlayColor="#e3f2fd"
      onPress={() => navigation.navigate('Task', { title, id, mutateString, backTo })}
    >
      <Fragment>
        <View style={styles.taskTitleContainer}>
          {showIcon && <AntDesign name="checkcircleo" size={16} color="black" />}
          <Text style={styles.taskText}>{title}</Text>
        </View>
        <AntDesign name="infocirlceo" size={16} color="#2196f3" />
      </Fragment>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  taskTitleContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskContainer: {
    backgroundColor: '#ededed',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginVertical: 4,
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  taskText: {
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 8,
    width: '80%',
  },
});
