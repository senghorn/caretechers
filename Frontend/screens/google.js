import { useEffect, useState, useContext, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { StyleSheet, Text, View, SafeAreaView, Image, Alert } from 'react-native';
import COLORS from '../constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getAccessToken } from '../services/api/auth';
import UserContext from '../services/context/UserContext';
import { setAPIAccessToken, setAPIResetToken, getAPIAccessToken, clearAsyncStorage } from '../services/storage/asyncStorage';
import { validateTokens } from '../utils/accessController';
import Spinner from 'react-native-loading-spinner-overlay';
import { setUserDataInfo } from '../utils/userController';
import InviteLinkContext from '../services/context/InviteLinkContext';

WebBrowser.maybeCompleteAuthSession();

/**
 * Login screen component that allow users to login and navigate to home screen on successful attempt.
 * @param {Object} navigation: react component for navigation 
 * @returns 
 */
export default function GoogleLogin({ navigation }) {
  const { user, setUser } = useContext(UserContext);
  const [accessToken, setAccessToken] = useState(null);
  const [cookies, setCookies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userDataReceived, setUserDataReceived] = useState(false);
  const inviteLink = useContext(InviteLinkContext);
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
  }, [promptAsync]);

  // Handles when user clicks on login
  const loginHandler = useCallback(async () => {
    const userAccess = await validateTokens();
    if (userAccess === "authenticated") {
      AuthenticatedUserHandler();
    }
    else {
      promptAsync();
    }
  }, [promptAsync])

  // Called when google login prompt responds
  useEffect(() => {
    if (response?.type === 'success') {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);


  // Runs when google access token is set
  useEffect(() => {
    if (accessToken != null) {
      const tokenRequest = async () => {
        // Sends google token to backend and try to get access token
        let serverAccessTokens = await getAccessToken(accessToken);
        if (serverAccessTokens) {
          if (serverAccessTokens.registered) {
            if (serverAccessTokens.accessToken) {
              await setAPIAccessToken(serverAccessTokens.accessToken);
            }
            if (serverAccessTokens.refreshToken) {
              await setAPIResetToken(serverAccessTokens.refreshToken);
            }
            setCookies(serverAccessTokens);
          } else {
            let userInfoResponse = await fetch(
              'https://www.googleapis.com/userinfo/v2/me',
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
            let data = await userInfoResponse.json();
            setLoading(false);
            navigation.navigate('RegisterUser', { googleData: data, googleToken: accessToken });
          }
        }
        else {
          setLoading(false);
          console.log('Cannot get access token');
        }
      }
      tokenRequest();
    }
  }, [accessToken]);

  useEffect(() => {
    if (cookies) {
      AuthenticatedUserHandler();
    }
  }, [cookies]);

  // Handles the effect from {user} changes. Navigate to appropriate pages
  useEffect(() => {
    if (userDataReceived) {
      setLoading(false);
      if (user.curr_group) {
        navigation.navigate('Home');
      } else if (inviteLink) {
        navigation.navigate('Group');
      }
      else {
        navigation.navigate('GroupSelector');
      }
    }
  }, [userDataReceived, user]);

  // Handler that fetch and set user data after google auth
  async function AuthenticatedUserHandler() {
    try {
      const access_token = await getAPIAccessToken();
      const result = await setUserDataInfo(setUser, access_token);
      if (result) {
        console.log('setting user data to be received');
        setUserDataReceived(true);
      } else {
        setLoading(false);
        console.log('Fetch user data error while trying to retrieve user info.');
      }
    } catch (error) {
      console.log('get user data error:', error);
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <Spinner
          color='#add8e6'
          visible={loading}
          textStyle={styles.spinnerTextStyle}
          size={'large'}
        />
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
            onPress={async () => {
              setLoading(true);
              await loginHandler();
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
