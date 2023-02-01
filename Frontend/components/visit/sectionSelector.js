import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';

export default function SectionSelector({ text, selected, setSelected }) {
  return (
    <TouchableHighlight
      underlayColor="#c8e5fc"
      style={[styles.container, selected === text ? styles.selectedContainer : undefined]}
      onPress={() => setSelected(text)}
    >
      <Text style={[styles.label, selected === text ? styles.isSelected : undefined]}>{text}</Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: 80,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedContainer: {
    //  backgroundColor: '#c8e5fc',
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
  },
  isSelected: {
    color: '#1664a1',
    textDecorationLine: 'underline',
  },
});
