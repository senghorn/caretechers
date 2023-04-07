import { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Divider } from 'react-native-paper';
import { createUser, fetchUserByCookie } from '../../services/api/user';
import UserContext from '../../services/context/UserContext';
import colors from '../../constants/colors';
import Spinner from 'react-native-loading-spinner-overlay';
import { getAccessToken } from '../../services/api/auth';
import { setAPIAccessToken, setAPIResetToken } from '../../services/storage/asyncStorage';
export default function Inputs({ route, navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneMissing, setPhoneMissing] = useState(false);
  const [nameMissing, setNameMissing] = useState(true);
  const [email, setEmail] = useState(null);
  const [userName, setUserName] = useState('');
  const [lastName, setLastName] = useState('');
  const [missLastName, setMissLastName] = useState(true);
  const { googleData, googleToken } = route.params;
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (googleData != undefined) {
      setUserName(googleData['given_name']);
      setLastName(googleData['family_name']);
      setEmail(googleData['email']);

      setMissLastName(false);
      setNameMissing(false);
    }
  }, [googleData]);

  // Formats the text of the phone number to display nicely
  // E.g., 123-449-4910
  const formatPhoneNumber = (text) => {
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

    setPhoneMissing(false);
  };

  const handleNameChange = (text) => {
    setUserName(text);
    setNameMissing(false);
  };

  const handleLastNameChange = (text) => {
    setLastName(text);
    setMissLastName(false);
  };

  // Handles create user button being pressed
  const submit = async () => {
    if (userName == undefined || userName == '') {
      setNameMissing(true);
    } else if (lastName == undefined || lastName == '') {
      setMissLastName(true);
    } else if (phoneNumber.length < 12) {
      setPhoneMissing(true);
    } else {
      setLoading(true);
      const accessToken = await getAccessToken(googleToken);
      const userCreated = await createUser(
        userName,
        lastName,
        email,
        phoneNumber,
        googleData['picture'],
        accessToken.accessToken
      );
      if (userCreated == true) {
        setAPIAccessToken(accessToken.accessToken);
        setAPIResetToken(accessToken.refreshToken);
        let result = await fetchUserByCookie(accessToken.accessToken);
        if (result) {
          setUser({
            "access_token": accessToken.accessToken, "curr_group": result.curr_group, "id": result.id,
            "first_name": result.first_name, "last_name": result.last_name, "profile_pic": result.profile_pic,
            "phone_num": result.phone_num
          });
          setLoading(false);
          navigation.navigate('Group');
        }
      } else {
        console.log('user created unsuccessful');
      }
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Spinner
        color='#add8e6'
        visible={loading}
        textStyle={styles.spinnerTextStyle}
        size={'large'}
      />
      <Text style={styles.title}>Register User</Text>
      <Divider />
      <TextInput
        right={<TextInput.Icon icon='email' />}
        style={styles.input}
        value={email}
        label={'Email'}
        disabled
      />
      <TextInput
        right={<TextInput.Icon icon='account' />}
        style={styles.input}
        label={'First Name'}
        value={userName}
        onChangeText={handleNameChange}
        autoCorrect={false}
        error={nameMissing}
        underlineColor='grey'
        activeUnderlineColor='blue'
      />
      <TextInput
        right={<TextInput.Icon icon='account' />}
        style={styles.input}
        label={'Last Name'}
        value={lastName}
        onChangeText={handleLastNameChange}
        autoCorrect={false}
        error={missLastName}
        underlineColor='grey'
        activeUnderlineColor='blue'
      />
      <TextInput
        right={<TextInput.Icon icon='phone' />}
        style={styles.input}
        label={'Phone Number'}
        keyboardType='number-pad'
        value={phoneNumber}
        onChangeText={(text) => formatPhoneNumber(text)}
        error={phoneMissing}
        underlineColor='grey'
        activeUnderlineColor='blue'
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
    backgroundColor: colors.primary,
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
    fontSize: 26,
    margin: 15,
  },
  subtext: {
    marginLeft: 15,
    fontWeight: '100',
    padding: 5,
  },
});
