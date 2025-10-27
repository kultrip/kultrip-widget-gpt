import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// For testing - you can temporarily add service role key here
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY; // Add this to .env if you have it
export const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

// Test function to simulate agency authentication (for development only)
export async function getLeadsForTestAgency(agencyId: string): Promise<Lead[]> {
  try {
    console.log('🧪 Testing with agency ID:', agencyId);
    
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });

    console.log('📊 Test query response:', { data, error });

    if (error) {
      console.error('❌ Test query error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('⚠️ No leads found for agency:', agencyId);
      return [];
    }

    console.log(`✅ Found ${data.length} leads for agency ${agencyId}`);

    const transformedLeads = data.map((lead: SupabaseLead): Lead => ({
      name: lead.traveler_name,
      email: lead.traveler_email,
      destination: lead.destination,
      story: lead.story_theme || lead.inspiring_story,
      preferences: lead.interests ? lead.interests.join(', ') : lead.themes || '',
      whatsapp: lead.traveler_phone || '',
      language: 'English',
      createdAt: lead.created_at,
      travelerType: capitalizeFirst(lead.traveler_type)
    }));

    return transformedLeads;
  } catch (error) {
    console.error('💥 Test query failed:', error);
    return [];
  }
}

// Types based on the leads table structure
export interface SupabaseLead {
  id: string;
  agency_id: string;
  traveler_name: string;
  traveler_email: string;
  traveler_phone?: string;
  destination: string;
  created_at: string;
  travel_style?: string;
  interests: string[];
  inspiring_story: string;
  traveler_type: string;
  trip_duration_days?: number;
}

// Transform Supabase lead to match the expected Lead type in Saas component
export interface Lead {
  name: string;
  email: string;
  destination: string;
  story: string;
  preferences: string;
  whatsapp: string;
  language: string;
  createdAt?: string;
  travelerType?: string;
}

// Alternative function to fetch leads with admin privileges (bypasses RLS)
export async function getLeadsAdmin(): Promise<Lead[]> {
  if (!supabaseAdmin) {
    console.log('⚠️ No admin client available, falling back to regular query');
    return getLeads();
  }

  try {
    console.log('🔍 Fetching leads with admin privileges (bypassing RLS)...');
    
    const { data, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('📊 Admin Supabase response:', { data, error });

    if (error) {
      console.error('❌ Admin query error:', error);
      return getLeads(); // Fallback to regular query
    }

    if (!data || data.length === 0) {
      console.log('⚠️ No leads found with admin query either');
      return [];
    }

    console.log(`✅ Admin query found ${data.length} leads`);

    const transformedLeads = data.map((lead: SupabaseLead): Lead => ({
      name: lead.traveler_name,
      email: lead.traveler_email,
      destination: lead.destination,
      story: lead.inspiring_story,
      preferences: lead.interests ? lead.interests.join(', ') : '',
      whatsapp: lead.traveler_phone || '',
      language: 'English',
      createdAt: lead.created_at,
      travelerType: capitalizeFirst(lead.traveler_type)
    }));

    return transformedLeads;
  } catch (error) {
    console.error('💥 Admin query failed:', error);
    return getLeads(); // Fallback to regular query
  }
}

// Function to fetch leads from Supabase (with RLS - only agency's own leads)
export async function getLeads(): Promise<Lead[]> {
  try {
    console.log('🔍 Fetching leads from Supabase...');
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('❌ No authenticated session - cannot fetch leads');
      throw new Error('Authentication required to access leads');
    }

    console.log('👤 Authenticated as agency:', session.user.id);
    
    // With RLS enabled, this will automatically filter by agency_id = auth.uid()
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('📊 Supabase response:', { data, error });

    if (error) {
      console.error('❌ Error fetching leads:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log('⚠️ No leads found for this agency');
      return [];
    }

    console.log(`✅ Found ${data.length} leads for agency ${session.user.id}`);

    // Transform Supabase data to match the expected Lead interface
    const transformedLeads = data.map((lead: SupabaseLead): Lead => {
      return {
        name: lead.traveler_name,
        email: lead.traveler_email,
        destination: lead.destination,
        story: lead.inspiring_story,
        preferences: lead.interests ? lead.interests.join(', ') : '',
        whatsapp: lead.traveler_phone || '',
        language: 'English', // Default since not in DB
        createdAt: lead.created_at,
        travelerType: capitalizeFirst(lead.traveler_type)
      };
    });

    console.log('✨ Transformed leads:', transformedLeads);
    return transformedLeads;
  } catch (error) {
    console.error('💥 Error in getLeads:', error);
    throw error;
  }
}

// Helper function to capitalize first letter
function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Debug function to test Supabase connection
export async function testSupabaseConnection() {
  try {
    console.log('🔗 Testing Supabase connection...');
    console.log('📍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('🔑 Supabase Key (first 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

    // Check if we're authenticated
    const { data: { user } } = await supabase.auth.getUser();
    console.log('👤 Current user:', user);

    // Test table count
    const { count, error: countError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    console.log('📊 Table count:', count, 'Error:', countError);

    // Try a simple select to see what happens
    const { data: rawData, error: rawError } = await supabase
      .from('leads')
      .select('*')
      .limit(5);

    console.log('🔍 Raw leads query result:', { rawData, rawError });

    if (rawError) {
      console.error('❌ Raw query failed:', rawError.message);
      if (rawError.message.includes('permission denied') || rawError.message.includes('RLS')) {
        console.log('🛡️ This is a Row Level Security (RLS) issue!');
        console.log('💡 Solutions:');
        console.log('1. Disable RLS for the leads table');
        console.log('2. Create an RLS policy for anonymous access');
        console.log('3. Authenticate the user before querying');
      }
    } else if (rawData && rawData.length === 0) {
      console.log('🛡️ Query succeeded but returned empty - likely RLS filtering');
      console.log('💡 The table has RLS enabled and is filtering out results');
    }

    // Try to get table info
    console.log('🔍 Attempting to check table structure...');
    
    return { count, countError, rawData, rawError, user };
  } catch (error) {
    console.error('💥 Connection test failed:', error);
    return { error };
  }
}

// Function to get leads with real-time subscription
export function subscribeToLeads(callback: (leads: Lead[]) => void) {
  const subscription = supabase
    .channel('leads_channel')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'leads' },
      async () => {
        // Refetch leads when there's a change
        const leads = await getLeads();
        callback(leads);
      }
    )
    .subscribe();

  return subscription;
}