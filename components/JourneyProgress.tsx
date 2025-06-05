import { useAuth } from '@/contexts/authContext';
import type { Journey } from '@/types/journey';
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = { journey: Journey };

export default function JourneyProgress({ journey }: Props) {
  const { myJourneys, ensureJourneyProgress } = useAuth();

  /* ───── make sure progress for this journey is loaded ───── */
  useEffect(() => {
    ensureJourneyProgress?.(journey.id);
  }, [journey.id, ensureJourneyProgress]);

  /* ───── compute completion stats ───── */
  const { percent } = useMemo(() => {
    const total = journey.sections.reduce(
      (sum, section) => sum + section.steps.length,
      0
    );
    const done = Object.keys(
      myJourneys[journey.id]?.completedSteps ?? {}
    ).length;
    const pct = total > 0 ? done / total : 0; // 0 → 1
    return { percent: pct };
  }, [journey, myJourneys]);

  /* ───── render progress bar only if some progress exists ───── */
  if (percent === 0 || percent === 1) return null;

  return (
    <View
      className="absolute right-0 left-0 bottom-0 bg-black rounded-full"
      style={{
        height: 12,
        backgroundColor: '#E7E0EE',
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          height: '100%',
          width: `${(percent  * 100).toFixed(1)}%`,
          backgroundColor: '#8C50FB',
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({})