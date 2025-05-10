import { Session, AuthChangeEvent } from '@supabase/supabase-js';

export interface AuthState {
  user: Session['user'] | null;
  isLoading: boolean;
}

export interface AuthContextType {
  user: Session['user'] | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
