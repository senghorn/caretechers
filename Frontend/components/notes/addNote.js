import { useState, useRef } from "react";
import { View, StyleSheet, Modal, TextInput, Text } from "react-native";
import { Button } from "react-native-paper";
import COLORS from "../../constants/colors";

export default function AddNote({
  notes,
  setNotes,
  modalVisible,
  setModalVisible,
  addNewNote,
}) {
  const [noteTitle, setNoteTitle] = useState(""); // Add a state variable for the note title
  const [noteContent, setNoteContent] = useState(""); // Add a state variable for the note content
  const [newId, setNewId] = useState(10); // TODO: switch up this new ID generator

  // Function to add a new note
  const addNote = () => {
    addNewNote({ title: noteTitle, content: noteContent, id: newId });
    setNotes([
      ...notes,
      {
        title: noteTitle,
        content: noteContent,
        id: newId,
      },
    ]);
    setNewId(newId + 1); // Generate new id
    setNoteTitle(""); // Clear the note title field
    setNoteContent(""); // Clear the note content field
    setModalVisible(false); // Hide the modal
  };

  const cancelNote = () => {
    setNoteTitle(""); // Clear the note title field
    setNoteContent(""); // Clear the note content field
    setModalVisible(false); // Hide the modal
  };

  return (
    <Modal visible={modalVisible}>
      <View style={styles.modal}>
        <Text style={styles.label}>Note title</Text>
        <TextInput
          style={styles.input}
          value={noteTitle}
          onChangeText={(text) => setNoteTitle(text)}
          labelStyle={styles.noteInput}
        />
        <Text style={styles.label}>Note description</Text>
        <TextInput
          style={styles.input}
          value={noteContent}
          onChangeText={(text) => setNoteContent(text)}
          labelStyle={styles.noteInput}
        />
        <View style={styles.row}>
          <Button
            mode="contained"
            uppercase={false}
            color={COLORS.danger}
            icon="cancel"
            onPress={() => cancelNote()}
            style={styles.cancelNoteButton}
            labelStyle={styles.createButtonText}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            uppercase={false}
            color="#2196f3"
            icon="checkbox-marked-circle-plus-outline"
            onPress={() => addNote()}
            style={styles.addNoteButton}
            labelStyle={styles.createButtonText}
          >
            Add Note
          </Button>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    width: "50%",
    color: "#333",
  },
  cancelNoteButton: {
    marginVertical: 32,
    width: "40%",
    alignSelf: "center",
    marginEnd: 10,
  },
  addNoteButton: {
    marginVertical: 32,
    width: "40%",
    alignSelf: "center",
    marginStart: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
    alignItems: "center",
  },
  noteInput: {
    fontSize: 14,
  },
});
