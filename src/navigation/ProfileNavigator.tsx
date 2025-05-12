import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Import screens
import { ProfileScreen } from '../screens/ProfileScreen';
import { EditNameScreen } from '../screens/EditScreens/EditNameScreen';
import { EditEmailScreen } from '../screens/EditScreens/EditEmailScreen';
import { EditPhoneScreen } from '../screens/EditScreens/EditPhoneScreen';
import { EditProfileScreen } from '../screens/EditScreens/EditProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="EditNameScreen" component={EditNameScreen} />
      <Stack.Screen name="EditEmailScreen" component={EditEmailScreen} />
      <Stack.Screen name="EditPhoneScreen" component={EditPhoneScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
