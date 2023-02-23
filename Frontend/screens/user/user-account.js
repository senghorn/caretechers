import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Appbar, Avatar, TextInput, Button, Text, ActivityIndicator } from "react-native-paper";
import colors from "../../constants/colors"
import UserContext from "../../services/context/UserContext";
import { useState, useContext, useEffect } from "react";
import { UpdateUserData } from '../../services/api/user';

export default function UserAccount({ navigation, route, newUser }) {

    const { user, setUser } = useContext(UserContext);
    const [profile, setProfile] = useState(require('../../assets/favicon.png'));
    const [firstName, setFirstName] = useState('John');
    const [lastName, setLastName] = useState('Doe')
    const [phone, setPhone] = useState('123-321-3211');
    const [email, setEmail] = useState('johndoe@user.com');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        initData();
    }, [user, newUser]);

    const initData = () => {
        if (user && !newUser) {
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setPhone(user.phone_num);
            setEmail(user.email);
            setProfile({ uri: user.profile_pic });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        if (user && phone.length == 12 && firstName.length > 0 && lastName.length > 0) {
            await (async () => {
                const update = await UpdateUserData(email, firstName, lastName, phone, user.group_id, user.profile_pic);
                if (update) {
                    setUser({
                        "email": user.email, "first_name": firstName,
                        "last_name": lastName, "group_id": user.group_id,
                        "profile_pic": user.profile_pic, "phone_num": phone
                    });
                }
            })();

        } else {
            alert("Make sure your phone number, first and last name are valid.");
        }
        setSaving(false);
    };

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
            <Appbar.Action icon={'arrow-left'} onPress={() => { navigation.goBack(); }} />
            <Appbar.Content title={'Account'} titleStyle={styles.title} />
        </Appbar.Header>
        <View style={styles.profileContainer}>
            <TouchableOpacity>
                <Avatar.Image size={90} source={profile} />
                <Text style={styles.uploadPhotoText}>Change</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
            <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="account" style={styles.iconStyle} size={20} color={colors.orange} />}
                value={firstName}
                style={styles.phone}
                activeOutlineColor={colors.orange}
                outlineColor={colors.darkblue}
                onChangeText={(text) => {
                    setFirstName(text);
                }}
            />
            <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="account" style={styles.iconStyle} size={20} color={colors.orange} />}
                value={lastName}
                style={styles.phone}
                activeOutlineColor={colors.orange}
                outlineColor={colors.darkblue}
                onChangeText={(text) => { setLastName(text); }}
            />
            <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="phone" style={styles.iconStyle} size={20} color={colors.orange} />}
                value={phone}
                style={styles.phone}
                activeOutlineColor={colors.orange}
                outlineColor={colors.darkblue}
                onChangeText={(text) => { formatPhoneNumber(text); }}
                keyboardType='number-pad'
            />
            <TextInput
                mode="outlined"
                left={<TextInput.Icon icon="email" style={styles.iconStyle} size={20} />}
                value={email}
                style={styles.email}
                outlineColor={colors.darkblue}
                activeOutlineColor={colors.orange}
                disabled
            />
        </View>
        {!newUser && (
            <View >
                {saving ? (<ActivityIndicator size="large" color="#2196f3" style={styles.loader} />) : (
                    <View style={styles.buttonRow}>
                        <Button
                            mode='contained'
                            color={colors.yellow}
                            icon='progress-check'
                            style={styles.createButton}
                            labelStyle={styles.createButtonText}
                            onPress={handleSave}
                        >
                            Save
                        </Button>
                        <Button
                            mode='contained'
                            color={colors.gray}
                            icon='cancel'
                            style={styles.createButton}
                            labelStyle={styles.createButtonText}
                            onPress={() => {
                                initData();
                            }}
                        >
                            Cancel
                        </Button>
                    </View>
                )}
            </View>
        )}
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
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    createButton: {
        marginVertical: 32,
        width: '40%',
        alignSelf: 'center',
    },
    createButtonText: {
        fontSize: 14,
    },
    uploadPhotoText: {
        fontSize: 12,
        color: colors.black,
        fontWeight: '400',
        alignSelf: 'center'
    }
});
