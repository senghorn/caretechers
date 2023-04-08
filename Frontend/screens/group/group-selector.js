import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native'
import { Appbar } from 'react-native-paper'
import GroupCard from '../../components/group/group-card'
import colors from '../../constants/colors'

export default function GroupSelector({ navigation }) {
    return (
        <SafeAreaView style={styles.container} >
            <Appbar style={styles.headerContainer}>
                <Appbar.Content title="Care Groups" titleStyle={styles.title} />
                <Appbar.Action icon="plus" onPress={() => navigation.navigate("Group")} style={styles.joinGroupButton} />
            </Appbar>
            <Text style={styles.welcomeMessage}>Select a group or join a new one!</Text>
            <ScrollView style={styles.groupList}>
                <GroupCard />
            </ScrollView>
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
        marginTop: 40
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