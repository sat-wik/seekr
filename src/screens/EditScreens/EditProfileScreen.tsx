import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors, typography, spacing } from '../../theme';
import { supabase } from '../../services/supabase';

type EditProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation, route }) => {
  const { user } = route.params;
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
  });

  const handleTextChange = (field: string, value: string) => {
    setTempValues(prev => ({ ...prev, [field]: value }));
    saveField(field);
  };

  React.useEffect(() => {
    fetchUser();
  }, []);

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

  return (
    <SafeAreaView style={styles.safeArea}>
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
                <TouchableOpacity onPress={() => setEditingField('fullName')}>
                  <Ionicons name="pencil" size={20} color={colors.primary.main} />
                </TouchableOpacity>
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
                <TouchableOpacity onPress={() => setEditingField('email')}>
                  <Ionicons name="pencil" size={20} color={colors.primary.main} />
                </TouchableOpacity>
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
                <TouchableOpacity onPress={() => setEditingField('phone')}>
                  <Ionicons name="pencil" size={20} color={colors.primary.main} />
                </TouchableOpacity>
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
    marginLeft: spacing[3],
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  editableRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editableText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
});
