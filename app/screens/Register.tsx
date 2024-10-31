// File: app/screens/Register.tsx

import React, { useState } from 'react';
import { View, TextInput, Button, ActivityIndicator, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Modal } from 'react-native';
import { FIREBASE_AUTH } from './../../firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { NavigationProp } from '@react-navigation/native';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('Weak');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false); // Track password match

  const auth = FIREBASE_AUTH;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePasswordStrength = (password: string) => {
    if (password.length > 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
      setPasswordStrength('Strong');
    } else if (password.length > 5) {
      setPasswordStrength('Medium');
    } else {
      setPasswordStrength('Weak');
    }
  };

  const handleStandardSignUp = async () => {
    setError(null);
    setPasswordMismatch(false); // Reset mismatch on each registration attempt

    if (!email.endsWith('@clarku.edu')) {
      setError('Please use your @clarku.edu email address to register.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setRegistrationSuccess(true); // Show modal on success
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          placeholder="First Name"
        />
        <TextInput
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          placeholder="Last Name"
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <View>
          <TextInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              handlePasswordStrength(text);
            }}
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.toggleButton}
          >
            <Text>{passwordVisible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
          <Text style={styles.passwordStrength}>Strength: {passwordStrength}</Text>
        </View>
        
        <TextInput
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setPasswordMismatch(password !== text); // Update mismatch in real-time
          }}
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
        />
        {passwordMismatch && <Text style={styles.errorText}>Passwords do not match</Text>} {/* Mismatch warning */}
        
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Register" onPress={handleStandardSignUp} />
        )}
        
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* "Login Now" Link Below Register Button */}
        {registrationSuccess && (
          <TouchableOpacity onPress={() => navigation.navigate('Login', { ssoMode: false })} style={styles.loginNowLink}>
          <Text style={styles.loginNowText}>Login Now</Text>
      </TouchableOpacity>
      
        )}
      </KeyboardAvoidingView>

      {/* Registration Success Modal */}
      <Modal
        visible={registrationSuccess}
        transparent
        animationType="slide"
        onRequestClose={() => setRegistrationSuccess(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.successText}>Registration Successful!</Text>
            <Text>Please verify your email before logging in.</Text>
            <Button title="Close" onPress={() => setRegistrationSuccess(false)} />
            {/* "Login Now" Link in Modal */}
            <TouchableOpacity onPress={() => navigation.navigate('Login', { ssoMode: false })} style={styles.loginNowLink}>
    <Text style={styles.loginNowText}>Login Now</Text>
</TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  passwordStrength: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  loginNowLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginNowText: {
    color: 'blue',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalLoginLink: {
    marginTop: 10,
  },
});
