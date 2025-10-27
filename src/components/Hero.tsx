import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

const Hero = ({ onSubmit }: { onSubmit?: (message: string) => void }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (onSubmit) onSubmit(message);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Content */}
      <div className="relative container mx-auto px-6 py-32 text-center">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20 mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Story Travel</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Travel like in your
            <span className="block mt-2">
              favorite story
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
            Design your perfect journey inspired by your favorite books, movies, and TV shows
          </p>

          {/* Chat-like Input Box */}
          <div className="max-w-3xl mx-auto mt-12">
            <form onSubmit={handleSubmit}>
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-strong hover:shadow-xl transition-all">
                <div className="flex items-center gap-4">
                  <Input
                    type="text"
                    placeholder="Ask KultripGPT to create your story-inspired journey..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button 
                    type="submit"
                    size="icon"
                    className="rounded-full h-12 w-12 bg-gradient-adventure hover:scale-110 transition-transform"
                  >
                    <Sparkles className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white/90"></div>
              <span>AI-Generated Guides</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white/90"></div>
              <span>Real Activities & Maps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white/90"></div>
              <span>Cultural Insights</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
