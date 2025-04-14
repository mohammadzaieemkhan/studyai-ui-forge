
// This is a mock implementation of the Gemini API service
// In a real application, this would make actual API calls to the Gemini API through a backend

// The API key would be stored securely in the backend
// const GEMINI_API_KEY = "AIzaSyC8gJgkyPZE4nvX66GsZRdLfJ2w2yNW9sk";

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

// This function simulates a request to Gemini API
export const generateExamWithGemini = async (
  params: ExamGenerationParams
): Promise<ExamGenerationResponse> => {
  console.log("Generating exam with parameters:", params);
  
  // In a real implementation, this would make an API call to your backend
  // which would then use the Gemini API with the stored API key
  
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Generate mock questions based on params
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
};

// Helper functions to generate mock content
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
