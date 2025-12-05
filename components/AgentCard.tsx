import React from 'react';
import { Agent } from '../types';
import * as Icons from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
  const IconComponent = (Icons as any)[agent.icon] || Icons.HelpCircle;

  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:border-indigo-400/50',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:border-emerald-400/50',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20 hover:border-pink-400/50',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:border-violet-400/50',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:border-cyan-400/50',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:border-amber-400/50',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:border-orange-400/50',
    teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20 hover:border-teal-400/50',
    fuchsia: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 hover:border-fuchsia-400/50',
    slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:border-slate-400/50',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:border-rose-400/50',
    red: 'bg-red-500/10 text-red-400 border-red-500/20 hover:border-red-400/50',
  };

  const styleClass = colorMap[agent.color] || colorMap.slate;

  return (
    <div 
      onClick={() => onClick(agent)}
      className={`relative group p-6 rounded-xl border transition-all duration-300 cursor-pointer backdrop-blur-sm ${styleClass} hover:shadow-lg hover:-translate-y-1 flex flex-col h-full`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-slate-900/50 ${styleClass.split(' ')[1]}`}>
          <IconComponent size={24} />
        </div>
        <span className="text-xs font-medium uppercase tracking-wider opacity-60 px-2 py-1 rounded bg-slate-900/50">
          {agent.category}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-slate-100 mb-1">{agent.name}</h3>
      <p className="text-sm font-medium opacity-80 mb-3">{agent.title}</p>
      
      <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-grow">
        {agent.role}
      </p>

      <div className="mt-auto flex items-center text-xs font-semibold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        View Profile &rarr;
      </div>
    </div>
  );
};