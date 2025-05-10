import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';

type BookingConfirmationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookingConfirmation'>;
type BookingConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'BookingConfirmation'>;

const BookingConfirmationScreen = () => {
  const navigation = useNavigation<BookingConfirmationScreenNavigationProp>();
  const route = useRoute<BookingConfirmationScreenRouteProp>();
  const { bookingId } = route.params;

  const handleViewItinerary = () => {
    navigation.navigate('ItineraryBuilder', { tripId: bookingId });
  };

  const handleShare = () => {
    // In a real app, this would use the Share API
    console.log('Share booking');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your booking has been successfully confirmed. We've sent the confirmation details to your email.
        </Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking ID</Text>
            <Text style={styles.detailValue}>{bookingId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={[styles.detailValue, styles.statusText]}>Confirmed</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>June 15, 2024</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleViewItinerary}
          >
            <Text style={styles.buttonText}>View Itinerary</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleShare}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Share Booking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    flex: 1,
    padding: spacing[24],
    paddingTop: spacing[32],
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing[24],
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.base,
  },
  checkmark: {
    fontSize: 40,
    color: colors.background.paper,
    fontWeight: '700',
  },
  title: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize['2xl'],
    fontWeight: '700',
    color: colors.neutral['700'],
    marginBottom: spacing[4],
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[24],
    paddingHorizontal: spacing[24],
  },
  detailsCard: {
    width: '100%',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing[24],
    marginBottom: spacing[24],
    ...shadows.base,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  detailLabel: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  detailValue: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    color: colors.neutral['700'],
    fontWeight: '600',
  },
  statusText: {
    color: colors.primary.main,
  },
  actions: {
    width: '100%',
    gap: spacing[4],
  },
  button: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.base,
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
  },
  secondaryButton: {
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  buttonText: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.background.paper,
  },
  secondaryButtonText: {
    color: colors.primary.main,
  },
});

export default BookingConfirmationScreen; 
