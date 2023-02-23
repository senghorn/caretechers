import { StyleSheet, View } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import React, { useState, useCallback, useEffect, useContext } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import COLORS from '../constants/colors';
import Header from '../components/notes/header';
import { FetchMessages, FetchUsers } from '../services/api/messages';
import createSocket from '../components/messages/socket';
import UserContext from '../services/context/UserContext';

export default function Messages({ navigation }) {
  const [this_user, setThisUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user && !(Object.keys(user).length === 0)) {
      setThisUser({
        _id: user.email,
        name: user.first_name + user.last_name,
        avatar: user.profile_pic,
        groupId: user.group_id,
      });
    }
  }, [user]);

  useEffect(() => {
    if (this_user) {
      FetchUsers(this_user.groupId, setUsers);
      setSocket(createSocket(this_user));
    }
  }, [this_user]);

  useEffect(() => {
    if (users != null && this_user != null) {
      FetchMessages(this_user.groupId, null, setMessages, users);
    }
  }, [users]);

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
        setMessages((previousMessages) => GiftedChat.append(previousMessages, msg));
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

  // Message render bubble
  const renderBubble = (props) => {
    const message_sender_id = props.currentMessage.user._id;
    return (
      <Bubble
        {...props}
        position={message_sender_id == user.email ? 'right' : 'left'}
        wrapperStyle={{
          right: {
            backgroundColor: COLORS.orange,
            marginVertical: 5,
          },
          left: {
            backgroundColor: COLORS.grayLight,
            marginVertical: 5,
          },
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header title={"Message"} navigation={navigation} />
      <GiftedChat
        renderBubble={renderBubble}
        showUserAvatar={true}
        messages={messages}
        renderUsernameOnMessage={true}
        onSend={(messages) => onMessageSend(messages)}
        user={this_user}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textInput: {
    height: 40,
    margin: 12,
    borderWidth: 0.2,
    padding: 10,
    borderRadius: 10,
  },
});