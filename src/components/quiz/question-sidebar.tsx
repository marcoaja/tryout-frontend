"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Trash2, ToggleLeft } from "lucide-react";
import type { Question } from "./quiz-creator";

interface QuestionItemProps {
  question: Question;
  isSelected: boolean;
  questionNumber: number; // Added question number prop
  onSelect: () => void;
  onDelete: () => void;
}

function QuestionItem({
  question,
  isSelected,
  questionNumber,
  onSelect,
  onDelete,
}: QuestionItemProps) {
  const isEmpty = !question.content || question.content.trim() === "";

  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? "bg-status-blue-background text-status-blue-foreground"
          : "hover:bg-status-neutral-background"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div
          className={`flex items-center justify-center w-6 h-6 rounded-md text-xs font-medium ${
            isSelected
              ? "bg-white text-status-blue-foreground"
              : "bg-status-neutral-background text-status-neutral-foreground"
          }`}
        >
          {questionNumber}
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm truncate max-w-[120px]">
              {isEmpty
                ? `Question ${questionNumber}`
                : `Question ${questionNumber}`}
            </span>
            {isEmpty && (
              <AlertCircle className="h-3 w-3 text-status-amber-foreground" />
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ToggleLeft className="h-4 w-4" />
            {isSelected ? (
              <span className="text-white">TRUE FALSE</span>
            ) : (
              <span>TRUE FALSE</span>
            )}
            {question.isDirty && (
              <span className="text-status-amber-foreground">*</span>
            )}
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface QuestionSidebarProps {
  questions: Question[];
  selectedId: string;
  onSelectQuestion: (id: string) => void;
  onDeleteQuestion: (id: string) => void;
}

export function QuestionSidebar({
  questions,
  selectedId,
  onSelectQuestion,
  onDeleteQuestion,
}: QuestionSidebarProps) {
  const emptyQuestions = questions.filter(
    (q) => !q.content || q.content.trim() === ""
  ).length;
  const dirtyQuestions = questions.filter((q) => q.isDirty).length;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold flex items-center gap-2">
          Questions{" "}
          <span className="text-status-blue-foreground">
            {questions.length}
          </span>
        </h2>
        {(emptyQuestions > 0 || dirtyQuestions > 0) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {emptyQuestions > 0 && (
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-status-amber-foreground" />
                <span>{emptyQuestions} empty</span>
              </div>
            )}
            {dirtyQuestions > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-status-amber-foreground">*</span>
                <span>{dirtyQuestions} unsaved</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="space-y-1">
        {questions.map((question, index) => (
          <QuestionItem
            key={question.id}
            question={question}
            questionNumber={index + 1} // Pass the question number as index + 1
            isSelected={selectedId === question.id}
            onSelect={() => onSelectQuestion(question.id)}
            onDelete={() => onDeleteQuestion(question.id)}
          />
        ))}
      </div>
    </Card>
  );
}
