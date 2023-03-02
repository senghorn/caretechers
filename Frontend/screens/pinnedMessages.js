import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import { Appbar, Avatar, Divider } from 'react-native-paper';
import { FetchUsers, UnpinMessage } from '../services/api/messages';
import useSWR from 'swr';
import colors from '../constants/colors';
import { getMonthDate } from '../utils/date';
import config from '../constants/config';
import UserContext from '../services/context/UserContext';
import { ActivityIndicator } from 'react-native-paper';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function PinnedMessages({ navigation }) {

    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const { data, isLoading, error, mutate } = useSWR(
        config.backend_server + '/messages/pin/' + user.group_id,
        fetcher
    );
    const [users, setUsers] = useState([]);
    useEffect(() => {
        if (data && !isLoading) {
            setMessages(data);
        }
    }, [data, isLoading]);

    useEffect(() => {
        if (user && user.group_id) {
            const fetchData = async () => {
                await FetchUsers(user.group_id, setUsers);
                mutate();
            }
            fetchData();
        }
    }, [user])

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
            {isLoading && users && messages ? (
                <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />
            ) : (
                <ScrollView style={styles.messageList}>
                    {messages.map((message) => {
                        return <MessageBox message={message} key={message.id} sender={users[message.sender]} />
                    })}
                </ScrollView>
            )}
        </View>
    );

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
    messageOuterBox: {
        marginTop: 10,
        padding: 10,
        alignContent: 'center',
        alignSelf: 'center',
        borderRadius: '20',
        flexDirection: 'column',
        width: '100%',
    }
    ,
    avatar: {
        alignContent: 'center',
        alignSelf: 'center',
        marginRight: 10
    },
    messageContent: {
        justifyContent: 'center'
    },
    contentText: {
        fontSize: '16',
        fontWeight: '400'
    },
    messageBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    messageInfo: {
        flexDirection: 'column',
        marginBottom: 15,
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    name: {
        fontSize: 15,
        fontWeight: '500'
    },
    box: {
        flexDirection: 'row',
    }
});

const MessageBox = ({ message, sender }) => {
    if (sender == null) {
        return;
    }
    return (
        <View style={styles.box}>
            <Avatar.Image size={32} style={styles.avatar} source={{ uri: sender.avatar }} />
            <View style={styles.messageOuterBox}>
                <View style={styles.messageInfo}>
                    <Text style={styles.name}>
                        {sender.name}
                    </Text>
                    <Text style={{ fontSize: 10 }}>
                        {getMonthDate(message.date_time)}
                    </Text>
                    <Text style={styles.contentText}>
                        {message.content}
                    </Text>
                </View>
                <View style={styles.messageBox}>
                    <View style={styles.messageContent}>

                    </View>
                </View>
                <Divider />
            </View>
        </View>
    );
}