import { View, StyleSheet } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import * as ImagePicker from "expo-image-picker";
import { Divider } from "react-native-paper";
import React, { useState, useCallback, useEffect, useContext } from "react";
import COLORS from "../constants/colors";
import TopBar from "../components/messages/top-bar";
import { FetchMessages, FetchUsers } from "../services/api/messages";
import createSocket from "../components/messages/socket";
import UserContext from "../services/context/UserContext";

export default function Messages({ route, navigation }) {
  // TODO:Need to get rid of this user
  const { user } = route.params;
  const [this_user, setThisUser] = useState(null);
  var socket = null;
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState(null);

  const user_i = useContext(UserContext);
  useEffect(() => {
    if (user_i) {
      setThisUser({
        _id: user["user"].email,
        name: user["user"].name,
        avatar: user["user"].picture,
        groupId: user_i.group_id,
      });
    }
  }, [user_i]);

  useEffect(() => {
    if (this_user) {
      FetchUsers(this_user.groupId, setUsers);
      socket = createSocket(this_user);
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
      socket.on("connect_error", (err) => {
        console.log(err.message);
        if (err.message === "invalid username") {
          console.log("failed to connect to message server");
        }
      });

      socket.on("message", (msg) => {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, msg)
        );
      });

      socket.on("disconnect", (reason) => {
        console.log(reason);
        socket.disconnect();
        if (reason === "io server disconnect") {
        }
      });

      // Network clean up: This will clean up any necessary connections with server
      return () => {
        socket.disconnect();
        console.log("cleaning up");
      };
    }
  }, [socket]);

  var onMessageSend = useCallback((messages = []) => {
    // Socket is always null
    console.log(socket);
    if (socket) {
      socket.emit("chat", messages);
    }
  }, []);

  // Message render bubble
  const renderBubble = (props) => {
    const message_sender_id = props.currentMessage.user._id;
    return (
      <Bubble
        {...props}
        position={message_sender_id == user["user"].email ? "right" : "left"}
        wrapperStyle={{
          right: {
            backgroundColor: COLORS.warning,
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
      <TopBar />
      <Divider style={styles.divider} />
      <GiftedChat
        renderBubble={renderBubble}
        showUserAvatar={true}
        messages={messages}
        renderUsernameOnMessage={true}
        onSend={(messages) => onMessageSend(messages)}
        user={this_user}
        textInputStyle={styles.textInput}
        minComposerHeight={40}
        minInputToolbarHeight={60}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  textInput: {
    height: 40,
    margin: 12,
    borderWidth: 0.2,
    padding: 10,
    borderRadius: 10,
  },
  divider: {},
});

// const [hasGalPermission, setGalPermission] = useState(null);
//   (async () => {
//   const galleryStatus = await ImagePicker.requestCameraPermissionsAsync();
//   setGalPermission(galleryStatus.status === "granted");
// })();

// Handles image selection
// const handleImageSelection = async () => {
//   let result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     allowsEditing: true,
//     aspect: [4, 3],
//     quality: 1,
//   });

//   result = result.assets;
//   imgValues = result[0];
//   const imageMessage = {
//     user: user[0],
//     createdAt: Date.now(),
//     _id: uuidv4(),
//     messageType: "image",
//     image: imgValues["uri"],
//   };
//   console.log(imageMessage);
// };
