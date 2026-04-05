import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Search, Music } from 'lucide-react-native';
import Header from '@/components/Header';
import { supabase, type Song } from '@/lib/supabase';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSongs(data);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadSongs();
      return;
    }

    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .or(`title.ilike.%${searchQuery}%,artist.ilike.%${searchQuery}%`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSongs(data);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            What do you wanna{' '}
            <Text style={styles.heroTitleHighlight}>play</Text>?
          </Text>
          <Text style={styles.heroSubtitle}>
            Digita il nome di una canzone e ottieni accordi e tablature generate
            dall'AI in pochi secondi.
          </Text>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Search size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Cerca una canzo"
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Cerca</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Music size={24} color="#ef4444" />
            <Text style={styles.sectionTitle}>Canzoni popolari</Text>
          </View>

          {songs.map((song) => (
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
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with Emergent</Text>
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
  hero: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    lineHeight: 44,
  },
  heroTitleHighlight: {
    color: '#ef4444',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#999',
    lineHeight: 22,
    marginBottom: 28,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    paddingVertical: 14,
  },
  searchButton: {
    backgroundColor: '#7f3a3a',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  section: {
    padding: 20,
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
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
});
