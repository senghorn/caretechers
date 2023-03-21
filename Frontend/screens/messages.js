import { StyleSheet, View, ActionSheetIOS } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import React, { useState, useCallback, useEffect, useContext } from 'react';
import COLORS from '../constants/colors';
import Header from '../components/notes/header';
import {
  FetchUsers,
  searchMessage,
  PinMessage,
  fetchMoreMessages
} from '../services/api/messages';
import createSocket from '../components/messages/socket';
import UserContext from '../services/context/UserContext';
import useSWR from 'swr';
import config from '../constants/config';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Messages({ navigation }) {
  const [this_user, setThisUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [displayMessages, setDisplayMessages] = useState([]);
  const [users, setUsers] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [noEalierMessages, setNoEarlierMessages] = useState(false);
  const { user } = useContext(UserContext);

  const onToggleSnackBar = () => setNoEarlierMessages(!noEalierMessages);

  const getBiggestIdOfMessages = () => {
    let result = 0;
    if (messages && messages.length > 0) {
      result = messages[0]._id;
      messages.forEach((message) => {
        if (message._id < result) {
          result = message._id;
        }
      })
    }
    return result;
  }

  const { data, isLoading, error, mutate } = useSWR(
    config.backend_server + '/messages/fetch/' + user.group_id,
    fetcher
  );

  useEffect(() => {
    if (!isLoading && data && users) {
      const formatted = FormatMessagesForChat(users, data);
      setMessages(formatted);
      setDisplayMessages(formatted);
    }
  }, [data, isLoading, users]);

  // Sets up user so GiftedChat recognize who this user is in order
  // to display correctly
  useEffect(() => {
    if (user && !(Object.keys(user).length === 0)) {
      setThisUser({
        _id: user.email,
        name: `${user.first_name} ${user.last_name}`,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.profile_pic,
        groupId: user.group_id,
      });
    }
  }, [user]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const loadEarlier = async () => {
    if (user && users && user.group_id && messages) {
      if (!isLoadingData) {
        setIsLoadingData(true);
        var last_id = getBiggestIdOfMessages();
        const more_messages = await fetchMoreMessages(user.group_id, last_id, users);
        if (more_messages) {
          if (more_messages.length === 0) {
            setNoEarlierMessages(true);
          }
          setMessages(messages.concat(more_messages));
        }
      }
    }
  }

  // Fetch all the users in the group for their profile photos
  useEffect(() => {
    if (this_user) {
      FetchUsers(this_user.groupId, setUsers);
      setSocket(createSocket(this_user));
    }
  }, [this_user]);

  useEffect(() => {
    if (
      searchQuery &&
      searchQuery != '' &&
      user &&
      user.group_id &&
      searchMode
    ) {
      const search = async () => {
        const result = await searchMessage(user.group_id, searchQuery);
        const formatted = FormatMessagesForChat(users, result);
        setDisplayMessages(formatted);
      };
      search();
    } else if (!searchMode) {
      // Display normal messages if searching mode is off
      setDisplayMessages(messages);
    }
  }, [searchQuery, searchMode]);

  useEffect(() => {
    if (!searchMode && messages) {
      setDisplayMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    setIsLoadingData(false);
  }, [displayMessages]);

  useEffect(() => {
    if (socket) {
      socket.connect();
      socket.on('connect_error', (err) => {
        console.log(err.message);
        if (err.message === 'invalid username') {
          console.log('failed to connect to message server');
        }
      });

      socket.on('message', (msg) => {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, msg)
        );
      });

      socket.on('disconnect', (reason) => {
        console.log(reason);
        socket.disconnect();
        if (reason === 'io server disconnect') {
        }
      });

      // Network clean up: This will clean up any necessary connections with server
      return () => {
        socket.disconnect();
        console.log('cleaning up');
      };
    }
  }, [socket]);

  var onMessageSend = useCallback(
    (messages = []) => {
      if (socket) {
        socket.emit('chat', messages);
      }
    },
    [socket]
  );

  const [pinMessage, setPinMessage] = useState(null);

  useEffect(() => {
    if (pinMessage && pinMessage._id && user && user.group_id) {
      PinMessage(pinMessage._id);
      setPinMessage(null);
    }

  }, [pinMessage]);

  const onLongPress = (context, message) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Pin', 'Remove'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          setPinMessage(message);
        } else if (buttonIndex === 2) {
        }
      },
    );

  };

  // Message render bubble
  const renderBubble = (props) => {
    const message_sender_id = props.currentMessage.user._id;
    return (
      <Bubble
        {...props}
        position={message_sender_id == user.email ? 'right' : 'left'}
        wrapperStyle={{
          right: {
            backgroundColor: COLORS.primary,
            marginVertical: 5,
          },
          left: {
            marginVertical: 5,
          },
        }}
      />
    );
  };

  return (

    <View style={styles.container}>
      <Header
        title={'Messages'}
        navigation={navigation}
        pin
        setSearchQuery={setSearchQuery}
        setSearchingMode={setSearchMode}
      />
      <GiftedChat
        renderBubble={renderBubble}
        wrapInSafeArea={false}
        showUserAvatar={true}
        messages={displayMessages}
        renderUsernameOnMessage={true}
        onSend={(messages) => onMessageSend(messages)}
        user={this_user}
        onLongPress={onLongPress}
        onLoadEarlier={loadEarlier}
        loadEarlier={!noEalierMessages}
        infiniteScroll
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0,
    margin: 0,
  },
  textInput: {
    height: 40,
    margin: 12,
    borderWidth: 0.2,
    padding: 10,
    borderRadius: 10,
  },
});

const FormatMessagesForChat = (all_users, messages) => {
  var formatted_messages = [];
  if (all_users) {
    messages.forEach(function (message) {
      formatted_messages.push({
        text: message.content,
        createdAt: message.date_time,
        _id: message.id,
        user: all_users[message.sender] ? all_users[message.sender] : { "_id": "Deleted user", "avatar": "", "name": "Deleted User" },
      });
    });
  }
  return formatted_messages;
};
