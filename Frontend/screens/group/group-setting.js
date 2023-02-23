import { SafeAreaView, View, StyleSheet, Text, TextInput } from 'react-native';
// import { TextInput } from 'react-native-paper';

export default function GroupSettings({}) {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello World!</Text>
      <View style={styles.input}>
        <TextInput />
      </View>

      <Text>Hello World!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input:{
    backgroundColor: '#900'
  }
});
