import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { Menu, MenuDivider, MenuItem } from 'react-native-material-menu';
import { REPEAT_CODES } from '../../utils/tasks';

export default function ViewSetter({ setFilter }) {
  const [label, setLabel] = useState('All');
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon={'timeline-clock'} onPress={openMenu} color="#000" />}
      >
        <MenuItemWrapper label="All Tasks" setLabel={setLabel} closeMenu={closeMenu} filter={null} setFilter={setFilter} />
        <MenuDivider />
        <MenuItemWrapper
          label="Solo Tasks"
          setLabel={setLabel}
          closeMenu={closeMenu}
          filter={REPEAT_CODES.NEVER}
          setFilter={setFilter}
        />
        <MenuDivider />
        <MenuItemWrapper
          label="Daily Tasks"
          setLabel={setLabel}
          closeMenu={closeMenu}
          filter={REPEAT_CODES.DAY}
          setFilter={setFilter}
        />
        <MenuItemWrapper
          label="Weekly Tasks"
          setLabel={setLabel}
          closeMenu={closeMenu}
          filter={REPEAT_CODES.WEEK}
          setFilter={setFilter}
        />
        <MenuItemWrapper
          label="Annual Tasks"
          setLabel={setLabel}
          closeMenu={closeMenu}
          filter={REPEAT_CODES.ANNUAL}
          setFilter={setFilter}
        />
      </Menu>
      <Text style={styles.showing}>Showing {label}</Text>
    </View>
  );
}

function MenuItemWrapper({ closeMenu, label, setLabel, filter, setFilter }) {
  return (
    <MenuItem
      onPress={() => {
        setFilter(filter);
        setLabel(label);
        closeMenu();
      }}
    >
      {label}
    </MenuItem>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  showing: {
    fontSize: 14,
    fontWeight: '500',
  },
});
