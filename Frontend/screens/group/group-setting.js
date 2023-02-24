import { SafeAreaView, View, StyleSheet, Text, TextInput } from 'react-native';
import { Appbar } from 'react-native-paper';

export default function GroupSettings({ navigation }) {
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.headerContainer}>
        <Appbar.Action
          icon={'arrow-left'}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title={'Group'} titleStyle={styles.title} />
      </Appbar.Header>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: '#900',
  },
  headerContainer: {
    flex: 0,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
  },
});
