import React from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';
import { supabase } from '../services/supabase';
import Constants from 'expo-constants';

export default function GoogleSignIn() {
  React.useEffect(() => {
    GoogleSignin.configure({
      scopes: ['profile', 'email'],
      webClientId: Constants.expoConfig?.extra?.IOS_GOOGLE_CLIENT_ID || '',
      offlineAccess: true,
      iosClientId: Constants.expoConfig?.extra?.IOS_GOOGLE_CLIENT_ID || '',
    });
  }, []);

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          
          if (userInfo) {
            const { data, error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: 'https://seekr-ruby.vercel.app/',
                scopes: 'email profile'
              }
            });

            if (error) {
              console.error('Google Sign-in error:', error);
              throw error;
            }

            console.log('Google Sign-in success:', data);
          } else {
            throw new Error('No ID token present!');
          }
        } catch (error: any) {
          console.error('Google Sign-in error:', error);
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      }}
    />
  );
}
