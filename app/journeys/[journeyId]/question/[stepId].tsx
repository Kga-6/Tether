import ExploreQuestion from '@/components/ExploreQuestion';
import { useAuth } from '@/contexts/authContext';
import { journeys } from '@/data/journeys';
import { router, useLocalSearchParams } from 'expo-router';

export default function QuestionStepScreen() {
  const { journeyId, stepId } = useLocalSearchParams<{ journeyId: string; stepId: string }>();
  const { completeStep } = useAuth();

  /* find the current & next step */
  const j = journeys.find(j => j.id === journeyId);
  const allSteps =
    j?.sections.sort((a,b)=>a.order-b.order)
      .flatMap(s => s.steps.sort((a,b)=>a.order-b.order)) ?? [];

  const currIdx  = allSteps.findIndex(s => s.id === stepId);
  const step     = allSteps[currIdx] as typeof allSteps[number] & { type: 'question' };
  const nextStep = allSteps[currIdx + 1] ?? null;

  if (!step) return null;

  const handleComplete = async (answers: Record<string, string | number>) => {
    await completeStep(
      journeyId!,          // id of this journey
      stepId!,             // current step
      //nextStep?.id ?? null,// where the user should resume
      answers,             // typed text
      null                 // score: not applicable
    );

    router.back()
  };

  return <ExploreQuestion step={step} onComplete={handleComplete} journeyId={journeyId}/>;
}
