import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default function Header({ title, id, selected, setSelected }) {
  const isSelected = id === selected;
  return (
    <Button
      mode={isSelected ? 'contained' : 'text'}
      color="#2196f3"
      onPress={() => setSelected(id)}
      style={styles.header}
      uppercase={false}
    >
      {title}
    </Button>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 64,
  },
  header: {
    fontSize: 18,
    fontWeight: '500',
    marginHorizontal: 8,
    borderRadius: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    flexBasis: 'auto',
  },
});
