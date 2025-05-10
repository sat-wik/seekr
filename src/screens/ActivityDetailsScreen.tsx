import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackNavigation, RootStackParamList } from '../navigation/types';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

interface Activity {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  location: string;
  ecoFriendly: boolean;
  suggestedActivities: string[];
}

type ActivityDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ActivityDetails'>;

const { width } = Dimensions.get('window');

const ActivityDetailsScreen: React.FC = () => {
  const route = useRoute<ActivityDetailsScreenRouteProp>();
  const navigation = useNavigation<RootStackNavigation>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivityDetails();
  }, [route.params?.activityId]);

  const loadActivityDetails = async () => {
    try {
      if (!route.params?.activityId) {
        throw new Error('Missing activity ID');
      }
      
      // TODO: Implement activity loading logic
      const mockActivity = {
        id: route.params.activityId,
        title: 'Mock Activity',
        description: 'This is a mock activity description.',
        image: 'https://via.placeholder.com/300',
        price: 99.99,
        duration: '2 hours',
        location: 'New York',
        ecoFriendly: true,
        suggestedActivities: ['Activity 1', 'Activity 2', 'Activity 3']
      } as Activity;
      setActivity(mockActivity);
    } catch (error) {
      console.error('Error loading activity details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToTrip = () => {
    navigation.navigate('ItineraryBuilder', {
      tripId: 'new',
    });
  };

  const handleBookNow = () => {
    navigation.navigate('Booking', {
      activityId: activity?.id || '',
    });
  };

  if (!route.params?.activityId) {
    return null;
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : activity ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image
              source={{ uri: activity.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.gradient}
            />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{activity.title}</Text>
            <Text style={styles.description}>{activity.description}</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.detail}>
                <Ionicons name="pricetag" size={16} color={colors.primary.main} />
                <Text style={styles.price}>${activity.price.toFixed(2)}</Text>
              </View>
              <View style={styles.detail}>
                <Ionicons name="time-outline" size={16} color={colors.primary.main} />
                <Text style={styles.duration}>{activity.duration}</Text>
              </View>
              <View style={styles.detail}>
                <Ionicons
                  name={activity.ecoFriendly ? "leaf" : "location"}
                  size={16}
                  color={colors.primary.main}
                />
                <Text style={styles.location}>{activity.location}</Text>
              </View>
            </View>
            <View style={styles.suggestions}>
              <Text style={styles.suggestionsTitle}>Suggested Activities</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionsContainer}
              >
                {activity.suggestedActivities.map((suggestion, index) => (
                  <View key={index} style={styles.suggestionCard}>
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={handleBookNow}
            >
              <Text style={styles.buttonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <Text>No activity found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    width: width,
    height: 250,
    position: 'relative',
  },
  image: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: spacing[4],
    left: spacing[4],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: borderRadius.md,
    padding: spacing[2],
  },
  content: {
    padding: spacing[4],
  },
  title: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold as '700',
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  description: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing[4],
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: spacing[2],
  },
  price: {
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold as '700',
  },
  duration: {
    color: colors.text.primary,
  },
  location: {
    color: colors.text.primary,
  },
  suggestions: {
    marginTop: spacing[5],
  },
  suggestionsTitle: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold as '700',
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  suggestionsContainer: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  suggestionCard: {
    backgroundColor: colors.background.paper,
    padding: spacing[3],
    borderRadius: borderRadius.md,
  },
  suggestionText: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  bookButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing[3],
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing[4],
  },
  buttonText: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold as '700',
    color: colors.text.inverse,
  },
  ecoTag: {
    backgroundColor: colors.status.success.light,
    padding: spacing[2],
    borderRadius: borderRadius.sm,
    marginTop: spacing[2],
  },
  ecoTagText: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.sm,
    color: colors.status.success.main,
  },
  footer: {
    padding: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[300],
  },
  button: {
    padding: spacing[3],
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.base,
  },
  addButton: {
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },


});

export default ActivityDetailsScreen;
