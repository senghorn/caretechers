import { StyleSheet, View } from "react-native";
import { Appbar, Avatar, Text, Button } from "react-native-paper";

export default function Settings({ navigation, route }) {
    return (<View>
        <Appbar.Header style={styles.headerContainer}>
            <Appbar.Action icon={'arrow-left'} onPress={() => { navigation.goBack(); }} />
            <Appbar.Content title={'Settings'} titleStyle={styles.title} />
        </Appbar.Header>
        <View style={styles.profileContainer}>
            <View style={styles.leftContainer}>
                <Avatar.Image size={65} source={require('../assets/favicon.png')} style={styles.photo} />
            </View>
            <View style={styles.rightContainer}>
                <Text style={styles.name}>Thomas Edison</Text>
                <Text style={styles.phone}>385-3899-8999</Text>
                <Text style={styles.phone}>Escobar1269@anonymous.com</Text>
            </View>
        </View>
        <View style={styles.settingsContainer}>
            <Button
                mode='contained'
                uppercase={false}
                color='lightgray'
                icon='account-edit'
                style={styles.createButton}
                labelStyle={styles.createButtonText}
                onPress={() => {
                    console.log('Account Edit Pressed');
                }}
            >
                Edit Profile
            </Button>
        </View>
    </View>)
};

const styles = StyleSheet.create({
    headerContainer: {
        flex: 0,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18
    },
    settingsContainer: {
        flexDirection: 'row',
        margin: 10,
    },
    profileContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        margin: 20,
    },
    leftContainer: {
        marginRight: 30,
    },
    rightContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    phone: {
        fontSize: 14,
        color: 'gray',
    },
    photo: {
        backgroundColor: 'lightgray',
    },
    createButton: {
        marginVertical: 18,
        width: '40%',
        alignSelf: 'center',
    },
    createButtonText: {
        fontSize: 14,
    },
});