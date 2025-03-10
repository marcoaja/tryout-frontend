"use client";

import { useState, useEffect, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { fetchTryout, updateTryout, deleteTryout } from "@/api/tryout";
import { TryoutUpdateInput } from "@/types/tryout";

export default function TryoutEditPage() {
  const router = useRouter();
  const params = useParams();
  const tryoutId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tryout, setTryout] = useState({
    title: "",
    description: "",
    category: "",
    timeLimit: 30,
  });

  // Load tryout data
  useEffect(() => {
    const loadTryout = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTryout(tryoutId);

        setTryout({
          title: data.title,
          description: data.description || "",
          category: data.category || "",
          timeLimit: data.timeLimit || 30,
        });
      } catch (error) {
        console.error("Error loading tryout:", error);
        toast.error("Failed to load tryout");
      } finally {
        setIsLoading(false);
      }
    };

    if (tryoutId) {
      loadTryout();
    }
  }, [tryoutId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!tryout.title.trim()) {
      toast.error("Please enter a title for the tryout");
      return;
    }

    if (!tryout.category.trim()) {
      toast.error("Please enter a category for the tryout");
      return;
    }

    try {
      setIsSaving(true);

      // Using your existing updateTryout function with the provided date
      const updates: TryoutUpdateInput = {
        title: tryout.title,
        description: tryout.description,
        category: tryout.category,
        timeLimit: tryout.timeLimit,
      };

      await updateTryout(tryoutId, updates);

      toast.success("Tryout updated successfully");
      router.push(`/dashboard/${tryoutId}/details`);
    } catch (error) {
      console.error("Error updating tryout:", error);
      toast.error("Failed to update tryout");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this tryout? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteTryout(tryoutId);
      toast.success("Tryout deleted successfully");
      router.push("/tryouts");
    } catch (error) {
      console.error("Error deleting tryout:", error);
      toast.error("Failed to delete tryout");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTryout({
      ...tryout,
      [name]: name === "timeLimit" ? parseInt(value) || 1 : value,
    });
  };

  const goBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 container py-6">
      <Button variant="ghost" onClick={goBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Tryout Details
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Tryout</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Tryout Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={tryout.title}
                  onChange={handleChange}
                  placeholder="Enter tryout title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Tryout Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={tryout.description}
                  onChange={handleChange}
                  placeholder="Enter tryout description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                  <Input
                    id="timeLimit"
                    name="timeLimit"
                    type="number"
                    min="1"
                    value={tryout.timeLimit}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Total time allowed for this tryout
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="category"
                    name="category"
                    type="text"
                    value={tryout.category}
                    onChange={handleChange}
                    placeholder="Math, Science, History, etc."
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Choose a category for your tryout
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete Tryout
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
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
