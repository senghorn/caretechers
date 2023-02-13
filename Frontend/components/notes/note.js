import {useContext} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../../constants/colors';

const Note = ({ navigation, route, note }) => {
  return (
    <TouchableOpacity
      style={styles.note}
      onPress={() => {
        navigation.navigate('Note', {
          note: note,
        });
      }}
    >
      {/* Add a title for the note */}
      <Text Text style={styles.title}>
        {' '}
        {note.title}
      </Text>
      {/* Display the note content */}
      <Text Text style={styles.content}>
        {' '}
        {note.content}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  note: {
    padding: 10,
    margin: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
  },
});

export default Note;
