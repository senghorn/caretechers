import { Fragment, useRef, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, View, ScrollView, StyleSheet, Text } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

const { height } = Dimensions.get('window').height;

export default function VisitNotes({ editMode, editContent, setEditContent }) {
  const richText = useRef();
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
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
            actions.undo,
            actions.redo,
          ]}
          iconMap={{
            [actions.heading1]: ({ tintColor }) => <Text style={[{ color: tintColor }]}>H1</Text>,
            [actions.heading2]: ({ tintColor }) => <Text style={[{ color: tintColor }]}>H1</Text>,
          }}
        />
      )}
      <ScrollView style={styles.scrollView}>
        <RichEditor
          ref={richText}
          onChange={(newText) => {
            setEditContent(newText);
          }}
          initialHeight={height}
          disabled={!editMode}
          initialContentHTML={editContent}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
  },
  scrollView: {
    paddingHorizontal: 4,
    backgroundColor: '#fff',
  },
});
