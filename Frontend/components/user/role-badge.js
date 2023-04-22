import { Avatar } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default function RoleBadge({ group }) {
    if (group?.admin_status === 2) {
        return <Avatar.Image size={26} source={require('../../assets/crown.png')} style={styles.roleBadge} />;
    } else if (group?.admin_status === 1) {
        return <Avatar.Image size={26} source={require('../../assets/badge.png')} style={styles.roleBadge} />;
    } else {
        return <Avatar.Image size={26} source={require('../../assets/circle.png')} style={styles.roleBadge} />;
    }
};

const styles = StyleSheet.create({
    roleBadge: {
        backgroundColor: 'transparent',
        flex: 1
    },
})