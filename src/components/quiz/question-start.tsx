"use client";

import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

interface QuestionViewProps {
  question: {
    id: string;
    content: string;
    answer: boolean;
    points: number;
  };
  selectedAnswers: string[];
  onAnswer: (selected: string[]) => void;
  isSubmitted: boolean;
}

export function QuestionView({
  question,
  selectedAnswers,
  onAnswer,
  isSubmitted,
}: QuestionViewProps) {
  const handleAnswerChange = (value: string) => {
    onAnswer([value]);
  };

  const getOptionStatus = (optionValue: string) => {
    if (!isSubmitted) return "default";

    const correctAnswer = question.answer ? "true" : "false";

    if (optionValue === correctAnswer) return "correct";
    if (selectedAnswers.includes(optionValue)) return "incorrect";

    return "default";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">True/False Question</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            {question.points} {question.points === 1 ? "point" : "points"}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{question.content}</h2>

        <RadioGroup
          value={selectedAnswers[0]}
          onValueChange={handleAnswerChange}
          className="space-y-3"
        >
          {/* True option */}
          <div
            className={cn(
              "flex items-center space-x-2 rounded-lg border p-4 transition-colors",
              getOptionStatus("true") === "correct" &&
                "bg-status-green-background border-status-green-foreground",
              getOptionStatus("true") === "incorrect" &&
                "bg-status-red-background border-status-red-foreground",
              !isSubmitted && "hover:bg-status-neutral-background"
            )}
          >
            <RadioGroupItem
              value="true"
              id="option-true"
              disabled={isSubmitted}
              className="sr-only"
            />
            <Label htmlFor="option-true" className="flex-1 cursor-pointer">
              True
            </Label>
          </div>

          {/* False option */}
          <div
            className={cn(
              "flex items-center space-x-2 rounded-lg border p-4 transition-colors",
              getOptionStatus("false") === "correct" &&
                "bg-status-green-background border-status-green-foreground",
              getOptionStatus("false") === "incorrect" &&
                "bg-status-red-background border-status-red-foreground",
              !isSubmitted && "hover:bg-status-neutral-background"
            )}
          >
            <RadioGroupItem
              value="false"
              id="option-false"
              disabled={isSubmitted}
              className="sr-only"
            />
            <Label htmlFor="option-false" className="flex-1 cursor-pointer">
              False
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Removed image handling as it's not part of our simplified schema */}
    </div>
  );
}
