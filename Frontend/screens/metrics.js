import { View, Text, StyleSheet } from 'react-native';

export default function Metrics() {
  return (
    <View style={styles.container}>
      <Text>Metrics Page</Text>
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
