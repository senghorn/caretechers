import { SafeAreaView, Text, StyleSheet, ScrollView } from 'react-native'
import { useContext, useState, useEffect } from 'react'
import { Appbar } from 'react-native-paper'
import GroupCard from '../../components/group/group-card'
import colors from '../../constants/colors'
import { changeUserCurrGroup, fetchUserByCookie } from '../../services/api/user'
import UserContext from '../../services/context/UserContext'
import SocketContext from '../../services/context/SocketContext'
import Spinner from 'react-native-loading-spinner-overlay';
import { setUserDataInfo } from '../../utils/userController'
export default function GroupSelector({ navigation }) {
    const { setUser, user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useContext(SocketContext);
    const [groupList, setGroupList] = useState([]);
    const [groups, setGroups] = useState([]);
    useEffect(() => {
        if (user && user.groups) {
            setGroups(user.groups);
        }
    }, [user])

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [navigatedToHome, setNavigatedToHome] = useState(false);

    useEffect(() => {
        if (selectedGroup) {
            const handleSelected = async () => {
                setLoading(true);
                if (selectedGroup.group_id !== user.curr_group) {
                    await changeUserCurrGroup(user.access_token, user.id, selectedGroup.group_id);
                    socket.disconnect();
                    setSocket(null);
                    const result = await setUserDataInfo(setUser, user.access_token);
                    // const result = await fetchUserByCookie(user.access_token);
                    if (result) {
                        setNavigatedToHome(true);
                        navigation.navigate('Home');
                    }
                } else {
                    setNavigatedToHome(true);
                    navigation.navigate('Home');
                }
            }
            handleSelected();
        }
    }, [selectedGroup, navigatedToHome]); // add navigatedToHome as a dependency

    // add another useEffect hook to reset selectedGroup to null when navigatedToHome is true
    useEffect(() => {
        if (navigatedToHome) {
            setSelectedGroup(null);
            setLoading(false);
            setNavigatedToHome(false);
        }
    }, [navigatedToHome]);

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
            <Spinner
                color='#add8e6'
                visible={loading}
                textStyle={styles.spinnerTextStyle}
                size={'large'}
            />
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