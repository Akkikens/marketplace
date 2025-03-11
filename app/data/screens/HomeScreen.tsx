// File: app/screens/HomeScreen.tsx

import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../types';

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clark Marketplace</Text>
      <Text style={styles.subtitle}>
        Marketplace for only Clark students. Connect, buy, and sell with fellow Clarkies!
      </Text>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="Login via Email & Password"
            onPress={() => navigation.navigate('Login', { ssoMode: false })}
          />
        </View>
        
        <View style={styles.buttonWrapper}>
          <Button
            title="Login via SSO"
            onPress={() => navigation.navigate('Login', { ssoMode: true })} // Navigate to Login with ssoMode
          />
        </View>
        
        <View style={styles.buttonWrapper}>
          <Button
            title="Register"
            onPress={() => navigation.navigate('Register', { otpEnabled: false })}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  buttonWrapper: {
    marginVertical: 10, // Add vertical margin for spacing
  },
});
