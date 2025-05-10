export type Question = {
  id: string;
  title: string;
  options: string[];
  dimension: "avoidance" | "anxiety";
  reverse?: boolean;
};

const everyOptions = [
  "Strongly disagree",
  "Disagree",
  "Neither agree nor disagree",
  "Agree",
  "Strongly Agree"
];

export const ECR_QUESTIONS: Question[] = [
  { id: "1",  title: "I prefer not to show a partner how I feel deep down.", options: everyOptions, dimension: "avoidance" },
  { id: "2",  title: "I worry about being abandoned.", options: everyOptions, dimension: "anxiety" },
  { id: "3",  title: "I am very comfortable being close to romantic partners.", options: everyOptions, dimension: "avoidance", reverse: true },
  { id: "4",  title: "I worry a lot about my relationships.", options: everyOptions, dimension: "anxiety" },
  { id: "5",  title: "Just when my partner starts to get close to me I find myself pulling away.", options: everyOptions, dimension: "avoidance" },
  { id: "6",  title: "I worry that romantic partners won’t care about me as much as I care about them.", options: everyOptions, dimension: "anxiety" },
  { id: "7",  title: "I get uncomfortable when a romantic partner wants to be very close.", options: everyOptions, dimension: "avoidance" },
  { id: "8",  title: "I worry a fair amount about losing my partner.", options: everyOptions, dimension: "anxiety" },
  { id: "9",  title: "I don't feel comfortable opening up to romantic partners.", options: everyOptions, dimension: "avoidance" },
  { id: "10", title: "I often wish that my partner’s feelings for me were as strong as my feelings for them.", options: everyOptions, dimension: "anxiety" },
  { id: "11", title: "I want to get close to my partner, but I keep pulling back.", options: everyOptions, dimension: "avoidance" },
  { id: "12", title: "I often want to merge completely with romantic partners, and this sometimes scares them away.", options: everyOptions, dimension: "anxiety" },
  { id: "13", title: "I am nervous when partners get too close to me.", options: everyOptions, dimension: "avoidance" },
  { id: "14", title: "I worry about being alone.", options: everyOptions, dimension: "anxiety" },
  { id: "15", title: "I feel comfortable sharing my private thoughts and feelings with my partner.", options: everyOptions, dimension: "avoidance", reverse: true },
  { id: "16", title: "My desire to be very close sometimes scares people away.", options: everyOptions, dimension: "anxiety" },
  { id: "17", title: "I try to avoid getting too close to my partner.", options: everyOptions, dimension: "avoidance" },
  { id: "18", title: "I need a lot of reassurance that I am loved by my partner.", options: everyOptions, dimension: "anxiety" },
  { id: "19", title: "I find it relatively easy to get close to my partner.", options: everyOptions, dimension: "avoidance", reverse: true },
  { id: "20", title: "Sometimes I feel that I force my partners to show more feeling, more commitment.", options: everyOptions, dimension: "anxiety" },
  { id: "21", title: "I find it difficult to allow myself to depend on romantic partners.", options: everyOptions, dimension: "avoidance" },
  { id: "22", title: "I do not often worry about being abandoned.", options: everyOptions, dimension: "anxiety", reverse: true },
  { id: "23", title: "I prefer not to be too close to romantic partners.", options: everyOptions, dimension: "avoidance" },
  { id: "24", title: "If I can't get my partner to show interest in me, I get upset or angry.", options: everyOptions, dimension: "anxiety" },
  { id: "25", title: "I tell my partner just about everything.", options: everyOptions, dimension: "avoidance", reverse: true },
  { id: "26", title: "I find that my partner(s) don’t want to get as close as I would like.", options: everyOptions, dimension: "anxiety" },
  { id: "27", title: "I usually discuss my problems and concerns with my partner.", options: everyOptions, dimension: "avoidance", reverse: true },
  { id: "28", title: "When I'm not involved in a relationship, I feel somewhat anxious and insecure.", options: everyOptions, dimension: "anxiety" },
  { id: "29", title: "I feel comfortable depending on romantic partners.", options: everyOptions, dimension: "avoidance", reverse: true },
  { id: "30", title: "I get frustrated when my partner is not around as much as I would like.", options: everyOptions, dimension: "anxiety" },
  { id: "31", title: "I don't mind asking romantic partners for comfort, advice, or help.", options: everyOptions, dimension: "avoidance", reverse: true },
  { id: "32", title: "I get frustrated if romantic partners are not available when I need them.", options: everyOptions, dimension: "anxiety" },
  { id: "33", title: "It helps to turn to my romantic partner in times of need.", options: everyOptions, dimension: "avoidance", reverse: true },
  { id: "34", title: "When romantic partners disapprove of me, I feel really bad about myself.", options: everyOptions, dimension: "anxiety" },
  { id: "35", title: "I turn to my partner for many things, including comfort and reassurance.", options: everyOptions, dimension: "avoidance", reverse: true },
  { id: "36", title: "I resent it when my partner spends time away from me.", options: everyOptions, dimension: "anxiety" }
];
