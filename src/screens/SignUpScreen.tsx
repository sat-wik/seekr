import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  Animated, 
  Alert, 
  ActivityIndicator, 
  useWindowDimensions, 
  Image, 
  Linking 
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { supabase, supabaseServiceRole } from '../services/supabase';
import Constants from 'expo-constants';
import * as Google from 'expo-auth-session';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Ionicons } from '@expo/vector-icons';

interface SignUpScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const animatedValue = useRef<Animated.Value>(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      
      // Start web-based authentication
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'seekr://auth/google/callback',
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateForm = () => {
    let isValid = true;
    let errorMessage = '';

    // Validate email
    if (!email) {
      isValid = false;
      errorMessage = 'Please enter an email address';
      setEmailError(true);
    } else if (!validateEmail(email)) {
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
    } else if (!validatePassword(password)) {
      isValid = false;
      errorMessage = 'Password must be at least 8 characters long';
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    // Validate confirm password
    if (!confirmPassword) {
      isValid = false;
      errorMessage = 'Please confirm your password';
      setConfirmPasswordError(true);
    } else if (confirmPassword !== password) {
      isValid = false;
      errorMessage = 'Passwords do not match';
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }

    if (!isValid) {
      setError(errorMessage);
    }

    return isValid;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError(false);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError(false);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setConfirmPasswordError(false);
  };

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate form
      if (!email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://seekr-ruby.vercel.app/confirm'
        }
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Show success message and wait for email confirmation
      Alert.alert('Success', 'Check your email for the confirmation link.');

      // Navigate to Main screen
      navigation.navigate('Main');
    } catch (error) {
      console.error('Sign up error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
            />
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={handleEmailChange}
                style={[styles.input, emailError && styles.inputError]}
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
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                style={[styles.input, confirmPasswordError && styles.inputError]}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={colors.text.secondary}
              />
              <TouchableOpacity
                style={{ position: 'absolute', right: spacing.md, top: spacing.md }}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
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
                backgroundColor: '#DB4437',
                paddingVertical: spacing.sm,
                borderRadius: 8,
              },
              isLoading && styles.signInButtonDisabled,
            ]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.text.primary} />
              </View>
            ) : (
              <Text style={styles.signInButtonText}>Sign Up</Text>
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
            onPress={handleGoogleSignUp}
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
              ]}>Sign up with Google</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.spacing} />

          <View style={styles.forgotPasswordContainer}>
            <View style={styles.forgotPasswordContent}>
              <Text style={styles.forgotPasswordText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  content: {
    flex: 1,
    width: '100%',
    padding: spacing.md,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoContainer: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  title: {
    fontSize: typography.h4.fontSize,
    fontWeight: '600' as const,
    color: 'white',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body1.fontSize,
    fontWeight: '600' as const,
    color: '#DB4437',
    opacity: 0.8,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
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
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  forgotPasswordContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPasswordText: {
    color: colors.text.primary,
    fontSize: typography.body2.fontSize,
  },
  signInLink: {
    color: '#DB4437',
    fontSize: typography.body2.fontSize,
    fontWeight: '600' as const,
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
    lineHeight: 24,
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
    justifyContent: 'center',
  },
  googleSignInButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  googleSignInButtonText: {
    fontSize: typography.body1.fontSize,
  },
  spacing: {
    height: spacing.lg,
  },
});

export default SignUpScreen;
