import React, { useState, useEffect } from 'react';
import { TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { FIRESTORE_DB, FIREBASE_AUTH } from '../../firebaseConfig';
import { WelcomeScreenNavigationProp } from '../types';
import { dummyListings } from '@/app/data/dummyListing';
import { Grid, Button, Typography, TextField, Box } from '@mui/material';
import { Image } from 'react-native'; // Import Image component from React Native


const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const [items, setItems] = useState<any[]>(dummyListings); // Set dummy listings as initial items
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '' });
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      const q = categoryFilter
        ? query(collection(FIRESTORE_DB, "marketplace-items"), where("category", "==", categoryFilter))
        : collection(FIRESTORE_DB, "marketplace-items");

      const querySnapshot = await getDocs(q);
      const firestoreItems = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setItems([...dummyListings, ...firestoreItems]); // Append Firestore items to dummy listings
    };
    fetchItems();
  }, [categoryFilter]);

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) return;
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
      navigation.navigate('Login', { ssoMode: false });
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#f2f2f2' }}>
      <Typography variant="h4" gutterBottom>Welcome to Clark Marketplace!</Typography>
      <Typography variant="subtitle1" paragraph>
        Buy, sell, and connect with fellow Clark students!
      </Typography>

      <Button variant="outlined" color="secondary" onClick={handleLogout} style={{ marginBottom: 20 }}>
        Logout
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
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Button onClick={() => setCategoryFilter(null)}>All</Button>
          <Button onClick={() => setCategoryFilter('Electronics')}>Electronics</Button>
          <Button onClick={() => setCategoryFilter('Furniture')}>Furniture</Button>
          <Button onClick={() => setCategoryFilter('Books')}>Books</Button>
        </Box>
      </Box>

      <Box component="form" style={{ marginBottom: 20 }}>
        <TextField
          fullWidth
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          variant="outlined"
          margin="dense"
          style={{ marginBottom: 10 }}
        />
        <TextField
          fullWidth
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          variant="outlined"
          margin="dense"
          type="number"
          style={{ marginBottom: 10 }}
        />
        <TextField
          fullWidth
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          variant="outlined"
          margin="dense"
          multiline
          rows={3}
          style={{ marginBottom: 10 }}
        />
        <Button variant="contained" color="primary" onClick={handleAddItem}>
          Add Item
        </Button>
      </Box>

      <Grid container spacing={2}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Box
              padding={2}
              borderRadius={2}
              boxShadow={2}
              bgcolor="background.paper"
              textAlign="center"
            >
            <Image source={{ uri: item.image }} style={{ width: '100%', height: 150, borderRadius: 8, marginBottom: 10 }} />

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
                onClick={() => navigation.navigate('ItemDetails', { itemId: item.id })}
              >
                View Item
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </ScrollView>
  );
};

export default WelcomeScreen;
