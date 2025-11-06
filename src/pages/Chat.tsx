import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const Chat = () => {
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    console.log("User input:", input);
    // Here you could add actual API call or processing
    setInput("");
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <form onSubmit={handleSend} className="space-y-4">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Name a book, movie, or show that inspires your wanderlust..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

export default Chat;