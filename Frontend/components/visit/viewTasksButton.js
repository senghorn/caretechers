import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

/**
 * Customized button to view tasks
 * @param {Object} navigation: React component for navigation 
 * @returns 
 */
export default function ViewTasksButton({ visitInfo, navigation, dateString }) {
  return (
    <TouchableHighlight
      style={styles.buttonContainer}
      underlayColor="#ededed"
      onPress={() => {
        navigation.navigate('Visit', { dateString });
      }}
    >
      <View style={styles.volunteerButton}>
        <Text style={styles.volunteerButtonText}>{visitInfo.taskCount} tasks</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    width: 80,
    borderRadius: 8,
  },
  volunteerButton: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: '#a6d2f5',
    borderWidth: 1,
    backgroundColor: '#e0f1ff',
  },
  volunteerButtonText: {
    color: '#2196f3',
    fontWeight: '400',
    fontSize: 14,
  },
});
