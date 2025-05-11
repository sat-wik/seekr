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
        try {
          // Extract the path from the URL
          const path = url.split('://')[1].split('/')[1];
          
          // Handle different types of authentication redirects
          if (path === 'confirm') {
            // Handle email confirmation
            const token = url.split('token=')[1];
            const email = url.split('email=')[1]?.split('&')[0];
            
            if (!email) {
              console.error('Email not found in confirmation URL');
              return;
            }

            const { data, error } = await supabase.auth.verifyOtp({
              token,
              email,
              type: 'email'
            });

            if (error) {
              console.error('Email confirmation error:', error);
              return;
            }

            // After successful confirmation, get the session
            const authResponse = await supabase.auth.getSession();
            if (authResponse.data.session) {
              navigate('Main');
            }
          } else if (path === 'google/callback') {
            // Handle Google OAuth callback
            const authResponse = await supabase.auth.getSession();
            if (authResponse.data.session) {
              navigate('Main');
            }
          }
        } catch (error) {
          console.error('Auth redirect error:', error);
        }
      }
    };

    // Listen for incoming links
    const handleUrl = (url: string) => {
      handleAuthRedirect(url);
    };

    // Add URL listener
    Linking.addEventListener('url', (event: any) => {
      const url = event.url;
      if (url && url.startsWith('seekr://auth')) {
        handleUrl(url);
      }
    });

    // Check for initial URL
    Linking.getInitialURL().then((url) => {
      if (url && url.startsWith('seekr://auth')) {
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
 