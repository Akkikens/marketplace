// File: app/types.ts

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// File: app/types.ts

export type RootStackParamList = {
    Home: undefined;
    Login: { ssoMode?: boolean };  // Ensure Login has ssoMode as optional
    Register: { otpEnabled: boolean };
    Welcome: undefined;
};


// Define the navigation prop type for screens
export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'Register'>;
export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
export type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
