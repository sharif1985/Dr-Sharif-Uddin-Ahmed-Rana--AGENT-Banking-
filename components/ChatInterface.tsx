import React, { useState, useEffect, useRef } from 'react';
import { Agent, Message } from '../types';
import { createAgentSession, sendMessageToAgent } from '../services/geminiService';
import * as Icons from 'lucide-react';
import { Chat } from '@google/genai';

interface ChatInterfaceProps {
  agent: Agent;
  onClose: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ agent, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const IconComponent = (Icons as any)[agent.icon] || Icons.HelpCircle;

  useEffect(() => {
    const initChat = () => {
      try {
        const session = createAgentSession(agent);
        setChatSession(session);
        setMessages([
          {
            id: 'system-welcome',
            role: 'model',
            content: `**${agent.name}** Online. \n\nI am ready to assist you as the ${agent.title}. Please provide input in the required format: \n*${agent.inputFormat}*`,
            timestamp: Date.now(),
            agentId: agent.id
          }
        ]);
      } catch (error) {
        console.error("Failed to initialize chat", error);
      }
    };
    initChat();
  }, [agent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToAgent(chatSession, userMsg.content);
      const text = response.text || "No response received.";
      
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: text,
        timestamp: Date.now(),
        agentId: agent.id
      };
      
      setMessages(prev => [...prev, agentMsg]);
    } catch (error) {
      console.error("Chat Error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: "Detailed simulation error: Unable to process request due to connection issues or quota limits.",
        timestamp: Date.now(),
        agentId: agent.id
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
      
      {/* Header */}
      <div className={`p-4 border-b border-slate-700 bg-slate-800/80 backdrop-blur flex justify-between items-center z-10`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-${agent.color}-500/20 text-${agent.color}-400`}>
            <IconComponent size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              {agent.name}
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </h3>
            <p className="text-xs text-slate-400 uppercase tracking-wide">{agent.title}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
          <Icons.Minimize2 size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-slate-900 to-slate-950">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-slate-700 text-white rounded-t-2xl rounded-bl-2xl' : `bg-slate-800/80 border border-slate-700 text-slate-200 rounded-t-2xl rounded-br-2xl`} p-4 shadow-md`}>
              {msg.role === 'model' && (
                <div className={`text-xs font-bold text-${agent.color}-400 mb-2 uppercase tracking-wider`}>
                  {agent.name}
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed text-sm">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800/50 border-t border-slate-700">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Instruct ${agent.name}... (Shift+Enter for new line)`}
            className="w-full bg-slate-900/50 text-white placeholder-slate-500 border border-slate-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-slate-500 resize-none h-14 max-h-32 custom-scrollbar"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 top-2 p-2 rounded-lg transition-colors ${!input.trim() || isLoading ? 'text-slate-600' : `text-${agent.color}-400 hover:bg-slate-700`}`}
          >
            <Icons.Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-600 mt-2">
          AI Agent Bank Secure Channel • Encrypted • Monitoring Active
        </p>
      </div>
    </div>
  );
};