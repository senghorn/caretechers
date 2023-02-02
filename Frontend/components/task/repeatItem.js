import { StyleSheet, Text } from 'react-native';
import { List } from 'react-native-paper';

export default function RepeatItem({ title, setSelected, setExpanded }) {
  return (
    <List.Item
      title={title}
      onPress={() => {
        setExpanded(false);
        setSelected(title);
      }}
    />
  );
}

const styles = StyleSheet.create({
  color: 'rgb(158, 42, 155)',
});
