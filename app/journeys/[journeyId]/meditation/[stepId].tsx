import ExploreMeditation from '@/components/ExploreMeditation';
import { useAuth } from '@/contexts/authContext';
import { journeys } from '@/data/journeys';
import { router, useLocalSearchParams } from 'expo-router';

export default function MeditationStepScreen() {
  const { journeyId, stepId } = useLocalSearchParams<{ journeyId: string; stepId: string }>();
  const { completeStep } = useAuth();

  /* find the current & next step */
  const j = journeys.find(j => j.id === journeyId);
  const steps =
    j?.sections.sort((a,b)=>a.order-b.order)
      .flatMap(s => s.steps.sort((a,b)=>a.order-b.order)) ?? [];

  const idx       = steps.findIndex(s => s.id === stepId);
  const step      = steps[idx] as typeof steps[number] & { type: 'meditation' };
  const nextStep  = steps[idx + 1] ?? null;

  if (!step) return null;

  const handleComplete = async () => {
    await completeStep(
      journeyId!,
      stepId!,
      //nextStep?.id ?? null,
      { listened: 'true' },     // answers field – keeps Firestore shape consistent
      null                      // score
    );

    router.back()
  };

  return <ExploreMeditation step={step} onComplete={handleComplete} journeyId={journeyId}/>;
}
