import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../theme';
import { supabase } from '../services/supabase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'ProfileScreen'>;

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(user);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigation.navigate('SignIn');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: user?.user_metadata?.avatar_url }}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>
            <View style={styles.editButtonContainer}>
              <TouchableOpacity style={styles.editButton}>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.name}>{user?.user_metadata?.full_name || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <TouchableOpacity 
            style={styles.option}
            onPress={() => navigation.navigate('EditProfile', { user })}
          >
            <Ionicons name="pencil" size={24} color={colors.primary.main} />
            <Text style={styles.optionText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="lock-closed" size={24} color={colors.primary.main} />
            <Text style={styles.optionText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="finger-print" size={24} color={colors.primary.main} />
            <Text style={styles.optionText}>Two-Factor Authentication</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="shield" size={24} color={colors.primary.main} />
            <Text style={styles.optionText}>Security Settings</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="notifications" size={24} color={colors.primary.main} />
            <Text style={styles.optionText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="moon" size={24} color={colors.primary.main} />
            <Text style={styles.optionText}>Dark Mode</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="language" size={24} color={colors.primary.main} />
            <Text style={styles.optionText}>Language</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="help-circle" size={24} color={colors.primary.main} />
            <Text style={styles.optionText}>Help Center</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="chatbubble" size={24} color={colors.primary.main} />
            <Text style={styles.optionText}>Contact Support</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="information-circle" size={24} color={colors.primary.main} />
            <Text style={styles.optionText}>About Seekr</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="finger-print" size={24} color={colors.primary.main} />
            <Text style={styles.optionText}>Two-Factor Authentication</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="shield" size={24} color={colors.primary.main} />
            <Text style={styles.optionText}>Security Settings</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out" size={24} color={colors.text.inverse} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    flex: 1,
    padding: spacing[4],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[6],
    paddingTop: spacing[4],
  },
  avatarContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing[4],
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background.paper,
  },
  editButtonContainer: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    opacity: 0.8,
  },
  editButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  name: {
    marginTop: spacing[2],
    fontSize: typography.fontSize['2xl'],
    fontWeight: '700',
    color: colors.text.primary,
  },
  email: {
    marginTop: spacing[1],
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.primary.main,
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginLeft: spacing[2],
  },
  infoValue: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginLeft: 'auto',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  optionText: {
    flex: 1,
    marginLeft: spacing[3],
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    backgroundColor: colors.status.error.main,
    borderRadius: spacing[3],
    marginHorizontal: spacing[4],
    marginBottom: spacing[6],
  },
  signOutIcon: {
    marginRight: spacing[3],
    fontSize: 24,
  },
  signOutText: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: spacing[4],
    backgroundColor: colors.background.paper,
  },
  icon: {
    marginRight: spacing[3],
    color: colors.text.secondary,
  },
});

export default ProfileScreen;