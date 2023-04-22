import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';
import { Avatar } from 'react-native-paper';

/**
 * A reusable component that displays a card representing a group.
 *
 * @param {Function} setSelected - A function that is called when the user presses the card. The selected group is passed as an argument.
 * @param {Object} group - An object that contains information about the group. Must have 'group_id', 'name', and 'password' fields.
 * 
 * @returns A TouchableOpacity component that displays the group's name and logo.
 */
export default function GroupCard({ setSelected, group }) {
    const onTouch = () => {
        setSelected(group);
    }

    const RoleBadge = () => {
        if (group.admin_status === 2) {
            return (
                <Avatar.Image size={34} source={require('../../assets/crown.png')} style={styles.roleBadge} />
            );
        } else if (group.admin_status === 1) {
            return (<Avatar.Image size={34} source={require('../../assets/badge.png')} style={styles.roleBadge} />);
        } else {
            return (<Avatar.Image size={34} source={require('../../assets/circle.png')} style={styles.roleBadge} />)
        }
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onTouch}>
            <View style={styles.content}>
                <View style={styles.logo}>
                    <Avatar.Image size={34} source={require('../../assets/house.jpg')} />
                </View>
                <View style={styles.name}>
                    <Text>{(group.name?.length <= 35) ? group.name : group.name.substr(0, 22) + "..."}</Text>
                </View>
                <View style={styles.role}>
                    <RoleBadge />
                </View>
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginTop: 15,
        borderWidth: 1.2,
        backgroundColor: colors.profileCard,
        borderRadius: 8,
        minWidth: "80%",
        minHeight: 50,
        alignContent: 'center',
        justifyContent: 'center'
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    logo: {
        marginRight: 15,
        flex: 1
    },
    name: {
        alignSelf: 'center',
        flex: 6
    },
    role: {
        flex: 1
    },
    roleBadge: {
        backgroundColor: 'transparent'
    },
})
