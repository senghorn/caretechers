import { Fragment, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Menu, Provider } from 'react-native-paper';
import MenuItemWrapper from './menu/MenuItemWrapper';

export default function SortAction({ sortOptions = [], setSort }) {
  const [visible, setVisible] = useState(false);
  
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const renderedSortOptions = sortOptions.map((option, index) => (
    <MenuItemWrapper
      key={index}
      label={option.label}
      setLabel={() => { }}
      closeMenu={closeMenu}
      value={option.value}
      setValue={setSort}
    />
  ));

  return (
    <View style={styles.container}>
      <Menu visible={visible} onDismiss={closeMenu} anchor={<Appbar.Action icon={'sort'} color="#000" onPress={openMenu} />}>
        {renderedSortOptions}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
