import { StyleSheet, View, ScrollView } from "react-native";
import { useState, useContext, useEffect } from "react";
import { Appbar, Avatar, Text, Button, Switch } from "react-native-paper";
import { AntDesign } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import UserContext from "../services/context/UserContext";
import colors from "../constants/colors";

export default function Settings({ navigation, route }) {
    const [notificationOn, setNotificationOn] = useState(false);
    const [darkOn, setDarkOn] = useState(false);
    const [username, setUsername] = useState('John Doe');
    const [phone, setPhone] = useState('123-321-1234');
    const [email, setEmail] = useState('johndoe@fakemail.com');
    const [photo, setPhoto] = useState(require('../assets/favicon.png'));

    const {user} = useContext(UserContext);
    useEffect(() => {
        if (user) {
            setUsername(user.first_name + " " + user.last_name);
            setPhone(user.phone_num);
            setEmail(user.email);
            setPhoto({ uri: user.profile_pic });
        }
    }, [user]);

    return (<View>
        <Appbar.Header style={styles.headerContainer}>
            <Appbar.Action icon={'arrow-left'} onPress={() => { navigation.goBack(); }} />
            <Appbar.Content title={'Settings'} titleStyle={styles.title} />
        </Appbar.Header>
        <View style={styles.topHalf}>
            <View style={styles.profileContainer}>
                <View style={styles.leftContainer}>
                    <Avatar.Image size={65} source={photo} style={styles.photo} />
                </View>
                <View style={styles.rightContainer}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name}>{username}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <AntDesign name="phone" size={20} color={colors.orange} style={styles.infoIcon} />
                        <Text style={styles.phone}>{phone}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <AntDesign name="mail" size={20} color={colors.orange} style={styles.infoIcon} />
                        <Text style={styles.phone}>{email}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.settingsContainer}>
                <Button
                    mode='contained'
                    uppercase={false}
                    color={'lightgray'}
                    icon='account-edit'
                    style={styles.editButton}
                    labelStyle={styles.editButtonText}
                    onPress={() => {
                        navigation.navigate('UserAccount');
                    }}
                >
                    Edit Profile
                </Button>
                <Button
                    mode='contained'
                    uppercase={false}
                    color={'lightgray'}
                    icon='account-group'
                    style={styles.editButton}
                    labelStyle={styles.editButtonText}
                    onPress={() => {
                        console.log('Account Edit Pressed');
                    }}
                >
                    Group Settings
                </Button>
            </View>
        </View>
        <ScrollView>
            <View style={styles.switchList}>
                <View style={styles.switchItem}>
                    <View style={styles.switchLabel}>
                        {notificationOn && <Ionicons name="notifications" size={26} />}
                        {!notificationOn && <Ionicons name="notifications-off" size={26} />}
                        <Text style={styles.textLabel}>Notification</Text>
                    </View>
                    <View style={styles.switchLabel}>
                        <Text style={styles.switchValue}>{notificationOn ? 'On' : 'Off'}</Text>
                        <Switch color={colors.orange} value={notificationOn} onValueChange={() => { setNotificationOn(!notificationOn); }} />
                    </View>
                </View>
                <View style={styles.switchItem}>
                    <View style={styles.switchLabel}>
                        {darkOn && <Ionicons name="moon" size={26} />}
                        {!darkOn && <Ionicons name="ios-sunny" size={26} />}
                        <Text style={styles.textLabel}>Dark Mode</Text>
                    </View>
                    <View style={styles.switchLabel}>
                        <Text style={styles.switchValue}>{darkOn ? 'On' : 'Off'}</Text>
                        <Switch color={colors.orange} value={darkOn} onValueChange={() => { setDarkOn(!darkOn); }} />
                    </View>
                </View>
            </View>
            <Button
                mode='contained'
                uppercase={true}
                color={colors.pinkishRed}
                icon='logout'
                style={styles.logout}
                labelStyle={styles.logoutButtonText}
                onPress={() => {
                    console.log('Log out pressed');
                }}
            >
                Logout
            </Button>
        </ScrollView>
    </View>)
};

const styles = StyleSheet.create({
    headerContainer: {
        flex: 0,
        backgroundColor: '#fff',
    },
    topHalf: {
        paddingTop: 10,
        backgroundColor: colors.profileCard,
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30
    },
    title: {
        fontSize: 18
    },
    settingsContainer: {
        flexDirection: 'row',
        margin: 10,
        justifyContent: 'space-evenly',
        marginTop: 30,
    },
    profileContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20
    },
    leftContainer: {
        width: "40%",
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContainer: {
        flex: 1,
        display: 'flex',
    },
    nameRow: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',

    },
    infoIcon: {
        marginRight: 15,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.black
    },
    phone: {
        fontSize: 14,
        color: 'gray',
        flexWrap: 'wrap'
    },
    photo: {
        backgroundColor: 'lightgray',
    },
    editButton: {
        marginVertical: 18,
        width: '45%',
        alignSelf: 'center',
    },
    editButtonText: {
        fontSize: 14,
    },
    logoutButtonText: {
        fontSize: 14,
    },
    logout: {
        marginTop: "50%",
        height: 50,
        alignContent: 'center',
        justifyContent: 'center',
        margin: 10
    },
    switchList: {
        alignContent: 'center',
        margin: 20
    },
    switchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',
        margin: 10
    },
    textLabel: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    switchLabel: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    switchValue: {
        marginRight: 5,
        fontSize: 12,
        color: colors.gray
    }
});