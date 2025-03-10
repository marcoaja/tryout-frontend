"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ToggleLeft, Star } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Question } from "./quiz-creator";

interface TrueFalseEditorProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onSave: () => void;
  questionNumber?: number;
}

export function TrueFalseEditor({
  question,
  onUpdate,
  onSave,
  questionNumber,
}: TrueFalseEditorProps) {
  const updateField = (field: keyof Question, value: any) => {
    onUpdate({ ...question, [field]: value });
  };

  const displayNumber = questionNumber;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-status-blue-background text-status-blue-foreground h-8 w-8 flex items-center justify-center rounded-md p-0"
          >
            <ToggleLeft className="h-5 w-5" />
          </Badge>
          <span className="font-medium">True/False Question</span>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-status-neutral-background text-status-neutral-foreground text-sm font-medium">
              {displayNumber}
            </div>
            <Input
              value={question.content}
              onChange={(e) => updateField("content", e.target.value)}
              placeholder="Enter your true/false statement"
              className="text-lg font-medium"
            />
          </div>
        </div>

        {/* True/False Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Correct Answer</h3>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">
                {question.points} {question.points === 1 ? "point" : "points"}
              </span>
            </div>
          </div>

          <RadioGroup
            value={question.answer ? "true" : "false"}
            onValueChange={(value) => updateField("answer", value === "true")}
            className="flex gap-4"
          >
            <div className="flex-1">
              <div
                className={`flex items-center space-x-2 p-4 rounded-lg border ${
                  question.answer
                    ? "bg-status-green-background border-status-green-foreground"
                    : ""
                }`}
              >
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true" className="cursor-pointer font-medium">
                  True
                </Label>
              </div>
            </div>
            <div className="flex-1">
              <div
                className={`flex items-center space-x-2 p-4 rounded-lg border ${
                  !question.answer
                    ? "bg-status-green-background border-status-green-foreground"
                    : ""
                }`}
              >
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false" className="cursor-pointer font-medium">
                  False
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Points Section */}
        <div className="space-y-2 pt-4 border-t">
          <Label>Points</Label>
          <Input
            type="number"
            min="1"
            value={question.points}
            onChange={(e) =>
              updateField("points", Number.parseInt(e.target.value) || 1)
            }
            className="max-w-[150px]"
          />
          <p className="text-xs text-muted-foreground">
            Value of this question
          </p>
        </div>
      </div>
    </Card>
  );
}
