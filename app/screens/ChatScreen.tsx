// File: app/screens/ChatScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, Button, Text, StyleSheet } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: any;
}

const ChatScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Chat'>>();
  const { receiverId, receiverEmail } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const userId = FIREBASE_AUTH.currentUser?.uid;

  useEffect(() => {
    const messagesRef = collection(FIRESTORE_DB, 'messages');
    const q = query(
      messagesRef,
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];

      setMessages(fetchedMessages.filter(
        (msg) => 
          (msg.senderId === userId && msg.receiverId === receiverId) ||
          (msg.senderId === receiverId && msg.receiverId === userId)
      ));
    });

    return unsubscribe;
  }, [userId, receiverId]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    try {
      await addDoc(collection(FIRESTORE_DB, 'messages'), {
        senderId: userId,
        receiverId: receiverId,
        content: message,
        timestamp: serverTimestamp()
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with {receiverEmail}</Text>
      <ScrollView style={styles.messageContainer}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.message,
              msg.senderId === userId ? styles.sent : styles.received
            ]}
          >
            <Text style={styles.messageText}>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  messageContainer: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  sent: {
    backgroundColor: '#d1e7dd',
    alignSelf: 'flex-end',
  },
  received: {
    backgroundColor: '#f8d7da',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#333',
  },
  input: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
});
