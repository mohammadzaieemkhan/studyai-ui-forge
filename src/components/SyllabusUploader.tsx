
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, FileText, Upload, FileUp, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Topic {
  name: string;
  subtopics: string[];
  keyTerms: string[];
  difficulty: string;
}

interface ExtractedTopics {
  mainSubject: string;
  topics: Topic[];
}

interface SyllabusUploaderProps {
  onTopicsExtracted?: (topics: ExtractedTopics) => void;
}

const SyllabusUploader: React.FC<SyllabusUploaderProps> = ({ onTopicsExtracted }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedTopics, setExtractedTopics] = useState<ExtractedTopics | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setExtractedTopics(null);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result.toString());
        } else {
          reject(new Error("Failed to read file content"));
        }
      };
      
      reader.onerror = () => reject(new Error("Error reading file"));
      
      if (file.type === 'application/pdf') {
        // For PDFs we'll just return the file name since we can't easily read PDF content in the browser
        // In a real implementation, you'd send the actual file to the server
        resolve(`PDF file: ${file.name}`);
      } else {
        reader.readAsText(file);
      }
    });
  };
  
  const processSyllabus = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setIsUploading(true);
      setProgress(20);
      
      // Read the file content
      const content = await readFileContent(file);
      setProgress(40);
      
      // Process the content with Gemini API
      setIsProcessing(true);
      setProgress(60);
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('process-syllabus', {
        body: { 
          syllabusContent: content,
          fileName: file.name
        }
      });

      setProgress(80);
      
      if (error) {
        throw new Error(`Error processing syllabus: ${error.message}`);
      }
      
      setProgress(100);
      
      if (data.success && data.topics) {
        setExtractedTopics(data.topics);
        if (onTopicsExtracted) {
          onTopicsExtracted(data.topics);
        }
        toast.success("Successfully extracted topics from syllabus");
      } else {
        throw new Error("Failed to extract topics from syllabus");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "An error occurred while processing the syllabus");
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Syllabus
        </CardTitle>
        <CardDescription>
          Upload your syllabus file to automatically extract topics for exam creation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="syllabus-file">Select File (.pdf, .docx, .txt)</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="syllabus-file" 
                type="file" 
                onChange={handleFileChange} 
                accept=".pdf,.docx,.doc,.txt"
                disabled={isUploading || isProcessing}
                className="flex-1"
              />
              <Button 
                onClick={processSyllabus}
                disabled={!file || isUploading || isProcessing}
              >
                {isUploading || isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isUploading ? 'Uploading...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    Process
                  </>
                )}
              </Button>
            </div>
            {(isUploading || isProcessing) && (
              <div className="mt-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {progress < 40 ? "Uploading file..." : 
                   progress < 80 ? "Analyzing with AI..." : 
                   "Finalizing results..."}
                </p>
              </div>
            )}
          </div>
          
          {extractedTopics && (
            <div className="space-y-4 mt-6">
              <div>
                <h3 className="text-lg font-medium">Detected Main Subject</h3>
                <p className="text-xl font-semibold mt-1">{extractedTopics.mainSubject}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Extracted Topics</h3>
                <div className="space-y-3">
                  {extractedTopics.topics.map((topic, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-card">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-lg">{topic.name}</h4>
                        <Badge className={getDifficultyColor(topic.difficulty)}>
                          {topic.difficulty}
                        </Badge>
                      </div>
                      
                      {topic.subtopics.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Subtopics:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {topic.subtopics.map((subtopic, i) => (
                              <Badge key={i} variant="outline">{subtopic}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {topic.keyTerms.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Key Terms:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {topic.keyTerms.map((term, i) => (
                              <Badge key={i} variant="secondary">{term}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {extractedTopics && (
          <p className="text-sm text-muted-foreground">
            <Check className="inline h-4 w-4 text-green-500 mr-1" />
            {extractedTopics.topics.length} topics extracted successfully
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default SyllabusUploader;
