import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Song = {
  id: string;
  title: string;
  artist: string;
  source: string;
  thumbnail_url: string | null;
  difficulty: string | null;
  created_at: string;
};

export type UserLibrary = {
  id: string;
  user_id: string;
  song_id: string;
  created_at: string;
};
