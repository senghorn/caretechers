import config from '../../constants/config';
import axios from 'axios';

/**
 * Sends a login request with the given google access token and returns back cookies.
 * If login fails, returns null.
 * @param {string} token - Google access token
 * @returns {Promise} - A promise that resolves with the cookies or null if login fails.
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
 * Given a reset token, returns an access token.
 * @param {string} token - Reset token
 * @returns {Promise} - A promise that resolves with the access token or null if the request fails.
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
