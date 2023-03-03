import { format } from 'date-fns';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { formatDate } from '../../utils/date';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Appbar, TextInput } from 'react-native-paper';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { CreateNote, RemoveNote, UpdateNote } from '../../services/api/notes';
import { NotesRefreshContext } from '../../services/context/NotesRefreshContext';
import UserContext from '../../services/context/UserContext';

const { height } = Dimensions.get('window');

export default function NewNote({ navigation, route }) {
  const { note } = route.params;

  const [editMode, setEditMode] = useState(true);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTime, setEditTime] = useState('');
  const [noteId, setNoteId] = useState(null);

  useEffect(() => {
    if (note && note.last_edited) {
      setEditContent(note.content);
      setNoteId(note.id);
      setEditTitle(note.title);
      const date = new Date(note.last_edited);
      const dayOfWeek = format(date, 'E');
      setEditTime(dayOfWeek + ', ' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString());
      setEditMode(false);
    }
  }, [note]);
  const { user } = useContext(UserContext);
  const richText = useRef();
  const { toggleRefresh } = useContext(NotesRefreshContext);
  return (
    <Fragment>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerOuterContainer}>
          <Appbar.Header style={styles.headerContainer}>
            <Appbar.Action
              icon={editMode && noteId ? 'marker-cancel' : 'chevron-left'}
              color={editMode && noteId ? '#f00' : '#000'}
              onPress={() => {
                if (editMode && noteId) {
                  setEditMode(false);
                  setEditContent(note.content);
                  setEditTitle(note.title);
                }
                else navigation.goBack();
              }}
            />
            {editMode ? (
              <TextInput
                style={styles.titleInput}
                label="Note Title"
                value={editTitle}
                onChangeText={(text) => {
                  setEditTitle(text);
                }}
                mode="outlined"
                activeOutlineColor="#2196f3"
              />
            ) : (
              <Appbar.Content title={editTitle} titleStyle={styles.titleText} />
            )}
            {!editMode ? (
              <Appbar.Action
                icon="pencil-box-multiple"
                color="#2196f3"
                onPress={() => {
                  setEditMode(true);
                }}
              />
            ) : (
              <Appbar.Action
                icon="check"
                color="#2196f3"
                onPress={async () => {
                  if (noteId) {
                    setEditMode(false);
                    await UpdateNote({
                      id: noteId,
                      title: editTitle,
                      content: editContent,
                    });
                    toggleRefresh();
                  } else await addNote(editTitle, editContent, user.group_id, navigation, setEditMode, toggleRefresh);
                }}
              />
            )}
            {!editMode && (
              <Appbar.Action
                icon="delete-empty"
                color="#D11A2A"
                onPress={() => {
                  Alert.alert(
                    'Delete this note forever?',
                    '', // <- this part is optional, you can pass an empty string
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Confirm',
                        onPress: async () => {
                          await RemoveNote(noteId);
                          toggleRefresh();
                          navigation.goBack();
                        },
                        style: 'destructive',
                      },
                    ],
                    {
                      cancelable: true,
                    }
                  );
                }}
              />
            )}
          </Appbar.Header>
        </View>
        {note && <Text style={styles.dateTimeText}>{
          note.last_edited ? formatDate(note.last_edited) : formatDate(new Date())
        }</Text>}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <RichEditor
              ref={richText}
              onChange={(newText) => {
                setEditContent(newText);
              }}
              initialHeight={height}
              disabled={!editMode}
              initialContentHTML={editContent}
              initialFocus={true}
            />
          </ScrollView>
          {editMode && (
            <RichToolbar
              editor={richText}
              selectedIconTint={'#2095F2'}
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.alignLeft,
                actions.alignCenter,
                actions.alignRight,
                actions.heading2,
                actions.undo,
                actions.redo,
              ]}
              iconMap={{
                [actions.heading1]: ({ tintColor }) => <Text style={[{ color: tintColor }]}>H1</Text>,
                [actions.heading2]: ({ tintColor }) => <Text style={[{ color: tintColor }]}>H1</Text>,
              }}
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Fragment>
  );
}

const addNote = async (noteTitle, noteContent, groupId, navigation, setEditMode, toggleRefresh) => {
  if (noteTitle && noteContent) {
    CreateNote({ title: noteTitle, content: noteContent }, groupId)
      .then((noteId) => {
        setEditMode(false);
        if (noteId) {
          toggleRefresh();
          //navigation.goBack();
        }
      })
      .catch((error) => console.error(error));
  } else {
    alert('Note must have both title and content');
  }
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    flex: 0,
    width: '100%',
    shadowOffset: { width: 0, height: -10 },
    shadowColor: '#888',
    shadowOpacity: 0.1,
  },
  headerOuterContainer: {
    zIndex: 999,
    paddingBottom: 10,
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    paddingHorizontal: 4,
    backgroundColor: '#fff',
  },
  titleInput: {
    flexGrow: 1,
    height: 40,
    marginRight: 16,
    marginBottom: 4,
    fontSize: 18,
  },
  dateTimeText: {
    alignSelf: 'center',
    padding: 10,
    fontSize: 12
  }
});
