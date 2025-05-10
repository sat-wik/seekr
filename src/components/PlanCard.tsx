import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { TravelPlan } from '../types/travel';

interface PlanCardProps {
  plan: TravelPlan;
  onPress: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {plan.locations[0]?.image && (
        <Image 
          style={styles.image}
          source={{ uri: plan.locations[0].image }}
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{plan.name}</Text>
        <Text style={styles.locations}>
          {plan.locations.map(loc => loc.name).join(', ')}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${plan.totalPrice.total.toFixed(2)}</Text>
          <Text style={styles.priceLabel}>Total</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locations: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  priceLabel: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
});