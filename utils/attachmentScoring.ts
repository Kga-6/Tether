import { Question } from "../data/attachmentQuestions";

const RESPONSE_SCORES = {
  "Strongly disagree": 1,
  "Disagree": 2,
  "Neither agree nor disagree": 3,
  "Agree": 4,
  "Strongly Agree": 5,
};

export const getScore = (answer: string, reverse?: boolean): number => {
  const base = RESPONSE_SCORES[answer];
  return reverse ? 6 - base : base;
};

export const calculateAttachmentScores = (
  answers: { [key: string]: string },
  questions: Question[]
): { anxiety: number; avoidance: number } => {
  let anxietySum = 0;
  let avoidanceSum = 0;
  let anxietyCount = 0;
  let avoidanceCount = 0;

  for (const question of questions) {
    const answer = answers[question.id];
    if (!answer) continue;

    const score = getScore(answer, question.reverse);

    if (question.dimension === "anxiety") {
      anxietySum += score;
      anxietyCount++;
    } else {
      avoidanceSum += score;
      avoidanceCount++;
    }
  }

  return {
    anxiety: parseFloat((anxietySum / anxietyCount).toFixed(1)),
    avoidance: parseFloat((avoidanceSum / avoidanceCount).toFixed(1)),
  };
};

export const classifyAttachmentStyle = ({
  anxiety,
  avoidance,
}: {
  anxiety: number;
  avoidance: number;
}): string => {
  if (anxiety <= 2.5 && avoidance <= 2.5) return "Secure";
  if (anxiety > 2.5 && avoidance <= 2.5) return "Preoccupied";
  if (anxiety <= 2.5 && avoidance > 2.5) return "Dismissive";
  return "Fearful-Avoidant";
};
