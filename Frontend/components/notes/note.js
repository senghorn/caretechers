import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors'

const Note = ({ content, title }) => (
  <View style={styles.note}>
    {/* Add a title for the note */}
    <Text style={styles.title}>{title}</Text>
    {/* Display the note content */}
    <Text style={styles.content}>{content}</Text>
  </View>
);

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
