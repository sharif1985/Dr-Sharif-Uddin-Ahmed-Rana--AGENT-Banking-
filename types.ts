export interface Agent {
  id: string;
  name: string;
  title: string;
  category: 'Executive' | 'Operations' | 'Creative' | 'Technical';
  icon: string;
  role: string;
  inputFormat: string;
  outputFormat: string;
  rules: string[];
  collaboration: string;
  color: string; // Tailwind color class snippet (e.g., 'blue', 'emerald')
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  agentId?: string; // If null, it's a system message
}

export interface ChatSession {
  agentId: string;
  messages: Message[];
  isTyping: boolean;
}