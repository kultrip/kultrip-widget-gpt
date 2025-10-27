import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  Heart, 
  Users, 
  User, 
  Baby, 
  Crown, 
  Wallet, 
  Camera, 
  Utensils, 
  MapPin, 
  Palette, 
  Mountain, 
  Building,
  Wine,
  ShoppingBag,
  Moon,
  Sun
} from "lucide-react";

interface PreferenceOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: 'group' | 'budget' | 'interests' | 'pace';
  description: string;
}

const preferenceOptions: PreferenceOption[] = [
  // Group Type
  { id: 'solo', label: 'Solo Travel', icon: <User className="w-4 h-4" />, category: 'group', description: 'Independent exploration' },
  { id: 'couple', label: 'Romantic Trip', icon: <Heart className="w-4 h-4" />, category: 'group', description: 'Intimate experiences for two' },
  { id: 'friends', label: 'With Friends', icon: <Users className="w-4 h-4" />, category: 'group', description: 'Fun group activities' },
  { id: 'family', label: 'Family Trip', icon: <Baby className="w-4 h-4" />, category: 'group', description: 'Kid-friendly adventures' },
  
  // Budget Style
  { id: 'luxury', label: 'Luxury', icon: <Crown className="w-4 h-4" />, category: 'budget', description: 'Premium experiences' },
  { id: 'budget', label: 'Budget-Friendly', icon: <Wallet className="w-4 h-4" />, category: 'budget', description: 'Affordable options' },
  
  // Interests
  { id: 'photography', label: 'Photography', icon: <Camera className="w-4 h-4" />, category: 'interests', description: 'Scenic photo spots' },
  { id: 'gastronomy', label: 'Food & Drinks', icon: <Utensils className="w-4 h-4" />, category: 'interests', description: 'Local cuisine experiences' },
  { id: 'history', label: 'Museums & History', icon: <Building className="w-4 h-4" />, category: 'interests', description: 'Cultural heritage sites' },
  { id: 'arts', label: 'Arts & Culture', icon: <Palette className="w-4 h-4" />, category: 'interests', description: 'Galleries and performances' },
  { id: 'nature', label: 'Nature & Outdoors', icon: <Mountain className="w-4 h-4" />, category: 'interests', description: 'Parks and outdoor activities' },
  { id: 'nightlife', label: 'Nightlife', icon: <Moon className="w-4 h-4" />, category: 'interests', description: 'Bars and evening entertainment' },
  { id: 'shopping', label: 'Shopping', icon: <ShoppingBag className="w-4 h-4" />, category: 'interests', description: 'Local markets and boutiques' },
  { id: 'wine', label: 'Wine & Tastings', icon: <Wine className="w-4 h-4" />, category: 'interests', description: 'Wine tours and tastings' },
  
  // Travel Pace
  { id: 'relaxed', label: 'Relaxed Pace', icon: <Sun className="w-4 h-4" />, category: 'pace', description: 'Slow travel with rest time' },
  { id: 'active', label: 'Action-Packed', icon: <MapPin className="w-4 h-4" />, category: 'pace', description: 'Maximize experiences' },
];

interface PreferenceCardsProps {
  onPreferencesSelect: (preferences: string[]) => void;
  selectedPreferences: string[];
}

export function PreferenceCards({ onPreferencesSelect, selectedPreferences }: PreferenceCardsProps) {
  const [localSelectedPreferences, setLocalSelectedPreferences] = useState<string[]>(selectedPreferences);

  const togglePreference = (preferenceId: string) => {
    const newPreferences = localSelectedPreferences.includes(preferenceId)
      ? localSelectedPreferences.filter(id => id !== preferenceId)
      : [...localSelectedPreferences, preferenceId];
    
    setLocalSelectedPreferences(newPreferences);
  };

  const handleSubmit = () => {
    onPreferencesSelect(localSelectedPreferences);
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'group': return '👥 Travel Group';
      case 'budget': return '💰 Budget Style';
      case 'interests': return '🎯 Interests';
      case 'pace': return '⏱️ Travel Pace';
      default: return category;
    }
  };

  const groupedOptions = preferenceOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, PreferenceOption[]>);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          ✨ Tell us about your travel style
        </h3>
        <p className="text-muted-foreground text-sm">
          Select all that apply to personalize your itinerary
        </p>
      </div>

      {Object.entries(groupedOptions).map(([category, options]) => (
        <div key={category} className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            {getCategoryTitle(category)}
          </h4>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <Button
                key={option.id}
                variant={localSelectedPreferences.includes(option.id) ? "default" : "outline"}
                size="sm"
                onClick={() => togglePreference(option.id)}
                className="h-auto py-2 px-3 text-xs"
              >
                <span className="mr-1">{option.icon}</span>
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 pt-4 border-t border-border">
        <Button 
          onClick={handleSubmit}
          className="w-full"
          size="lg"
          disabled={localSelectedPreferences.length === 0}
        >
          {localSelectedPreferences.length > 0 
            ? `Create My Guide (${localSelectedPreferences.length} preferences selected)` 
            : 'Select at least one preference'
          } ✨
        </Button>
      </div>
    </div>
  );
}