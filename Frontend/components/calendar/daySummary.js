import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function DaySummary({ volunteer = false }) {
  if (volunteer) {
    return (
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          uppercase={false}
          color="#fff"
          icon="plus-circle-outline"
          onPress={() => console.log('Volunteer to Visit')}
          style={styles.volunteerButton}
          labelStyle={styles.volunteerButtonText}
        >
          Volunteer to Visit
        </Button>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.pictureContainer}></View>
      <View>
        <Text style={styles.nameText}>John</Text>
        <Text>7 Tasks</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ededed',
  },
  nameText: {
    fontWeight: '600',
  },
  pictureContainer: {
    height: 32,
    width: 32,
    backgroundColor: '#2196f3',
    borderRadius: '100%',
    marginRight: 16,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    borderRadius: 8,
    backgroundColor: '#ededed',
  },
  volunteerButton: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  volunteerButtonText: {
    color: '#2196f3',
    fontWeight: '600',
  },
});
