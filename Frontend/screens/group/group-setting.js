import { View, StyleSheet, Text } from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';
import { useState, useEffect } from 'react';
import colors from '../../constants/colors';

export default function GroupSettings({ navigation }) {
  const [bellOn, setBellOn] = useState(false);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.headerContainer}>
        <Appbar.Action
          icon={'arrow-left'}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title={''} titleStyle={styles.title} />
      </Appbar.Header>
      <View style={styles.bodyContainer}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>Madison Family</Text>
        </View>
        <View style={styles.buttonList}>
          <View style={styles.buttonContainer}>
            <IconButton
              icon='account-plus-outline'
              size={20}
              color={colors.white}
              style={styles.iconButton}
              onPress={() => console.log('Add User Pressed')}
            />
            <Text style={styles.buttonTitle}>Add</Text>
          </View>
          <View style={styles.buttonContainer}>
            <IconButton
              icon={bellOn ? 'bell-outline' : 'bell-off-outline'}
              size={20}
              color={colors.white}
              style={styles.iconButton}
              onPress={() => setBellOn(!bellOn)}
            />
            <Text style={styles.buttonTitle}>{bellOn ? 'Mute' : 'Unmute'}</Text>
          </View>
        </View>
        <View style={styles.memberListBox}>
          <Text>Members</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flex: 0,
    backgroundColor: '#fff',
  },
  bodyContainer: {
    flex: 1,
  },
  titleBox: {
    backgroundColor: colors.profileCard,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: 120,
    borderBottomLeftRadius: 70,
    borderBottomEndRadius: 70,
    marginLeft: 20,
    marginRight: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.gray,
    alignSelf: 'center',
  },
  memberListBox: {
    margin: 20,
  },
  iconButton: {
    backgroundColor: colors.black,
  },
  buttonTitle: {
    alignSelf: 'center',
    marginTop: -6,
    fontSize: 12,
    color: colors.gray,
  },
  buttonContainer: {
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  buttonList: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
});
