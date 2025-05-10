import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';
import { Canvas, Circle, Group, Path, Skia } from '@shopify/react-native-skia';

type ItineraryBuilderScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ItineraryBuilder'>;

type TimelineItem = {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  type: 'activity' | 'transport' | 'accommodation';
};

const { width } = Dimensions.get('window');
const MAP_SIZE = 150;

const ItineraryBuilderScreen = () => {
  const navigation = useNavigation<ItineraryBuilderScreenNavigationProp>();
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateItinerary();
  }, []);

  const generateItinerary = async () => {
    try {
      // In a real app, this would call an AI service to generate the itinerary
      // For now, using mock data
      const mockTimeline: TimelineItem[] = [
        {
          id: '1',
          time: '09:00',
          title: 'Samba Workshop',
          description: 'Learn authentic samba moves from local dancers',
          location: 'Copacabana',
          type: 'activity',
        },
        {
          id: '2',
          time: '12:00',
          title: 'Local Café',
          description: 'Enjoy traditional Brazilian coffee and pastries',
          location: 'Ipanema',
          type: 'activity',
        },
        {
          id: '3',
          time: '14:00',
          title: 'Beach Walk',
          description: 'Stroll along the famous Copacabana beach',
          location: 'Copacabana Beach',
          type: 'activity',
        },
      ];

      setTimeline(mockTimeline);
      setLoading(false);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      // Save itinerary to Supabase
      navigation.navigate('Booking', {
        activityId: 'itinerary',
      });
    } catch (error) {
      console.error('Error saving itinerary:', error);
    }
  };

  const handleTweak = () => {
    // In a real app, this would open a modal to adjust the itinerary
    generateItinerary();
  };

  // Create a simple map path
  const mapPath = Skia.Path.Make();
  mapPath.addCircle(MAP_SIZE / 2, MAP_SIZE / 2, MAP_SIZE / 2);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Trip Plan</Text>
          <View style={styles.mapContainer}>
            <Canvas style={styles.map}>
              <Group>
                <Circle
                  cx={MAP_SIZE / 2}
                  cy={MAP_SIZE / 2}
                  r={MAP_SIZE / 2}
                  color={colors.primary.main}
                  opacity={0.1}
                />
                <Path
                  path={mapPath}
                  color={colors.primary.main}
                  style="stroke"
                  strokeWidth={2}
                />
              </Group>
            </Canvas>
          </View>
        </View>

        <View style={styles.timelineContainer}>
          {timeline.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={styles.timeContainer}>
                <Text style={styles.time}>{item.time}</Text>
                {index < timeline.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemLocation}>{item.location}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.tweakButton]}
          onPress={handleTweak}
        >
          <Text style={[styles.buttonText, styles.tweakButtonText]}>Tweak</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={handleApprove}
        >
          <Text style={styles.buttonText}>Approve Plan</Text>
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
    marginBottom: spacing[8],
  },
  mapContainer: {
    alignItems: 'center',
    marginBottom: spacing[24],
  },
  map: {
    width: MAP_SIZE,
    height: MAP_SIZE,
  },
  timelineContainer: {
    padding: spacing[24],
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing[24],
  },
  timeContainer: {
    width: 60,
    alignItems: 'center',
  },
  time: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    fontWeight: '700',
    color: colors.neutral['900'],
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.primary.main,
    marginVertical: spacing[2],
  },
  itemContent: {
    flex: 1,
    backgroundColor: colors.background.paper,
    padding: spacing[8],
    borderRadius: borderRadius.lg,
    ...shadows.base,
  },
  itemTitle: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.neutral['900'],
    marginBottom: spacing[1],
  },
  itemDescription: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing[1],
  },
  itemLocation: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: typography.fontSize.sm,
    color: colors.primary.main,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing[24],
    gap: spacing[6],
    backgroundColor: colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.base,
  },
  tweakButton: {
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  approveButton: {
    backgroundColor: colors.primary.main,
  },
  buttonText: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.background.paper,
  },
  tweakButtonText: {
    color: colors.primary.main,
  },
});

export default ItineraryBuilderScreen; 
