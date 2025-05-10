import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthNavigator from './src/navigation/AuthNavigator';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import ActivityDetailsScreen from './src/screens/ActivityDetailsScreen';
import ItineraryBuilderScreen from './src/screens/ItineraryBuilderScreen';
import BookingScreen from './src/screens/BookingScreen';
import BookingConfirmationScreen from './src/screens/BookingConfirmationScreen';
import { AuthProvider } from './src/authContext';
import { RootStackParamList } from './src/types/navigation';
import * as Linking from 'expo-linking';
import { supabase } from './src/services/supabase';
import { navigationRef, navigate } from './src/hooks/useNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    const handleAuthRedirect = async (url: string) => {
      if (url.startsWith('seekr://auth')) {
        // Handle the authentication redirect
        const authResponse = await supabase.auth.getSession();
        if (authResponse.data.session) {
          // User is authenticated, navigate to the home screen
          navigate('Main');
        }
      }
    };

    // Listen for incoming links
    const handleUrl = (url: string) => {
      handleAuthRedirect(url);
    };

    // Add URL listener
    Linking.addEventListener('url', (event: any) => {
      handleUrl(event.url);
    });

    // Check for initial URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleAuthRedirect(url);
      }
    });

    // Cleanup function
    return () => {
      // No cleanup needed for expo-linking
    };
  }, []);

  const linking = {
    prefixes: ['seekr://'],
    config: {
      screens: {
        Auth: {
          path: 'auth'
        }
      }
    }
  };

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer
          linking={linking}
          ref={navigationRef}
        >
          <Stack.Navigator
            initialRouteName="Auth"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Auth" component={AuthNavigator} />
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
 