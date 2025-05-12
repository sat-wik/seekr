import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography } from '../../theme';
import { useAuth } from '../../authContext';
import { TravelPlan } from '../../types/travel';
import { RootStackParamList, RootStackNavigation } from '../../types/navigation';

const PlanScreen = () => {
  const navigation = useNavigation<RootStackNavigation>();
  const { user, isLoading } = useAuth();
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    if (user && !isLoading) {
      fetchPlans();
    }
  }, [user, isLoading]);

  const fetchPlans = async () => {
    try {
      setLoadingPlans(true);
      if (!user?.id) return;
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleCreatePlan = () => {
    navigation.navigate('ItineraryBuilder', { tripId: 'new' });
  };

  const handlePlanPress = (plan: TravelPlan) => {
    navigation.navigate('ItineraryBuilder', { tripId: plan.id });
  };

  if (isLoading || loadingPlans) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading plans...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreatePlan}
      >
        <Text style={styles.buttonText}>Create New Plan</Text>
      </TouchableOpacity>
      
      {plans.length === 0 ? (
        <Text style={styles.emptyText}>No plans yet. Create one!</Text>
      ) : (
        <View style={styles.plansList}>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
    padding: 16,
  },
  createButton: {
    backgroundColor: colors.primary.main,
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  plansList: {
    flex: 1,
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
});

export default PlanScreen;