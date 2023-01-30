import { useState, useEffect } from "react";
import { View, StyleSheet, Modal, Text } from "react-native";
import { TextInput } from "react-native-paper";
import { Button } from "react-native-paper";
import COLORS from "../../constants/colors";
import { UpdateNote, RemoveNote } from "../../services/api/notes";

export default function EditRemoveNoteModal({
  notes,
  setNotes,
  selectedNote,
  setSelectedNote,
}) {
  const [noteTitle, setNoteTitle] = useState(""); // Add a state variable for the note title
  const [noteContent, setNoteContent] = useState(""); // Add a state variable for the note content
  const [newId, setNewId] = useState(null);
  const [modalVisible, setVisible] = useState(false);

  useEffect(() => {
    if (selectedNote != null) {
      setNoteTitle(selectedNote.title);
      setNoteContent(selectedNote.content);
      setNewId(selectedNote.id);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [selectedNote]);

  /**
   * Updates the values of the note
   *
   * @param {string} id - The id of the note to be removed
   * @param {string} newContent - New content to set to
   * @param {string} newTitle - New title to set to
   */
  const updateNote = (id, newContent, newTitle) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        return { ...note, title: newTitle, content: newContent };
      }
      return note;
    });
    setNotes(updatedNotes);
  };

  /**
   * Removes the note from notes array
   * @param {string} id - The id of the note to be removed
   */
  const removeNoteFromNotes = (id) => {
    const updatedNotes = notes.filter((item) => {
      return item.id != id;
    });
    setNotes(updatedNotes);
  };

  // OnPress callback for remove note button
  const removeNote = () => {
    if (selectedNote != null) {
      // sends remove requst to server
      RemoveNote(newId);
      // remove the note
      removeNoteFromNotes(newId);
    }

    setSelectedNote(null);
  };

  // OnPress callback for save edit note button
  const saveEditNote = () => {
    // Sends update note to server
    UpdateNote({ id: newId, title: noteTitle, content: noteContent });
    // Set the note
    updateNote(newId, noteContent, noteTitle);

    setSelectedNote(null); // This will hide the Modal
  };

  // OnPress callback for cancel editing note button
  const cancelNote = () => {
    setNoteTitle(""); // Clear the note title field
    setNoteContent(""); // Clear the note content field
    setSelectedNote(null); // Hide the modal
  };

  return (
    <Modal visible={modalVisible} transparent={true} animationType="slide">
      <View style={styles.modal}>
        <View style={styles.container}>
          <Text style={styles.title}>Edit Note</Text>
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
              icon="trash-can"
              onPress={() => removeNote()}
              style={styles.cancelNoteButton}
              labelStyle={styles.createButtonText}
            >
              Remove
            </Button>
            <Button
              mode="contained"
              uppercase={false}
              color="#2196f3"
              icon="content-save"
              onPress={() => saveEditNote()}
              style={styles.addNoteButton}
              labelStyle={styles.createButtonText}
            >
              Save
            </Button>
            <Button
              mode="contained"
              uppercase={false}
              color={COLORS.danger}
              icon="cancel"
              onPress={() => cancelNote()}
              style={styles.removeNoteButton}
              labelStyle={styles.createButtonText}
            >
              Cancel
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
    width: "45%",
    alignSelf: "center",
    marginEnd: 10,
  },
  addNoteButton: {
    marginVertical: 32,
    width: "45%",
    alignSelf: "center",
    marginStart: 10,
  },
  removeNoteButton: {
    width: "100%",
    alignSelf: "center",
    opacity: 0.6,
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
