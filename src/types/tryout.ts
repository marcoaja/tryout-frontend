import { Question } from "./question";

export interface Tryout {
  id: string;
  title: string;
  description: string;
  category: string;
  timeLimit: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  questions?: Question[];
  _count?: {
    questions?: number;
  };
}

export interface TryoutCreateInput {
  title: string;
  description: string;
  category: string;
  timeLimit: number;
}

export interface TryoutUpdateInput {
  title?: string;
  description?: string;
  category?: string;
  timeLimit?: number;
}
