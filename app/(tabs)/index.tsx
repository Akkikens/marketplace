// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function HomeScreen() {
  const handleLogout = () => {
    auth().signOut();
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24 }}>Welcome to the Home Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
