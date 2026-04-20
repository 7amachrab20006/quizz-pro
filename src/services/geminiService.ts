import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../lib/data";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please add it to your environment variables.");
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
    return JSON.parse(text);
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
        responseMimeType: "application/json"
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
