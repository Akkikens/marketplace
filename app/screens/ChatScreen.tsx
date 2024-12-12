import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  addDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
import { ChatScreenRouteProp } from "../types";

type Message = {
  id: string;
  text: string;
  senderId: string;
  senderEmail: string;
};

const ChatScreen: React.FC = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const { receiverId, receiverEmail } = route.params;
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const senderId = FIREBASE_AUTH.currentUser?.uid;
  const senderEmail = FIREBASE_AUTH.currentUser?.email;
  const chatId = [senderId, receiverId].sort().join("_");

  // 🔥 Listen for new messages in real-time
  useEffect(() => {
    if (!senderId) return;

    const chatQuery = query(
      collection(FIRESTORE_DB, `chats/${chatId}/messages`),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text || "",
          senderId: data.senderId || "",
          senderEmail: data.senderEmail || "",
        };
      });
      setMessages(fetchedMessages);
    });

    return unsubscribe;
  }, [senderId, receiverId]);

  // 🔥 Add message to local state instantly
  const handleSend = async () => {
    if (!message.trim()) return;

    if (!senderId) {
      console.error("User not authenticated. Cannot send messages.");
      return;
    }

    const tempId = Date.now().toString(); // Generate a temporary unique id

    // 🔥 Add message locally so user sees it immediately
    const newMessage: Message = {
      id: tempId,
      text: message,
      senderId: senderId || "",
      senderEmail: senderEmail || "",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      await addDoc(collection(FIRESTORE_DB, `chats/${chatId}/messages`), {
        text: message,
        senderId,
        senderEmail,
        receiverId,
        receiverEmail,
        timestamp: serverTimestamp(),
      });
      console.log("Message sent successfully.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error sending message: ", error.message);
      } else {
        console.error("Unexpected error: ", error);
      }
    } finally {
      setMessage(""); // Clear the input after sending
    }
  };

  // 🔥 Render a single message
  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={
        item.senderId === senderId ? styles.sentMessage : styles.receivedMessage
      }
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageInfo}>{item.senderEmail}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  messageContainer: {
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C5",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    maxWidth: "80%",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E2E2E2",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
  },
  messageInfo: {
    fontSize: 10,
    color: "#555",
    textAlign: "right",
    marginTop: 5,
  },
});
