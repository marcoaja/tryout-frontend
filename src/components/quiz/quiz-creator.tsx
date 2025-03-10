"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { QuestionSidebar } from "./question-sidebar";
import { TrueFalseEditor } from "./true-false-question";
import { Button } from "@/components/ui/button";
import { Plus, Save, Eye, ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createTryout } from "@/api/tryout";
import { createQuestion } from "@/api/question";
import { TryoutCreateInput } from "@/types/tryout";
import { QuestionCreateInput } from "@/types/question";

export type Question = {
  id: string;
  content: string;
  answer: boolean;
  points: number;
  isDirty?: boolean;
};

export type TryoutSettings = {
  title: string;
  description: string;
  category: string;
  timeLimit: number;
};

export function QuizCreator() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"questions" | "preview">(
    "questions"
  );
  const [tryoutSettings, setTryoutSettings] = useState<TryoutSettings>({
    title: "",
    description: "",
    category: "",
    timeLimit: 30,
  });

  // Empty initial state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);

  const addQuestion = () => {
    try {
      setIsCreatingQuestion(true);

      const newQuestion: Question = {
        id: Date.now().toString(), // Temporary client-side ID
        content: `Question ${questions.length + 1}`, // Default question title
        answer: true, // Default to true
        points: 1, // Default points
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

  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions(
      questions.map((q) =>
        q.id === updatedQuestion.id ? { ...updatedQuestion, isDirty: true } : q
      )
    );
  };

  const saveQuestion = (id: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, isDirty: false } : q))
    );
  };

  const deleteQuestion = (id: string) => {
    const newQuestions = questions.filter((q) => q.id !== id);
    setQuestions(newQuestions);
    if (selectedQuestionId === id) {
      setSelectedQuestionId(newQuestions[0]?.id || "");
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);

  const updateTryoutSetting = (key: keyof TryoutSettings, value: any) => {
    setTryoutSettings({
      ...tryoutSettings,
      [key]: value,
    });
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const validateForm = () => {
    if (!tryoutSettings.title.trim()) {
      toast.error("Please enter a title for the tryout");
      return false;
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return false;
    }

    return true;
  };

  const formatCurrentDate = () => {
    // Using the provided format: "2025-03-10 12:11:16"
    return "2025-03-10 12:11:16";
  };

  const saveTryout = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      // Create tryout using the imported API function
      console.log("Creating tryout...");

      const tryoutInput: TryoutCreateInput = {
        title: tryoutSettings.title,
        category: tryoutSettings.category,
        description: tryoutSettings.description,
        timeLimit: tryoutSettings.timeLimit,
      };

      const createdTryout = await createTryout(tryoutInput);
      console.log("Tryout created:", createdTryout);

      const tryoutId = createdTryout.id;

      // Create each question using the imported API function
      console.log(
        `Creating ${questions.length} questions for tryout ${tryoutId}...`
      );

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        console.log(`Creating question ${i + 1}:`, question);

        const questionInput: QuestionCreateInput = {
          content: question.content || `Question ${i + 1}`,
          answer: question.answer,
          points: question.points,
        };

        await createQuestion(tryoutId, questionInput);
        console.log(`Question ${i + 1} created successfully`);
      }

      toast.success("Tryout created successfully!");

      // Redirect to the new tryout
      router.push(`/dashboard`);
    } catch (error) {
      console.error("Error during save:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save tryout"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="questions">Create</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Create Tab */}
        <TabsContent value="questions">
          <form onSubmit={saveTryout} className="space-y-6">
            {/* Tryout Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tryout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Tryout Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={tryoutSettings.title}
                      onChange={(e) =>
                        updateTryoutSetting("title", e.target.value)
                      }
                      placeholder="Enter tryout title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Tryout Description</Label>
                    <Textarea
                      id="description"
                      value={tryoutSettings.description}
                      onChange={(e) =>
                        updateTryoutSetting("description", e.target.value)
                      }
                      placeholder="Enter tryout description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                      <Input
                        id="timeLimit"
                        type="number"
                        min="1"
                        value={tryoutSettings.timeLimit}
                        onChange={(e) =>
                          updateTryoutSetting(
                            "timeLimit",
                            Number.parseInt(e.target.value) || 1
                          )
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Total time allowed for this tryout
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        placeholder="Math"
                        value={tryoutSettings.category}
                        onChange={(e) =>
                          updateTryoutSetting("category", e.target.value)
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Tryout Category
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                      questions.findIndex((q) => q.id === selectedQuestion.id) +
                      1
                    }
                  />
                ) : (
                  <Card className="p-8 text-center">
                    <div className="text-muted-foreground">
                      {questions.length === 0
                        ? "No Questions"
                        : "Select a question from the sidebar"}
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("preview")}
                className="gap-2"
                disabled={questions.length === 0}
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                type="submit"
                className="gap-2 bg-status-blue-background text-status-blue-foreground"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Create Tryout
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Tryout Preview</CardTitle>
              <CardDescription>
                This is how your True/False tryout will appear to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <div className="p-8 text-center border rounded-lg">
                  <p className="text-muted-foreground">
                    Add questions to see a preview
                  </p>
                </div>
              ) : (
                <div className="p-6 border rounded-lg">
                  <h2 className="text-2xl font-bold mb-2">
                    {tryoutSettings.title || "Untitled Tryout"}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {tryoutSettings.description || "No description provided"}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Questions:</span>
                      <span className="font-medium">{questions.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">
                        Total Points:
                      </span>
                      <span className="font-medium">{totalPoints}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Time Limit:</span>
                      <span className="font-medium">
                        {tryoutSettings.timeLimit} mins
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {questions.slice(0, 3).map((question, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-status-blue-background text-white text-xs font-medium">
                            {index + 1}
                          </div>
                          <h3 className="font-medium">
                            {question.content || "Untitled Question"}
                          </h3>
                        </div>

                        <div className="ml-8 grid grid-cols-2 gap-3 max-w-xs">
                          <div className="flex items-center border rounded-md p-3 hover:bg-gray-50">
                            <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                            <span>True</span>
                          </div>
                          <div className="flex items-center border rounded-md p-3 hover:bg-gray-50">
                            <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                            <span>False</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {questions.length > 3 && (
                      <div className="text-center text-muted-foreground">
                        + {questions.length - 3} more questions
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => setActiveTab("questions")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Editor
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
