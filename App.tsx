import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WelcomeScreen from './src/screens/WelcomeScreen';
import AIWelcomeScreen from './src/screens/AIWelcomeScreen';
import SignInScreen from './src/screens/SignInScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import ActivityDetailsScreen from './src/screens/ActivityDetailsScreen';
import ItineraryBuilderScreen from './src/screens/ItineraryBuilderScreen';
import BookingScreen from './src/screens/BookingScreen';
import BookingConfirmationScreen from './src/screens/BookingConfirmationScreen';
import { AuthProvider } from './src/authContext';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="SignIn"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="AIWelcome" component={AIWelcomeScreen} />
            <Stack.Screen name="Main" component={BottomTabNavigator} />
            <Stack.Screen name="ActivityDetails" component={ActivityDetailsScreen} />
            <Stack.Screen name="ItineraryBuilder" component={ItineraryBuilderScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
} 
 