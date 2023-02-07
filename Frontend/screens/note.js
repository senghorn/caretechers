import { StyleSheet, Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';

export default function Note({ navigation }) {
  // fetch title and id from route params
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.headerContainer}>
        <Appbar.Action
          icon="chevron-left"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title={'title'} titleStyle={styles.titleText} />
      </Appbar.Header>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  headerContainer: {
    flex: 0,
    backgroundColor: '#fff',
  },
  titleText: {
    fontWeight: '500',
    fontSize: 18,
  },
});
