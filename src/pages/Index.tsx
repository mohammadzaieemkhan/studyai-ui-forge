
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import Navbar from "@/components/Navbar";
import { 
  BookOpen, 
  BookMarked, 
  BarChart2, 
  Calendar, 
  Brain, 
  FileText, 
  CheckCircle2, 
  ArrowRight
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col gap-8 md:flex-row md:gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  AI-Powered Exam Preparation
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground">
                  Personalized learning and smart testing to supercharge your academic success.
                </p>
              </div>
              
              <div className="flex gap-4">
                <Link to="/login">
                  <Button size="lg" className="gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg">
                    View Demo
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="relative bg-muted rounded-xl overflow-hidden p-1 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="IndelibleAI Dashboard Preview" 
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute top-3 right-3">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 px-4 sm:px-6 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Key Features</h2>
            <p className="text-muted-foreground mt-2">
              Everything you need to excel in your studies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover-scale">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">AI-Generated Exams</h3>
                <p className="text-muted-foreground">
                  Create personalized exams tailored to your curriculum with our advanced AI technology.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Performance Analytics</h3>
                <p className="text-muted-foreground">
                  Track your progress with detailed insights and identify areas for improvement.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Smart Study Notes</h3>
                <p className="text-muted-foreground">
                  Generate concise study materials and summaries from your textbooks and lectures.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Study Scheduler</h3>
                <p className="text-muted-foreground">
                  Optimize your study time with personalized schedules based on your goals and deadlines.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Practice Question Bank</h3>
                <p className="text-muted-foreground">
                  Access thousands of practice questions across various subjects and difficulty levels.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookMarked className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Past Exams Archive</h3>
                <p className="text-muted-foreground">
                  Review your previous exams and track your improvement over time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your study experience?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of students achieving academic excellence with IndelibleAI's personalized learning platform.
          </p>
          <Link to="/login">
            <Button size="lg" className="gap-2">
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      
      <footer className="border-t py-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">IndelibleAI</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact Us
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} IndelibleAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
