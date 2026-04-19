import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the "KnowApp Project Advisor". Your goal is to help users who might have limited funds to define their home improvement needs.
When a user describes a problem (e.g., "my sink is leaking" or "hole in wall"), you should:
1. Identify the likely job category (e.g., Plumbing, Carpentry).
2. Estimate the difficulty level (Easy DIY vs. Professional needed).
3. Suggest a concise Title and Description for a job posting.
4. Estimate a fair "community budget" (low cost) or suggest specific items for Barter/Trade if they have no money.
5. Be encouraging and helpful.
6. Keep responses structured and concise. 
`;

export const getProjectAdvice = async (userQuery: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key is missing. Returning mock response.");
    return "I can't connect to my brain right now (Missing API Key), but generally, for home projects, try to describe the issue clearly and take photos!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    
    return response.text || "I couldn't generate advice at this moment. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while analyzing your project. Please try again later.";
  }
};

export const getDirectMessageResponse = async (
  recipientName: string,
  jobTitle: string,
  history: { senderId: string; text: string }[],
  userName: string = 'User'
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "I'm interested! Tell me more.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const conversationHistory = history.map(h => `${h.senderId === userName ? userName : recipientName}: ${h.text}`).join('\n');
    
    const prompt = `
      You are simulating a response from "${recipientName}" in a community project app called KnowApp.
      The context is a job titled "${jobTitle}".
      
      Conversation so far:
      ${conversationHistory}
      
      Generate a natural, helpful, and concise response from ${recipientName}. 
      Keep it short (1-2 sentences) and friendly. 
      If the user asked a question, answer it reasonably based on the context.
      If they are offering help, be appreciative.
      If they are asking for help, be clear about what you need.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Sounds good! Let's talk more soon.";
  } catch (error) {
    console.error("Gemini Direct Message Error:", error);
    return "Thanks for the message! I'll get back to you soon.";
  }
};
