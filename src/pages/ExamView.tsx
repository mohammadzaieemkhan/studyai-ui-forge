
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Clock, AlertTriangle, Save, ChevronLeft, ChevronRight, Flag, Award, CheckCircle2 } from 'lucide-react';
import { ExamGenerationResponse, GeneratedQuestion } from '@/services/geminiService';

const ExamView = () => {
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamGenerationResponse | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);

  useEffect(() => {
    // Retrieve the generated exam from session storage
    const storedExam = sessionStorage.getItem('generatedExam');
    if (storedExam) {
      try {
        const parsedExam = JSON.parse(storedExam) as ExamGenerationResponse;
        setExam(parsedExam);
        
        // Initialize the time remaining
        if (parsedExam.metadata?.timeLimit) {
          setTimeRemaining(parsedExam.metadata.timeLimit * 60); // Convert to seconds
        }
      } catch (error) {
        console.error('Error parsing exam data:', error);
        toast.error('Failed to load exam data');
        navigate('/exam-creation');
      }
    } else {
      toast.error('No exam data found');
      navigate('/exam-creation');
    }
  }, [navigate]);

  useEffect(() => {
    let timer: number | undefined;
    
    if (examStarted && !examCompleted && timeRemaining !== null && timeRemaining > 0) {
      timer = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev && prev > 0) {
            return prev - 1;
          }
          
          // Time's up
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [examStarted, examCompleted, timeRemaining]);

  const startExam = () => {
    setExamStarted(true);
    toast.success('Exam started!');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const goToNextQuestion = () => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    if (exam && index >= 0 && index < exam.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleSubmitExam = () => {
    // In a real application, you would save the answers to the database
    setExamCompleted(true);
    toast.success('Exam submitted successfully!');
    
    // Calculate the score based on matching answers with the correct ones
    if (exam) {
      const totalQuestions = exam.questions.length;
      let correctAnswers = 0;
      
      exam.questions.forEach(question => {
        const userAnswer = answers[question.id];
        if (question.options) {
          // For multiple choice questions, check if the selected option matches the answer
          if (userAnswer === question.answer) {
            correctAnswers++;
          }
        } else {
          // For essay/short answer questions, we would need more complex evaluation
          // For now, we'll skip scoring these
        }
      });
      
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      
      toast.success(`Your score: ${score}%`);
    }
  };

  // Render question based on its type
  const renderQuestion = (question: GeneratedQuestion) => {
    const isMultipleChoice = question.options && question.options.length > 0;
    const userAnswer = answers[question.id];
    
    if (isMultipleChoice) {
      return (
        <RadioGroup
          value={userAnswer as string}
          onValueChange={(value) => handleAnswerChange(question.id, value)}
          disabled={examCompleted}
        >
          <div className="space-y-3">
            {question.options.map((option, optionIndex) => {
              const optionValue = `Option ${String.fromCharCode(65 + optionIndex)}`;
              const isCorrect = examCompleted && question.answer === optionValue;
              const isWrong = examCompleted && userAnswer === optionValue && question.answer !== optionValue;
              
              return (
                <div key={optionIndex} className="flex items-start space-x-2">
                  <RadioGroupItem 
                    value={optionValue}
                    id={`${question.id}-option-${optionIndex}`}
                    className={`mt-1 ${isCorrect ? 'border-green-500' : ''} ${isWrong ? 'border-red-500' : ''}`}
                  />
                  <Label 
                    htmlFor={`${question.id}-option-${optionIndex}`}
                    className={`
                      ${isCorrect ? 'text-green-600 font-medium' : ''}
                      ${isWrong ? 'text-red-600 line-through' : ''}
                    `}
                  >
                    {option}
                    {isCorrect && examCompleted && <CheckCircle2 className="inline-block ml-2 h-4 w-4 text-green-600" />}
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      );
    } else {
      // Essay or short answer question
      return (
        <Textarea
          placeholder="Type your answer here..."
          value={userAnswer as string || ''}
          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          disabled={examCompleted}
          className="w-full min-h-[150px]"
        />
      );
    }
  };

  if (!exam) {
    return (
      <div className="container mx-auto py-6 flex justify-center">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Loading Exam...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="container mx-auto py-6">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>{exam.metadata.subject}: {exam.metadata.topic}</CardTitle>
            <CardDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">
                  <Clock className="mr-1 h-4 w-4" />
                  {exam.metadata.timeLimit} minutes
                </Badge>
                <Badge variant="outline">
                  {exam.metadata.questionCount} Questions
                </Badge>
                <Badge className={
                  exam.metadata.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  exam.metadata.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {exam.metadata.difficulty.charAt(0).toUpperCase() + exam.metadata.difficulty.slice(1)}
                </Badge>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium">Exam Instructions</h3>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-sm">
                  <li>You will have {exam.metadata.timeLimit} minutes to complete this exam.</li>
                  <li>There are {exam.metadata.questionCount} questions in total.</li>
                  <li>You can navigate between questions using the navigation buttons.</li>
                  <li>Click the flag icon to mark questions for review.</li>
                  <li>Once you submit the exam, you cannot change your answers.</li>
                  <li>If time runs out, your exam will be automatically submitted.</li>
                </ul>
              </div>
              
              <div className="flex items-center justify-center py-4">
                <Button size="lg" onClick={startExam}>
                  Start Exam
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Panel */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  Question {currentQuestionIndex + 1} 
                  <span className="text-muted-foreground text-lg ml-2">
                    of {exam.questions.length}
                  </span>
                </CardTitle>
                <CardDescription>
                  {exam.metadata.subject}: {exam.metadata.topic}
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                {!examCompleted && timeRemaining !== null && (
                  <div className={`px-3 py-1 rounded-full flex items-center ${
                    timeRemaining < 60 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    <Clock className="mr-1 h-4 w-4" />
                    {formatTime(timeRemaining)}
                  </div>
                )}
                
                {!examCompleted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleFlagQuestion(currentQuestion.id)}
                  >
                    <Flag className={`h-5 w-5 ${
                      flaggedQuestions.includes(currentQuestion.id) 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-muted-foreground'
                    }`} />
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div>
                <Progress value={progress} />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">{currentQuestion.question}</h3>
                  {renderQuestion(currentQuestion)}
                </div>
                
                {examCompleted && currentQuestion.explanation && (
                  <div className="mt-6 p-4 border rounded-lg bg-green-50">
                    <h4 className="font-medium text-green-800">Explanation</h4>
                    <p className="mt-1 text-green-700">{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              {currentQuestionIndex < exam.questions.length - 1 ? (
                <Button
                  onClick={goToNextQuestion}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitExam}
                  disabled={examCompleted}
                >
                  Submit Exam
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        
        {/* Question Navigator */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {exam.questions.map((q, index) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isFlagged = flaggedQuestions.includes(q.id);
                  const isCurrent = index === currentQuestionIndex;
                  
                  return (
                    <Button
                      key={q.id}
                      variant={isCurrent ? "default" : "outline"}
                      size="icon"
                      className={`
                        w-full h-10 relative
                        ${isAnswered && !isCurrent ? 'bg-blue-50 border-blue-200' : ''}
                        ${isFlagged ? 'border-yellow-400' : ''}
                      `}
                      onClick={() => jumpToQuestion(index)}
                    >
                      {index + 1}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
                      )}
                    </Button>
                  );
                })}
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-primary mr-2"></div>
                  <span className="text-sm">Current Question</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded bg-blue-50 border border-blue-200 mr-2"></div>
                  <span className="text-sm">Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded border border-yellow-400 mr-2 relative">
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
                  </div>
                  <span className="text-sm">Flagged for Review</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {!examCompleted ? (
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleSubmitExam}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  End Exam & Submit
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/dashboard')}
                >
                  <Award className="mr-2 h-4 w-4" />
                  View Results
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExamView;
