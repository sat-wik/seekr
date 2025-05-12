import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, typography, spacing } from '../../theme';
import { supabase } from '../../services/supabase';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigation } from '../../types/navigation';

type EditProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ route }) => {
  const navigation = useNavigation<RootStackNavigation>();
  const { user } = route.params;
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
  });

  const handleTextChange = (field: string, value: string) => {
    setTempValues(prev => ({ ...prev, [field]: value }));
  };

  React.useEffect(() => {
    fetchUser();
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUser();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (user?.user_metadata) {
        setTempValues({
          fullName: user.user_metadata.full_name || '',
          email: user.email || '',
          phone: user.user_metadata.phone || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Refresh user data when the component receives new props
  React.useEffect(() => {
    fetchUser();
  }, [navigation]);

  const startEditing = (field: string) => {
    setEditingField(field);
  };

  const saveField = async (field: string) => {
    const { user } = route.params;
    if (!user) return;

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          [field]: tempValues[field as keyof typeof tempValues],
        },
      });

      if (error) throw error;
      setEditingField(null);
      fetchUser();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Profile Information</Text>

        <View style={styles.infoRow}>
          <Ionicons name="person" size={24} color={colors.primary.main} />
          <Text style={styles.infoLabel}>Full Name</Text>
          <TouchableOpacity 
            style={styles.editableRow}
            onPress={() => navigation.navigate('EditNameScreen', { name: tempValues.fullName || '' })}
          >
            {editingField === 'fullName' ? (
              <TextInput
                style={styles.editableText}
                value={tempValues.fullName || ''}
                onChangeText={(text) => handleTextChange('fullName', text)}
                autoFocus
              />
            ) : (
              <>
                <Text style={styles.infoValue}>{tempValues.fullName || 'Not set'}</Text>
                <Ionicons name="pencil" size={20} color={colors.primary.main} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail" size={24} color={colors.primary.main} />
          <Text style={styles.infoLabel}>Email</Text>
          <TouchableOpacity 
            style={styles.editableRow}
            onPress={() => navigation.navigate('EditEmailScreen', { email: tempValues.email || '' })}
          >
            {editingField === 'email' ? (
              <TextInput
                style={styles.editableText}
                value={tempValues.email || ''}
                onChangeText={(text) => handleTextChange('email', text)}
                keyboardType="email-address"
                autoFocus
              />
            ) : (
              <>
                <Text style={styles.infoValue}>{tempValues.email || 'Not set'}</Text>
                <Ionicons name="pencil" size={20} color={colors.primary.main} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="call" size={24} color={colors.primary.main} />
          <Text style={styles.infoLabel}>Phone Number</Text>
          <TouchableOpacity 
            style={styles.editableRow}
            onPress={() => navigation.navigate('EditPhoneScreen', { phone: tempValues.phone || '' })}
          >
            {editingField === 'phone' ? (
              <TextInput
                style={styles.editableText}
                value={tempValues.phone || ''}
                onChangeText={(text) => handleTextChange('phone', text)}
                keyboardType="phone-pad"
                autoFocus
              />
            ) : (
              <>
                <Text style={styles.infoValue}>{tempValues.phone || 'Not set'}</Text>
                <Ionicons name="pencil" size={20} color={colors.primary.main} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    backgroundColor: colors.background.default,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: 'bold' as const,
    color: colors.text.primary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  container: {
    flex: 1,
    padding: spacing[4],
    backgroundColor: colors.background.default,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  infoLabel: {
    flex: 1,
    marginLeft: spacing[3],
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontWeight: '600',
  },
  infoValue: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    minWidth: 200,
    maxWidth: 300,
  },
  editableRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editableText: {
    flex: 1,
    padding: spacing[2],
    backgroundColor: colors.background.input,
    borderRadius: spacing[2],
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    minWidth: 200,
    maxWidth: 300,
  },
});
