import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Map, Code, Users, Sparkles, Globe } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-hero pt-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              AI-Powered Story Travel
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 mb-12 animate-fade-in">
              Where stories inspire real journeys.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
              <Link to="/chat">
                <Button variant="secondary" size="lg" className="text-lg px-8 py-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  <Sparkles className="h-5 w-5 mr-2" />
                  For Travelers
                </Button>
              </Link>
              <Link to="/agency">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-white/10 text-white border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  <Users className="h-5 w-5 mr-2" />
                  For Agencies
                </Button>
              </Link>
              <Link to="/api">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-white/10 text-white border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  <Code className="h-5 w-5 mr-2" />
                  For Developers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is Kultrip Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              What is Kultrip?
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Kultrip transforms your favorite books, films, and TV shows into real-world travel experiences. 
              Our AI analyzes cultural data, maps iconic locations, and creates personalized guides that bring 
              stories to life. Whether you want to explore Midnight in Paris or walk through Middle-earth, 
              Kultrip turns fiction into unforgettable adventures.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-warm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Benefits for Everyone
            </h2>
            <p className="text-xl text-muted-foreground">
              Kultrip creates value across the travel ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Travelers */}
            <Card className="p-8 hover:shadow-medium transition-smooth">
              <div className="h-16 w-16 rounded-lg bg-gradient-adventure flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">For Travelers</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Turn favorite stories into real itineraries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Discover cultural insights and hidden gems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Get personalized day-by-day guides</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Access maps and bookable activities</span>
                </li>
              </ul>
            </Card>

            {/* For Agencies */}
            <Card className="p-8 hover:shadow-medium transition-smooth border-2 border-accent">
              <div className="h-16 w-16 rounded-lg bg-gradient-adventure flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">For Agencies</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Embed Kultrip widget on your website</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Capture qualified story-inspired leads</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Track performance in real-time dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Pay-per-lead or monthly subscription</span>
                </li>
              </ul>
            </Card>

            {/* For Developers */}
            <Card className="p-8 hover:shadow-medium transition-smooth">
              <div className="h-16 w-16 rounded-lg bg-gradient-adventure flex items-center justify-center mb-6">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">For Developers</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>RESTful API for guide generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Integrate story-based travel into your app</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Access cultural data and mapping APIs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Comprehensive documentation</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* About & Contact Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                About Kultrip
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Kultrip was born from a simple idea: what if the stories we love could guide us to real places? 
                We combine AI technology with cultural intelligence to bridge the gap between fiction and reality, 
                making travel more meaningful and inspiring.
              </p>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Whether you're a traveler seeking adventure, an agency looking for innovative tools, or a developer 
                building the next great travel platform, Kultrip is here to help you turn stories into journeys.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
              <Card className="p-8 text-center">
                <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold text-card-foreground mb-2">Get in Touch</h3>
                <p className="text-muted-foreground mb-4">
                  Have questions or want to partner with us?
                </p>
                <a href="mailto:hello@kultrip.com" className="text-accent hover:underline">
                  hello@kultrip.com
                </a>
              </Card>

              <Card className="p-8 text-center">
                <Map className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold text-card-foreground mb-2">Start Your Journey</h3>
                <p className="text-muted-foreground mb-4">
                  Ready to explore the world through stories?
                </p>
                <Link to="/chat">
                  <Button variant="adventure">Try Kultrip Now</Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      </div>
    </PageTransition>
  );
};

export default Index;
