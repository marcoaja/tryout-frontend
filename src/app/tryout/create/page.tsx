"use client";

import { QuizCreator } from "@/components/quiz/quiz-creator";

export default function CreateQuizPage() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-2">Create New Quiz</h1>
      <p className="text-muted-foreground mb-6">
        Design your quiz with multiple question types and customization options
      </p>
      <QuizCreator />
    </div>
  );
}
