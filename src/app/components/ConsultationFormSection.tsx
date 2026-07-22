import React, { useState } from 'react';
import { useStone } from '../context/StoneContext';
import { submitBooking, type BookingData, isSupabaseConfigured } from '../lib/supabase';
import {
  Sparkles, Clock, Send, CheckCircle2, ShieldCheck,
  PhoneCall, Mail, Loader2, AlertCircle, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ── WhatsApp number (international format, no + or spaces) ─────────────────
const WHATSAPP_NUMBER = '919974617657';

function buildWhatsAppUrl(data: BookingData): string {
  const lines = [
    '*New Booking Request — Ashapura Tiles & Marbles*',
    '',
    '*Customer Details*',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `City: ${data.city || '—'}`,
    '',
    '*Order Details*',
    `Product: ${data.product || '—'}`,
    `Quantity: ${data.quantity || '—'}`,
    '',
    data.message ? ` *Message*\n${data.message}` : '',
    '',
    ` Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
  ].filter(line => line !== undefined).join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
}

const INITIAL_FORM: BookingData = {
  name: '',
  email: '',
  phone: '',
  product: '',
  quantity: '',
  city: '',
  message: '',
};

const inputClass =
  'w-full bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:border-[#C8A96A] focus:outline-none transition-colors text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600';

const labelClass =
  'block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2';

export const ConsultationFormSection: React.FC = () => {
  const { showToast, isConsultationModalOpen, setIsConsultationModalOpen, presetConsultationSlab } = useStone();

  const [formData, setFormData] = useState<BookingData>({
    ...INITIAL_FORM,
    product: presetConsultationSlab ? presetConsultationSlab.name : '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const set = (field: keyof BookingData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const resetForm = () => {
    setFormData({ ...INITIAL_FORM, product: presetConsultationSlab ? presetConsultationSlab.name : '' });
    setIsSuccess(false);
    setErrorMsg(null);
  };

  const openWhatsApp = (data: BookingData) => {
    window.open(buildWhatsAppUrl(data), '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Client-side validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMsg('Please fill in your name, email, and phone number.');
      return;
    }

    setIsLoading(true);

    // Save snapshot before any async ops
    const snapshot = { ...formData };

    if (isSupabaseConfigured) {
      // Try to save to database; open WhatsApp regardless of result
      const result = await submitBooking(snapshot);
      setIsLoading(false);

      if (!result.success) {
        // DB failed but still send via WhatsApp — let user know
        showToast('Could not save to database, sending via WhatsApp instead.', 'info');
      }
    } else {
      setIsLoading(false);
    }

    // Always open WhatsApp with booking details
    openWhatsApp(snapshot);
    setIsSuccess(true);
    showToast('Opening WhatsApp with your booking details!', 'success');

    if (isConsultationModalOpen) {
      setTimeout(() => {
        setIsConsultationModalOpen(false);
        resetForm();
      }, 2500);
    }
  };

  // ── Success State ──────────────────────────────────────────────────────────
  const successContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-10 text-center space-y-4"
    >
      {/* Animated WhatsApp Icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-[#25D366]/10 flex items-center justify-center">
          <MessageCircle className="w-10 h-10 text-[#25D366]" />
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
      </div>

      <h4 className="font-serif-luxury text-xl font-bold text-gray-900 dark:text-white">
        Booking Sent via WhatsApp!
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
        Your booking details have been sent to our team on WhatsApp. We'll get back to you within 2 hours.
      </p>

      {/* Re-open WhatsApp button in case pop-up was blocked */}
      <button
        onClick={() => openWhatsApp(formData)}
        className="mt-2 flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold transition-colors shadow-lg"
      >
        <MessageCircle className="w-4 h-4" />
        Open WhatsApp
      </button>

      <button
        onClick={resetForm}
        className="text-xs uppercase tracking-widest font-bold text-[#C8A96A] hover:underline"
      >
        Submit Another Request
      </button>
    </motion.div>
  );

  // ── Form Content ───────────────────────────────────────────────────────────
  const formContent = isSuccess ? successContent : (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>

      {/* Row 1: Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input
            id="booking-name"
            type="text"
            required
            placeholder="Your full name"
            value={formData.name}
            onChange={set('name')}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Email Address *</label>
          <input
            id="booking-email"
            type="email"
            required
            placeholder="your@email.com"
            value={formData.email}
            onChange={set('email')}
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 2: Phone + City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Phone Number *</label>
          <input
            id="booking-phone"
            type="tel"
            required
            placeholder="+91 99746 17657"
            value={formData.phone}
            onChange={set('phone')}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>City / Location</label>
          <input
            id="booking-city"
            type="text"
            placeholder="e.g. Ahmedabad, Mumbai"
            value={formData.city}
            onChange={set('city')}
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 3: Product + Quantity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Product</label>
          <select
            id="booking-product"
            value={formData.product}
            onChange={set('product')}
            className={inputClass}
          >
            <option value="">Select a product...</option>
            <option>Floor Tiles</option>
            <option>Wall Tiles</option>
            <option>Granite</option>
            <option>Marble</option>
            <option>Sanitary Items</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Quantity</label>
          <input
            id="booking-quantity"
            type="text"
            placeholder="e.g. 200 sq ft, 50 boxes"
            value={formData.quantity}
            onChange={set('quantity')}
            className={inputClass}
          />
        </div>
      </div>


      {/* Row 5: Message */}
      <div>
        <label className={labelClass}>Requirements & Message</label>
        <textarea
          id="booking-message"
          rows={3}
          placeholder="Describe your project, finish preferences, or any specific requirements..."
          value={formData.message}
          onChange={set('message')}
          className={inputClass}
        />
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Notice */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <ShieldCheck className="w-4 h-4 text-[#C8A96A] shrink-0" />
        <span>Your information is kept strictly confidential and never shared with third parties.</span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        id="booking-submit"
        disabled={isLoading}
        className="w-full py-4 rounded-xl gold-button text-xs uppercase tracking-widest font-bold shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-opacity"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting Booking...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Submit Booking Request</span>
          </>
        )}
      </button>
    </form>
  );

  return (
    <>
      {/* ── Full-page Section ─────────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-[#F8F8F8] dark:bg-[#0E0E11] text-gray-900 dark:text-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Contact Info — Left 5 cols */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Book a Consultation
                </span>
                <h2 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight">
                  Get in Touch With Us
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-base font-sans-luxury leading-relaxed">
                  Visit our showroom, browse our curated tile and marble collections, and get expert guidance from our team.
                </p>
              </div>

              <div className="space-y-4 text-sm font-sans-luxury">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#141417] border border-gray-200 dark:border-gray-800 shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-[#C8A96A]/10 text-[#C8A96A] flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider block">Call / WhatsApp</span>
                    <a href="tel:+919974617657" className="font-bold text-base text-[#C8A96A] hover:underline block">
                      +91 99746 17657
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#141417] border border-gray-200 dark:border-gray-800 shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-[#C8A96A]/10 text-[#C8A96A] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider block">Email Us</span>
                    <a href="mailto:info@ashapuratiles.com" className="font-bold text-base hover:text-[#C8A96A] transition-colors">
                      info@ashapuratiles.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#141417] border border-gray-200 dark:border-gray-800 shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-[#C8A96A]/10 text-[#C8A96A] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider block">Response Time</span>
                    <span className="font-bold text-base">Within 2 Hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Panel — Right 7 cols */}
            <div className="lg:col-span-7 bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 p-8 sm:p-12 rounded-3xl shadow-2xl">
              <h3 className="font-serif-luxury text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Booking Request Form
              </h3>
              {formContent}
            </div>
          </div>
        </div>
      </section>

      {/* ── Modal Popup ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isConsultationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="fixed inset-0" onClick={() => setIsConsultationModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative max-w-2xl w-full bg-[#FFFFFF] dark:bg-[#121215] border border-[#C8A96A]/40 rounded-3xl p-8 shadow-2xl z-10 text-gray-900 dark:text-gray-100 my-auto"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold">Book a Consultation</h3>
                  <p className="text-xs text-gray-500 font-sans-luxury">Fill in your details and we'll get back to you</p>
                </div>
                <button
                  onClick={() => { setIsConsultationModalOpen(false); resetForm(); }}
                  className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              {formContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
