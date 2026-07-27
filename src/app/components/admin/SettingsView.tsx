import React, { useState } from 'react';
import {
  Settings, Save, Globe, Database, ShieldAlert, CheckCircle2,
  Trash2, RefreshCw, Key, Download
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [siteInfo, setSiteInfo] = useState({
    name: 'Ashapura Tiles & Granite',
    email: 'info@ashapuragranite.in',
    phone: '+91 99746 17657',
    whatsapp: '+91 99746 17657',
    address: 'Atelier Ashapura Granite, Industrial Area, Jalore, Rajasthan - 343001',
    mapsUrl: 'https://www.google.com/maps/embed?...',
    accentColor: '#C8A96A',
    fontStyle: 'serif-luxury'
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupDate, setBackupDate] = useState('2026-07-26 10:45 AM');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupDate(new Date().toLocaleString());
      alert('Local Storage and Database Catalog Backup complete!\nFile: ashapura_backup_v3.json has been generated successfully.');
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
      {/* General Settings Form */}
      <div className="lg:col-span-2 bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="font-serif-luxury text-xl font-bold flex items-center gap-1.5 border-b border-gray-200 dark:border-gray-800 pb-3">
          <Settings className="w-5 h-5 text-[#C8A96A]" /> Atelier Website Information
        </h3>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[9px]">Company Name</label>
              <input
                type="text"
                value={siteInfo.name}
                onChange={e => setSiteInfo({ ...siteInfo, name: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-850 rounded-xl px-3.5 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#C8A96A]"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[9px]">Contact Email</label>
              <input
                type="email"
                value={siteInfo.email}
                onChange={e => setSiteInfo({ ...siteInfo, email: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-850 rounded-xl px-3.5 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#C8A96A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[9px]">Telephone Phone</label>
              <input
                type="text"
                value={siteInfo.phone}
                onChange={e => setSiteInfo({ ...siteInfo, phone: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-850 rounded-xl px-3.5 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#C8A96A]"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[9px]">WhatsApp Target</label>
              <input
                type="text"
                value={siteInfo.whatsapp}
                onChange={e => setSiteInfo({ ...siteInfo, whatsapp: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-850 rounded-xl px-3.5 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#C8A96A]"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[9px]">Atelier Address</label>
            <input
              type="text"
              value={siteInfo.address}
              onChange={e => setSiteInfo({ ...siteInfo, address: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-850 rounded-xl px-3.5 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[9px]">Brand Accent Color</label>
              <select
                value={siteInfo.accentColor}
                onChange={e => setSiteInfo({ ...siteInfo, accentColor: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-850 rounded-xl px-3.5 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#C8A96A] font-bold"
              >
                <option value="#C8A96A">Luxurious Gold (#C8A96A)</option>
                <option value="#3b82f6">Royal Blue (#3B82F6)</option>
                <option value="#EF233C">Scarlet Red (#EF233C)</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[9px]">Typography Font Pair</label>
              <select
                value={siteInfo.fontStyle}
                onChange={e => setSiteInfo({ ...siteInfo, fontStyle: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-850 rounded-xl px-3.5 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#C8A96A] font-bold"
              >
                <option value="serif-luxury">Luxury Serif (Inter + Playfair)</option>
                <option value="sans-modern">Modern Sans-Serif (Inter + Outfit)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#C8A96A] text-black font-bold uppercase tracking-wider rounded-xl hover:brightness-110 flex items-center gap-1.5 transition-all shadow-md mt-4"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Site Settings Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save General Settings
              </>
            )}
          </button>
        </form>
      </div>

      {/* Security & Backup Panel */}
      <div className="space-y-6">
        {/* Backup Database */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h4 className="font-serif-luxury text-base font-bold flex items-center gap-1.5 text-gray-900 dark:text-white">
            <Database className="w-4 h-4 text-[#C8A96A]" /> Database Backups
          </h4>
          <p className="text-xs text-gray-450">
            Create snapshot backups of the stone slabs inventory, sample orders, and general configurations.
          </p>

          <div className="bg-gray-50 dark:bg-[#1A1A1F] p-3 rounded-xl text-[10px] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Last Backup Snapshot</span>
              <span className="font-bold font-mono text-gray-850 dark:text-gray-250">{backupDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Database Size</span>
              <span className="font-bold font-mono text-gray-850 dark:text-gray-250">142 KB (Compact JSON)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            <button
              onClick={handleBackup}
              disabled={isBackingUp}
              className="py-2.5 rounded-xl border border-[#C8A96A]/40 text-[#C8A96A] hover:bg-[#C8A96A]/10 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1"
            >
              {isBackingUp ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                </>
              ) : (
                'Run Backup'
              )}
            </button>
            <button className="py-2.5 rounded-xl bg-gray-50 dark:bg-[#1A1A1F] hover:bg-gray-100 dark:hover:bg-[#1e1e24] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 border border-transparent hover:border-gray-200">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        </div>

        {/* Security Controls */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h4 className="font-serif-luxury text-base font-bold flex items-center gap-1.5 text-red-500">
            <ShieldAlert className="w-4 h-4" /> Security Audit Controls
          </h4>
          <p className="text-xs text-gray-450">
            Advanced parameters for portal rate-limiting, clickjacking protection, and token expirations.
          </p>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Rate Limiter API</span>
              <span className="text-emerald-500 font-bold">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Session Timeout</span>
              <span className="text-gray-900 dark:text-white font-bold font-mono">30 Mins</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Strict XSS Headers</span>
              <span className="text-emerald-500 font-bold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
