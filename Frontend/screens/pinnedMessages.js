import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import { Appbar, Avatar, Divider, IconButton } from 'react-native-paper';
import { FetchUsers, UnpinMessage } from '../services/api/messages';
import { Badge } from '@rneui/themed';
import useSWR from 'swr';
import colors from '../constants/colors';
import { getMonthDate } from '../utils/date';
import config from '../constants/config';
import UserContext from '../services/context/UserContext';
import { ActivityIndicator } from 'react-native-paper';


const fetcher = (url, token) => fetch(url, token).then((res) => res.json());

/**
 * Component for displaying pinned messages and allow unpinning messages.
 * 
 * @param {Object} navigation: React component for navigation 
 * @returns 
 */
export default function PinnedMessages({ navigation }) {

    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const { data, isLoading, error, mutate } = useSWR(
        [config.backend_server + '/messages/pin/' + user.curr_group, {
            params: {
                groupId: user.curr_group
            },
            headers: { 'Authorization': 'Bearer ' + user.access_token }
        }],
        ([url, token]) => fetcher(url, token)
    );
    const [users, setUsers] = useState([]);
    const [this_user, setThisUser] = useState(null);

    // handle data receiving
    useEffect(() => {
        if (data && !isLoading) {
            setMessages(data);
        }
    }, [data, isLoading]);

    // Fetch users for displaying messages when user object exists
    useEffect(() => {
        if (user && user.curr_group) {
            const fetchData = async () => {
                await FetchUsers(user, setUsers, setThisUser, user.access_token);
                mutate();
            }
            fetchData();
        }
    }, [user])

    // Handles unpin messages
    const [messageToUnpin, setMessageToUnpin] = useState(null);
    useEffect(() => {
        if (messageToUnpin != null) {
            const unpin = async () => {
                await UnpinMessage(messageToUnpin.id, user.access_token);
            }
            unpin();
            mutate(); // We can instead of fetching data again, remove the unpinned message
            setMessageToUnpin(null);
        }
    }, [messageToUnpin]);


    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.headerContainer}>
                <Appbar.Action
                    icon={'chevron-left'}
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
                <Appbar.Content title={'Pinned Messages'} titleStyle={styles.titleStyle} />
            </Appbar.Header>
            {isLoading ? (
                <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />
            ) : (
                <ScrollView style={styles.messageList}>
                        {messages != null && messages.map((message) => {
                            return (
                                <MessageBox message={message} key={message.id} sender={users[message.sender]} setMessageToUnpin={setMessageToUnpin} />
                            )
                    })}
                </ScrollView>
            )}
        </View>
    );

}

/**
 * Display message and handles unpinning feature
 * @param {object} message to display
 * @param {string} sender email
 * @param {function} sets when unpin button is pressed on this message
 * @returns 
 */
const MessageBox = ({ message, sender, setMessageToUnpin }) => {
    const handleUnpinPressed = () => {
        Alert.alert(
            'Do you want to unpin this message?',
            'Old messages are sometimes hard to find!', // <- this part is optional, you can pass an empty string
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        setMessageToUnpin(message);
                    },
                    style: 'destructive',
                },
            ],
            {
                cancelable: true,
            }
        );
    }

    if (sender == null) {
        return;
    }
    return (
        <View>
            <View style={styles.messageBox}>
                <View style={styles.topRow}>
                    {sender.avatar != '' ?
                        <Avatar.Image size={32} style={styles.avatar} source={{ uri: sender.avatar }} /> :
                        <Avatar.Image size={32} style={styles.avatar} />}
                    <Text style={styles.senderName}>{sender.name}</Text>
                    <Text style={styles.dateTime}>{getMonthDate(message.date_time)}</Text>
                </View>
                <Divider style={{ marginTop: 5 }} />
                <View style={styles.bottomRow}>
                    <MessageContent message={message} />
                </View>
            </View>
            <Badge
                color={colors.black}
                status={'error'}
                value={<IconButton
                    icon="pin"
                    size={15}
                    color={colors.white}
                    onPress={handleUnpinPressed}
                />}
                containerStyle={{ position: 'absolute', top: 10, right: 0 }}
            />
        </View>
    );
}

/**
 * Component for displaying message content
 * @returns 
 */
const MessageContent = ({ message }) => {
    return message ? (
        <View>
            {message?.messageType === "I" ? (
                <View style={styles.pictureContainer}>
                    <Image
                        style={[styles.pictureStyle, { resizeMode: 'contain' }]}
                        source={{ uri: message.content }}
                    />
                </View>

            ) : (
                <Text style={styles.messageContent}>{message.content}</Text>
            )}
        </View>
    ) : null;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1
    },
    titleStyle: {
        fontWeight: '500',
        fontSize: 18,
    },
    headerContainer: {
        backgroundColor: '#fff',
    },
    messageList: {
        backgroundColor: '#fff',
        margin: 10,
    },
    avatar: {
        alignContent: 'center',
        alignSelf: 'center',
        marginRight: 10
    },
    messageBox: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#FFAA',
        borderRadius: 20
    },
    topRow: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
    },
    bottomRow: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center'
    },
    messageContent: {
        fontSize: 14,
        alignSelf: 'center',
        padding: 5

    },
    senderName: {
        fontWeight: '400',
        fontSize: 12
    },
    dateTime: {
        fontSize: 12
    },
    loader: {
        height: '100%',
        transform: [{ translateY: -16 }],
    },
    pictureContainer: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        display: "flex"
    },
    pictureStyle: {
        width: 400,
        height: 400,
    },
});
