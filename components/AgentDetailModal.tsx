import React from 'react';
import { Agent } from '../types';
import * as Icons from 'lucide-react';

interface AgentDetailModalProps {
  agent: Agent | null;
  onClose: () => void;
  onChat: (agent: Agent) => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({ agent, onClose, onChat }) => {
  if (!agent) return null;

  const IconComponent = (Icons as any)[agent.icon] || Icons.HelpCircle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-${agent.color}-500/20 text-${agent.color}-400`}>
              <IconComponent size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
              <p className={`text-${agent.color}-400 font-medium`}>{agent.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <Icons.X size={24} />
          </button>
        </div>

        {/* Content - Scrollable Table */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 gap-6">
            
            <div className="bg-slate-800/30 rounded-lg border border-slate-700 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-slate-700/50">
                  <tr className="group hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 w-1/3 text-slate-400 font-medium align-top border-r border-slate-700/50">Role</td>
                    <td className="p-4 text-slate-200">{agent.role}</td>
                  </tr>
                  <tr className="group hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 w-1/3 text-slate-400 font-medium align-top border-r border-slate-700/50">Input Format</td>
                    <td className="p-4 text-slate-200 font-mono text-sm bg-slate-900/30">{agent.inputFormat}</td>
                  </tr>
                  <tr className="group hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 w-1/3 text-slate-400 font-medium align-top border-r border-slate-700/50">Output Format</td>
                    <td className="p-4 text-slate-200 font-mono text-sm bg-slate-900/30">{agent.outputFormat}</td>
                  </tr>
                  <tr className="group hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 w-1/3 text-slate-400 font-medium align-top border-r border-slate-700/50">Operational Rules</td>
                    <td className="p-4 text-slate-200">
                      <ul className="list-disc list-inside space-y-1">
                        {agent.rules.map((rule, idx) => (
                          <li key={idx} className="text-slate-300">{rule}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                  <tr className="group hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 w-1/3 text-slate-400 font-medium align-top border-r border-slate-700/50">Collaboration Flow</td>
                    <td className="p-4 text-slate-200 italic">{agent.collaboration}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-slate-300 hover:text-white font-medium transition-colors hover:bg-slate-700"
          >
            Close
          </button>
          <button 
            onClick={() => onChat(agent)}
            className={`px-6 py-2 rounded-lg bg-${agent.color}-600 hover:bg-${agent.color}-500 text-white font-bold shadow-lg shadow-${agent.color}-500/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2`}
          >
            <Icons.MessageSquare size={18} />
            Initialize Session
          </button>
        </div>

      </div>
    </div>
  );
};