// File: app/screens/ChatScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { addDoc, collection, query, where, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../../firebaseConfig';
import { RootStackParamList } from '../types';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const { receiverId, receiverEmail } = route.params; // Getting receiver's info
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const senderId = FIREBASE_AUTH.currentUser?.uid;
  const senderEmail = FIREBASE_AUTH.currentUser?.email;

  useEffect(() => {
    if (!senderId) return;

    const chatQuery = query(
      collection(FIRESTORE_DB, 'chats'),
      where('participants', 'array-contains', senderId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return unsubscribe;
  }, [senderId]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await addDoc(collection(FIRESTORE_DB, 'chats'), {
        text: message,
        senderId,
        senderEmail,
        receiverId,
        receiverEmail,
        timestamp: serverTimestamp(),
        participants: [senderId, receiverId],
      });
      setMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={item.senderId === senderId ? styles.sentMessage : styles.receivedMessage}>
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
    backgroundColor: '#f9f9f9',
  },
  messageContainer: {
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C5',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    maxWidth: '80%',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2E2E2',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  messageInfo: {
    fontSize: 10,
    color: '#555',
    textAlign: 'right',
    marginTop: 5,
  },
});
