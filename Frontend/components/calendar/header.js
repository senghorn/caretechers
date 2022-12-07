import { format } from 'date-fns';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';

export default function Header({ date, jumpToToday }) {
  return (
    <View style={styles.outerContainer}>
      <Appbar.Header style={styles.container}>
        <Appbar.Content title={format(date, 'LLLL Y')} titleStyle={styles.titleText} />
        <Appbar.Action icon="calendar" onPress={() => console.log('jump to today')} />
        <Appbar.Action
          icon="filter"
          onPress={() => {
            console.log('Filter Dialog Open');
          }}
        />
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
    fontSize: 20,
  },
});
