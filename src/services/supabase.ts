import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get the environment variables from app.json
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your app.json');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
