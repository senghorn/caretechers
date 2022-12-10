import { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Text,
} from "react-native";
import { Button } from "react-native-paper";
import Note from "../components/notes/note";
import COLORS from "../constants/colors";
import Header from "../components/notes/header";

export default function Notes() {
  const [notes, setNotes] = useState([
    {
      title: "Wifi",
      content: "SSID: Caretechers passcode: 123123",
      id: 1,
    },
    {
      title: "Garage",
      content: "code: 312312",
      id: 2,
    },
    {
      title: "Door",
      content: "code: 123321",
      id: 3,
    },
    {
      id: 4,
      title: "Water Heater",
      content:
        "How to fix water heater: CLOSE gas pipe, slide the heater small glass window, turn on pilot and then use lighter to ignite the pilot. Hold on to pilot for 1mn.",
    },
    {
      id: 5,
      title: "AC",
      content:
        "How to use AC: located in the second floor master bedroom. Adjust it accordingly.",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false); // Add a state variable to control the visibility of the modal
  const [noteTitle, setNoteTitle] = useState(""); // Add a state variable for the note title
  const [noteContent, setNoteContent] = useState(""); // Add a state variable for the note content
  const [newId, setNewId] = useState(10);

  // Function to add a new note
  const addNote = () => {
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
    <View style={styles.container}>
      <Header />

      {/* Add new note view */}
      <Modal visible={modalVisible}>
        <View style={styles.modal}>
          <Text style={styles.label}>Note title</Text>
          <TextInput
            style={styles.input}
            placeholder="Note Title"
            value={noteTitle}
            onChangeText={(text) => setNoteTitle(text)}
            labelStyle={styles.noteInput}
          />
          <Text style={styles.label}>Note description</Text>
          <TextInput
            style={styles.input}
            placeholder="Note Content"
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

      <ScrollView style={styles.tasksContainer}>
        {/* Map over the notes and create a Note component for each note */}
        {notes.map((note) => (
          <Note key={note.id} title={note.title} content={note.content} />
        ))}
      </ScrollView>
      <Button
        mode="contained"
        uppercase={false}
        color="#2196f3"
        icon="checkbox-marked-circle-plus-outline"
        onPress={() => setModalVisible(true)}
        style={styles.createButton}
        labelStyle={styles.createButtonText}
      >
        Add New Note
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignSelf: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    flexBasis: "auto",
  },
  box: {
    elevation: 0,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  tasksContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    marginTop: 16,
  },
  createButton: {
    marginVertical: 32,
    width: "40%",
    alignSelf: "center",
  },
  createButtonText: {
    fontSize: 14,
  },
  noteInput: {
    fontSize: 14,
  },
  modal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    width: "80%",
    color: '#333',
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
});
