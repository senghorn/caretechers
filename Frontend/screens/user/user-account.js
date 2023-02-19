import { StyleSheet, View } from "react-native";
import { Appbar, Avatar, TextInput } from "react-native-paper";
import colors from "../constants/colors";
import UserContext from "../services/context/UserContext";
import { useState, useContext, useEffect } from "react";

export default function UserAccount({ navigation, route, newUser }) {

    const user = useContext(UserContext);
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState('../assets/favicon.png');
    const [firstName, setFirstName] = useState('John');
    const [lastName, setLastName] = useState('Doe')
    const [phone, setPhone] = useState('123-321-3211');
    const [email, setEmail] = useState('johndoe@user.com');

    useEffect(() => {
        if (user) {

        }
    }, [user]);

    const formatPhoneNumber = (text) => {
        var cleaned = '';
        var match = text.match(/\d/g);
        if (match) {
            cleaned = match.join('');
            if (cleaned.length > 10) {
                cleaned = cleaned.substring(0, 10);
            }
        }
        if (cleaned.length >= 7) {
            cleaned =
                cleaned.slice(0, 3) +
                '-' +
                cleaned.slice(3, 6) +
                '-' +
                cleaned.slice(6);
        } else if (cleaned.length > 3) {
            cleaned = cleaned.slice(0, 3) + '-' + cleaned.slice(3);
        }
        setPhone(cleaned);
    };

    return (<View style={styles.container}>
        <Appbar.Header style={styles.headerContainer}>
            {!editMode && <Appbar.Action icon={'arrow-left'} onPress={() => { navigation.goBack(); }} />}
            {editMode && <Appbar.Action icon={'close-outline'} onPress={() => { setEditMode(!editMode); }} />}
            <Appbar.Content title={''} titleStyle={styles.title} />
            {!editMode && <Appbar.Action icon={'account-edit'} onPress={() => { setEditMode(!editMode); }} />}
            {editMode && <Appbar.Action icon={'check-outline'} onPress={() => { setEditMode(!editMode); }} />}
        </Appbar.Header>
        <View style={styles.profileContainer}>
            <Avatar.Image size={80} source={require('../assets/favicon.png')} />
        </View>
        <View style={styles.infoContainer}>
            <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="account" style={styles.iconStyle} size={20} />}
                value={firstName}
                style={styles.phone}
                activeOutlineColor={colors.orange}
                outlineColor={colors.darkblue}
                onChangeText={(text) => { setFirstName(text); }}
                disabled={!editMode}
            />
            <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="account" style={styles.iconStyle} size={20} />}
                value={lastName}
                style={styles.phone}
                activeOutlineColor={colors.orange}
                outlineColor={colors.darkblue}
                onChangeText={(text) => { setLastName(text); }}
                disabled={!editMode}
            />
            <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="phone" style={styles.iconStyle} size={20} />}
                value={phone}
                style={styles.phone}
                activeOutlineColor={colors.orange}
                outlineColor={colors.darkblue}
                onChangeText={(text) => { formatPhoneNumber(text); }}
                keyboardType='number-pad'
                disabled={!editMode}
            />
            <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="email" style={styles.iconStyle} size={20} />}
                value={email}
                style={styles.email}
                outlineColor={colors.darkblue}
                activeOutlineColor={colors.orange}
                onChangeText={(text) => { setEmail(text); }}
                disabled
            />
        </View>
    </View>)
};

const styles = StyleSheet.create({
    container: {

    },
    headerContainer: {
        flex: 0,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    profileContainer: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        margin: 20,
    },
    name: {
        fontSize: 20,
        color: colors.black,
        fontWeight: 'bold',
        marginBottom: 10
    },
    phone: {
        fontSize: 16,
        color: 'gray',
        backgroundColor: colors.warmWhite,
        width: '98%',
        justifyContent: 'center'
    },
    email: {
        fontSize: 16,
        color: 'gray',
        backgroundColor: colors.warmWhite,
        width: '98%',
        justifyContent: 'center'
    },
    infoContainer: {
        flexDirection: 'column',
        margin: 10,
        marginLeft: 20,
    },
    iconStyle: {
        paddingRight: 10,
    },
});