import { useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Divider } from 'react-native-paper';
import colors from '../constants/colors';

export default function Inputs({ route, navigation }) {
  const { user } = route.params;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneMissing, setPhoneMissing] = useState(false);
  const [nameMissing, setNameMissing] = useState(false);
  const [email, setEmail] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user != undefined) {
      setUserName(user['name']);
      setEmail(user['email']);
    }
  }, [user]);

  // Formats the text of the phone number to display nicely
  // E.g., 123-449-4910
  const formatPhoneNumber = text => {
    var cleaned = '';
    var match = text.match(/\d/g);
    if (match) {
      cleaned = match.join('');
      if (cleaned.length > 10) {
        cleaned = cleaned.substring(0, 10);
      }
    }
    if (cleaned.length >= 7) {
      cleaned =
        cleaned.slice(0, 3) +
        '-' +
        cleaned.slice(3, 6) +
        '-' +
        cleaned.slice(6);
    } else if (cleaned.length > 3) {
      cleaned = cleaned.slice(0, 3) + '-' + cleaned.slice(3);
    }
    setPhoneNumber(cleaned);
    if (cleaned.length == 12) {
      setPhoneMissing(false);
    }
  };

  const handleNameChange = text => {
    setUserName(text);
  };

  // Handles create user button being pressed
  const submit = async () => {
    if (userName == undefined || userName == '') {
      setNameMissing(true);
      return;
    } else if (phoneNumber.length < 12) {
      setPhoneMissing(true);
      return;
    } else {
      navigation.navigate('Group', {
        user: {
          email: email,
          name: userName,
          picture: user['picture'],
          phone: phoneNumber,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Register User</Text>
      <Divider />
      <TextInput
        right={<TextInput.Icon icon='email' />}
        style={styles.input}
        value={user['email']}
        label={'Email'}
        disabled
      />
      <TextInput
        right={<TextInput.Icon icon='account' />}
        style={styles.input}
        underlineColorAndroid='transparent'
        label={'Full Name'}
        value={userName}
        onChangeText={handleNameChange}
        autoCorrect={false}
        error={nameMissing}
      />
      <TextInput
        right={<TextInput.Icon icon='phone' />}
        style={styles.input}
        label={'Phone Number'}
        keyboardType='number-pad'
        value={phoneNumber}
        onChangeText={text => formatPhoneNumber(text)}
        error={phoneMissing}
      />
      <TouchableOpacity style={styles.submitButton} onPress={submit}>
        <Text style={styles.submitButtonText}> Join Caring Group </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    marginTop: 50,
  },
  input: {
    margin: 12,
  },
  submitButton: {
    backgroundColor: colors.lightGreen,
    fontFamily: 'Georgia',
    padding: 10,
    margin: 15,
    marginTop: 30,
    width: '50%',
    alignSelf: 'center',
    borderRadius: 20,
    alignContent: 'center',
    justifyContent: 'center',
    height: '15%',
    marginBottom: '3%',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    alignSelf: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    margin: 15,
  },
  subtext: {
    marginLeft: 15,
    fontWeight: '100',
    padding: 5,
  },
});
