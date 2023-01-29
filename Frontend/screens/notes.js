import { useState, useEffect, useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import Note from "../components/notes/note";
import COLORS from "../constants/colors";
import Header from "../components/notes/header";
import CreateNoteModal from "../components/notes/CreateNoteModal";
import EditRemoveNoteModal from "../components/notes/EditRemoveNoteModal";
import config from "../constants/config";
import UserContext from "../data/context/UserContext";

const axios = require("axios").default;
const fetchNotes = async (user, setNotes) => {
  try {
    let connection_string =
      "http://" + config.backend_server + "/notes/group/" + user.group_id;
    await axios.get(connection_string).then(function (response) {
      setNotes(response.data);
    });
  } catch (error) {
    console.log("Fetching note error", error.message);
  }
};

export default function Notes() {

  // Grab user data from UserContext
  const user = useContext(UserContext);

  // Add a state variable to control the visibility of the modal
  const [modalVisible, setModalVisible] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  useEffect(() => {
    if (user != null) {
      fetchNotes(user, setNotes);
    }
  }, [user]);

  useEffect(() => {
    if (selectedNote != null) {
    }
  }, [selectedNote]);

  return (
    <View style={styles.container}>
      <Header />
      <CreateNoteModal
        notes={notes}
        setNotes={setNotes}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        key={"create"} /*Key is required to differentiate two Modal objects*/
      />
      <EditRemoveNoteModal
        notes={notes}
        setNotes={setNotes}
        selectedNote={selectedNote}
        setSelectedNote={setSelectedNote}
        key={"edit"} /*Key is required to differentiate two Modal objects*/
      />
      <ScrollView style={styles.tasksContainer}>
        {/* Map over the notes and create a Note component for each note */}
        {notes.map((note) => (
          <Note
            key={note.id}
            title={note.title}
            content={note.content}
            setSelectedNote={setSelectedNote}
            id={note.id}
          />
        ))}
      </ScrollView>
      <Button
        mode="contained"
        uppercase={false}
        color="#2196f3"
        icon="checkbox-marked-circle-plus-outline"
        style={styles.createButton}
        labelStyle={styles.createButtonText}
        onPress={() => {
          setModalVisible(true);
        }}
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
