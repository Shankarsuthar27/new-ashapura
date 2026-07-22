import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export const FloatingWhatsAppButton: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Phone Direct Call Button */}
      <a
        href="tel:+919974617657"
        className="w-12 h-12 rounded-full bg-[#0B1F44] text-white flex items-center justify-center shadow-2xl hover:bg-black hover:scale-110 transition-all border border-white/20 group relative"
        title="Call +91 9974617657"
      >
        <Phone className="w-5 h-5 text-[#C8A96A]" />
        <span className="absolute right-14 bg-[#0B1F44] text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg border border-white/10">
          Call +91 99746 17657
        </span>
      </a>

      {/* WhatsApp Direct Chat Button */}
      <a
        href="https://wa.me/919974617657?text=Hi%20Ashapura%20Tiles%20%26%20Granite%2C%20I%20would%20like%20to%20enquire%20about%20your%20products."
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all border-2 border-white group relative p-3 animate-bounce"
        title="WhatsApp +91 9974617657"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="absolute right-16 bg-[#25D366] text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
          WhatsApp 9974617657
        </span>
      </a>
    </div>
  );
};
