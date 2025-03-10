"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QuizInterface } from "@/components/quiz/quiz-interface";
import { fetchTryout } from "@/api/tryout";
import { fetchQuestions } from "@/api/question";
import { Tryout } from "@/types/tryout";
import { Question } from "@/types/question";

export default function TryoutPage() {
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [tryout, setTryout] = useState<Tryout | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTryoutData() {
      try {
        setLoading(true);

        // Fetch tryout and questions in parallel
        const [tryoutData, questionsData] = await Promise.all([
          fetchTryout(id),
          fetchQuestions(id),
        ]);

        setTryout(tryoutData);
        setQuestions(questionsData);
      } catch (err) {
        console.error("Failed to load tryout:", err);
        setError("Failed to load the tryout. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadTryoutData();
    }
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">loading</div>;
  }

  if (error || !tryout) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="p-6 bg-red-50 text-red-800 rounded-lg">
          <h2 className="text-xl font-medium mb-2">Error</h2>
          <p>{error || "Tryout not found"}</p>
        </div>
      </div>
    );
  }

  // Format quiz data for the QuizInterface component
  const quiz = {
    id: tryout.id,
    title: tryout.title,
    category: tryout.category,
    description: tryout.description,
    timeLimit: tryout.timeLimit,
    questions: questions.map((q) => ({
      id: q.id,
      content: q.content,
      answer: q.answer,
      points: q.points,
    })),
  };

  return (
    <div className="container mx-auto p-4">
      <QuizInterface tryout={quiz} />
    </div>
  );
}
