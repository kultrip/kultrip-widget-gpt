import { Card } from "@/components/ui/card";
import { BookOpen, Film, Tv } from "lucide-react";

interface StoryCardProps {
  title: string;
  type: "book" | "film" | "tv";
  destination: string;
  onClick: () => void;
}

const typeIcons = {
  book: BookOpen,
  film: Film,
  tv: Tv,
};

const StoryCard = ({ title, type, destination, onClick }: StoryCardProps) => {
  const Icon = typeIcons[type];
  
  return (
    <Card 
      className="p-4 hover:shadow-medium transition-smooth cursor-pointer group bg-card"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-card-foreground group-hover:text-accent transition-smooth mb-1">
            {title}
          </h4>
          <p className="text-sm text-muted-foreground">Set in {destination}</p>
        </div>
      </div>
    </Card>
  );
};

export default StoryCard;
