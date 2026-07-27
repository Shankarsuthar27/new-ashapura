import React, { useState } from 'react';
import { ClipboardList, ShieldAlert, Monitor, Terminal, FileText, CheckCircle2 } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  // Mock activity logs
  const [logs, setLogs] = useState([
    { id: '1', time: 'Active Now', user: 'Shankar Suthar', action: 'Added product "Amazonite Emerald Slabs"', category: 'inventory', ip: '103.88.22.140' },
    { id: '2', time: '5 mins ago', user: 'Shankar Suthar', action: 'Modified price for "Bianco Lasa Marble" to ₹280.00', category: 'inventory', ip: '103.88.22.140' },
    { id: '3', time: '2 hours ago', user: 'Victoria Sterling', action: 'Replied to message from "Rajesh Sharma"', category: 'messages', ip: '192.168.1.45' },
    { id: '4', time: '4 hours ago', user: 'Shankar Suthar', action: 'OTP login verified successfully', category: 'auth', ip: '103.88.22.140' },
    { id: '5', time: '1 day ago', user: 'System Agent', action: 'Automated catalog sync with Supabase', category: 'system', ip: 'localhost' }
  ]);

  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredLogs = logs.filter(l => categoryFilter === 'All' || l.category === categoryFilter);

  return (
    <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4 mb-6 flex-wrap gap-4">
        <div>
          <h3 className="font-serif-luxury text-xl font-bold flex items-center gap-1.5">
            <ClipboardList className="w-5 h-5 text-[#C8A96A]" /> Activity Logs & Audit Trail
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Real-time track of all administrative catalog updates and security events.
          </p>
        </div>

        <div className="flex gap-2">
          {['All', 'Inventory', 'Messages', 'Auth', 'System'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                categoryFilter === cat
                  ? 'bg-[#C8A96A] text-black shadow-md'
                  : 'bg-gray-50 dark:bg-[#1A1A1F] text-gray-600 dark:text-gray-300 hover:border-[#C8A96A] border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline view */}
      <div className="relative border-l border-gray-200 dark:border-gray-800 ml-4 space-y-6">
        {filteredLogs.map(log => {
          let icon = <Terminal className="w-3.5 h-3.5" />;
          let colorClass = 'bg-blue-500/10 text-blue-500 border-blue-500/20';

          if (log.category === 'inventory') {
            icon = <FileText className="w-3.5 h-3.5" />;
            colorClass = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
          } else if (log.category === 'auth') {
            icon = <ShieldAlert className="w-3.5 h-3.5" />;
            colorClass = 'bg-red-500/10 text-red-500 border-red-500/20';
          } else if (log.category === 'messages') {
            icon = <CheckCircle2 className="w-3.5 h-3.5" />;
            colorClass = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
          }

          return (
            <div key={log.id} className="relative pl-6 animate-in slide-in-from-left-2 duration-200">
              {/* Timeline dot */}
              <div className={`absolute -left-3.5 top-0.5 w-7 h-7 rounded-full border flex items-center justify-center bg-white dark:bg-[#131316] ${colorClass}`}>
                {icon}
              </div>

              {/* Log Details */}
              <div className="space-y-1 bg-gray-50 dark:bg-[#19191D] border border-gray-200 dark:border-gray-850 p-4 rounded-2xl max-w-2xl text-xs">
                <div className="flex items-center justify-between flex-wrap gap-2 text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-800 dark:text-gray-200">{log.user}</span>
                    <span>•</span>
                    <span className="font-mono text-[10px]">IP: {log.ip}</span>
                  </div>
                  <span className="font-mono text-[10px]">{log.time}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-1 font-semibold">{log.action}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
