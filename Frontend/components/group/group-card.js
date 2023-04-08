import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';
import { Avatar } from 'react-native-paper';

/**
 * 
 * @param { group_logo, name, role} 
 * @returns 
 */
export default function GroupCard({ setSelected, group }) {

    const onTouch = () => {
        // setSelected(group);
        console.log('on pressed');
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onTouch}>
            <View style={styles.content}>
                <View style={styles.logo}>
                    <Avatar.Image size={34} source={require('../../assets/house.jpg')} />
                </View>
                <View style={styles.name}>
                    <Text>Jackson's Fam</Text>
                </View>
                <View style={styles.role}>

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
    },
    logo: {
        marginRight: 15
    },
    name: {

        alignSelf: 'center'
    },
    role: {

    },
})
