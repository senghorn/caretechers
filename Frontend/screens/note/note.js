import { useState, useEffect, useContext } from 'react';
import { StyleSheet, Keyboard, View, TextInput, Text, TouchableWithoutFeedback } from 'react-native';
import { TextInput as TextInputBox } from 'react-native-paper';
import { Appbar } from 'react-native-paper';
import { UpdateNote, RemoveNote, CreateNote } from '../../services/api/notes';
import { format } from 'date-fns';
import { RefreshContext } from '../../services/context/RefreshContext';
import UserContext from '../../services/context/UserContext';
import colors from '../../constants/colors';
import NewNote from './newNote';

export default function Note({ navigation, route }) {
  const { note } = route.params;
  const [noteContent, setNoteContent] = useState('');
  const [noteId, setNoteId] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [editing, setEditing] = useState(false);
  const [editTime, setEditTime] = useState('');
  const { user } = useContext(UserContext);
  const { toggleRefresh } = useContext(RefreshContext);

  useEffect(() => {
    if (note && note.last_edited) {
      setNoteContent(note.content);
      setNoteId(note.id);
      setNoteTitle(note.title);
      const date = new Date(note.last_edited);
      const dayOfWeek = format(date, 'E');
      setEditTime(dayOfWeek + ', ' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString());
    }
  }, [note]);

  // if noteId exists, use header for editing note. Otherwise, use header for adding new note
  return (
    <View style={styles.container}>
      {noteId && (
        <View style={styles.container}>
          <Appbar.Header style={styles.headerContainer}>
            <Appbar.Action
              icon="chevron-left"
              onPress={() => {
                navigation.goBack();
              }}
            />
            <Appbar.Content title={noteTitle} titleStyle={styles.titleText} />
            {editing && (
              <Appbar.Action
                icon="check"
                onPress={async () => {
                  Keyboard.dismiss();
                  setEditing(false);
                  await UpdateNote({
                    id: noteId,
                    title: noteTitle,
                    content: noteContent,
                  });
                  toggleRefresh();
                }}
              />
            )}
            {!editing && (
              <Appbar.Action
                icon="trash-can"
                onPress={async () => {
                  await RemoveNote(noteId);
                  toggleRefresh();
                  navigation.goBack();
                }}
              />
            )}
          </Appbar.Header>
          <Text style={styles.time}>Last Edited: {editTime}</Text>
          <TextInput
            multiline={true}
            numberOfLines={4}
            value={noteContent}
            onChangeText={(text) => {
              setNoteContent(text);
            }}
            onFocus={() => {
              setEditing(true);
            }}
            style={styles.content}
          ></TextInput>
        </View>
      )}
      {!noteId && (
        <View style={styles.container}>
          <Appbar.Header style={styles.headerContainer}>
            <Appbar.Action
              icon="chevron-left"
              onPress={() => {
                navigation.goBack();
              }}
            />
            <Appbar.Content title={'New Note'} titleStyle={styles.titleText} />
            <Appbar.Action
              icon="content-save-check"
              onPress={async () => {
                Keyboard.dismiss();
                setEditing(false);
                toggleRefresh();
                await addNote(noteTitle, noteContent, user.group_id, navigation);
              }}
            />
          </Appbar.Header>
          <TextInputBox
            value={noteTitle}
            onChangeText={(text) => {
              setNoteTitle(text);
            }}
            onFocus={() => {
              setEditing(true);
            }}
            label="Note Title"
            style={styles.titleInputBox}
            mode="outlined"
          />
          <TextInputBox
            multiline
            value={noteContent}
            onChangeText={(text) => {
              setNoteContent(text);
            }}
            onFocus={() => {
              setEditing(true);
            }}
            label={'Note Description'}
            style={styles.contentInputBox}
            mode={'outlined'}
          />
        </View>
      )}
    </View>
  );
}

const addNote = async (noteTitle, noteContent, groupId, navigation) => {
  if (noteTitle && noteContent) {
    CreateNote({ title: noteTitle, content: noteContent }, groupId)
      .then((noteId) => {
        if (noteId) {
          navigation.goBack();
        }
      })
      .catch((error) => console.error(error));
  } else {
    alert('Note must have both title and content');
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
  },
  headerContainer: {
    flex: 0,
    backgroundColor: '#fff',
  },
  titleText: {
    fontWeight: '500',
    fontSize: 18,
  },
  titleInputBox: {
    margin: 10,
    borderRadius: 20,
  },
  contentInputBox: {
    margin: 10,
    borderRadius: 20,
    minHeight: '30%',
  },
  titleBox: {
    height: 'auto',
    backgroundColor: colors.grayLight,
    fontSize: 18,
    padding: 15,
    margin: 10,
    minHeight: '10%',
    borderRadius: 15,
    width: 800,
  },
  content: {
    height: 'auto',
    backgroundColor: '#ededed',
    fontSize: 16,
    padding: 15,
    margin: 10,
    marginTop: 20,
    minHeight: '10%',
    borderRadius: 4,
    paddingTop: 20,
  },
  time: {
    fontSize: 12,
    alignSelf: 'center',
    marginTop: 10,
  },
});
