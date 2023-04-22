import { Fragment, useContext, useRef, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Appbar } from 'react-native-paper';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import uploadImage from '../../services/s3/uploadImage';
import RecordVisitContext from '../../services/context/RecordVisitContext';
import * as ImagePicker from 'expo-image-picker';

const { height } = Dimensions.get('window');

/**
 * Adding new note screen.
 * @param {Object} navigation: React component for navigation
 * @returns
 */
export default function RecordVisitNotes({ navigation }) {
  const { visitNotes, setVisitNotes } = useContext(RecordVisitContext);

  const [imageUploading, setImageUploading] = useState(false);

  // Handles adding image to the note. isCamera boolean decides whether
  // user wants to capture an image or choose for library.
  const addImage = async (isCamera = false) => {
    setImageUploading(true);
    const result = isCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.5,
          base64: true,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.5,
          base64: true,
        });
    if (!result.canceled) {
      try {
        const imageUrl = await uploadImage(result.assets[0].base64);
        console.log(imageUrl);
        richText.current?.insertHTML(
          `
            <div align="center" >
              <img src="${imageUrl}" style="height: 500px;" />
            </div>
          `
        );
      } catch (error) {
        console.log(error);
      } finally {
        setImageUploading(false);
      }
    } else setImageUploading(false);
  };

  const richText = useRef();
  return (
    <Fragment>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerOuterContainer}>
          <Appbar.Header style={styles.headerContainer}>
            <Appbar.Action
              icon={'chevron-left'}
              color={'#000'}
              onPress={() => {
                navigation.goBack();
              }}
            />
            <Appbar.Content title="Visit Notes" titleStyle={styles.titleText} />
          </Appbar.Header>
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <RichEditor
              ref={richText}
              onChange={(newText) => {
                setVisitNotes(newText);
              }}
              initialContentHTML={visitNotes}
              initialHeight={height}
              initialFocus={true}
              style={styles.richEditor}
            />
          </ScrollView>
          <RichToolbar
            editor={richText}
            selectedIconTint={'#2095F2'}
            onPressAddImage={() => {
              addImage(false);
            }}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.insertImage,
              'insertCamera',
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
              insertCamera: ({ tintColor }) => <Text style={[{ color: tintColor }]}>CAM</Text>,
              [actions.heading2]: ({ tintColor }) => <Text style={[{ color: tintColor }]}>H1</Text>,
            }}
            insertCamera={() => {
              addImage(true);
            }}
          />
        </KeyboardAvoidingView>
        {imageUploading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </SafeAreaView>
    </Fragment>
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
    backgroundColor: '#fff',
  },
  scrollView: {
    backgroundColor: '#fff',
  },
  titleInput: {
    flexGrow: 1,
    marginRight: 16,
    marginBottom: 4,
    fontSize: 18,
    maxWidth: '70%',
  },
  dateTimeText: {
    alignSelf: 'center',
    padding: 10,
    fontSize: 12,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 60,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
