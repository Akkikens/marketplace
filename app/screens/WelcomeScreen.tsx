import React, { useState } from 'react';
import { ScrollView, Modal, View, Image, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { dummyListings } from '@/app/data/dummyListing';
import { Grid, Button, Typography, TextField, Box } from '@mui/material';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// Define the Item type for better type safety
interface Item {
  id: string;
  name: string;
  price: string;
  description: string;
  location: string;
  image: string;
  email: string;
  sellerName: string;
}

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Welcome'>>();
  const [items, setItems] = useState<Item[]>(dummyListings);
  const [searchText, setSearchText] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSellModalVisible, setIsSellModalVisible] = useState(false); // For "Sell Something" modal
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    description: '',
    location: '',
    image: '',
  });

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigation.navigate('Login', { ssoMode: false });
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  // Handle adding new item to Firestore and listings
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.description || !newItem.location) return;
    
    const itemWithDefaults: Item = {
      ...newItem,
      id: Date.now().toString(),
      email: 'seller@clarku.edu', // Example email; replace with actual user email if available
      sellerName: 'Clark User',   // Example name; replace with actual seller name if available
    };
    
    try {
      const docRef = await addDoc(collection(FIRESTORE_DB, 'marketplace-items'), itemWithDefaults);
      setItems([...items, { ...itemWithDefaults, id: docRef.id }]);
      setIsSellModalVisible(false);
      setNewItem({ name: '', price: '', description: '', location: '', image: '' });
    } catch (error) {
      console.error('Error adding item: ', error);
    }
  };

  // Filter items based on search text
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())
  );

  // Open/Close Modals
  const openModal = (item: Item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };
  const closeModal = () => setIsModalVisible(false);
  const openSellModal = () => setIsSellModalVisible(true);
  const closeSellModal = () => setIsSellModalVisible(false);

  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#f2f2f2' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Clark Marketplace!
      </Typography>
      <Typography variant="subtitle1" paragraph>
        Buy, sell, and connect with fellow Clark students!
      </Typography>

      <Button variant="outlined" color="secondary" onClick={handleLogout} style={{ marginBottom: 20 }}>
        Logout
      </Button>

      <Button variant="contained" color="primary" onClick={openSellModal} style={{ marginBottom: 20 }}>
        Sell Something
      </Button>

      <Box style={{ marginBottom: 20 }}>
        <TextField
          fullWidth
          placeholder="Search items..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          variant="outlined"
          margin="dense"
          style={{ marginBottom: 10 }}
        />
      </Box>

      <Grid container spacing={2}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Box padding={2} borderRadius={2} boxShadow={2} bgcolor="background.paper" textAlign="center">
              <Image
                source={{ uri: item.image }}
                style={{ width: '100%', height: 150, borderRadius: 8, marginBottom: 10 }}
              />
              <Typography variant="h6">{item.name}</Typography>
              <Typography color="textSecondary" gutterBottom>
                Price: ${item.price}
              </Typography>
              <Typography variant="body2" paragraph>
                {item.description}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Location: {item.location}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                style={{ marginTop: 10 }}
                onClick={() => openModal(item)}
              >
                View Item
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Modal for Viewing Item Details */}
      <Modal animationType="slide" transparent visible={isModalVisible} onRequestClose={closeModal}>
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContent}>
            {selectedItem && (
              <>
                <Image
                  source={{ uri: selectedItem.image }}
                  style={{ width: '100%', height: 150, borderRadius: 8, marginBottom: 10 }}
                />
                <Typography variant="h6">{selectedItem.name}</Typography>
                <Typography color="textSecondary" gutterBottom>
                  Price: ${selectedItem.price}
                </Typography>
                <Typography variant="body2" paragraph>
                  {selectedItem.description}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Location: {selectedItem.location}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Listed by: {selectedItem.email}
                </Typography>
                <Button variant="contained" color="primary" onClick={closeModal} style={{ marginTop: 10 }}>
                  Close
                </Button>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal for Selling an Item */}
      <Modal animationType="slide" transparent visible={isSellModalVisible} onRequestClose={closeSellModal}>
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContent}>
            <Typography variant="h6" gutterBottom>
              List a New Item
            </Typography>
            <TextInput
              placeholder="Item Name"
              value={newItem.name}
              onChangeText={(text) => setNewItem({ ...newItem, name: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Price"
              value={newItem.price}
              onChangeText={(text) => setNewItem({ ...newItem, price: text })}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Description"
              value={newItem.description}
              onChangeText={(text) => setNewItem({ ...newItem, description: text })}
              style={styles.input}
              multiline
            />
            <TextInput
              placeholder="Location"
              value={newItem.location}
              onChangeText={(text) => setNewItem({ ...newItem, location: text })}
              style={styles.input}
            />
            <Button variant="contained" color="primary" onClick={handleAddItem} style={{ marginTop: 10 }}>
              List Item
            </Button>
            <Button variant="outlined" color="secondary" onClick={closeSellModal} style={{ marginTop: 10 }}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default WelcomeScreen;

// Modal styles
const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center' as const,
  },
});

const styles = StyleSheet.create({
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 8,
  },
});
