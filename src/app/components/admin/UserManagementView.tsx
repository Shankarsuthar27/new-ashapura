import React, { useState } from 'react';
import {
  Users, Key, ShieldCheck, Monitor, Smartphone, RefreshCw, X, CheckSquare, Square
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  // Mock users
  const [users, setUsers] = useState([
    { id: '1', name: 'Shankar Suthar', role: 'Super Admin', email: 'shankar@ashapuragranite.in', status: 'Active' },
    { id: '2', name: 'Victoria Sterling', role: 'Editor', email: 'victoria@sterlingdesign.com', status: 'Active' },
    { id: '3', name: 'Dr. Alessandro Conti', role: 'Manager', email: 'alessandro@quarrylabs.it', status: 'Inactive' }
  ]);

  // Mock sessions
  const [sessions, setSessions] = useState([
    { id: 'S1', ip: '103.88.22.140', device: 'Windows 11 PC (Chrome)', time: 'Active Now', current: true },
    { id: 'S2', ip: '192.168.1.45', device: 'Apple iPhone 15 Pro (Safari)', time: '2 hours ago', current: false },
    { id: 'S3', ip: '185.220.101.4', device: 'Linux Desktop (Firefox)', time: '1 day ago', current: false }
  ]);

  // Permissions matrix
  const [permissions, setPermissions] = useState<Record<string, string[]>>({
    'Super Admin': ['all'],
    'Admin': ['inventory_read', 'inventory_write', 'bookings_read', 'bookings_write', 'users_read'],
    'Manager': ['inventory_read', 'inventory_write', 'bookings_read'],
    'Editor': ['inventory_read', 'inventory_write'],
    'Staff': ['inventory_read']
  });

  const [selectedRole, setSelectedRole] = useState('Admin');
  const availablePermissions = [
    { key: 'inventory_read', label: 'View Inventory' },
    { key: 'inventory_write', label: 'Add/Edit Slabs' },
    { key: 'bookings_read', label: 'View Bookings' },
    { key: 'bookings_write', label: 'Manage Bookings' },
    { key: 'users_read', label: 'View Admin Accounts' },
    { key: 'users_write', label: 'Modify Roles & Permissions' }
  ];

  const handleTogglePermission = (role: string, permKey: string) => {
    setPermissions(prev => {
      const current = prev[role] || [];
      const updated = current.includes(permKey)
        ? current.filter(p => p !== permKey)
        : [...current, permKey];
      return { ...prev, [role]: updated };
    });
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleTerminateSession = (sessionId: string) => {
    if (confirm('Terminate this active login session?')) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
      {/* Left: Administrative Accounts */}
      <div className="lg:col-span-2 bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="font-serif-luxury text-xl font-bold flex items-center gap-1.5 border-b border-gray-200 dark:border-gray-800 pb-3">
          <Users className="w-5 h-5 text-[#C8A96A]" /> Administrator Accounts
        </h3>

        <div className="space-y-4">
          {users.map(u => (
            <div
              key={u.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#19191D] border border-gray-200 dark:border-gray-800 text-xs"
            >
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">{u.name}</p>
                <p className="text-gray-450 font-mono mt-0.5">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                {u.role === 'Super Admin' ? (
                  <span className="font-bold text-[#C8A96A] bg-[#C8A96A]/10 px-3 py-1.5 rounded-lg border border-[#C8A96A]/30">
                    Super Admin
                  </span>
                ) : (
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u.id, e.target.value)}
                    className="bg-white dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-850 px-3 py-1.5 rounded-xl font-bold focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Editor">Editor</option>
                    <option value="Staff">Staff</option>
                  </select>
                )}
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-400'
                }`}>
                  {u.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Roles & Active Sessions */}
      <div className="space-y-6">
        {/* Permission matrix configuration */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h4 className="font-serif-luxury text-base font-bold text-[#C8A96A] flex items-center gap-1.5">
            <Key className="w-4 h-4" /> Role Permissions
          </h4>

          <div className="flex items-center gap-2">
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C8A96A] font-bold text-[#C8A96A]"
            >
              <option value="Admin">Role: Admin</option>
              <option value="Manager">Role: Manager</option>
              <option value="Editor">Role: Editor</option>
              <option value="Staff">Role: Staff</option>
            </select>
          </div>

          <div className="space-y-2.5 pt-2">
            {availablePermissions.map(perm => {
              const currentPerms = permissions[selectedRole] || [];
              const isChecked = currentPerms.includes(perm.key) || currentPerms.includes('all');
              const isDisabled = currentPerms.includes('all'); // Super admin can't be toggled

              return (
                <button
                  key={perm.key}
                  disabled={isDisabled}
                  onClick={() => handleTogglePermission(selectedRole, perm.key)}
                  className="w-full flex items-center gap-3 text-left text-xs text-gray-700 dark:text-gray-300 disabled:opacity-60"
                >
                  {isChecked ? (
                    <CheckSquare className="w-4.5 h-4.5 text-[#C8A96A]" />
                  ) : (
                    <Square className="w-4.5 h-4.5 text-gray-400" />
                  )}
                  <span>{perm.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active login sessions */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h4 className="font-serif-luxury text-base font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Active Login Sessions
          </h4>

          <div className="space-y-3">
            {sessions.map(s => (
              <div
                key={s.id}
                className="text-xs p-3 rounded-xl bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 space-y-1.5 relative group"
              >
                {!s.current && (
                  <button
                    onClick={() => handleTerminateSession(s.id)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Terminate Session"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                
                <div className="flex items-center gap-2">
                  {s.device.includes('iPhone') ? (
                    <Smartphone className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Monitor className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="font-bold text-gray-850 dark:text-gray-250 truncate max-w-[170px]">{s.device}</span>
                </div>
                
                <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                  <span>IP: {s.ip}</span>
                  <span className={s.current ? 'text-emerald-500 font-bold' : ''}>{s.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
