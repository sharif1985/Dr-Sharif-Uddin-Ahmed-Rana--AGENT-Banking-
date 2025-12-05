import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Agent, Message } from '../types';

let genAI: GoogleGenAI | null = null;

const getGenAI = (): GoogleGenAI => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found in environment variables");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

export const createAgentSession = (agent: Agent): Chat => {
  const ai = getGenAI();
  
  const systemInstruction = `
    You are ${agent.name}, the ${agent.title} of a prestigious virtual organization called "AI Agent Bank".
    
    YOUR ROLE:
    ${agent.role}
    
    YOUR RULES:
    ${agent.rules.map(r => `- ${r}`).join('\n')}
    
    INPUT FORMAT YOU EXPECT:
    ${agent.inputFormat}
    
    OUTPUT FORMAT YOU PROVIDE:
    ${agent.outputFormat}
    
    COLLABORATION STYLE:
    ${agent.collaboration}
    
    Tone: Professional, authoritative yet helpful within your domain.
    If asked about topics completely outside your domain (e.g., a Lawyer asked about coding CSS), politely defer to the appropriate agent in the bank.
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7, // Balance between creativity and strict adherence
    },
  });
};

export const sendMessageToAgent = async (
  chat: Chat, 
  message: string
): Promise<GenerateContentResponse> => {
  return await chat.sendMessage({
    message: message
  });
};