import { View, Text, StyleSheet } from 'react-native';

export default function Task({ title }) {
  return (
    <View style={styles.taskContainer}>
      <Text style={styles.taskText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 8,
  },
  taskText: {
    fontWeight: '500',
  },
});
