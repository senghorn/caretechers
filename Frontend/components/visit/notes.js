import { Fragment, useRef, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

import { ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import uploadImage from '../../services/s3/uploadImage';

const { height } = Dimensions.get('window').height;

/**
 * Component built for visit notes that support editing note for the visit
 * @param {Object} navigation: React component for navigation 
 * @returns 
 */
export default function VisitNotes({ editMode, editContent, setEditContent }) {
  const richText = useRef();

  const [imageUploading, setImageUploading] = useState(false);

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

  return (
    <Fragment>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        {editMode && (
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
      {imageUploading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" style={{ transform: [{ translateY: -200 }] }} />
        </View>
      )}
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
  },
  scrollView: {
    backgroundColor: '#fff',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
