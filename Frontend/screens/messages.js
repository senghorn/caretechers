import { View, StyleSheet } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import React, { useState, useCallback, useEffect } from "react";
import COLORS from "../constants/colors";

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
    name: "Benjamin Hatch",
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

export default function Messages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Seeding the messages for prototype phase
    setMessages([
      {
        _id: 0,
        text: "oops! that was my kid. Mom is doing fine. I took her to a sushi place downtown, she liked it.",
        createdAt: new Date(),
        user: users[2],
      },
      {
        _id: 1,
        text: "hi1k",
        createdAt: new Date(),
        user: users[2],
      },
      {
        _id: 2,
        text: "Not me! I was out of town.",
        createdAt: new Date(),
        user: users[3],
      },
      {
        _id: 3,
        text: "Who checked on mom last week? How is she?",
        createdAt: new Date(),
        user: users[4],
      },
      {
        _id: 4,
        text: "Welcome everyone!",
        createdAt: new Date("2022-03-25"),
        user: users[1],
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
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
      <GiftedChat
        renderBubble={renderBubble}
        showUserAvatar={true}
        messages={messages}
        renderUsernameOnMessage={true}
        onSend={(messages) => onSend(messages)}
        user={users[1]}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 64,
  },
});
