// File: app/screens/Login.tsx

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ActivityIndicator, Text, StyleSheet, KeyboardAvoidingView, Modal, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from './../../firebaseConfig';
import { signInWithEmailAndPassword, sendEmailVerification, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type LoginScreenNavigationProp = NavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false); // Modal visibility
  const [resendMessage, setResendMessage] = useState<string | null>(null); // Message for resend success/failure

  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute<LoginScreenRouteProp>();
  const auth = FIREBASE_AUTH;

  // Check if SSO mode is enabled
  const ssoMode = route.params?.ssoMode ?? false;

  useEffect(() => {
    if (ssoMode) {
      setError('Please enter your email to proceed with SSO login.');
    }
  }, [ssoMode]);

  const handleEmailPasswordLogin = async () => {
    setLoading(true);
    setError(null);
    setResendMessage(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Refresh the user to get the latest emailVerified status
      await userCredential.user.reload();
      const isVerified = userCredential.user.emailVerified;

      if (!isVerified) {
        setShowVerificationModal(true); // Show modal if email is not verified
      } else {
        navigation.navigate('Welcome');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Microsoft SSO Login
  const handleMicrosoftSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new OAuthProvider('microsoft.com');
      const userCredential = await signInWithPopup(auth, provider);

      // Check if email is verified
      if (userCredential.user && !userCredential.user.emailVerified) {
        setShowVerificationModal(true); // Show modal if email is not verified
      } else {
        navigation.navigate('Welcome');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
        setResendMessage('Verification email sent. Please check your inbox.');
      } catch (error: any) {
        setResendMessage("Couldn't send verification email. Please try again later.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        {!ssoMode && (
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholder="Password"
            secureTextEntry
          />
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Button
              title={ssoMode ? 'Continue with SSO' : 'Login'}
              onPress={ssoMode ? handleMicrosoftSignIn : handleEmailPasswordLogin}
            />
            <Button
              title="Login with Microsoft SSO"
              onPress={handleMicrosoftSignIn}
              color="#0078d4" // Optional: Microsoft color
            />
          </>
        )}
        
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Modal for Email Verification Prompt */}
        <Modal
          visible={showVerificationModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowVerificationModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Email Verification Required</Text>
              <Text style={styles.modalText}>Please verify your email to continue.</Text>
              <Button title="Resend Verification Email" onPress={resendVerificationEmail} />
              {resendMessage && <Text style={styles.resendMessage}>{resendMessage}</Text>}
              <TouchableOpacity onPress={() => setShowVerificationModal(false)}>
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  resendMessage: {
    fontSize: 14,
    color: 'green',
    marginTop: 10,
    textAlign: 'center',
  },
  closeModalText: {
    marginTop: 15,
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
