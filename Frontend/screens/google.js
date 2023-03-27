import { useEffect, useState, useContext } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { StyleSheet, Text, View, SafeAreaView, Image, Alert } from 'react-native';
import COLORS from '../constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getAccessToken } from '../services/api/auth';
import UserContext from '../services/context/UserContext';
import { fetchUserByCookie, fetchUserByEmail } from '../services/api/user';
import { getGoogleAccessToken, setGoogleAccessToken, setAPIAccessToken, setAPIResetToken, getAPIAccessToken } from '../services/storage/asyncStorage';
import { validateTokens } from '../utils/accessController';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin({ navigation }) {
  const { setUser } = useContext(UserContext);
  const [accessToken, setAccessToken] = useState(null);
  const [cookies, setCookies] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      '899499604143-nq831c8qd2u72r9h6842ion24rgcj8me.apps.googleusercontent.com',
    iosClientId:
      '899499604143-5oqn70f2r4uu7lp1mbajpkv15ks3p368.apps.googleusercontent.com',
    androidClientId:
      '899499604143-q5b803tsomq5k9tu0vv0fjb0ap1551gm.apps.googleusercontent.com',
    webClientId:
      '899499604143-ps7gl6ktu9796gticni41c10o1evfp2t.apps.googleusercontent.com',
  });

  // On load, try logging in automatically
  useEffect(() => {
    loginHandler();
  }, []);

  const loginHandler = async () => {
    const userAccess = await validateTokens();
    if (userAccess === "Authenticated") {
      getUserData();
    } else if (userAccess === "GoogleAuthenticated") {
      const googleToken = await getGoogleAccessToken();
      setAccessToken(googleToken);
    } else {
      promptAsync();
    }
  }

  useEffect(() => {
    if (response?.type === 'success') {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);

  useEffect(() => {
    if (accessToken != null) {
      setGoogleAccessToken(accessToken);
      const tokenRequest = async () => {
        let serverAccessTokens = await getAccessToken(accessToken);
        setCookies(serverAccessTokens);
        if (serverAccessTokens.accessToken) {
          setAPIAccessToken(serverAccessTokens.accessToken);
        }
        if (serverAccessTokens.refreshToken) {
          setAPIResetToken(serverAccessTokens.refreshToken);
        }
      }
      tokenRequest();
    }
  }, [accessToken]);

  useEffect(() => {
    if (cookies) {
      getUserData();
    }
  }, [cookies]);

  async function getUserData() {
    try {
      let userInfoResponse = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      // Request access token from backend and store it in AsyncStorage for later requests
      let data = await userInfoResponse.json();
      const access_token = await getAPIAccessToken();
      const result = await fetchUserByCookie(access_token);
      if (result) {
        // set user context 
        setUser({
          "access_token": access_token, "curr_group": result.curr_group, "id": result.id,
          "first_name": result.first_name, "last_name": result.last_name, "profile_pic": result.profile_pic,
          "phone_num": result.phone_num
        });
        if (result.curr_group) {
          navigation.navigate('Home');
        } else {
          navigation.navigate('Group');
        }
      } else {
        navigation.navigate('RegisterUser', { user: data });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <View style={styles.wFull}>
          <View style={styles.row}>
            <Text style={styles.welcomeText}>Welcome to CareCoord!</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subWelcomeText}>Let's get started.</Text>
          </View>
          <View style={styles.row}>
            <Image
              style={styles.image}
              source={require('../assets/caretaker.png')}
            />
          </View>
          <FontAwesome.Button
            name='google'
            backgroundColor='#FFFFFF'
            size={35}
            iconStyle={styles.icon}
            onPress={() => {
              loginHandler();
            }}
          >
            <Text style={styles.loginText}>Login with Google</Text>
          </FontAwesome.Button>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Proudly presented by the Caretechers
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.bgColor,
  },
  container: {
    padding: 15,
    width: '100%',
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    opacity: 1,
  },
  subWelcomeText: {
    fontSize: 22,
    color: COLORS.grayLight,
    opacity: 1,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    height: 55,
    paddingVertical: 0,
  },
  loginBtn: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: 55,
    color: COLORS.dark,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gradientForm,
  },
  loginText: {
    color: COLORS.gray,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 30,
  },
  // footer
  footer: {
    position: 'relative',
    bottom: -100,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  footerText: {
    color: COLORS.white,
  },
  signupBtn: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  // utils
  wFull: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mr7: {
    marginRight: 7,
  },
  image: {
    marginBottom: 40,
    width: '100%',
    height: 380,
    resizeMode: 'stretch',
    borderRadius: 10,
  },
  icon: {
    height: 35,
    color: COLORS.bgColor,
  },
});
