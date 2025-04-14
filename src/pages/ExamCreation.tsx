
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FileUp, Brain, Loader2, Check, BookOpen, Sparkles, FileQuestion } from "lucide-react";

interface QuestionType {
  id: string;
  question: string;
  options?: string[];
  answer?: string;
  explanation?: string;
}

const ExamCreation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ai");
  const [showPreview, setShowPreview] = useState(false);
  const [examGenerated, setExamGenerated] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    difficulty: "medium",
    questionCount: 10,
    questionType: "multiple-choice",
    timeLimit: 60,
    customPrompt: "",
    syllabus: null as File | null,
  });

  const [generatedQuestions, setGeneratedQuestions] = useState<QuestionType[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({
      ...formData,
      [name]: value[0],
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        syllabus: e.target.files[0],
      });
    }
  };

  const generateExam = async () => {
    if (!formData.subject || !formData.topic) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    
    try {
      // Example API call to Gemini API (mock implementation)
      // In a real implementation, you would call your backend which would use the API key
      // const response = await fetch('/api/generate-exam', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      // const data = await response.json();
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock generated questions
      const mockQuestions = Array.from({ length: formData.questionCount }, (_, i) => ({
        id: `q-${i + 1}`,
        question: `Sample question ${i + 1} for ${formData.topic} in ${formData.subject}?`,
        options: formData.questionType === "multiple-choice" 
          ? ['Option A', 'Option B', 'Option C', 'Option D'] 
          : undefined,
        answer: formData.questionType === "multiple-choice" ? "Option B" : "Sample answer for question.",
        explanation: "This is an explanation of the correct answer and the concept tested."
      }));
      
      setGeneratedQuestions(mockQuestions);
      setExamGenerated(true);
      setShowPreview(true);
      toast.success("Exam generated successfully!");
    } catch (error) {
      console.error("Error generating exam:", error);
      toast.error("Failed to generate exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveExam = () => {
    // In a real implementation, you would save the exam to your backend
    toast.success("Exam saved successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exam Creation</h1>
          <p className="text-muted-foreground">
            Create a custom exam using AI or upload your own materials
          </p>
        </div>
      </div>

      <Tabs defaultValue="ai" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>AI Generation</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            <span>Upload Materials</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ai" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Exam Parameters</CardTitle>
                <CardDescription>
                  Define the parameters for your AI-generated exam
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => handleSelectChange("subject", value)}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="literature">Literature</SelectItem>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic <span className="text-red-500">*</span></Label>
                  <Input
                    id="topic"
                    name="topic"
                    placeholder="e.g., Calculus, Thermodynamics"
                    value={formData.topic}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <RadioGroup
                    id="difficulty"
                    value={formData.difficulty}
                    onValueChange={(value) => handleSelectChange("difficulty", value)}
                    className="flex space-x-2"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="easy" id="easy" />
                      <Label htmlFor="easy">Easy</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="hard" id="hard" />
                      <Label htmlFor="hard">Hard</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="questionType">Question Type</Label>
                  <Select
                    value={formData.questionType}
                    onValueChange={(value) => handleSelectChange("questionType", value)}
                  >
                    <SelectTrigger id="questionType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="short-answer">Short Answer</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="questionCount">Number of Questions: {formData.questionCount}</Label>
                  </div>
                  <Slider
                    id="questionCount"
                    min={5}
                    max={50}
                    step={5}
                    value={[formData.questionCount]}
                    onValueChange={(value) => handleSliderChange("questionCount", value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="timeLimit">Time Limit (minutes): {formData.timeLimit}</Label>
                  </div>
                  <Slider
                    id="timeLimit"
                    min={15}
                    max={180}
                    step={15}
                    value={[formData.timeLimit]}
                    onValueChange={(value) => handleSliderChange("timeLimit", value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customPrompt">Custom Instructions (Optional)</Label>
                  <Textarea
                    id="customPrompt"
                    name="customPrompt"
                    placeholder="Include specific topics, concepts, or instructions..."
                    value={formData.customPrompt}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={generateExam} 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Exam...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Exam
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card className={showPreview ? "" : "hidden md:block"}>
              <CardHeader>
                <CardTitle>Exam Preview</CardTitle>
                <CardDescription>
                  {examGenerated 
                    ? `${formData.subject}: ${formData.topic} (${formData.questionCount} questions)` 
                    : "Your exam will appear here after generation"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!examGenerated ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Exam Generated Yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                      Fill in the exam parameters and click "Generate Exam" to create your custom test
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                    {generatedQuestions.slice(0, 3).map((q, index) => (
                      <div key={q.id} className="rounded-lg border p-4">
                        <h3 className="font-medium">Question {index + 1}</h3>
                        <p className="mt-2">{q.question}</p>
                        
                        {q.options && (
                          <div className="mt-3 space-y-2">
                            {q.options.map((option, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-primary text-xs">
                                  {String.fromCharCode(65 + i)}
                                </div>
                                <span>{option}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {examGenerated && generatedQuestions.length > 3 && (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        {generatedQuestions.length - 3} more questions available...
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              {examGenerated && (
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/exams/preview")}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Full Preview
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={saveExam}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Save Exam
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Study Materials</CardTitle>
              <CardDescription>
                Upload your notes, textbooks, or syllabi to generate exams
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="uploadedSubject">Subject <span className="text-red-500">*</span></Label>
                    <Input
                      id="uploadedSubject"
                      name="subject"
                      placeholder="e.g., Mathematics, Physics"
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="uploadedTopic">Topic <span className="text-red-500">*</span></Label>
                    <Input
                      id="uploadedTopic"
                      name="topic"
                      placeholder="e.g., Calculus, Thermodynamics"
                      value={formData.topic}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="syllabusFile">Upload File</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="syllabusFile"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                        className="file:bg-primary file:text-primary-foreground file:border-none file:rounded-md file:px-2 file:py-1 file:mr-2 cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports PDF, DOC, DOCX, and TXT files (max 10MB)
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="uploadQuestionCount">
                      Number of Questions: {formData.questionCount}
                    </Label>
                    <Slider
                      id="uploadQuestionCount"
                      min={5}
                      max={50}
                      step={5}
                      value={[formData.questionCount]}
                      onValueChange={(value) => handleSliderChange("questionCount", value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="uploadDifficulty">Difficulty Level</Label>
                    <RadioGroup
                      id="uploadDifficulty"
                      value={formData.difficulty}
                      onValueChange={(value) => handleSelectChange("difficulty", value)}
                      className="flex space-x-2"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="easy" id="uploadEasy" />
                        <Label htmlFor="uploadEasy">Easy</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="medium" id="uploadMedium" />
                        <Label htmlFor="uploadMedium">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="hard" id="uploadHard" />
                        <Label htmlFor="uploadHard">Hard</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="uploadQuestionType">Question Type</Label>
                    <Select
                      value={formData.questionType}
                      onValueChange={(value) => handleSelectChange("questionType", value)}
                    >
                      <SelectTrigger id="uploadQuestionType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="short-answer">Short Answer</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                        <SelectItem value="essay">Essay</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="uploadCustomPrompt">Additional Instructions (Optional)</Label>
                <Textarea
                  id="uploadCustomPrompt"
                  name="customPrompt"
                  placeholder="Include specific topics, concepts, or instructions..."
                  value={formData.customPrompt}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={generateExam} 
                className="w-full"
                disabled={loading || !formData.syllabus}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Exam...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Exam from Upload
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExamCreation;
