"use client";

import { useState } from "react";
import Link from "next/link";
import { QuestionSidebar } from "./question-sidebar";
import { QuestionView } from "./question-start";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Play,
  Clock,
  Award,
  CheckCircle,
  Info,
} from "lucide-react";

interface Tryout {
  id: string;
  title: string;

  questions: Question[];
  timeLimit?: number;
  description: string;
}

interface Question {
  id: string;
  content: string;
  answer: boolean;
  points: number;
}
interface QuizInterfaceProps {
  tryout: Tryout;
}

export function QuizInterface({ tryout }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const currentQuestion = tryout.questions[currentQuestionIndex];
  const totalQuestions = tryout.questions.length;
  const totalPoints = tryout.questions.reduce((sum, q) => sum + q.points, 0);

  const handleAnswer = (questionId: string, selectedAnswers: string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswers,
    }));
  };

  const navigateQuestion = (direction: "prev" | "next") => {
    if (direction === "prev" && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (
      direction === "next" &&
      currentQuestionIndex < totalQuestions - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = tryout.questions.reduce((total, question) => {
      const userAnswer = answers[question.id] || [];
      const correctAnswer = question.answer ? "true" : "false";
      return total + (userAnswer.includes(correctAnswer) ? question.points : 0);
    }, 0);

    console.log("Tryout submitted with score:", score);
  };

  const isQuestionAnswered = (questionId: string) => {
    return !!answers[questionId];
  };

  const startQuiz = () => {
    setIsStarted(true);
  };

  if (!isStarted) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{tryout.title}</CardTitle>
          <Link
            href={`/dashboard/${tryout.id}/details`}
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2"
          >
            <Info className="h-4 w-4" />
            View Tryout Details
          </Link>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-status-neutral-background rounded-lg">
              <CheckCircle className="h-8 w-8 mb-2 text-status-green-foreground" />
              <div className="text-xl font-bold">{totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-status-neutral-background rounded-lg">
              <Clock className="h-8 w-8 mb-2 text-status-blue-background" />
              <div className="text-xl font-bold">
                {tryout.timeLimit || "No"}
              </div>
              <div className="text-sm text-muted-foreground">Time Limit</div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-status-neutral-background rounded-lg">
              <Award className="h-8 w-8 mb-2 text-status-orange-foreground" />
              <div className="text-xl font-bold">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <div>{tryout.description || "No Description"}</div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={startQuiz}
            className="w-full gap-2 bg-status-blue-background text-status-blue-foreground"
          >
            <Play className="h-4 w-4" />
            Start Tryout
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Format questions for sidebar
  const sidebarQuestions = tryout.questions.map((q, index) => ({
    id: q.id,
    content: q.content,
    position: index + 1,
    answer: q.answer,
    points: q.points,
  }));

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-64">
        <QuestionSidebar
          questions={sidebarQuestions}
          selectedId={currentQuestion.id}
          onSelectQuestion={(id) => {
            const index = tryout.questions.findIndex((q) => q.id === id);
            if (index >= 0) setCurrentQuestionIndex(index);
          }}
          onDeleteQuestion={() => {}}
        />
      </div>

      <div className="flex-1">
        <Card className="p-6">
          <QuestionView
            question={currentQuestion}
            selectedAnswers={answers[currentQuestion.id] || []}
            onAnswer={(selected) => handleAnswer(currentQuestion.id, selected)}
            isSubmitted={isSubmitted}
          />

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => navigateQuestion("prev")}
              disabled={currentQuestionIndex === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={
                  isSubmitted || !isQuestionAnswered(currentQuestion.id)
                }
                className="gap-2 bg-status-blue-background text-status-blue-foreground"
              >
                <Send className="h-4 w-4" />
                Submit Tryout
              </Button>
            ) : (
              <Button
                onClick={() => navigateQuestion("next")}
                disabled={!isQuestionAnswered(currentQuestion.id)}
                className="gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
