// System Version: 2.4.1 - Updated AI Advisor Logic
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../lib/data";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please ensure it is set in your environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function generateQuizQuestions(categoryName: string, difficulty: string, amount: number = 10): Promise<Question[]> {
  const prompt = `Generate ${amount} unique, clear, and beginner-friendly multiple-choice questions for the domain of "${categoryName}". 
  The difficulty level should be strictly "${difficulty}" but keep them straightforward and accessible. 
  Ensure the questions are fun and easy to understand for a general audience.
  Provide exactly ${amount} questions in the requested JSON format.`;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "A unique identifier for the question (e.g., ai-q1)" },
              text: { type: Type.STRING, description: "The actual text of the question" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Four plausible answer choices"
              },
              correctAnswer: { 
                type: Type.INTEGER, 
                description: "The zero-based index of the correct answer in the options array" 
              }
            },
            required: ["id", "text", "options", "correctAnswer"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data received from Gemini");
    
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed;
      if (parsed.questions && Array.isArray(parsed.questions)) return parsed.questions;
      if (parsed.data && Array.isArray(parsed.data)) return parsed.data;
      throw new Error("Gemini response is not a valid question array");
    } catch (e) {
      console.error("Failed to parse Gemini response as array:", text);
      throw e;
    }
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}

export interface DecisionResult {
  reasoning: string;
  recommendation: string;
  decisionScore: number;
}

export async function analyzeDecision(dilemma: string, context?: string): Promise<DecisionResult> {
  const prompt = `Act as a logical, highly intelligent AI Life Advisor. 
  A user has presented the following dilemma: "${dilemma}".
  Context (if any): "${context || 'None provided'}".
  
  Evaluate this dilemma objectively. Consider long-term consequences, personal growth, and practical logic.
  Provide:
  1. A clear reasoning for your evaluation.
  2. A definitive final recommendation.
  3. A "Decision Score" from 0 to 100 representing how confident this choice is (100 is high certainty).
  
  Provide the response in the following JSON format:
  {
    "reasoning": "...",
    "recommendation": "...",
    "decisionScore": 85
  }`;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reasoning: { type: Type.STRING, description: "Detailed logical reasoning" },
            recommendation: { type: Type.STRING, description: "Final clear recommendation" },
            decisionScore: { type: Type.INTEGER, description: "Certainty score from 0-100" }
          },
          required: ["reasoning", "recommendation", "decisionScore"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data received from Advisor");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Advisor Analysis Error:", error);
    throw error;
  }
}
