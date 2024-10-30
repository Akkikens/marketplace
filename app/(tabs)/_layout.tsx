// app/(tabs)/_layout.tsx
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Adjust the import path if needed
import LoginScreen from './LoginScreen';
import ExploreScreen from './ExploreScreen';
import HomeScreen from './index';

const Tab = createBottomTabNavigator();

export default function Layout() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return user ? (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
    </Tab.Navigator>
  ) : (
    <LoginScreen />
  );
}
