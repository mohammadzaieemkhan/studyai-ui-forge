
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Loader2, Wand2, Save, FileText, Book, Clock, Award, PenLine } from 'lucide-react';
import SyllabusUploader from '@/components/SyllabusUploader';
import { generateExamWithGemini } from '@/services/geminiService';

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

const ExamCreation = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [subjectInput, setSubjectInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [questionType, setQuestionType] = useState('multiple-choice');
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [customPrompt, setCustomPrompt] = useState('');
  const [extractedTopics, setExtractedTopics] = useState<ExtractedTopics | null>(null);

  const handleTopicsExtracted = (topics: ExtractedTopics) => {
    setExtractedTopics(topics);
    setSubjectInput(topics.mainSubject);
    if (topics.topics.length > 0) {
      setTopicInput(topics.topics[0].name);
      setDifficulty(topics.topics[0].difficulty.toLowerCase());
    }
  };

  const handleGenerateExam = async () => {
    if (!subjectInput) {
      toast.error('Please enter a subject');
      return;
    }
    
    if (!topicInput) {
      toast.error('Please enter a topic');
      return;
    }

    try {
      setIsGenerating(true);
      
      const examParams = {
        subject: subjectInput,
        topic: topicInput,
        difficulty,
        questionCount,
        questionType,
        timeLimit,
        customPrompt: customPrompt || undefined,
        syllabus: null
      };
      
      const response = await generateExamWithGemini(examParams);
      
      // Store in session storage to be used in the exam view page
      sessionStorage.setItem('generatedExam', JSON.stringify(response));
      
      toast.success('Exam generated successfully!');
      navigate('/exam-view'); // You'd need to create this page
    } catch (error: any) {
      console.error('Error generating exam:', error);
      toast.error(error.message || 'Failed to generate exam');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderSliderMarks = (min: number, max: number, step: number) => {
    const marks = [];
    for (let i = min; i <= max; i += step) {
      marks.push(
        <div key={i} className="absolute text-xs text-muted-foreground" style={{ left: `${((i - min) / (max - min)) * 100}%`, bottom: '-20px' }}>
          {i}
        </div>
      );
    }
    return marks;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Exam</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="syllabus">Upload Syllabus</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Exam</CardTitle>
              <CardDescription>
                Enter the details for your new exam and our AI will generate questions for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="e.g. Mathematics, Physics" 
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input 
                    id="topic" 
                    placeholder="e.g. Calculus, Quantum Mechanics" 
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="question-type">Question Type</Label>
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger id="question-type">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="short-answer">Short Answer</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                      <SelectItem value="mixed">Mixed Types</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="question-count">Number of Questions: {questionCount}</Label>
                </div>
                <div className="relative pt-1 px-2">
                  <Slider 
                    id="question-count"
                    min={5}
                    max={50}
                    step={5}
                    value={[questionCount]}
                    onValueChange={(value) => setQuestionCount(value[0])}
                  />
                  <div className="relative h-6">
                    {renderSliderMarks(5, 50, 15)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="time-limit">Time Limit: {timeLimit} minutes</Label>
                </div>
                <div className="relative pt-1 px-2">
                  <Slider 
                    id="time-limit"
                    min={10}
                    max={180}
                    step={10}
                    value={[timeLimit]}
                    onValueChange={(value) => setTimeLimit(value[0])}
                  />
                  <div className="relative h-6">
                    {renderSliderMarks(10, 180, 50)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-prompt">Additional Instructions (Optional)</Label>
                <Textarea 
                  id="custom-prompt" 
                  placeholder="Add any specific instructions for the AI generating your exam"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>
              <Button onClick={handleGenerateExam} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Exam
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="syllabus" className="mt-4">
          <SyllabusUploader onTopicsExtracted={handleTopicsExtracted} />
          
          {extractedTopics && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Generate Exam from Syllabus</CardTitle>
                <CardDescription>
                  Review the extracted topics and customize your exam settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject-from-syllabus">Subject</Label>
                    <Input 
                      id="subject-from-syllabus" 
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="topic-from-syllabus">Topic</Label>
                    <Select value={topicInput} onValueChange={setTopicInput}>
                      <SelectTrigger id="topic-from-syllabus">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {extractedTopics.topics.map((topic, index) => (
                          <SelectItem key={index} value={topic.name}>
                            {topic.name} ({topic.difficulty})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="question-type-from-syllabus">Question Type</Label>
                    <Select value={questionType} onValueChange={setQuestionType}>
                      <SelectTrigger id="question-type-from-syllabus">
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                        <SelectItem value="short-answer">Short Answer</SelectItem>
                        <SelectItem value="essay">Essay</SelectItem>
                        <SelectItem value="mixed">Mixed Types</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty-from-syllabus">Difficulty</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger id="difficulty-from-syllabus">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="question-count-from-syllabus">Number of Questions: {questionCount}</Label>
                    </div>
                    <Slider 
                      id="question-count-from-syllabus"
                      min={5}
                      max={50}
                      step={5}
                      value={[questionCount]}
                      onValueChange={(value) => setQuestionCount(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="time-limit-from-syllabus">Time Limit: {timeLimit} minutes</Label>
                    </div>
                    <Slider 
                      id="time-limit-from-syllabus"
                      min={10}
                      max={180}
                      step={10}
                      value={[timeLimit]}
                      onValueChange={(value) => setTimeLimit(value[0])}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
                <Button onClick={handleGenerateExam} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Exam
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExamCreation;
