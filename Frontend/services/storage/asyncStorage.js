import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../context/UserContext';
import { useContext } from 'react';
import SocketContext from '../context/SocketContext';
/**
 * Stores Google Auth Token in async storage
 * @param {*} token 
 */
export async function setGoogleAccessToken(token) {
    try {
        await AsyncStorage.setItem("google_token", JSON.stringify(token));
    } catch (error) {
        console.log(error);
    }
};

/**
 * Returns google auth token. Null if does not exist.
 */
export async function getGoogleAccessToken() {
    try {
        const savedGoogleToken = await AsyncStorage.getItem("google_token");
        const googleToken = JSON.parse(savedGoogleToken);
        return googleToken;
    } catch (error) {
        console.log(error);
    }
    return null;
};

/**
 * Stores API access token in async storage
 * @param {*} token 
 */
export async function setAPIAccessToken(token) {
    try {
        await AsyncStorage.setItem("api_access_token", JSON.stringify(token));
    } catch (error) {
        console.log(error);
    }
};

/**
 * Returns API access token in async storage
 * @returns 
 */
export async function getAPIAccessToken() {
    try {
        const apiToken = await AsyncStorage.getItem("api_access_token");
        const apiAccessToken = JSON.parse(apiToken);
        return apiAccessToken;
    } catch (error) {
        console.log(error);
    }
    return null;
};

/**
 * Stores token in async storge.
 * @param {*} token 
 */
export async function setAPIResetToken(token) {
    try {
        await AsyncStorage.setItem("api_reset_token", JSON.stringify(token));
    } catch (error) {
        console.log(error);
    }
};

/**
 * returns API reset token from async storage.
 * @returns 
 */
export async function getAPIResetToken() {
    try {
        const resetToken = await AsyncStorage.getItem("api_reset_token");
        const apiResetToken = JSON.parse(resetToken);
        console.log(apiResetToken);
        return apiResetToken;
    } catch (error) {
        console.log(error);
    }
    return null;
};

/**
 * Clears app's async storage
 * @returns 
 */
export async function clearAsyncStorage() {
    try {
        const [socket, setSocket] = useContext(SocketContext);
        const { setUser } = useContext(UserContext);
        setUser({});
        if (socket) {
            socket.disconnect();
        }
        setSocket(null);
        await AsyncStorage.clear();
        return true;
    } catch (error) {
        console.log('storage clear error: ', error)
    }
    return false;
}