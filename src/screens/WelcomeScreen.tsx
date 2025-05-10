import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, typography, spacing, shadows } from '../theme';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800' }}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Seekr</Text>
            <Text style={styles.subtitle}>Your AI Travel Companion</Text>
          </View>

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Ionicons name="sparkles" size={24} color={colors.primary.main} />
              <Text style={styles.featureText}>Personalized Recommendations</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="calendar" size={24} color={colors.primary.main} />
              <Text style={styles.featureText}>Smart Itinerary Planning</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="compass" size={24} color={colors.primary.main} />
              <Text style={styles.featureText}>Local Experiences</Text>
            </View>
          </View>

          <Button
            title="Get Started"
            onPress={() => navigation.navigate('AIWelcome')}
            size="lg"
            rightIcon={<Ionicons name="arrow-forward" size={24} color={colors.text.inverse} style={styles.buttonIcon} />}
          />
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing[6],
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: spacing[12],
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold as 'bold',
    color: colors.text.inverse,
    marginBottom: spacing[4],
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium as '500',
    color: colors.text.inverse,
    marginBottom: spacing[8],
  },
  features: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: spacing[8],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  featureText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium as '500',
    color: colors.text.inverse,
    marginLeft: spacing[4],
  },
  buttonIcon: {
    marginLeft: spacing[4],
  },
});

export default WelcomeScreen;
