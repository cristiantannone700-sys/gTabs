import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Library, LogIn } from 'lucide-react-native';
import Header from '@/components/Header';
import { supabase, type Song } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function LibraryScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [librarySongs, setLibrarySongs] = useState<Song[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadLibrary(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadLibrary(session.user.id);
      } else {
        setLibrarySongs([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadLibrary = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_library')
      .select('song_id, songs(*)')
      .eq('user_id', userId);

    if (!error && data) {
      const songs = data.map((item: any) => item.songs).filter(Boolean);
      setLibrarySongs(songs);
    }
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Error logging in:', error.message);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.emptyContainer}>
          <View style={styles.iconContainer}>
            <Library size={80} color="#ef4444" strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>La tua Libreria</Text>
          <Text style={styles.emptySubtitle}>
            Accedi per salvare le tue tabs preferite e accedervi ovunque.
          </Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <LogIn size={20} color="#fff" />
            <Text style={styles.loginButtonText}>Accedi con Google</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with Emergent</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Library size={24} color="#ef4444" />
            <Text style={styles.sectionTitle}>La tua Libreria</Text>
          </View>

          {librarySongs.length === 0 ? (
            <Text style={styles.emptyText}>
              Nessuna canzone salvata. Inizia ad aggiungere le tue tabs
              preferite!
            </Text>
          ) : (
            librarySongs.map((song) => (
              <TouchableOpacity key={song.id} style={styles.songCard}>
                <Image
                  source={{ uri: song.thumbnail_url || '' }}
                  style={styles.songThumbnail}
                />
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle} numberOfLines={1}>
                    {song.title}
                  </Text>
                  <Text style={styles.songArtist}>{song.source}</Text>
                </View>
                {song.difficulty && (
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyText}>{song.difficulty}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 30,
  },
  emptyTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ef4444',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
    paddingTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 40,
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    gap: 14,
  },
  songThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#222',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
    color: '#888',
  },
  difficultyBadge: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
});
