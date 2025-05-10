import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Alert, ActivityIndicator, useWindowDimensions, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackNavigation } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import Constants from 'expo-constants';
import * as Google from 'expo-auth-session';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';

type SignInScreenProps = {
  navigation: RootStackNavigation;
};

function SignInScreen({ navigation }: SignInScreenProps) {
  // Using navigation from props instead of hook to avoid duplicate navigation
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const animatedValue = useRef<Animated.Value>(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Start web-based authentication
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${Constants.expoConfig?.extra?.supabaseUrl}/auth/v1/callback?redirect_to=${encodeURIComponent('seekr://auth')}`,
          scopes: 'email profile'
        },
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      if (data.url) {
        // Open the URL in the browser
        await Linking.openURL(data.url);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let isValid = true;
      let errorMessage = '';

      // Validate email
      if (!email) {
        isValid = false;
        errorMessage = 'Please enter an email address';
        setEmailError(true);
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
        setEmailError(true);
      } else {
        setEmailError(false);
      }

      // Validate password
      if (!password) {
        isValid = false;
        errorMessage = 'Please enter a password';
        setPasswordError(true);
      } else {
        setPasswordError(false);
      }

      if (!isValid) {
        setError(errorMessage);
        return;
      }

      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (user) {
        navigation.navigate('Welcome');
      }
    } catch (error) {
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = (): void => {
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = (): void => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
        />

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={handleEmailChange}
              style={[styles.input, emailError && styles.inputError]}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.text.secondary}
            />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={handlePasswordChange}
              style={[styles.input, passwordError && styles.inputError]}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.text.secondary}
            />
            <TouchableOpacity
              style={{ position: 'absolute', right: spacing.md, top: spacing.md }}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.signInButton,
            {
              backgroundColor: '#DB4437', // Google's red color
              paddingVertical: spacing.sm,
              borderRadius: 8,
            },
            isLoading && styles.signInButtonDisabled,
          ]}
          onPress={handleSignIn}
          disabled={isLoading || emailError || passwordError}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.text.primary} />
            </View>
          ) : (
            <Text style={styles.signInButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        <TouchableOpacity
          style={[
            styles.googleButton,
            {
              backgroundColor: 'white',
              paddingVertical: spacing.sm,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#DB4437',
            }
          ]}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          <View style={styles.googleSignInButtonContent}>
            <Ionicons
              name="logo-google"
              size={24}
              color="#DB4437"
            />
            <Text style={[
              styles.googleSignInButtonText,
              {
                color: '#DB4437',
                marginLeft: spacing.sm,
                fontWeight: '600' as const,
              }
            ]}>Sign in with Google</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: spacing.md,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: spacing.xl,
    resizeMode: 'contain',
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: '600' as const,
    color: 'white',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.h5.fontSize,
    fontWeight: '600' as const,
    color: '#DB4437',
    opacity: 0.8,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  inputWrapper: {
    marginBottom: spacing.lg,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    fontSize: typography.body1.fontSize,
    color: colors.text.primary,
    borderColor: 'transparent',
    borderWidth: 1,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  },
  errorContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    fontSize: typography.caption.fontSize,
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    color: colors.text.primary, // Black
    fontSize: typography.body2.fontSize,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  signUpText: {
    color: colors.text.primary, // Black
    fontSize: typography.body2.fontSize,
  },
  signUpLink: {
    color: '#DB4437', // Orange for the link
    fontSize: typography.body2.fontSize,
    fontWeight: '600' as const,
    marginLeft: spacing.sm,
  },
  signInButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',

  },
  signInButtonDisabled: {
    backgroundColor: colors.primary,
    opacity: 0.7,
  },
  signInButtonText: {
    fontSize: typography.body1.fontSize,
    color: 'white',
    fontWeight: '600' as const,
    textAlign: 'center',
    width: '100%',
    lineHeight: 24, // Match font size for proper vertical alignment
  },
  loadingContainer: {
    paddingVertical: spacing.sm,
  },
  orContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  orText: {
    color: colors.text.secondary,
    fontSize: typography.body2.fontSize,
  },
  googleButton: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  googleSignInButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  googleSignInButtonText: {
    color: colors.text.primary,
    fontSize: typography.body1.fontSize,
    lineHeight: typography.body1.lineHeight,
    textAlign: 'center',
  },
});

export default SignInScreen;
