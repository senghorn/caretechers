import { useState } from "react";
import { View, StyleSheet, Modal, Text } from "react-native";
import { TextInput } from "react-native-paper";
import { Button } from "react-native-paper";
import COLORS from "../../constants/colors";
import { CreateNote } from "../../services/api/notes";

export default function CreateNoteModal({
  notes,
  setNotes,
  modalVisible,
  setModalVisible,
}) {
  const [noteTitle, setNoteTitle] = useState(""); // Add a state variable for the note title
  const [noteContent, setNoteContent] = useState(""); // Add a state variable for the note content

  // Function to add a new note
  const addNote = async () => {
    CreateNote({ title: noteTitle, content: noteContent })
      .then(noteId => {
        if (noteId) {
          setNotes([
            ...notes,
            {
              title: noteTitle,
              content: noteContent,
              id: noteId,
            },
          ]);
        }
      })
      .catch(error => console.error(error));
      
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
    <Modal visible={modalVisible} transparent={true} animationType="slide">
      <View style={styles.modal}>
        <View style={styles.container}>
          <Text style={styles.title}>Create New Note</Text>
          <TextInput
            style={styles.input}
            value={noteTitle}
            onChangeText={(text) => setNoteTitle(text)}
            labelStyle={styles.noteInput}
            placeholder="Title"
          />
          <TextInput
            style={styles.input}
            value={noteContent}
            onChangeText={(text) => setNoteContent(text)}
            labelStyle={styles.noteInput}
            placeholder="Content"
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
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(33, 150, 243, 0.7)",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    color: "#333",
  },
  container: {
    backgroundColor: "#fff",
    opacity: 1,
    width: "80%",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 12,
    flex: 0,
    justifyContent: "space-between",
  },
  cancelNoteButton: {
    marginVertical: 32,
    width: "40%",
    alignSelf: "center",
    marginEnd: 10,
    opacity: 0.6,
  },
  addNoteButton: {
    marginVertical: 32,
    width: "40%",
    alignSelf: "center",
    marginStart: 10,
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
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "600",
    color: "#2196f3",
  },
});
