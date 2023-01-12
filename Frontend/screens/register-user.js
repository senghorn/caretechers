import { useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, TextInput, StyleSheet, View } from 'react-native'
import { Divider } from "react-native-paper";
import colors from '../constants/colors';


export default function Inputs({ route, navigation }) {

    const { user } = route.params;
    const [state, setState] = useState({});
    state['email'] = user['email'];
    state['first'] = user['given_name'];
    state['last'] = user['family_name'];
    handleFirstName = (text) => {
        state['first'] = text;
    }
    handleLastName = (text) => {
        state['last'] = text;
    }
    handlePhone = (text) => {
        state['phone'] = text;
    }

    submit = () => {
        if (state['first'] == undefined) {
            alert("Please make to enter your first name");
        }
        else if (state['last'] == undefined) {
            alert("Please make to enter your last name");
        }
        else if (state['phone'] == undefined) {
            alert("Please make to enter your phone number");
        }
        else {
            alert("Register info \n" + "First name: " + state['first'] + "\n" + "Last name: " + state['last'] + "\n"
                + "Phone: " + state['phone'] + "\n" + "Email: " + state['email'] + "\n");
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Register with CareCoord!</Text>
            <Text style={styles.subtext}>Please fill up the information below</Text>
            <Divider />

            <Text style={styles.input}>Email: {state['email']}</Text>

            <View style={styles.nameRow}>
                <TextInput style={styles.lastName}
                    underlineColorAndroid="transparent"
                    placeholder="First Name"
                    autoCapitalize="none"
                    onChangeText={handleFirstName} />
                <TextInput style={styles.firstName}
                    underlineColorAndroid="transparent"
                    placeholder="Last Name"
                    autoCapitalize="none"
                    onChangeText={handleLastName} />
            </View>
            <TextInput style={styles.input}
                underlineColorAndroid="transparent"
                placeholder="Phone Number"
                autoCapitalize="none"
                onChangeText={handlePhone} />

            <TouchableOpacity
                style={styles.submitButton}
                onPress={submit}>
                <Text style={styles.submitButtonText}> Register </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )

}



const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        marginTop: 100,
    },
    nameRow: {
        margin: 12,
        flexDirection: 'row',
    },
    firstName: {
        height: 40,
        padding: 10,
        flex: 1,
    },
    lastName: {
        height: 40,
        padding: 10,
        flex: 1,
    },
    input: {
        height: 40,
        margin: 12,
        padding: 10,
    },
    submitButton: {
        backgroundColor: colors.primary,
        padding: 10,
        margin: 15,
        height: 40,
        width: 100,
        alignSelf: 'center',
        borderRadius: 20,
        alignContent: 'center',
    },
    submitButtonText: {
        color: 'white',
        alignSelf: 'center',
    },
    title: {
        fontWeight: "500",
        fontSize: 20,
        margin: 15,
    },
    subtext: {
        marginLeft: 15,
        fontWeight: "100",
        padding: 5
    }
})