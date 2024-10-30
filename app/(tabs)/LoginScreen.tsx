// app/(tabs)/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Picker, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Adjust the import path if needed

export default function LoginScreen() {
  const [isRegistering, setIsRegistering] = useState(false);

  // Registration and Login Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Date of Birth Dropdown Fields
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());

  const validateEmailDomain = (email: string) => email.endsWith('@clarku.edu');

  const isPasswordStrong = (password: string) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  };

  const handleRegister = async () => {
    // Validation checks
    if (!validateEmailDomain(email)) {
      Alert.alert('Error', 'Only @clarku.edu emails are allowed');
      return;
    }
    if (!isPasswordStrong(password)) {
      Alert.alert('Error', 'Password must be at least 8 characters long, contain an uppercase letter, and a number');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!firstName || !lastName || !selectedMonth || !selectedDay || !selectedYear) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      Alert.alert('Success', `Account created successfully for ${firstName} ${lastName}!`);
      setIsRegistering(false); // Switch to Login view after successful registration
    } catch (error) {
      const errorMessage = (error as Error).message || 'Registration Failed';
      Alert.alert('Registration Failed', errorMessage);
    }
  };

  const handleLogin = async () => {
    if (!validateEmailDomain(email)) {
      Alert.alert('Error', 'Only @clarku.edu emails are allowed');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error) {
      const errorMessage = (error as Error).message || 'Login Failed';
      Alert.alert('Login Failed', errorMessage);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>{isRegistering ? 'Register' : 'Login'}</Text>
      
      {isRegistering && (
        <>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
          
          {/* Date of Birth Selectors */}
          <View style={styles.dobContainer}>
            <Picker
              selectedValue={selectedMonth}
              style={styles.picker}
              onValueChange={(itemValue: string) => setSelectedMonth(itemValue)}
            >
              <Picker.Item label="Month" value="" />
              {months.map((month) => (
                <Picker.Item key={month} label={month} value={month} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedDay}
              style={styles.picker}
              onValueChange={(itemValue: string) => setSelectedDay(itemValue)}
            >
              <Picker.Item label="Day" value="" />
              {days.map((day) => (
                <Picker.Item key={day} label={day} value={day} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedYear}
              style={styles.picker}
              onValueChange={(itemValue: string) => setSelectedYear(itemValue)}
            >
              <Picker.Item label="Year" value="" />
              {years.map((year) => (
                <Picker.Item key={year} label={year} value={year} />
              ))}
            </Picker>
          </View>
        </>
      )}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {isRegistering && (
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
      )}

      <Button
        title={isRegistering ? 'Register' : 'Login'}
        onPress={isRegistering ? handleRegister : handleLogin}
      />
      <Text
        style={{ marginTop: 20, color: 'blue', textAlign: 'center' }}
        onPress={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    borderBottomWidth: 1,
    padding: 8,
  },
  dobContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
});
