
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, company?: string) => Promise<{ data?: any; error?: any }>;
  signOut: () => Promise<void>;
}
