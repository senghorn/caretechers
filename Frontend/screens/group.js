import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { useState, useEffect } from 'react';
import colors from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function Group({ navigation, route }) {
  const { user } = route.params;
  const [searchValue, setSearchValue] = useState('');
  const image = { uri: require('../assets/IMG_5965.png') };

  const searchGroup = () => {
    console.log('searching for ' + searchValue);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          console.log('create group pressed');
        }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Group</Text>
        </View>
      </TouchableOpacity>

      <TextInput
        label={'Find Group'}
        style={styles.searchInput}
        mode={'outlined'}
        value={searchValue}
        onChangeText={(text) => {
          setSearchValue(text);
        }}
        onSubmitEditing={searchGroup}
        activeOutlineColor='lightblue'
      ></TextInput>
      <ScrollView></ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.babyBlue,
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    margin: 15,
    flex: 'auto',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchInput: {
    width: '95%',
    alignSelf: 'center',
  },
  topItem: {
    marginTop: 70,
  },
});
