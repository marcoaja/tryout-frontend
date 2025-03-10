"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TryoutCard } from "@/components/quiz/tryout-card";
import Link from "next/link";
import { toast } from "sonner";
import { Tryout } from "@/types/tryout";
import { fetchTryouts } from "@/api/tryout";
import { formatDistanceToNow } from "date-fns";

export default function TryoutPage() {
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTryouts = async () => {
      try {
        setLoading(true);
        const data = await fetchTryouts();
        setTryouts(data);
      } catch (error) {
        console.error("Failed to load tryouts:", error);
        toast.error("Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    loadTryouts();
  }, []);

  // Format date for display
  const formatTime = (dateString: string | Date) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "recently";
    }
  };

  return (
    <div className="mx-auto p-4 bg-background text-foreground">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tryouts</h1>
      </div>

      <div>
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-pulse">Loading quizzes...</div>
          </div>
        ) : tryouts.length === 0 ? (
          <div className="text-center p-12 border border-dashed rounded-lg">
            <h3 className="text-lg font-medium mb-2">No quizzes yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first quiz to get started
            </p>
            <Link href="/tryout/create">
              <Button className="bg-status-blue-background hover:bg-status-blue-background/80">
                Create New Quiz
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tryouts.map((tryout) => (
              <Link key={tryout.id} href={`/dashboard/${tryout.id}`}>
                <TryoutCard
                  tryout={{
                    id: tryout.id,
                    title: tryout.title,
                    description: tryout.description,
                    category: tryout.category,
                    timeLimit: tryout.timeLimit,
                    createdAt: formatTime(tryout.createdAt),
                    _count: {
                      questions: tryout._count?.questions || 0,
                    },
                  }}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
