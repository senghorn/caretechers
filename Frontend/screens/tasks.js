import { View, Text, StyleSheet } from 'react-native';

export default function Tasks() {
  return (
    <View style={styles.container}>
      <Text>Tasks Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
