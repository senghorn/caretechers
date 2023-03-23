import { getAPIAccessToken, getGoogleAccessToken } from '../services/storage/asyncStorage';


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

async function validateApiToken(token) {
    // TODO: Validate the token with the backend
    return false;
}