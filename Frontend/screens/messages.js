import { View, Text, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import React, { useState, useCallback, useEffect } from "react";

export default function Messages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 4,
        text: "oops! that was my kid. Mom is doing fine. I took her to a sushi place downtown, she liked it.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Benjamin Hatch",
          avatar: "https://source.unsplash.com/140x140/?spiderman",
        },
      },
      {
        _id: 1,
        text: "dkl",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Benjamin Hatch",
          avatar: "https://source.unsplash.com/140x140/?spiderman",
        },
      },
      {
        _id: 2,
        text: "Not me! I was in Hawaii.",
        createdAt: new Date(),
        user: {
          _id: 3,
          name: "Seng Rith",
          avatar: "https://source.unsplash.com/140x140/?dog",
        },
      },
      {
        _id: 3,
        text: "Who checked on mom last week? How is she?",
        createdAt: new Date(),
        user: {
          _id: 4,
          name: "Aaron Heo",
          avatar: "https://source.unsplash.com/140x140/?cat",
        },
      }
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <GiftedChat
      isTyping={true}
      alwaysShowSend ={true}
      showUserAvatar ={true}
      messages={messages}
      multiline ={true}
      renderAvatarOnTop={true}
      renderUsernameOnMessage={true}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
        avatar: "https://source.unsplash.com/140x140/?person",
      }}
    />
  );
}
