import { StyleSheet, View, ActionSheetIOS } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { ActivityIndicator, Button, IconButton } from 'react-native-paper';
import React, { useState, useCallback, useEffect, useContext } from 'react';
import COLORS from '../constants/colors';
import Header from '../components/notes/header';
import {
  FetchUsers,
  searchMessage,
  PinMessage,
  fetchMoreMessages
} from '../services/api/messages';
import UserContext from '../services/context/UserContext';
import useSWR from 'swr';
import config from '../constants/config';
import SocketContext from '../services/context/SocketContext';
import uploadImage from '../services/s3/uploadImage';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';

const fetcher = (url, token) => fetch(url, token).then((res) => res.json());

export default function Messages({ navigation }) {
  const [this_user, setThisUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [displayMessages, setDisplayMessages] = useState([]);
  const [users, setUsers] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [noEalierMessages, setNoEarlierMessages] = useState(false);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useContext(SocketContext);
  const [imageUploading, setImageUploading] = useState(false);


  const getSmallestMessageId = () => {
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
    [config.backend_server + '/messages/fetch/' + user.curr_group,
      {
        headers: { 'Authorization': 'Bearer ' + user.access_token }
      }],
    ([url, token]) => fetcher(url, token)
  );

  useEffect(() => {
    if (!isLoading && data && users) {
      const formatted = FormatMessagesForChat(users, data);
      setMessages(formatted);
      setDisplayMessages(formatted);
    }
    if (!isLoading) {
      setLoading(false);
    }
  }, [data, isLoading, users]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const loadEarlier = async () => {
    if (user && users && user.curr_group && messages) {
      if (!isLoadingData) {
        setIsLoadingData(true);
        var last_id = getSmallestMessageId();
        const more_messages = await fetchMoreMessages(user.curr_group, last_id, users, user.access_token);
        if (more_messages) {
          if (more_messages.length === 0) {
            setNoEarlierMessages(true);
          }
          setMessages(messages.concat(more_messages));
        }
      }
    }
  }

  const addImage = async (isCamera = false) => {
    setImageUploading(true);
    const result = isCamera
      ? await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        base64: true,
      })
      : await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        base64: true,
      });
    if (!result.canceled) {
      try {
        const imageUrl = await uploadImage(result.assets[0].base64);
        const imageData = [{
          text: imageUrl,
          messageType: 'I'
        }];
        onMessageSend(imageData);
      } catch (error) {
        console.log(error);
      } finally {
        setImageUploading(false);
      }
    } else setImageUploading(false);
  };

  // Fetch all the users in the group for their profile photos
  useEffect(() => {
    if (user) {
      FetchUsers(user, setUsers, setThisUser, user.access_token);
    }
  }, [user]);

  useEffect(() => {
    if (
      searchQuery &&
      searchQuery != '' &&
      user &&
      user.curr_group &&
      searchMode
    ) {
      const search = async () => {
        const result = await searchMessage(user.curr_group, searchQuery, user.access_token);
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
    if (socket && users) {
      socket.on('message', (message) => {
        const msg = {
          text: message.messageType === "I" ? "" : message.content,
          createdAt: message.date_time,
          _id: message.id,
          messageType: message.messageType === "I" ? "image" : "text",
          image: message.messageType === "I" ? message.content : null,
          user: users[message.sender] ? users[message.sender] :
            { "_id": "Deleted user", "avatar": "", "name": "Deleted User" },
        }
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, msg)
        );
      });
    }
  }, [socket, users])

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
    if (pinMessage && pinMessage._id && user && user.curr_group) {
      PinMessage(pinMessage._id, user.access_token);
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

  const CameraButton = () => {
    return (
      <IconButton
        icon="image-plus"
        size={25}
        onPress={() => addImage(true)}
      />
    )
  }

  // Message render bubble
  const renderBubble = (props) => {
    const message_sender_id = props.currentMessage.user._id;
    return (
      <Bubble
        {...props}
        position={message_sender_id == this_user._id ? 'right' : 'left'}
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
      {loading && <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />}
      <GiftedChat
        renderActions={CameraButton}
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
  loader: {
    height: '100%',
    transform: [{ translateY: -16 }],
  },
});

const FormatMessagesForChat = (all_users, messages) => {
  var formatted_messages = [];
  if (all_users) {
    messages.forEach(function (message) {
      formatted_messages.push({
        text: message.messageType === "I" ? "" : message.content,
        createdAt: message.date_time,
        _id: message.id,
        messageType: message.messageType === "I" ? "image" : "text",
        image: message.messageType === "I" ? message.content : null,
        user: all_users[message.sender] ? all_users[message.sender] : { "_id": "Deleted user", "avatar": "", "name": "Deleted User" },
      });
    });
  }
  return formatted_messages;
};
