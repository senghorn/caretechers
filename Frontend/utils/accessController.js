import { getAPIAccessToken, getGoogleAccessToken, getAPIResetToken, setAPIAccessToken } from '../services/storage/asyncStorage';
import config from '../constants/config';
import axios from 'axios';
import { regenerateAccessToken } from '../services/api/auth';
/**
 * Returns "Authenticated" if the app has valid access tokens to backend.
 * Returns "GoogleAuthenticated" if the only has valid Google Access Token.
 * Otherwise, return "Unauthenticated"
 */
export async function validateTokens() {
    const googleToken = await getGoogleAccessToken();
    if (googleToken) {
        const accessToken = await getAPIAccessToken();
        if (accessToken) {
            const valid = await validateApiToken(accessToken);
            if (valid) {
                return "Authenticated";
            } else {
                const resetToken = await getAPIResetToken();
                const newToken = await regenerateAccessToken(resetToken);
                if (newToken) {
                    setAPIAccessToken(newToken);
                    return "Authenticated";
                }

            }
        } else {
            const valid = await validateGoogleToken(googleToken);
            if (valid) {
                return "GoogleAuthenticated"
            }
        }
    } else {
        return "Unauthenticated";;
    }

    return "Unauthenticated";
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

/**
 * Returns true if Api token is valid. Otherwise, false.
 * @param {*} token 
 * @returns 
 */
async function validateApiToken(token) {
    let connection_string =
        config.auth_server + '/validate';
    return await axios
        .post(connection_string, {
            token: token
        })
        .then(function (response) {
            return true;
        })
        .catch(function (error) {
            console.log('validate request error', error);
            return false;
        });
}