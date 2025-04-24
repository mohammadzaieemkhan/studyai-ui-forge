
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// The Gemini API key provided
const GEMINI_API_KEY = "AIzaSyC8gJgkyPZE4nvX66GsZRdLfJ2w2yNW9sk";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { syllabusContent, fileName } = await req.json();

    if (!syllabusContent) {
      return new Response(JSON.stringify({ error: "Missing syllabus content" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing syllabus from file: ${fileName}`);

    // Create a prompt for the Gemini API to extract topics from the syllabus
    const prompt = `
      You are an expert educational content analyzer. Extract and organize the main topics from this syllabus.
      For each topic, please:
      1. Identify the main subject area
      2. List subtopics
      3. Note any key concepts or theories mentioned
      4. Indicate approximate difficulty level (Beginner, Intermediate, Advanced)
      
      Format the response as a structured JSON with the following format:
      {
        "mainSubject": "Subject name",
        "topics": [
          {
            "name": "Topic name",
            "subtopics": ["Subtopic 1", "Subtopic 2"],
            "keyTerms": ["Term 1", "Term 2"],
            "difficulty": "Beginner|Intermediate|Advanced"
          }
        ]
      }
      
      Here's the syllabus content:
      ${syllabusContent}
    `;

    // Call the Gemini API
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
          temperature: 0.2,
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
    const generatedContent = data.candidates[0]?.content?.parts[0]?.text;

    if (!generatedContent) {
      throw new Error("No content generated from Gemini API");
    }

    // Extract the JSON from the response which might contain markdown formatting
    let extractedTopics;
    try {
      // Try to find JSON in the response which might be wrapped in markdown code blocks
      const jsonMatch = generatedContent.match(/```json\s*([\s\S]*?)\s*```|```\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/);
      const jsonContent = jsonMatch ? (jsonMatch[1] || jsonMatch[2] || jsonMatch[3]) : generatedContent;
      extractedTopics = JSON.parse(jsonContent);
    } catch (e) {
      console.error("Error parsing JSON from Gemini response:", e);
      console.log("Raw response:", generatedContent);
      extractedTopics = {
        mainSubject: "Unknown",
        topics: [],
        rawResponse: generatedContent
      };
    }

    return new Response(JSON.stringify({
      topics: extractedTopics,
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in process-syllabus function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
