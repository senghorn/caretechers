import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import COLORS from '../../constants/colors';
import RenderHTML from 'react-native-render-html';
import { formatDate } from '../../utils/date';
const width = Dimensions.get('window').width;

/**
 * Component that displays notes
 * @param {Object} navigation: React component for navigation 
 * @param {Object} note: note to display that has content, last_edited, title
 * @returns 
 */
const Note = ({ navigation, route, note }) => {
  return (
    <TouchableOpacity
      style={styles.note}
      onPress={() => {
        navigation.navigate('New Note', {
          note: note,
        });
      }}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {note.title && note.title.length > 15 ? note.title.substring(0, 15) + '...' : note.title}
        </Text>
        <Text style={styles.timeText}>{formatDate(note.last_edited)}</Text>
      </View>
      <View style={styles.htmlRenderer}>
        <RenderHTML source={{ html: note.content }} contentWidth={width} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  note: {
    padding: 10,
    marginTop: 15,
    borderWidth: 1.2,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.lighterYellow,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: COLORS.gray,
    fontSize: 12,
  },
  htmlRenderer: {
    maxHeight: 40,
    overflow: 'hidden',
  },
});

export default Note;
