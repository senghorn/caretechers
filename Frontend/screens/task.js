import { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button } from 'react-native-paper';
import Description from '../components/task/description';
import Header from '../components/task/header';
import RepeatBehavior from '../components/task/repeatBehavior';

export default function Task({ route, navigation }) {
  const { title, id } = route.params;

  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState('');
  const [editStartDate, setEditStartDate] = useState(new Date());
  const [editRepeat, setEditRepeat] = useState('Does not repeat');

  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        title={title}
        editMode={editMode}
        setEditMode={setEditMode}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
      />
      <ScrollView style={styles.scrollContainer}>
        <Description
          id={id}
          editMode={editMode}
          editDescription={editDescription}
          setEditDescription={setEditDescription}
          editStartDate={editStartDate}
          setEditStartDate={setEditStartDate}
        />
        <RepeatBehavior id={id} editMode={editMode} editRepeat={editRepeat} setEditRepeat={setEditRepeat} />
      </ScrollView>
      {editMode && (
        <View style={styles.buttonsContainer}>
          <Button
            mode="text"
            uppercase={false}
            disabled={false}
            color="red"
            style={styles.cancelbutton}
            onPress={() => {
              setEditMode(false);
            }}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            loading={false}
            disabled={false}
            uppercase={false}
            color="#1664a1"
            icon="content-save-all"
            onPress={() => {
              console.log({
                editTitle,
                editDescription,
                editStartDate,
                editRepeat,
              });
            }}
          >
            Save Task
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  scrollContainer: {
    marginBottom: 16,
  },
  buttonsContainer: {
    marginBottom: 40,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
