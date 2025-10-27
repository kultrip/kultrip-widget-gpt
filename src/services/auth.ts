import { supabase } from './supabase';

// Agency authentication functions
export interface Agency {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  agency: Agency | null;
  loading: boolean;
}

// Sign in agency
export async function signInAgency(email: string, password: string) {
  try {
    console.log('🔐 Attempting sign in with:', { email, password: '***' });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log('🔐 Supabase auth response:', { data, error });

    if (error) {
      console.error('❌ Authentication error:', error);
      throw error;
    }

    if (!data.user) {
      console.error('❌ No user returned from authentication');
      throw new Error('Authentication failed - no user returned');
    }

    console.log('✅ Authentication successful for user:', data.user.id);

    // Get agency details
    const { data: agencyData, error: agencyError } = await supabase
      .from('agencies') // Assuming you have an agencies table
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (agencyError && agencyError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.warn('⚠️ Agency details not found in agencies table:', agencyError);
    }

    const result = {
      user: data.user,
      agency: agencyData || {
        id: data.user.id,
        name: data.user.user_metadata?.agency_name || data.user.email,
        email: data.user.email || '',
        created_at: data.user.created_at
      },
      session: data.session
    };

    console.log('✅ Login result:', result);
    return result;
  } catch (error) {
    console.error('💥 Sign in error:', error);
    throw error;
  }
}

// Sign up new agency
export async function signUpAgency(email: string, password: string, agencyName: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          agency_name: agencyName,
          role: 'agency'
        }
      }
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

// Sign out
export async function signOutAgency() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

// Get current agency
export async function getCurrentAgency(): Promise<AuthState> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('🚫 No active session found');
      return {
        isAuthenticated: false,
        agency: null,
        loading: false
      };
    }

    console.log('👤 Active session found for user:', session.user.id);
    console.log('📧 User email:', session.user.email);

    // Get agency details if available
    const { data: agencyData, error: agencyError } = await supabase
      .from('agencies')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (agencyError && agencyError.code !== 'PGRST116') {
      console.log('⚠️ No agency details found, using user info');
    }

    const agency = agencyData || {
      id: session.user.id,
      name: session.user.user_metadata?.agency_name || session.user.email?.split('@')[0] || 'Agency',
      email: session.user.email || '',
      created_at: session.user.created_at
    };

    console.log('🏢 Agency info:', agency);

    return {
      isAuthenticated: true,
      agency,
      loading: false
    };
  } catch (error) {
    console.error('Get current agency error:', error);
    return {
      isAuthenticated: false,
      agency: null,
      loading: false
    };
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (authState: AuthState) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      const authState = await getCurrentAgency();
      callback(authState);
    } else if (event === 'SIGNED_OUT') {
      callback({
        isAuthenticated: false,
        agency: null,
        loading: false
      });
    }
  });
}