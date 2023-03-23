import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setGoogleAccessToken(token) {
    try {
        await AsyncStorage.setItem("google_token", JSON.stringify(token));
    } catch (error) {
        console.log(error);
    }
};

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

export async function setAPIAccessToken(token) {
    try {
        await AsyncStorage.setItem("api_access_token", JSON.stringify(token));
    } catch (error) {
        console.log(error);
    }
};

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

export async function setAPIResetToken(token) {
    try {
        await AsyncStorage.setItem("api_reset_token", JSON.stringify(token));
    } catch (error) {
        console.log(error);
    }
};

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