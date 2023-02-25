import { Fragment, useContext } from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import UserContext from '../../services/context/UserContext';
import { FadeInView } from '../generic/FadeInView';
import colors from '../../constants/colors';

export default function RecordVisitPrompt({ navigation }) {
  const { user } = useContext(UserContext);
  return (
    <TouchableHighlight
      onPress={() => {
        navigation.navigate('Record Visit');
      }}
    >
      <View style={styles.metaContainer}>
        <FadeInView opacityLowerBound={0.7}>
          <View style={styles.container} />
        </FadeInView>
        <View style={styles.overlayContainer}>
          {user && <Image source={{ uri: user.profile_pic }} style={styles.pictureContainer} />}
          <View>
            <Text style={styles.message}>{user ? user.first_name + ', ' : ''}it's your turn to visit today 🙂</Text>
            <Text style={styles.message}>Click here to start recording your visit!</Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  metaContainer: {
    position: 'relative',
  },
  container: {
    position: 'absolute',
    backgroundColor: 'red',
    bottom: 8,
    left: 8,
    right: 8,
    height: 56,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 8,
    left: 24,
    right: 16,
    zIndex: 999,
    height: 56,
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pictureContainer: {
    height: 32,
    width: 32,
    backgroundColor: '#fff',
    borderRadius: '100%',
    marginRight: 16,
  },
  message: {
    fontWeight: '500',
  },
});
