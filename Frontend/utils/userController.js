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
/**
 * Returns the admin status
 * @param {User Object} user : contains the information of groups they belong to and their roles
 * @returns 
 */
export function getUserRole(user) {
    let status = 0;
    const groups = user.groups;
    if (groups) {
        groups.forEach(group => {
            if (group.group_id === user.curr_group) {
                status = group.admin_status;
                return;
            }
        });
    }
    return status;
}