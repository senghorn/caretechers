import { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Divider } from 'react-native-paper';
import colors from '../constants/colors';

export default function Inputs({ route, navigation }) {
  const { user } = route.params;
  const [state, setState] = useState({});
  const [phoneNumber, setPhoneNumber] = useState('');

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
    state['phone'] = cleaned;
    setState(state);
  };

  state['email'] = user['email'];
  state['first'] = user['given_name'];
  state['last'] = user['family_name'];
  state['picture'] = user['picture'];

  const handleFirstName = text => {
    state['first'] = text;
    setState(state);
  };

  const handleLastName = text => {
    state['last'] = text;
    setState(state);
  };

  const handlePhone = text => {
    setPhone(text);
    state['phone'] = text;
  };

  // Handles create user button being pressed
  const submit = async () => {
    if (state['first'] == undefined) {
      alert('Please make to enter your first name');
    } else if (state['last'] == undefined) {
      alert('Please make to enter your last name');
    } else if (state['phone'] == undefined) {
      alert('Please make to enter your phone number');
    } else if (state['phone'].length < 12) {
      alert('Phone number is not valid');
    } else {
      navigation.navigate('Group', { user: state });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Register User</Text>
      {/* <Text style={styles.subtext}>Please fill up the information below</Text> */}
      <Divider />
      <TextInput
        right={<TextInput.Icon icon='email' />}
        style={styles.input}
        value={state['email']}
        label={'Email'}
        disabled
      />
      <TextInput
        right={<TextInput.Icon icon='account' />}
        style={styles.input}
        underlineColorAndroid='transparent'
        label={'Full Name'}
        onChangeText={handleFirstName}
      />
      <TextInput
        right={<TextInput.Icon icon='phone' />}
        style={styles.input}
        label={'Phone Number'}
        keyboardType='number-pad'
        value={phoneNumber}
        onChangeText={text => formatPhoneNumber(text)}
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
    backgroundColor: colors.gradientForm,
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
