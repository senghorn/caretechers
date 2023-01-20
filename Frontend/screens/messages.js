import { View, StyleSheet } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import * as ImagePicker from "expo-image-picker";
import { Divider } from "react-native-paper";
import React, { useState, useCallback, useEffect } from "react";
import COLORS from "../constants/colors";
import TopBar from "../components/topBar";
import socket from "../components/messages/socket";

const users = [
  {
    _id: 0,
    name: "Annonymous",
    avatar: "https://source.unsplash.com/140x140/?person",
  },
  {
    _id: 1,
    name: "Brynnli Borrowman",
    avatar: "https://source.unsplash.com/140x140/?wolf",
  },
  {
    _id: 2,
    name: "Ben Hatch",
    avatar: "https://source.unsplash.com/140x140/?racoon",
  },
  {
    _id: 3,
    name: "Seng Rith",
    avatar: "https://source.unsplash.com/140x140/?fox",
  },
  {
    _id: 4,
    name: "Aaron Heo",
    avatar: "https://source.unsplash.com/140x140/?cat",
  },
];
// For the testing purposes, you should probably use https://github.com/uuidjs/uuid
const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === "x" ? r : (r % 4) + 8;
    return v.toString(16);
  });
};

export default function Messages() {
  socket.auth = { username: "Senghorn" };
  socket.connect();
  socket.on("connect_error", (err) => {
    console.log(err.message);
    if (err.message === "invalid username") {
      console.log("failed to connect to message server");
    }
  });


  const [messages, setMessages] = useState([]);

  // Getting user permission to access photo gallery
  const [hasGalPermission, setGalPermission] = useState(null);
  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestCameraPermissionsAsync();
      setGalPermission(galleryStatus.status === "granted");
    })();
  }, []);

  // Handles image selection
  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    result = result.assets;
    imgValues = result[0];
    const imageMessage = {
      user: user[0],
      createdAt: Date.now(),
      _id: uuidv4(),
      messageType: "image",
      image: imgValues["uri"]
    };
    console.log(imageMessage);
  };

  useEffect(() => {
    // Seeding the messages for prototype phase
    setMessages([
      {
        _id: 0,
        text: "Hey all.  Just refilled Mom’s blood pressure medication.  They gave us a 3 month supply, so we should be good on that for a while.",
        createdAt: new Date("2022-10-07"),
        user: users[4],
      },
      {
        _id: 1,
        text: "Cool thanks. I can do the next one.",
        createdAt: new Date("2022-09-28"),
        user: users[4],
      },
      {
        _id: 2,
        text: "Thanks for doing that!",
        createdAt: new Date("2022-09-28"),
        user: users[2],
      },
      {
        _id: 3,
        text: "Good to hear!",
        createdAt: new Date("2022-09-28"),
        user: users[3],
      },
      {
        _id: 4,
        text: "Hey guys! Just checked on Mom. She's doing fine.",
        createdAt: new Date("2022-09-28"),
        user: users[1],
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    console.log("sent")
    socket.emit("chat", messages);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  // Message render bubble
  const renderBubble = (props) => {
    const message_sender_id = props.currentMessage.user._id;
    return (
      <Bubble
        {...props}
        position={message_sender_id == 1 ? "right" : "left"}
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
        onSend={(messages) => onSend(messages)}
        user={users[1]}
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
