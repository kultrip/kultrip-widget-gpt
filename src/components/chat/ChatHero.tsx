import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatHeroProps {
  onSubmit: (message: string) => void;
}

const ChatHero = ({ onSubmit }: ChatHeroProps) => {
  const [heroInput, setHeroInput] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Example prompts for cycling placeholder
  const examplePrompts = [
    "Plan a Harry Potter trip to London...",
    "Find Lord of the Rings locations in New Zealand...",
    "Recreate Emily in Paris adventure in France...",
    "Explore Game of Thrones locations in Ireland...",
    "Experience Studio Ghibli magic in Japan...",
    "Follow James Bond's footsteps across Europe..."
  ];

  // Cycle through example prompts
  useEffect(() => {
    if (heroInput === "") {  // Only cycle when input is empty
      const interval = setInterval(() => {
        setPlaceholderIndex((prev) => (prev + 1) % examplePrompts.length);
      }, 3000); // Change every 3 seconds

      return () => clearInterval(interval);
    }
  }, [heroInput, examplePrompts.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroInput.trim()) return;
    onSubmit(heroInput);
  };

  return (
    <main className="h-full flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-blue-300 px-4">
      <div className="w-full max-w-2xl space-y-4 text-center">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            KultripGPT
          </h1>
          <p className="text-sm md:text-base text-white/90 max-w-xl mx-auto">
            Your AI travel storyteller. Find places from your favorite stories!
          </p>
          {/* Trust Message */}
          <p className="text-white/70 text-xs italic max-w-2xl mx-auto">
            ✨ Trusted by story-lovers worldwide for authentic adventures
          </p>
        </header>



        <form onSubmit={handleSubmit} className="relative group">
          <div className="relative">
            <Input
              value={heroInput}
              onChange={(e) => setHeroInput(e.target.value)}
              placeholder={heroInput === "" ? examplePrompts[placeholderIndex] : "Enter your travel story inspiration"}
              aria-label="Enter your travel story inspiration"
              className="w-full h-10 pl-4 pr-12 text-sm bg-white/95 backdrop-blur-sm border-0 rounded-full shadow-elegant focus-visible:ring-2 focus-visible:ring-white/30 transition-all duration-300 group-hover:shadow-glow placeholder:transition-opacity placeholder:duration-500"
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Send message"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-110 transition-transform duration-200"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
        </form>

        <section className="flex items-center justify-center gap-4 text-white/90 text-xs" aria-label="Features">
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-white" aria-hidden="true"></div>
            <span>AI-Generated Guides</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-white" aria-hidden="true"></div>
            <span>Real Activities & Maps</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-white" aria-hidden="true"></div>
            <span>Cultural Insights</span>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ChatHero;
