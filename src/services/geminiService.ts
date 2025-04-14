// This file implements the Gemini API service for exam generation

export interface ExamGenerationParams {
  subject: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  questionType: string;
  timeLimit: number;
  customPrompt?: string;
  syllabus?: File | null;
}

export interface GeneratedQuestion {
  id: string;
  question: string;
  options?: string[];
  answer?: string;
  explanation?: string;
}

export interface ExamGenerationResponse {
  questions: GeneratedQuestion[];
  metadata: {
    subject: string;
    topic: string;
    difficulty: string;
    questionCount: number;
    timeLimit: number;
    generatedAt: string;
  };
}

// Your Gemini API key - note that exposing API keys in the frontend is not recommended
// for production applications, but for educational purposes we'll use it directly
const GEMINI_API_KEY = "AIzaSyC8gJgkyPZE4nvX66GsZRdLfJ2w2yNW9sk";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export const generateExamWithGemini = async (
  params: ExamGenerationParams
): Promise<ExamGenerationResponse> => {
  console.log("Generating exam with parameters:", params);
  
  try {
    // Create prompt based on parameters
    const prompt = createPromptForExamGeneration(params);
    
    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || "Unknown error"}`);
    }
    
    const data = await response.json();
    
    // Process and format Gemini's response
    const generatedContent = data.candidates[0]?.content?.parts[0]?.text;
    if (!generatedContent) {
      throw new Error("No content generated from Gemini API");
    }
    
    // Parse the generated content into questions
    const questions = parseGeneratedContent(generatedContent, params.questionType);
    
    // Return formatted response
    return {
      questions,
      metadata: {
        subject: params.subject,
        topic: params.topic,
        difficulty: params.difficulty,
        questionCount: params.questionCount,
        timeLimit: params.timeLimit,
        generatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error generating exam:", error);
    // Fallback to mock data if the API call fails
    return generateMockExam(params);
  }
};

// Helper function to create a prompt for Gemini based on exam parameters
function createPromptForExamGeneration(params: ExamGenerationParams): string {
  let prompt = `Generate ${params.questionCount} ${params.difficulty} level ${params.questionType} questions about ${params.topic} in the subject of ${params.subject}. `;
  
  // Add question type specific instructions
  if (params.questionType === "multiple-choice") {
    prompt += "For each question, provide 4 options (labeled A, B, C, D), mark the correct answer, and include a brief explanation. ";
  } else if (params.questionType === "true-false") {
    prompt += "For each question, indicate whether the statement is true or false, and include a brief explanation. ";
  } else if (params.questionType === "short-answer") {
    prompt += "For each question, provide a sample correct answer and a brief explanation. ";
  } else if (params.questionType === "essay") {
    prompt += "For each question, provide some key points that should be addressed in a good answer. ";
  } else if (params.questionType === "mixed") {
    prompt += "Mix different question types (multiple-choice, true-false, and short-answer). For multiple-choice, provide 4 options (labeled A, B, C, D). Mark the correct answer for all questions and include a brief explanation. ";
  }
  
  // Add time constraint context
  prompt += `The exam should be completable within ${params.timeLimit} minutes. `;
  
  // Add custom instructions if provided
  if (params.customPrompt) {
    prompt += `Additional instructions: ${params.customPrompt}`;
  }
  
  // Add request for structured format to make parsing easier
  prompt += "Please format each question clearly with a number, followed by the question text, options (if applicable), the correct answer, and an explanation. Separate each question with a line break.";
  
  return prompt;
}

// Helper function to parse Gemini's response into structured question objects
function parseGeneratedContent(content: string, questionType: string): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  
  try {
    // Split content by questions (looking for patterns like "1.", "Question 1:", etc.)
    const questionBlocks = content.split(/\n\s*(?:\d+[\)\.:]|Question \d+:?)\s*/);
    
    // Filter out empty blocks and process each question
    questionBlocks.filter(block => block.trim().length > 0).forEach((block, index) => {
      const id = `q-${index + 1}`;
      const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      if (lines.length < 2) return; // Skip if not enough content
      
      const question = lines[0];
      let options: string[] | undefined;
      let answer: string | undefined;
      let explanation: string | undefined;
      
      if (questionType === "multiple-choice" || questionType === "mixed") {
        // Try to extract options (looking for A), B), etc. patterns)
        const optionLines = lines.filter(line => /^[A-D][\)\.]/.test(line));
        if (optionLines.length > 0) {
          options = optionLines.map(line => line.replace(/^[A-D][\)\.]\s*/, ''));
        }
        
        // Try to find answer line (looking for "Answer:" or "Correct:" patterns)
        const answerLine = lines.find(line => /Answer:|Correct:|The correct answer is/i.test(line));
        if (answerLine) {
          // Extract letter A, B, C, or D
          const answerMatch = answerLine.match(/[A-D]/);
          answer = answerMatch ? `Option ${answerMatch[0]}` : answerLine.replace(/.*?:\s*/, '');
        }
        
        // Try to find explanation
        const explanationIndex = lines.findIndex(line => /Explanation:|Reason:/i.test(line));
        if (explanationIndex !== -1) {
          explanation = lines.slice(explanationIndex).join(' ').replace(/Explanation:|Reason:/i, '').trim();
        }
      } else {
        // For other question types, simpler parsing
        const answerIndex = lines.findIndex(line => /Answer:|Correct:|Solution:/i.test(line));
        if (answerIndex !== -1) {
          answer = lines[answerIndex].replace(/.*?:\s*/, '');
          // If there are more lines after the answer, treat them as explanation
          if (answerIndex < lines.length - 1) {
            explanation = lines.slice(answerIndex + 1).join(' ');
          }
        }
      }
      
      questions.push({
        id,
        question,
        options,
        answer: answer || "No answer provided",
        explanation: explanation || "No explanation provided",
      });
    });
    
    // If parsing failed to produce enough questions, pad with generic ones
    while (questions.length < 5) {
      questions.push({
        id: `q-${questions.length + 1}`,
        question: `Failed to parse question ${questions.length + 1}`,
        options: questionType === "multiple-choice" ? ["Option A", "Option B", "Option C", "Option D"] : undefined,
        answer: "Unable to parse answer",
        explanation: "The AI response could not be properly parsed for this question.",
      });
    }
    
    return questions;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    return generateFallbackQuestions(questionType);
  }
}

// Fallback function to generate mock questions if parsing fails
function generateFallbackQuestions(questionType: string): GeneratedQuestion[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `q-fallback-${i + 1}`,
    question: `Fallback question ${i + 1} due to parsing error`,
    options: questionType === "multiple-choice" || questionType === "mixed" 
      ? ["Option A", "Option B", "Option C", "Option D"] 
      : undefined,
    answer: "Fallback answer",
    explanation: "This is a fallback question generated because the AI response could not be properly parsed.",
  }));
}

// Fallback function to generate mock exam data if the API fails
function generateMockExam(params: ExamGenerationParams): ExamGenerationResponse {
  console.log("Falling back to mock exam generation");
  
  const questions: GeneratedQuestion[] = [];
  
  for (let i = 0; i < params.questionCount; i++) {
    const question: GeneratedQuestion = {
      id: `q-${i + 1}`,
      question: generateQuestionText(params.subject, params.topic, i),
      options: params.questionType === "multiple-choice" || params.questionType === "mixed" 
        ? generateOptions(params.subject, i)
        : undefined,
      answer: generateAnswer(params.questionType, i),
      explanation: generateExplanation(params.subject, params.topic, i),
    };
    
    questions.push(question);
  }
  
  return {
    questions,
    metadata: {
      subject: params.subject,
      topic: params.topic,
      difficulty: params.difficulty,
      questionCount: params.questionCount,
      timeLimit: params.timeLimit,
      generatedAt: new Date().toISOString(),
    },
  };
}

// Helper functions for mock content generation (from the original implementation)
function generateQuestionText(subject: string, topic: string, index: number): string {
  const subjectQuestions: Record<string, string[]> = {
    mathematics: [
      "Calculate the derivative of f(x) = 3x² + 2x - 5",
      "Solve the equation 2x² - 7x + 3 = 0",
      "Find the integral of g(x) = 4x³ - 2x² + 3x - 1",
      "If sin(θ) = 0.6, what is cos(θ)?",
      "What is the limit of (1 + 1/n)^n as n approaches infinity?",
      "Find the volume of a sphere with radius 5 units",
      "If A = [1 2; 3 4], find the determinant of A",
      "Solve the system of equations: 3x + 2y = 14, 5x - 3y = 7",
      "Find the domain of the function f(x) = ln(x² - 3)",
      "Calculate the area under the curve y = x² from x = 0 to x = 3",
    ],
    physics: [
      "Calculate the force required to accelerate a 2 kg object at 5 m/s²",
      "A car travels at 20 m/s for 10 seconds. How far does it travel?",
      "Calculate the wavelength of a photon with energy 3.0 eV",
      "What is the electric field at a distance of 2m from a point charge of 4C?",
      "A spring has a spring constant of 200 N/m. How much energy is stored when it is compressed by 10 cm?",
      "Calculate the momentum of a 5 kg object moving at 10 m/s",
      "What is the period of a pendulum with length 2m on Earth?",
      "Calculate the centripetal acceleration of an object moving in a circle of radius 3m at 5 m/s",
      "Two charges of +2C and -3C are separated by 4m. Calculate the electric potential at the midpoint",
      "What is the magnetic field at the center of a current-carrying loop with radius 5cm and current 2A?",
    ],
    chemistry: [
      "Balance the following chemical equation: H₂ + O₂ → H₂O",
      "Calculate the pH of a solution with [H⁺] = 1.0 × 10⁻⁵ M",
      "What is the molar mass of sulfuric acid (H₂SO₄)?",
      "Calculate the number of moles in a 25g sample of CaCO₃",
      "Define Hess's Law and explain its significance in thermochemistry",
      "What is the hybridization of the carbon atom in ethene (C₂H₄)?",
      "Calculate the boiling point elevation for a solution with 10g of glucose in 100g of water",
      "Explain the difference between SN1 and SN2 reactions",
      "What is the oxidation state of chromium in K₂Cr₂O₇?",
      "Calculate the mass of sodium hydroxide needed to prepare 250mL of a 0.1M solution",
    ],
    biology: [
      "Describe the structure and function of mitochondria",
      "Explain the role of enzymes in metabolic reactions",
      "Describe the stages of mitosis in eukaryotic cells",
      "Explain how DNA replication occurs in eukaryotic cells",
      "Describe the structure and function of cell membranes",
      "Explain the process of protein synthesis",
      "Describe the circulatory system in mammals",
      "What are the main differences between prokaryotic and eukaryotic cells?",
      "Explain the process of cellular respiration",
      "Describe the structure and function of nephrons in the kidney",
    ],
  };
  
  const defaultQuestions = [
    `Question ${index + 1} about ${topic} in the field of ${subject}`,
    `Explain the key concepts of ${topic} as it relates to ${subject}`,
    `How would you apply ${topic} principles to solve problems in ${subject}?`,
  ];
  
  const questions = subjectQuestions[subject.toLowerCase()] || defaultQuestions;
  return questions[index % questions.length];
}

function generateOptions(subject: string, index: number): string[] {
  const optionSets = [
    ["3x² + 2", "6x + 2", "6x - 5", "3x² + 2x"],
    ["x = 3 and x = 0.5", "x = 3.5 and x = 0.5", "x = 3 and x = -0.5", "x = 3.5 and x = -0.5"],
    ["10 N", "20 N", "5 N", "15 N"],
    ["200 m", "100 m", "150 m", "250 m"],
    ["Bohr model", "Rutherford model", "Quantum model", "Thomson model"],
    ["1.8 × 10⁻¹⁴", "6.02 × 10²³", "9.11 × 10⁻³¹", "1.67 × 10⁻²⁷"],
    ["Mitochondria", "Nucleus", "Golgi apparatus", "Endoplasmic reticulum"],
    ["Anaphase", "Prophase", "Metaphase", "Telophase"],
  ];
  
  return optionSets[index % optionSets.length];
}

function generateAnswer(questionType: string, index: number): string {
  if (questionType === "multiple-choice" || questionType === "mixed") {
    const mcqAnswers = ["Option A", "Option B", "Option C", "Option D"];
    return mcqAnswers[index % 4];
  } else if (questionType === "true-false") {
    return index % 2 === 0 ? "True" : "False";
  } else {
    return "This is a sample answer for the question. In a real implementation, this would be generated by the Gemini API based on the question.";
  }
}

function generateExplanation(subject: string, topic: string, index: number): string {
  return `This explanation discusses the concept of ${topic} in ${subject}. The correct answer demonstrates understanding of the key principles involved. In a real implementation, this would be a detailed explanation generated by the Gemini API.`;
}
