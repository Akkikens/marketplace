// File: app/screens/WelcomeScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { FIRESTORE_DB, FIREBASE_AUTH } from '../../firebaseConfig';
import { WelcomeScreenNavigationProp } from '../types';

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '' });

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, "marketplace-items"));
      setItems(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    try {
      const docRef = await addDoc(collection(FIRESTORE_DB, "marketplace-items"), newItem);
      setItems([...items, { ...newItem, id: docRef.id }]);
      setNewItem({ name: '', price: '', description: '' });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigation.navigate('Login', { ssoMode: false });  // Redirect to Login screen
    } catch (error) {
      Alert.alert("Logout Error", "There was an error logging out. Please try again.");
      console.error("Error signing out: ", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Clark Marketplace!</Text>
      <Text style={styles.description}>
        You have successfully signed in. Buy, sell, and connect with fellow Clark students!
      </Text>

      <Button title="Logout" onPress={handleLogout} />

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Item Name"
          value={newItem.name}
          onChangeText={(text) => setNewItem({ ...newItem, name: text })}
          style={styles.textField}
        />
        <TextInput
          placeholder="Price"
          value={newItem.price}
          onChangeText={(text) => setNewItem({ ...newItem, price: text })}
          keyboardType="numeric"
          style={styles.textField}
        />
        <TextInput
          placeholder="Description"
          value={newItem.description}
          onChangeText={(text) => setNewItem({ ...newItem, description: text })}
          multiline
          style={styles.textField}
        />
        <Button title="Add Item" onPress={handleAddItem} />
      </View>

      <View style={styles.gridContainer}>
        {items.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>Price: ${item.price}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Button
              title="View Item"
              onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  textField: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  gridContainer: {
    width: '100%',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
});
