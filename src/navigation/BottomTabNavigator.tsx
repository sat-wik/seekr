import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, shadows } from '../theme';
import { Ionicons } from '@expo/vector-icons';

type IconName = 'home' | 'home-outline' | 'calendar' | 'calendar-outline' | 'map' | 'map-outline' | 'trophy' | 'trophy-outline' | 'person' | 'person-outline' | 'help-circle';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import PlanScreen from '../screens/PlanScreen';
import MapScreen from '../screens/MapScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileNavigator from './ProfileNavigator';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const iconMap: Record<string, IconName> = {
            Feed: focused ? 'home' : 'home-outline',
            Plan: focused ? 'calendar' : 'calendar-outline',
            Map: focused ? 'map' : 'map-outline',
            Leaderboard: focused ? 'trophy' : 'trophy-outline',
            Profile: focused ? 'person' : 'person-outline',
            default: 'help-circle'
          };

          const iconName = iconMap[route.name as keyof typeof iconMap] || iconMap.default;

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Feed" component={HomeScreen} />
      <Tab.Screen name="Plan" component={PlanScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: spacing[4],
    left: spacing[4],
    right: spacing[4],
    backgroundColor: colors.background.default,
    borderRadius: 20,
    height: 60,
    ...shadows.lg,
    borderTopWidth: 0,
    paddingBottom: 0,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
});

export default BottomTabNavigator; 
 