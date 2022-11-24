import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { View, Text, StyleSheet, Button, Image } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin() {

    const [accessToken, setAccessToken] = React.useState(null);
    const [userInfo , setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '899499604143-ps7gl6ktu9796gticni41c10o1evfp2t.apps.googleusercontent.com',
    iosClientId: '899499604143-5oqn70f2r4uu7lp1mbajpkv15ks3p368.apps.googleusercontent.com',
    androidClientId: '899499604143-q5b803tsomq5k9tu0vv0fjb0ap1551gm.apps.googleusercontent.com',
    webClientId: '899499604143-ps7gl6ktu9796gticni41c10o1evfp2t.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log(response.authentication.accessToken)
      setAccessToken(response.authentication.accessToken);
      getUserData();
    }
  }, [response]);

  async function getUserData(){
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me",
    {
        headers: {Authorization:`Bearer ${accessToken}`}
    });
    userInfoResponse.json().then(data => {
        setUserInfo(data);
        console.log(data)
    });
  }


  function showUserInfo() {
    if (userInfo) {
      return (
        <View style={styles.userInfo}>
          <Image source={{uri: userInfo.picture}} style={styles.profilePic} />
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
        {showUserInfo()}
        <Text>Messages Page</Text>
        <Button
        disabled={!request}
        title="Login"
        onPress={() => {
            promptAsync();
        }}
        />
    </View>
    
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  