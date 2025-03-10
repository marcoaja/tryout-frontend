import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MoreHorizontal } from "lucide-react";

interface TryoutCardProps {
  tryout: {
    id: string;
    title: string;
    description: string;
    category: string;
    timeLimit: number;
    createdAt?: string;
    _count?: {
      questions?: number;
    };
  };
  onClick?: () => void;
}

export function TryoutCard({ tryout, onClick }: TryoutCardProps) {
  // Get question count or default to 0
  const questionCount = tryout._count?.questions || 0;
  const createdTime = tryout.createdAt || "recently";

  return (
    <Card
      className="overflow-hidden bg-card hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <div className="w-full h-32 bg-blue-100"></div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-sm sm:text-base line-clamp-2 text-card-foreground">
            {tryout.title}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          {/* Time Limit Badge */}
          <Badge
            variant="outline"
            className="text-xs flex items-center gap-1 bg-blue-50 text-blue-700"
          >
            <Clock className="h-3 w-3" />
            {tryout.timeLimit} min
          </Badge>
          <Badge
            variant="outline"
            className="text-xs flex items-center gap-1 bg-status-orange-foreground text-status-orange-background"
          >
            {tryout.category}
          </Badge>
        </div>

        <div className="flex items-center justify-between mt-3 text-xs sm:text-sm text-muted-foreground">
          <span>Created {createdTime}</span>
          <span>
            {questionCount} Question{questionCount !== 1 ? "s" : ""}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
