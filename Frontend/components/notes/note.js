import { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../../constants/colors';

const Note = ({ navigation, route, note }) => {
  return (
    <TouchableOpacity
      style={styles.note}
      onPress={() => {
        navigation.navigate('Note', {
          note: note,
        });
      }}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {note.title && note.title.length > 15
            ? note.title.substring(0, 15) + '...'
            : note.title}
        </Text>
        <Text style={styles.timeText}>{formatDate(note.last_edited)}</Text>
      </View>
      <Text style={styles.content}>
        {note.content && note.content.length > 45
          ? note.content.substring(0, 45) + ' ...'
          : note.content}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  note: {
    padding: 10,
    marginTop: 15,
    borderWidth: 1.2,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.grayLight,
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
});

export default Note;

function formatDate(dateString) {
  const date = new Date(dateString);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthsOfYear = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = monthsOfYear[date.getMonth()];
  const dayOfMonth = date.getDate();
  let suffix = 'th';
  const year = date.getFullYear();

  if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
    suffix = 'st';
  } else if (dayOfMonth === 2 || dayOfMonth === 22) {
    suffix = 'nd';
  } else if (dayOfMonth === 3 || dayOfMonth === 23) {
    suffix = 'rd';
  }

  const formattedDate = `${dayOfWeek}, ${month} ${dayOfMonth}${suffix}, ${year}`;
  return formattedDate;
}
