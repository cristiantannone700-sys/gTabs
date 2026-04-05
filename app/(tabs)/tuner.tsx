import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { Music, Mic, Volume2 } from 'lucide-react-native';
import Header from '@/components/Header';

const REFERENCE_TONES = [
  { note: 'E', string: '1ª corda (E4)', frequency: '329.63 Hz' },
  { note: 'B', string: '2ª corda (B3)', frequency: '246.94 Hz' },
  { note: 'G', string: '3ª corda (G3)', frequency: '196.00 Hz' },
  { note: 'D', string: '4ª corda (D3)', frequency: '146.83 Hz' },
  { note: 'A', string: '5ª corda (A2)', frequency: '110.00 Hz' },
  { note: 'E', string: '6ª corda (E2)', frequency: '82.41 Hz' },
];

export default function TunerScreen() {
  const [isListening, setIsListening] = useState(false);
  const [tuning, setTuning] = useState(0);

  const handleStartTuner = () => {
    setIsListening(!isListening);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroHeader}>
            <Music size={32} color="#ef4444" />
            <Text style={styles.heroTitle}>Accordatore</Text>
          </View>
          <Text style={styles.heroSubtitle}>
            Accorda la tua chitarra con precisione
          </Text>
        </View>

        <View style={styles.tunerContainer}>
          <View style={styles.tunerCircle}>
            <View
              style={[
                styles.tunerIndicator,
                { transform: [{ translateX: tuning * 1.5 }] },
              ]}
            />
          </View>

          <View style={styles.scaleContainer}>
            <Text style={styles.scaleText}>-50</Text>
            <Text style={styles.scaleText}>0</Text>
            <Text style={styles.scaleText}>+50</Text>
          </View>

          <View style={styles.sliderContainer}>
            <View style={styles.slider}>
              <View
                style={[
                  styles.sliderThumb,
                  { left: `${((tuning + 50) / 100) * 100}%` },
                ]}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.startButton,
              isListening && styles.startButtonActive,
            ]}
            onPress={handleStartTuner}>
            <Mic size={22} color="#fff" />
            <Text style={styles.startButtonText}>
              {isListening ? 'Interrompi Accordatore' : 'Avvia Accordatore'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.referenceTones}>
          <View style={styles.referenceToneHeader}>
            <Volume2 size={24} color="#ef4444" />
            <Text style={styles.referenceToneTitle}>Toni di Riferimento</Text>
          </View>

          <View style={styles.tonesGrid}>
            {REFERENCE_TONES.map((tone, index) => (
              <TouchableOpacity key={index} style={styles.toneCard}>
                <Text style={styles.toneNote}>{tone.note}</Text>
                <Text style={styles.toneString}>{tone.string}</Text>
                <Text style={styles.toneFrequency}>{tone.frequency}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    paddingTop: 30,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#999',
    marginLeft: 44,
  },
  tunerContainer: {
    padding: 20,
    paddingTop: 10,
  },
  tunerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#333',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  tunerIndicator: {
    width: 4,
    height: 60,
    backgroundColor: '#ef4444',
    borderRadius: 2,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  scaleText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  sliderContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  slider: {
    height: 6,
    backgroundColor: '#222',
    borderRadius: 3,
    position: 'relative',
  },
  sliderThumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ef4444',
    top: -6,
    marginLeft: -9,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 12,
  },
  startButtonActive: {
    backgroundColor: '#7f3a3a',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  referenceTones: {
    padding: 20,
    paddingTop: 10,
  },
  referenceToneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  referenceToneTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  tonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toneCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  toneNote: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  toneString: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  toneFrequency: {
    fontSize: 14,
    color: '#666',
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
