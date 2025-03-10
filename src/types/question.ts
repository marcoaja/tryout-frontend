export interface Question {
  id: string;
  content: string;
  answer: boolean;
  points: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  tryoutId: string;
}

export interface QuestionCreateInput {
  content: string;
  answer: boolean;
  points?: number;
}

export interface QuestionUpdateInput {
  content?: string;
  answer?: boolean;
  points?: number;
}
