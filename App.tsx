import React, { useState } from 'react';
import { AGENTS } from './constants';
import { Agent } from './types';
import { AgentCard } from './components/AgentCard';
import { AgentDetailModal } from './components/AgentDetailModal';
import { ChatInterface } from './components/ChatInterface';
import { Cpu, Grid, Layers, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeChatAgent, setActiveChatAgent] = useState<Agent | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', 'Executive', 'Creative', 'Technical', 'Operations'];
  
  const filteredAgents = categoryFilter === 'All' 
    ? AGENTS 
    : AGENTS.filter(a => a.category === categoryFilter);

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const handleStartChat = (agent: Agent) => {
    setSelectedAgent(null);
    setActiveChatAgent(agent);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar / Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
            <Layers size={20} />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Agent Bank</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">Departments</div>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === cat 
                  ? 'bg-blue-600/10 text-blue-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
          
          <div className="mt-8 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">System Status</div>
          <div className="px-3 py-2 bg-slate-900 rounded border border-slate-800/50">
             <div className="flex items-center gap-2 text-xs text-emerald-400 mb-1">
               <Activity size={12} />
               <span>Operational</span>
             </div>
             <div className="text-[10px] text-slate-500">Uptime: 99.9%</div>
             <div className="text-[10px] text-slate-500">Latency: 45ms</div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center gap-3 px-2">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center">
               <Cpu size={14} className="text-slate-300" />
             </div>
             <div>
               <div className="text-xs font-medium text-slate-200">Admin User</div>
               <div className="text-[10px] text-slate-500">Access Level: 5</div>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {activeChatAgent ? (
          <div className="flex-1 p-4 md:p-8 animate-fadeIn flex flex-col h-full">
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
               <span onClick={() => setActiveChatAgent(null)} className="cursor-pointer hover:text-white transition-colors">Agents</span>
               <span>/</span>
               <span className="text-white">Active Session</span>
            </div>
            <ChatInterface 
              agent={activeChatAgent} 
              onClose={() => setActiveChatAgent(null)} 
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Deployable Agents</h1>
              <p className="text-slate-400 max-w-2xl">
                Select an intelligent agent to view their specialized capabilities, rules of engagement, and collaboration protocols.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              {filteredAgents.map(agent => (
                <AgentCard 
                  key={agent.id} 
                  agent={agent} 
                  onClick={handleAgentClick} 
                />
              ))}
            </div>
            
            {filteredAgents.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                <Grid size={48} className="mx-auto mb-4 opacity-20" />
                <p>No agents found in this category.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <AgentDetailModal 
        agent={selectedAgent} 
        onClose={() => setSelectedAgent(null)} 
        onChat={handleStartChat}
      />
    </div>
  );
};

export default App;