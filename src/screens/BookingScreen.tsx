import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';

type BookingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Booking'>;
type BookingScreenRouteProp = RouteProp<RootStackParamList, 'Booking'>;

type PaymentMethod = 'card' | 'apple' | 'google';

const BookingScreen = () => {
  const navigation = useNavigation<BookingScreenNavigationProp>();
  const route = useRoute<BookingScreenRouteProp>();
  const { activityId } = route.params;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const handlePayment = async () => {
    try {
      // In a real app, this would integrate with a payment processor
      // For now, just simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigation.navigate('BookingConfirmation', {
        bookingId: 'mock-booking-id',
      });
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const renderPaymentMethod = (method: PaymentMethod, label: string) => (
    <TouchableOpacity
      style={[
        styles.paymentMethod,
        selectedPaymentMethod === method && styles.selectedPaymentMethod,
      ]}
      onPress={() => setSelectedPaymentMethod(method)}
    >
      <Text
        style={[
          styles.paymentMethodText,
          selectedPaymentMethod === method && styles.selectedPaymentMethodText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Booking</Text>
          <Text style={styles.subtitle}>Choose your payment method</Text>
        </View>

        <View style={styles.paymentMethods}>
          {renderPaymentMethod('card', 'Credit Card')}
          {renderPaymentMethod('apple', 'Apple Pay')}
          {renderPaymentMethod('google', 'Google Pay')}
        </View>

        {selectedPaymentMethod === 'card' && (
          <View style={styles.cardForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: spacing[4] }]}>
                <Text style={styles.label}>Expiry Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name on Card</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>
        )}

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={styles.summaryValue}>$299.99</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing[24],
    paddingTop: spacing[32],
  },
  title: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize['2xl'],
    fontWeight: '700',
    color: colors.neutral['900'],
    marginBottom: spacing[2],
  },
  subtitle: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  paymentMethods: {
    flexDirection: 'row',
    padding: spacing[24],
    gap: spacing[4],
  },
  paymentMethod: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.neutral['100'],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.paper,
  },
  selectedPaymentMethod: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.main,
  },
  paymentMethodText: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    color: colors.neutral['900'],
  },
  selectedPaymentMethodText: {
    color: colors.background.paper,
  },
  cardForm: {
    padding: spacing[24],
  },
  inputGroup: {
    marginBottom: spacing[8],
  },
  label: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.neutral['100'],
    borderRadius: borderRadius.base,
    paddingHorizontal: spacing[4],
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    color: colors.neutral['900'],
  },
  row: {
    flexDirection: 'row',
  },
  summary: {
    padding: spacing[24],
    backgroundColor: colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  summaryTitle: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.neutral['900'],
    marginBottom: spacing[4],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.neutral['900'],
  },
  footer: {
    padding: spacing[24],
    backgroundColor: colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  payButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.base,
  },
  payButtonText: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.background.paper,
  },
});

export default BookingScreen; 
