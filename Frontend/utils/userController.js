import { fetchUserByCookie } from '../services/api/user';

export async function setUserDataInfo(setUser, token) {
    if (!token) {
        console.log('setUserDataInfo error: No token provided');
        return false;
    }
    const result = await fetchUserByCookie(token);
    if (result) {
        setUser({
            "access_token": token, "curr_group": result.curr_group, "id": result.id,
            "first_name": result.first_name, "last_name": result.last_name, "profile_pic": result.profile_pic,
            "phone_num": result.phone_num, "groups": result.groups
        });
        return true;
    }
    return false;

}