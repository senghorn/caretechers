import { Fragment, useRef } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

const { height } = Dimensions.get('window');

export default function NewNote({ navigation }) {
  const richText = useRef();
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <RichEditor ref={richText} onChange={(newText) => {}} />
        </ScrollView>
        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertImage,
            actions.heading1,
          ]}
          iconMap={{ [actions.heading1]: ({ tintColor }) => <Text style={[{ color: tintColor }]}>H1</Text> }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 0,
  },
});
