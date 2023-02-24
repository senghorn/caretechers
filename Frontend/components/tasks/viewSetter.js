import { useState } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { REPEAT_CODES } from '../../utils/tasks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Divider, Menu, Provider } from 'react-native-paper';

export default function ViewSetter({ setFilter }) {
  const [label, setLabel] = useState('All');
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Provider>
      <View style={styles.container}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          style={styles.positionMenu}
          anchor={
            <TouchableHighlight underlayColor="#e3f2fd" style={styles.container} onPress={openMenu}>
              <View style={styles.layout}>
                <MaterialCommunityIcons name="timeline-clock" size={20} color="#2196f3" />
                <Text style={styles.showing}>Showing {label}</Text>
              </View>
            </TouchableHighlight>
          }
        >
          <MenuItemWrapper label="All Tasks" setLabel={setLabel} closeMenu={closeMenu} filter={null} setFilter={setFilter} />
          <Divider />
          <MenuItemWrapper
            label="Solo Tasks"
            setLabel={setLabel}
            closeMenu={closeMenu}
            filter={REPEAT_CODES.NEVER}
            setFilter={setFilter}
          />
          <Divider />
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
      </View>
    </Provider>
  );
}

function MenuItemWrapper({ closeMenu, label, setLabel, filter, setFilter }) {
  return (
    <Menu.Item
      onPress={() => {
        setFilter(filter);
        setLabel(label);
        closeMenu();
      }}
      title={label}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ededed',
    alignSelf: 'flex-start',
    borderRadius: 4,
  },
  showing: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 8,
  },
  layout: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginLeft: 8,
  },
  positionMenu: {
    transform: [{ translateY: -80 }],
  },
});
