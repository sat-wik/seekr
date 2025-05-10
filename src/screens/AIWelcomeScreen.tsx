import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, typography, spacing, shadows } from '../theme';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

type AIWelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AIWelcome'>;
};

const { width, height } = Dimensions.get('window');

const AIWelcomeScreen = ({ navigation }: AIWelcomeScreenProps) => {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800' }}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Meet Your AI Travel Guide</Text>
            <Text style={styles.subtitle}>
              I'll help you discover amazing places and create personalized travel experiences.
            </Text>
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
            title="Start Exploring"
            onPress={() => navigation.navigate('Main')}
            size="lg"
            rightIcon={<Ionicons name="arrow-forward" size={24} color={colors.text.inverse} style={styles.buttonIcon} />}
          />
        </View>
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
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing[6],
  },
  header: {
    marginTop: spacing[12],
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: '700',
    color: colors.text.inverse,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.text.inverse,
    opacity: 0.9,
    lineHeight: typography.lineHeight.relaxed,
  },
  features: {
    marginVertical: spacing[8],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  featureText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.inverse,
    marginLeft: spacing[3],
  },
  buttonIcon: {
    marginLeft: spacing[2],
  },
});

export default AIWelcomeScreen; 
