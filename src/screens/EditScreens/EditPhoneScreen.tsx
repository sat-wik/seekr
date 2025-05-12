import React from 'react';
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { supabase } from '../../services/supabase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type EditPhoneScreenProps = NativeStackScreenProps<RootStackParamList, 'EditPhoneScreen'>;

export function EditPhoneScreen({ navigation, route }: EditPhoneScreenProps) {
  const { phone } = route.params;
  const [value, setValue] = React.useState(phone);

  const savePhone = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user) {
        console.error('No user found');
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          phone: value,
        },
      });

      if (updateError) throw updateError;

      navigation.goBack();
    } catch (error) {
      console.error('Error updating phone:', error);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Phone</Text>
        <TouchableOpacity onPress={savePhone}>
          <Text style={styles.headerButton}>Done</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder="Enter your phone number"
            placeholderTextColor={colors.text.secondary}
            keyboardType="phone-pad"
            autoFocus
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.background.default,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerButton: {
    color: colors.primary.main,
    fontSize: typography.fontSize.base,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  inputContainer: {
    padding: spacing[4],
  },
  input: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    backgroundColor: colors.background.paper,
    borderRadius: spacing[2],
    padding: spacing[3],
    height: 50,
    borderWidth: 1,
    borderColor: colors.neutral[400],
  },
});

export default EditPhoneScreen;
