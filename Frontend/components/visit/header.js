import { format, startOfDay } from 'date-fns';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';

/**
 * Visit header component to allow sorting and searching
 * @param {Date} visit date
 * @param {Object} navigation: React component for navigation 
 * @returns 
 */
export default function Header({ date, navigation }) {
  return (
    <View style={styles.outerContainer}>
      <Appbar.Header style={styles.container}>
        <Appbar.Action
          icon="chevron-left"
          onPress={() => {
            navigation.navigate('Home');
          }}
        />
        <Appbar.Content title={format(date, 'EEEE, LLL do, Y')} titleStyle={styles.titleText} />
      </Appbar.Header>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    shadowOffset: { width: 0, height: -10 },
    shadowColor: '#888',
    shadowOpacity: 0.1,
    zIndex: 999,
  },
  container: {
    backgroundColor: '#fff',
  },
  titleText: {
    fontWeight: '500',
    fontSize: 18,
  },
});
