import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Description from '../components/task/description';
import Header from '../components/task/header';
import RepeatBehavior from '../components/task/repeatBehavior';

export default function Task({ route, navigation }) {
  const { title, id } = route.params;

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title={title} />
      <ScrollView style={styles.scrollContainer}>
        <Description id={id} />
        <RepeatBehavior id={id} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  scrollContainer: {
    marginBottom: 16,
  },
});
