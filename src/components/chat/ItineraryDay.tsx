import { Card } from "@/components/ui/card";
import { Coffee, Utensils, Camera, Moon } from "lucide-react";

interface TimeSlot {
  time: string;
  activity: string;
  location: string;
  icon: "morning" | "lunch" | "afternoon" | "evening";
}

interface ItineraryDayProps {
  dayNumber: number;
  title: string;
  slots: TimeSlot[];
}

const iconMap = {
  morning: Coffee,
  lunch: Utensils,
  afternoon: Camera,
  evening: Moon,
};

const ItineraryDay = ({ dayNumber, title, slots }: ItineraryDayProps) => {
  return (
    <Card className="p-4 bg-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-gradient-adventure flex items-center justify-center text-primary-foreground font-bold">
          {dayNumber}
        </div>
        <div>
          <h4 className="font-semibold text-card-foreground">Day {dayNumber}</h4>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {slots.map((slot, idx) => {
          const Icon = iconMap[slot.icon];
          return (
            <div key={idx} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">{slot.time}</div>
                <div className="text-sm font-medium text-foreground">{slot.activity}</div>
                <div className="text-xs text-muted-foreground">{slot.location}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ItineraryDay;
