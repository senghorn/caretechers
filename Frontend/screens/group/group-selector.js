import { SafeAreaView, Text, StyleSheet, ScrollView } from 'react-native'
import { useContext, useState, useEffect } from 'react'
import { Appbar } from 'react-native-paper'
import GroupCard from '../../components/group/group-card'
import colors from '../../constants/colors'
import UserContext from '../../services/context/UserContext'

export default function GroupSelector({ navigation }) {
    const { user } = useContext(UserContext);
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
            // Set user data depending on which group was selected
            console.log('group selected', selectedGroup);
            navigation.navigate('Home');
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