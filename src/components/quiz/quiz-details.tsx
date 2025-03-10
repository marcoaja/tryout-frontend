"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  CheckSquare,
  ToggleLeft,
  ArrowLeft,
  Play,
  Star,
  Plus,
  Edit,
  Settings,
} from "lucide-react";

interface QuestionForDisplay {
  id: string;
  text: string;
  type: string;
  points: number;
}

interface QuizForDisplay {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  timeLimit: number;
  totalQuestions: number;
  totalPoints: number;
  questions: QuestionForDisplay[];
}

interface QuizDetailsProps {
  quiz: QuizForDisplay;
  quizId: string;
}

export function QuizDetails({ quiz, quizId }: QuizDetailsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const startQuiz = () => {
    router.push(`/tryouts/${quizId}`);
  };

  const goBack = () => {
    router.back();
  };

  const editTryout = () => {
    router.push(`/tryout/${quizId}/edit`);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "true-false":
        return <ToggleLeft className="h-4 w-4" />;
      default:
        return <CheckSquare className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={goBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Tryouts
      </Button>

      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-3xl font-bold">{quiz.title}</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button onClick={editTryout} variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Edit Tryout
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quiz.totalQuestions}</div>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{quiz.totalPoints} total points</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Time Limit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quiz.timeLimit} minutes</div>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {Math.round(quiz.timeLimit / quiz.totalQuestions || 1)} minutes
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">True/False</div>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <ToggleLeft className="h-4 w-4" />
              <span>Simple true/false questions</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tryout Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Created</div>
                  <div>{formatDate(quiz.createdAt)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Last updated
                  </div>
                  <div>{formatDate(quiz.updatedAt)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Visibility
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Type</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-status-neutral-background rounded-lg">
                {quiz.description}
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
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Question List</CardTitle>
                <CardDescription>
                  This tryout contains {quiz.totalQuestions} questions worth{" "}
                  {quiz.totalPoints} points
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quiz.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="p-4 border rounded-lg hover:border-primary hover:shadow-sm cursor-pointer transition-all group"
                    onClick={() =>
                      router.push(
                        `/tryout/${quizId}/questions/${question.id}/edit`
                      )
                    }
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-status-neutral-background text-status-neutral-foreground text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {getQuestionTypeIcon(question.type)}
                        <span className="capitalize">True/False</span>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>
                            {question.points}{" "}
                            {question.points === 1 ? "point" : "points"}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </div>
                    </div>

                    <div className="text-base font-medium mb-3">
                      {question.text}
                    </div>

                    {/* True/False options */}
                    <div className="mt-2 grid grid-cols-2 gap-2 max-w-xs">
                      <div className="text-sm p-2 bg-muted rounded-md flex items-center justify-center">
                        True
                      </div>
                      <div className="text-sm p-2 bg-muted rounded-md flex items-center justify-center">
                        False
                      </div>
                    </div>

                    {/* Edit indicator */}
                    <div className="mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <Edit className="h-3 w-3" />
                      <span>Click to edit this question</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
