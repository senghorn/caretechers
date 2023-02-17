import { useContext } from 'react';
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
      {/* Add a title for the note with ... if longer than 25 characters */}
      <Text Text style={styles.title}>
        {note.title && note.title.length > 25
          ? note.title.substring(0, 25) + '...'
          : note.title}
      </Text>
      {/* Display the note content with ... if longer than 70 characters */}
      <Text Text style={styles.content}>
        {note.content && note.content.length > 70
          ? note.content.substring(0, 70) + '...'
          : note.content}
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
