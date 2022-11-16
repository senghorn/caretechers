import { View, Text, StyleSheet } from 'react-native';

export default function Notes() {
  return (
    <View style={styles.container}>
      <Text>Notes Page</Text>
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
