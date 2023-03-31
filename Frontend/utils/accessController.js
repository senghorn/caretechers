import { getAPIAccessToken, getGoogleAccessToken, getAPIResetToken, setAPIAccessToken } from '../services/storage/asyncStorage';
import config from '../constants/config';
import axios from 'axios';


/**
 * Returns "authenticated" if the app has valid access tokens and user is registered.
 * Returns "unregistered" if the user has valid access token but not registered.
 * Otherwise, return "unauthenticated".
 */
export async function validateTokens() {
    const serverAccessToken = await getAPIAccessToken();
    const authState = await validateApiToken(serverAccessToken);
    return authState;
}

/**
 * Returns true if google token is valid. Otherwise, false.
 * @param {*} token 
 * @returns 
 */
async function validateGoogleToken(token) {
    let userInfoResponse = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    if (userInfoResponse.status === 401) {
        console.log('Google token expired');
        return false;
    }

    return true;
}


const AUTHENTICATED = "authenticated";
const UNREGISTERED = "unregistered";
const UNAUTHENTICATED = "unauthenticated";
/**
 * Returns 'authenticated' if user is registered and has valid token. Returns 'unregistered' if 
 * token is valid but not registered. Otherwise, returns unauthenticated.
 * @param {*} token 
 * @returns 
 */
async function validateApiToken(token) {
    let connection_string = config.auth_server + '/validate';
    try {
        const response = await axios.post(connection_string, { token: token });
        if (response.data.registered === true) {
            return AUTHENTICATED;
        }
        return UNREGISTERED;
    } catch (error) {
        console.log('validate request error', error);
        return UNAUTHENTICATED;
    }
}
