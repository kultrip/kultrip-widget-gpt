import { Card } from "@/components/ui/card";
import { MapPin, Clock, DollarSign } from "lucide-react";

interface ActivityCardProps {
  title: string;
  location: string;
  duration: string;
  price: string;
  imageUrl?: string;
  storyConnection?: string;
}

const ActivityCard = ({ title, location, duration, price, imageUrl, storyConnection }: ActivityCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-medium transition-smooth group cursor-pointer">
      {imageUrl && (
        <div className="aspect-video bg-muted overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-4">
        <h4 className="font-semibold text-card-foreground mb-2 group-hover:text-accent transition-smooth">
          {title}
        </h4>
        {storyConnection && (
          <p className="text-xs text-accent mb-2 flex items-center gap-1">
            ✨ {storyConnection}
          </p>
        )}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>{price}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivityCard;
