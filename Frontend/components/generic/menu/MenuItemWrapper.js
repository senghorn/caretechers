import { Menu } from 'react-native-paper';

export default function MenuItemWrapper({ closeMenu, label, setLabel, value, setValue }) {
  return (
    <Menu.Item
      onPress={() => {
        setValue(value);
        setLabel(label);
        closeMenu();
      }}
      title={label}
    />
  );
}
