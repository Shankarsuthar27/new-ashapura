import React, { useState } from 'react';
import {
  MessageSquare, Mail, Trash2,
  Archive, AlertOctagon, Reply, Eye, ClipboardList
} from 'lucide-react';

interface ContactBookingsViewProps {
  sampleOrders: any[];
  onDeleteSampleOrder: (orderId: string) => void;
}

export const ContactBookingsView: React.FC<ContactBookingsViewProps> = ({
  sampleOrders,
  onDeleteSampleOrder
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'messages' | 'samples'>('messages');
  
  // Custom mock messages from the contact page
  const [messages, setMessages] = useState<any[]>([
    { id: 'MSG-884', date: '2026-07-26', name: 'Rajesh Sharma', email: 'rajesh@sharmabuilders.in', subject: 'Bulk Tiles Inquiry', message: 'Looking for vitrified floor tiles pricing for a 50-apartment residential project in Jalore.', status: 'unread', isSpam: false },
    { id: 'MSG-612', date: '2026-07-25', name: 'Lucia Berti', email: 'lucia.berti@italstone.it', subject: 'Quarry Collaboration Proposal', message: 'Interested in partnering to export premium white Carrara blocks directly to Jalore.', status: 'read', isSpam: false },
    { id: 'MSG-441', date: '2026-07-23', name: 'Cryptocurrency bot', email: 'spam@cryptorobot.xyz', subject: 'Guaranteed SEO ranking boost', message: 'Earn passive income with our new digital crypto investment engine.', status: 'read', isSpam: true }
  ]);

  // Reply simulation state
  const [replyTarget, setReplyTarget] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');

  // Message action handlers
  const handleToggleMessageRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: m.status === 'read' ? 'unread' : 'read' } : m));
  };

  const handleArchiveMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm('Permanently delete this message?')) {
      setMessages(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    alert(`Simulated email reply sent to ${replyTarget.email}:\n\n"${replyText}"`);
    setReplyTarget(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-3 overflow-x-auto no-scrollbar scrollbar-none whitespace-nowrap">
        <button
          onClick={() => setActiveSubTab('messages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            activeSubTab === 'messages'
              ? 'bg-[#C8A96A] text-black shadow-md'
              : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" /> Contact Messages ({messages.filter(m => m.status === 'unread').length} new)
        </button>

        <button
          onClick={() => setActiveSubTab('samples')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            activeSubTab === 'samples'
              ? 'bg-[#C8A96A] text-black shadow-md'
              : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
          }`}
        >
          <ClipboardList className="w-4 h-4" /> Booking Boxes ({sampleOrders.length})
        </button>
      </div>

      {/* Reply Modal Dialog */}
      {replyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#121215] border border-[#C8A96A]/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div>
              <h4 className="font-serif-luxury text-lg font-bold">Reply to {replyTarget.name}</h4>
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">{replyTarget.email}</p>
            </div>
            <textarea
              rows={4}
              placeholder="Type your official email reply message..."
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-250 dark:border-gray-800 rounded-xl p-3 text-xs focus:outline-none focus:border-[#C8A96A] text-gray-900 dark:text-gray-100"
            />
            <div className="flex justify-end gap-3 text-xs">
              <button
                onClick={() => setReplyTarget(null)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                className="px-5 py-2 bg-[#C8A96A] text-black font-bold uppercase tracking-wider rounded-xl hover:brightness-110"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: Contact Messages */}
      {activeSubTab === 'messages' && (
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="font-serif-luxury text-lg font-bold">Client Contact Messages</h3>

          <div className="space-y-4">
            {messages.map(m => (
              <div
                key={m.id}
                className={`border rounded-2xl p-5 text-xs transition-all relative ${
                  m.status === 'unread'
                    ? 'border-[#C8A96A]/60 bg-[#C8A96A]/5 dark:bg-[#C8A96A]/2'
                    : 'border-gray-200 dark:border-gray-800 bg-gray-55 dark:bg-[#19191D]'
                }`}
              >
                {m.isSpam && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 rounded bg-red-500/15 text-red-500 text-[8px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                    <AlertOctagon className="w-3 h-3" /> Spam Detected
                  </span>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 dark:text-white text-sm">{m.name}</span>
                    <span className="text-gray-400 font-mono">({m.email})</span>
                    <span className="text-[10px] text-gray-450">• {m.date}</span>
                  </div>
                  
                  <p className="font-bold text-gray-800 dark:text-gray-200">Subject: {m.subject}</p>
                  <p className="text-gray-600 dark:text-gray-350 leading-relaxed font-sans">{m.message}</p>
                  
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-250 dark:border-gray-800 mt-2">
                    <button
                      onClick={() => setReplyTarget(m)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-[10px] font-bold uppercase tracking-wider hover:border-[#C8A96A] flex items-center gap-1.5 transition-colors"
                    >
                      <Reply className="w-3.5 h-3.5" /> Reply
                    </button>
                    <button
                      onClick={() => handleToggleMessageRead(m.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                      title={m.status === 'read' ? 'Mark Unread' : 'Mark Read'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleArchiveMessage(m.id)}
                      className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors"
                      title="Archive"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(m.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab: Booking box orders (Reused WhatsApp order display log) */}
      {activeSubTab === 'samples' && (
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
            <h3 className="font-serif-luxury text-lg font-bold">Luxury Booking Box Order Logs</h3>
          </div>

          {sampleOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-400 space-y-2 text-xs">
              <Mail className="w-8 h-8 mx-auto" />
              <p>No Booking Boxes ordered yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sampleOrders.map(order => (
                <div
                  key={order.id}
                  className="bg-gray-50 dark:bg-[#19191D] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex flex-col lg:flex-row justify-between gap-6 text-xs text-gray-900 dark:text-gray-100"
                >
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#C8A96A] bg-[#C8A96A]/10 px-2.5 py-0.5 rounded">
                        {order.id}
                      </span>
                      <span className="text-gray-450 font-mono">{order.date}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{order.name}</p>
                        <p className="text-gray-500 font-mono">{order.email}</p>
                        {order.company && <p className="text-[10px] text-gray-400">{order.company}</p>}
                      </div>
                      <div>
                        <p className="text-gray-800 dark:text-gray-200">{order.address}</p>
                        <p className="text-gray-500">{order.city} {order.zip}</p>
                      </div>
                    </div>

                    {order.notes && (
                      <p className="italic text-gray-500 dark:text-gray-450 bg-white dark:bg-[#121215] p-2.5 rounded-lg border border-gray-200 dark:border-gray-850">
                        "{order.notes}"
                      </p>
                    )}
                  </div>

                  <div className="w-full lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 pt-4 lg:pt-0 lg:pl-6">
                    <div className="space-y-1 mb-4">
                      <p className="text-[10px] uppercase font-bold text-gray-400">Swatches ({order.chips?.length})</p>
                      <div className="flex flex-wrap gap-1">
                        {order.chips?.map((c: any) => (
                          <span key={c.id} className="inline-block bg-white dark:bg-[#121215] border border-gray-200 dark:border-gray-850 px-2 py-1 rounded text-[9px] font-bold text-[#C8A96A]">
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t pt-3 border-gray-200 dark:border-gray-800">
                      <button
                        onClick={() => onDeleteSampleOrder(order.id)}
                        className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg font-bold"
                      >
                        Delete
                      </button>
                      <a
                        href={`https://wa.me/919974617657?text=${encodeURIComponent(
                          `Following up on booking box ${order.id}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4.5 py-1.5 rounded-lg bg-[#C8A96A] text-black font-bold uppercase"
                      >
                        Chat
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
