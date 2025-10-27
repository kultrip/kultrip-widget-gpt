import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatHeroProps {
  onSubmit: (message: string) => void;
}

const ChatHero = ({ onSubmit }: ChatHeroProps) => {
  const [heroInput, setHeroInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroInput.trim()) return;
    onSubmit(heroInput);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-blue-300 px-4 animate-fade-in">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Travel like in your favorite story
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto">
            Design your perfect journey inspired by your favorite books, movies, and TV shows
          </p>
        </header>

        <form onSubmit={handleSubmit} className="relative group">
          <div className="relative">
            <Input
              value={heroInput}
              onChange={(e) => setHeroInput(e.target.value)}
              placeholder="Ask KultripGPT to create your story-inspired journey..."
              aria-label="Enter your travel story inspiration"
              className="w-full h-14 pl-6 pr-14 text-base bg-white/95 backdrop-blur-sm border-0 rounded-full shadow-elegant focus-visible:ring-4 focus-visible:ring-white/30 transition-all duration-300 group-hover:shadow-glow"
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Send message"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-gradient-primary hover:scale-110 transition-transform duration-200"
            >
              <Send className="h-5 w-5 text-white" />
            </Button>
          </div>
        </form>

        <section className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/90 text-sm" aria-label="Features">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true"></div>
            <span>AI-Generated Guides</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true"></div>
            <span>Real Activities & Maps</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true"></div>
            <span>Cultural Insights</span>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ChatHero;
