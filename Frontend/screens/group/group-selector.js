import { SafeAreaView, Text, StyleSheet, ScrollView } from 'react-native'
import { useContext, useState, useEffect } from 'react'
import { Appbar } from 'react-native-paper'
import GroupCard from '../../components/group/group-card'
import colors from '../../constants/colors'
import { changeUserCurrGroup, fetchUserByCookie } from '../../services/api/user'
import UserContext from '../../services/context/UserContext'
import SocketContext from '../../services/context/SocketContext'

export default function GroupSelector({ navigation }) {
    const { setUser, user } = useContext(UserContext);
    const [socket, setSocket] = useContext(SocketContext);
    const [groupList, setGroupList] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([]);
    useEffect(() => {
        if (user && user.groups) {
            setGroups(user.groups);
        }
    }, [user])

    useEffect(() => {
        if (selectedGroup) {
            const handleSelected = async () => {
                await changeUserCurrGroup(user.access_token, user.id, selectedGroup.group_id);
                socket.disconnect();
                setSocket(null);
                const result = await fetchUserByCookie(user.access_token);
                if (result) {
                    setUser({
                        "access_token": user.access_token, "curr_group": result.curr_group, "id": result.id,
                        "first_name": result.first_name, "last_name": result.last_name, "profile_pic": result.profile_pic,
                        "phone_num": result.phone_num, "groups": result.groups
                    });
                    navigation.navigate('Home');
                }
            }
            handleSelected();
        }
    }, [selectedGroup]);

    useEffect(() => {
        if (groups) {
            setGroupList(
                <ScrollView style={styles.groupList}>
                    {groups.map((group) => {
                        return <GroupCard group={group} key={group.group_id} setSelected={setSelectedGroup} />
                    })}
                </ScrollView>
            );
        }
    }, [groups])

    return (
        <SafeAreaView style={styles.container} >
            <Appbar style={styles.headerContainer}>
                <Appbar.Content title="Care Groups" titleStyle={styles.title} />
                <Appbar.Action icon="plus" onPress={() => navigation.navigate("Group")} style={styles.joinGroupButton} />
            </Appbar>
            <Text style={styles.welcomeMessage}>Select a group or join a new one!</Text>
            {groupList}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    welcomeMessage: {
        fontSize: 22,
        marginTop: 20
    },
    title: {
        fontSize: 18,

    },
    groupList: {
        marginTop: 20
    },
    headerContainer: {
        backgroundColor: 'transparent',
        flex: 0,
        width: '100%',
    },
    joinGroupButton: {
        backgroundColor: colors.yellow,
    }
})