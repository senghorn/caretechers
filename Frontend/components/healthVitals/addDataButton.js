import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import colors from '../../constants/colors';

export default function AddDataButton() {
  return (
    <TouchableHighlight onPress={() => {}} underlayColor="#ededed" style={styles.outerContainer}>
      <View style={styles.container}>
        <SimpleLineIcons name="graph" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.text}>Add New Measurement</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  container: {
    flex: 0,
    width: '100%',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: 8,
  },
  text: {
    color: '#fff',
    fontWeight: '500',
  },
});
