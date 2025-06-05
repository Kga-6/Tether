import type { Step } from '@/types/journey';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
  step: Step & { type: 'meditation' };
  /**
   * Called once the user finishes (or taps “Done”)
   * We don’t need answers → just signal completion.
   */
  onComplete: () => void;
};

export default function ExploreMeditation({ step, onComplete }: Props) {
  // Create the audio player for the given URI.
  const player = useAudioPlayer({ uri: step.payload.url }); 
  // Obtain status: { isLoaded, isPlaying, didJustFinish, ... }
  const status = useAudioPlayerStatus(player);

  // When the audio finishes, trigger onComplete()
  useEffect(() => {
    if (status.didJustFinish) {
      onComplete();
    }
  }, [status.didJustFinish, onComplete]);

  // While loading, show a spinner.
  if (!status.isLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{step.title}</Text>
        <ActivityIndicator />
        <Pressable style={styles.doneBtn} onPress={onComplete}>
          <Text style={styles.doneTxt}>Done</Text>
        </Pressable>
      </View>
    );
  }

  // Toggle between play and pause.
  const togglePlay = () => {
    status.playing ? player.pause() : player.play();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{step.title}</Text>

      <Pressable style={styles.btn} onPress={togglePlay}>
        <Text style={styles.btnTxt}>
          {status.playing ? 'Pause' : 'Play'}
        </Text>
      </Pressable>

      {/* fallback if user stops early */}
      <Pressable style={styles.doneBtn} onPress={onComplete}>
        <Text style={styles.doneTxt}>Done</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', backgroundColor: '#fff' },
  title:     { fontSize: 22, fontWeight: '600', color: '#322566', marginBottom: 32 },
  btn:       { backgroundColor: '#8C50FB', paddingVertical: 12, paddingHorizontal: 48, borderRadius: 24, marginBottom: 16 },
  btnTxt:    { color: '#fff', fontWeight: '600' },
  doneBtn:   { marginTop: 8, backgroundColor: '#322566', paddingVertical: 12, paddingHorizontal: 48, borderRadius: 24 },
  doneTxt:   { color: '#fff', fontWeight: '600' },
});
