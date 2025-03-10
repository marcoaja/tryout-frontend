"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QuizDetails } from "@/components/quiz/quiz-details";
import { fetchTryout } from "@/api/tryout";
import { fetchQuestions } from "@/api/question";
import { Tryout } from "@/types/tryout";
import { Question } from "@/types/question";

function Spinner() {
  return (
    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
  );
}

export default function TryoutDetailsPage() {
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

        const [tryoutData, questionsData] = await Promise.all([
          fetchTryout(id),
          fetchQuestions(id),
        ]);

        setTryout(tryoutData);
        setQuestions(questionsData);
      } catch (err) {
        console.error("Failed to load tryout details:", err);
        setError("Failed to load tryout details. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadTryoutData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
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

  const quiz = {
    id: tryout.id,
    title: tryout.title,
    description: tryout.description,
    category: tryout.category,
    createdAt: new Date(tryout.createdAt).toISOString().split("T")[0],
    updatedAt: new Date(tryout.updatedAt).toISOString().split("T")[0],
    timeLimit: tryout.timeLimit,
    totalQuestions: questions.length,
    totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
    questions: questions.map((q) => ({
      id: q.id,
      text: q.content,
      type: "true-false",
      points: q.points || 1,
    })),
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <QuizDetails quiz={quiz} quizId={id} />
    </div>
  );
}
