import config from '../../constants/config';
import axios from 'axios';

/**
 * Given a google access token, it sends a login request and returns back cookies.
 * If login fails, it returns null.
 * @param {String} token | Google access token
 * @returns 
 */
export async function getAccessToken(token) {
    try {
        let connection_string =
            config.auth_server + '/login';
        // attache the token to the request body
        return await axios
            .post(connection_string, {
                token: token
            })
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log('login request error', error);
                return null;
            });
    } catch (error) {
        console.log('login in error', error.message);
        return null;
    }
}

/**
 * Given a reset token, returns back an access token.
 * @param {string} token 
 */
export async function regenerateAccessToken(token) {
    try {
        let connection_string =
            config.auth_server + '/token';
        // attache the token to the request body
        return await axios
            .post(connection_string, {
                token: token
            })
            .then(function (response) {
                return response.data.accessToken;
            })
            .catch(function (error) {
                console.log('login request error', error);
                return null;
            });
    } catch (error) {
        console.log('login in error', error.message);
        return null;
    }
}
