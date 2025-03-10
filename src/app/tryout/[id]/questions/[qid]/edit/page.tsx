"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuestionSidebar } from "@/components/quiz/question-sidebar";
import { TrueFalseEditor } from "@/components/quiz/true-false-question";
import { Button } from "@/components/ui/button";
import { Plus, Save, ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { fetchTryout, updateTryout } from "@/api/tryout";
import {
  fetchQuestions,
  createQuestion,
  updateQuestion as apiUpdateQuestion,
  deleteQuestion as apiDeleteQuestion,
} from "@/api/question";
import { QuestionUpdateInput, QuestionCreateInput } from "@/types/question";

export type Question = {
  id: string;
  content: string;
  answer: boolean;
  points: number;
  isDirty?: boolean;
};

export default function TryoutEditPage() {
  const router = useRouter();
  const params = useParams();
  const tryoutId = params.id as string;
  console.log(tryoutId);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
  const [tryoutTitle, setTryoutTitle] = useState("");

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Load tryout and questions
  useEffect(() => {
    const loadTryoutAndQuestions = async () => {
      try {
        setIsLoading(true);

        // First fetch the tryout for basic info
        const tryoutData = await fetchTryout(tryoutId);
        setTryoutTitle(tryoutData.title);

        // Then fetch all questions
        const questionsData = await fetchQuestions(tryoutId);

        // Convert API questions to our format
        const formattedQuestions: Question[] = questionsData.map((q) => ({
          id: q.id,
          content: q.content,
          answer: q.answer,
          points: q.points,
          isDirty: false,
        }));

        setQuestions(formattedQuestions);

        // Select the first question if any
        if (formattedQuestions.length > 0) {
          setSelectedQuestionId(formattedQuestions[0].id);
        }
      } catch (error) {
        console.error("Error loading tryout data:", error);
        toast.error("Failed to load tryout data");
      } finally {
        setIsLoading(false);
      }
    };

    if (tryoutId) {
      loadTryoutAndQuestions();
    }
  }, [tryoutId]);

  // Add a new question
  const addQuestion = async () => {
    try {
      setIsCreatingQuestion(true);

      const newQuestion: Question = {
        id: Date.now().toString(),
        content: `Question ${questions.length + 1}`,
        answer: true,
        points: 1,
        isDirty: true,
      };

      setQuestions([...questions, newQuestion]);
      setSelectedQuestionId(newQuestion.id);
    } catch (error) {
      toast.error("Failed to add question");
      console.error(error);
    } finally {
      setIsCreatingQuestion(false);
    }
  };

  // Update a question locally
  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions(
      questions.map((q) =>
        q.id === updatedQuestion.id ? { ...updatedQuestion, isDirty: true } : q
      )
    );
  };

  // Save a single question
  const saveQuestion = async (id: string) => {
    const question = questions.find((q) => q.id === id);
    if (!question) return;

    try {
      setIsSaving(true);

      // If ID is a Date timestamp, it's a new question that needs to be created
      if (id.length > 10) {
        // Checking if it's a temporary ID
        const questionInput: QuestionCreateInput = {
          content: question.content,
          answer: question.answer,
          points: question.points,
        };

        const createdQuestion = await createQuestion(tryoutId, questionInput);

        // Update our questions array by replacing the temp question with the created one
        setQuestions(
          questions.map((q) =>
            q.id === id
              ? {
                  id: createdQuestion.id,
                  content: createdQuestion.content,
                  answer: createdQuestion.answer,
                  points: createdQuestion.points,
                  isDirty: false,
                }
              : q
          )
        );

        // Update the selected question ID to the new ID
        setSelectedQuestionId(createdQuestion.id);
      } else {
        // Otherwise update the existing question
        const questionInput: QuestionUpdateInput = {
          content: question.content,
          answer: question.answer,
          points: question.points,
        };

        await apiUpdateQuestion(id, questionInput);

        // Mark as not dirty
        setQuestions(
          questions.map((q) => (q.id === id ? { ...q, isDirty: false } : q))
        );
      }

      toast.success("Question saved successfully");
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Failed to save question");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a question
  const deleteQuestion = async (id: string) => {
    // Check if it's a temporary ID (not yet saved to backend)
    const isTemporary = id.length > 10;

    try {
      if (!isTemporary) {
        // Confirm deletion
        if (!confirm("Are you sure you want to delete this question?")) {
          return;
        }

        // Delete from API if it's already saved
        await apiDeleteQuestion(id);
      }

      // Remove from state
      const newQuestions = questions.filter((q) => q.id !== id);
      setQuestions(newQuestions);

      // Select another question if available
      if (selectedQuestionId === id) {
        setSelectedQuestionId(newQuestions[0]?.id || "");
      }

      toast.success("Question deleted successfully");
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete question");
    }
  };

  // Convert questions to SidebarQuestion format for the sidebar
  const sidebarQuestions = questions.map((q, index) => ({
    id: q.id,
    content: q.content,
    position: index + 1,
    answer: q.answer,
    points: q.points,
    isDirty: q.isDirty,
  }));

  const filteredQuestions = sidebarQuestions.filter((q) =>
    q.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);

  const goBack = () => {
    router.push(`/dashboard/${tryoutId}/details`);
  };

  const saveAllAndExit = async () => {
    try {
      setIsSaving(true);

      // Save any unsaved questions
      const dirtyQuestions = questions.filter((q) => q.isDirty);

      for (const question of dirtyQuestions) {
        await saveQuestion(question.id);
      }

      toast.success("All changes saved successfully");
      router.push(`/dashboard/${tryoutId}/details`);
    } catch (error) {
      console.error("Error saving all changes:", error);
      toast.error("Failed to save all changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={goBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tryout Details
        </Button>
        <h1 className="text-2xl font-bold">
          Editing Questions for: {tryoutTitle}
        </h1>
      </div>

      {/* Questions Editor */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex flex-col gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 absolute left-2.5 top-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {questions.length > 0 ? (
            <QuestionSidebar
              questions={filteredQuestions}
              selectedId={selectedQuestionId}
              onSelectQuestion={setSelectedQuestionId}
              onDeleteQuestion={deleteQuestion}
            />
          ) : (
            <div className="text-center p-4 border rounded-md text-muted-foreground">
              No questions yet. Click the button below to add your first
              question.
            </div>
          )}

          <Button
            type="button"
            onClick={addQuestion}
            className="w-full gap-2 bg-status-blue-background text-status-blue-foreground"
            disabled={isCreatingQuestion}
          >
            {isCreatingQuestion ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add True/False Question
          </Button>
        </div>
        <div className="flex-1">
          {selectedQuestion ? (
            <TrueFalseEditor
              question={selectedQuestion}
              onUpdate={updateQuestion}
              onSave={() => saveQuestion(selectedQuestion.id)}
              questionNumber={
                questions.findIndex((q) => q.id === selectedQuestion.id) + 1
              }
            />
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <div className="text-muted-foreground">
                  {questions.length === 0
                    ? "Add a question to get started"
                    : "Select a question from the sidebar"}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          onClick={saveAllAndExit}
          className="gap-2 bg-status-blue-background text-status-blue-foreground"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
