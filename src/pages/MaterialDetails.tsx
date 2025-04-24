
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, BookOpen, FileText, Brain, GraduationCap, BookMarked, Lightbulb } from "lucide-react";

interface MaterialDetails {
  title: string;
  description: string;
  content: string;
  content_type: string;
  created_at: string;
  subject_name?: string;
}

const MaterialDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [material, setMaterial] = useState<MaterialDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("content");
  const { toast } = useToast();

  // Format the slug to a more readable title
  const formattedTitle = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) : '';

  useEffect(() => {
    const fetchMaterialDetails = async () => {
      setIsLoading(true);
      try {
        // Try to fetch material by formatted title (fuzzy match)
        const { data, error } = await supabase
          .from('study_materials')
          .select(`
            *,
            subjects:subject_id (name)
          `)
          .ilike('title', `%${formattedTitle}%`)
          .limit(1);
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          setMaterial({
            ...data[0],
            subject_name: data[0]?.subjects?.name
          });
        } else {
          // If no match found, use the slug as dummy data
          setMaterial({
            title: formattedTitle,
            description: "This is an AI-generated overview of this important topic.",
            content: "Detailed content about this topic will be displayed here when available in the database.",
            content_type: "text",
            created_at: new Date().toISOString()
          });
          
          toast({
            title: "Demo Mode",
            description: "Showing placeholder content for this material",
            variant: "default",
          });
        }
      } catch (error) {
        console.error('Error fetching material details:', error);
        toast({
          title: "Error",
          description: "Failed to load material details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchMaterialDetails();
    }
  }, [slug, formattedTitle, toast]);

  const handleGenerateSummary = () => {
    toast({
      title: "AI Summary Request",
      description: "Generating a personalized summary...",
    });
  };

  const handleCreateExam = () => {
    toast({
      title: "Exam Generation",
      description: "Preparing a practice exam from this material...",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{material?.title}</h1>
          {material?.subject_name && (
            <Badge variant="outline" className="mt-1">
              {material.subject_name}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={handleGenerateSummary} className="gap-2">
            <Lightbulb className="h-4 w-4" />
            AI Summary
          </Button>
          <Button size="sm" onClick={handleCreateExam} variant="outline" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Create Practice Exam
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Material Overview</CardTitle>
          <CardDescription>{material?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="content" className="gap-2">
                <FileText className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="notes" className="gap-2">
                <BookOpen className="h-4 w-4" />
                My Notes
              </TabsTrigger>
              <TabsTrigger value="related" className="gap-2">
                <BookMarked className="h-4 w-4" />
                Related
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="mt-0">
              <div className="prose dark:prose-invert max-w-none">
                {material?.content_type === 'text' ? (
                  <div className="whitespace-pre-wrap">{material?.content}</div>
                ) : (
                  <div className="text-center p-8 border rounded-md">
                    <p className="text-muted-foreground">
                      Content of type "{material?.content_type}" is available to view in the original format
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="notes" className="mt-0">
              <div className="p-4 border rounded-lg bg-muted/50 text-center">
                <Brain className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-1">Your study notes will appear here</h3>
                <p className="text-muted-foreground mb-4">
                  Take notes while studying or let AI generate smart summaries for you
                </p>
                <Button>Create Note</Button>
              </div>
            </TabsContent>
            <TabsContent value="related" className="mt-0">
              <div className="space-y-4">
                <p className="text-muted-foreground">Related study materials and resources</p>
                <Separator />
                <div className="grid gap-2">
                  <div className="p-3 border rounded flex items-center gap-3 hover:bg-accent">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">Advanced Deep Learning Techniques</p>
                      <p className="text-sm text-muted-foreground">Related to Neural Networks</p>
                    </div>
                  </div>
                  <div className="p-3 border rounded flex items-center gap-3 hover:bg-accent">
                    <FileText className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="font-medium">Data Preprocessing for ML Models</p>
                      <p className="text-sm text-muted-foreground">Essential foundation knowledge</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialDetails;
