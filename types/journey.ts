export type StepType = 'question' | 'meditation';  

export type QuestionItem =
  | {
      /** Multiple-choice prompt */
      type: 'choice';
      id: string;
      text: string;
      options: string[];
    }
  | {
      /** Open-ended text prompt */
      type: 'text';
      id: string;
      text: string;
    };

export interface StepPayloadQuestion {
  questions: QuestionItem[];
  /** How you’ll evaluate answers later (leave as-is for now) */
  scoring: 'sum' | 'custom' | "none";
}

/* ----------   Media payload (unchanged)   ---------- */

export interface StepPayloadMedia {
  url: string;
}

/* ----------   Step & Journey containers   ---------- */

export interface StepBase<T extends StepType, P> {
  id: string;
  type: T;
  author: string;
  title: string;
  order: number;
  gradient?: string[];
  payload: P;
  locked?: boolean;
  prerequisites?: string[];
}

export type Step =
  | StepBase<'question', StepPayloadQuestion>
  | StepBase<'meditation', StepPayloadMedia>;

export interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
  steps: Step[];
}

export interface Journey {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  tags: string[];
  keywords: string[];
  isPublished: boolean;
  sections: Section[];
}
