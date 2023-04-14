import { StyleSheet, Text } from 'react-native';
import { List } from 'react-native-paper';

/**
 * Repeat behavior item
 * @param {Object} navigation: React component for navigation 
 * @returns 
 */
export default function RepeatItem({ title, setSelected, setExpanded, editMode, setEditRepeat, setEditRepeatTitle }) {
  return (
    <List.Item
      title={title}
      onPress={() => {
        setExpanded(false);
        if (editMode) {
          setEditRepeatTitle(title);
          setEditRepeat();
        } else setSelected(title);
      }}
    />
  );
}

const styles = StyleSheet.create({
  color: 'rgb(158, 42, 155)',
});
