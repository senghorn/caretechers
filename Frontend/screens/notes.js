import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import Note from "../components/notes/note";
import COLORS from "../constants/colors";
import Header from "../components/notes/header";
import CreateNoteModal from "../components/notes/CreateNoteModal";
import config from "../constants/config";

const fetchNotes = async (setNotes) => {
  try {
    let connection_string =
      "http://" + config.backend_server + "/notes/group/1";
    const result = await fetch(connection_string);
    const data = await result.json();
    setNotes(data);
  } catch (error) {
    console.log(error.message);
  }
};

export default function Notes() {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    fetchNotes(setNotes);
  }, []);


  // Add a state variable to control the visibility of the modal
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Header />
      <CreateNoteModal
        notes={notes}
        setNotes={setNotes}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
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
        style={styles.createButton}
        labelStyle={styles.createButtonText}
        onPress={() => setModalVisible(true)}
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
});
