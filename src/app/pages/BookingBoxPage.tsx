import React, { useState } from 'react';
import { useStone } from '../context/StoneContext';
import { useNavigate } from 'react-router';
import {
  Package, Trash2, ArrowRight, ShieldCheck, Check,
  ArrowLeft, Info, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BookingBoxPage: React.FC = () => {
  const {
    sampleCart,
    removeSampleFromCart,
    clearSampleCart,
    showToast
  } = useStone();

  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    notes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sampleCart.length === 0) {
      showToast('Your Booking Box is empty.', 'info');
      return;
    }

    const orderId = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const orderData = {
      id: orderId,
      date: new Date().toLocaleDateString(),
      name: formData.name,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      zip: formData.zip,
      notes: formData.notes,
      chips: sampleCart.map(item => ({ id: item.id, name: item.name }))
    };

    // Store order locally for admin dashboard log view
    try {
      const existing = localStorage.getItem('ashapura_sample_orders');
      const orders = existing ? JSON.parse(existing) : [];
      orders.unshift(orderData);
      localStorage.setItem('ashapura_sample_orders', JSON.stringify(orders));
    } catch (err) {
      console.error('Failed to store order in local storage admin database:', err);
    }

    // Format WhatsApp message redirect
    const chipsList = sampleCart.map((item) => `• ${item.name} (${item.category})`).join('\n');
    const messageText = `Hi Ashapura Granite, I would like to order a complimentary Luxury Booking Box.

*Shipping Details:*
• Name: ${formData.name}
• Email: ${formData.email}
• Address: ${formData.address}
• City: ${formData.city || 'N/A'}
• ZIP: ${formData.zip || 'N/A'}
${formData.notes ? `• Notes: ${formData.notes}\n` : ''}
*Selected Stone Chips:*
${chipsList}

Order ID: ${orderId}
Thank you!`;

    const whatsappUrl = `https://wa.me/919974617657?text=${encodeURIComponent(messageText)}`;

    setIsSubmitted(true);
    setTimeout(() => {
      showToast('Booking Box request saved! Opening WhatsApp...', 'success');
      clearSampleCart();
      setIsSubmitted(false);
      window.open(whatsappUrl, '_blank');
      navigate('/products');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0C] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div className="space-y-2">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#C8A96A] transition-colors uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Collections
            </button>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Package className="w-8 h-8 text-[#C8A96A]" /> Atelier Booking Box
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Curate up to 4 real architectural stone chips with express specifier delivery guidelines.
            </p>
          </div>

          {sampleCart.length > 0 && (
            <div className="bg-[#C8A96A]/10 border border-[#C8A96A]/30 rounded-2xl p-4 flex items-center gap-3 self-start md:self-auto">
              <div className="w-10 h-10 rounded-full bg-[#C8A96A]/20 flex items-center justify-center text-[#C8A96A] font-bold">
                {sampleCart.length}/4
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-800 dark:text-gray-250">Chips Selected</span>
                <span className="block text-[10px] text-gray-400">
                  {sampleCart.length === 4 ? 'Maximum items reached' : `Add ${4 - sampleCart.length} more sample chips`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Columns: Items Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h2 className="font-serif-luxury text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-150 dark:border-gray-800/80 pb-3">
                Selected Stone Chips
              </h2>

              <AnimatePresence mode="popLayout">
                {sampleCart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-16 space-y-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-[#C8A96A]/10 text-[#C8A96A] flex items-center justify-center mx-auto">
                      <Package className="w-10 h-10" />
                    </div>
                    <h3 className="font-serif-luxury text-xl font-semibold text-gray-900 dark:text-white">Your Booking Box is Empty</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                      Explore our premium slab categories, architectural collections, and request samples of real stone.
                    </p>
                    <button
                      onClick={() => navigate('/products')}
                      className="px-6 py-2.5 bg-[#C8A96A] text-black font-bold uppercase tracking-wider rounded-xl hover:brightness-110 transition-all text-xs"
                    >
                      Browse Inventory
                    </button>
                  </motion.div>
                ) : isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 space-y-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] flex items-center justify-center mx-auto animate-pulse">
                      <Check className="w-10 h-10" />
                    </div>
                    <h3 className="font-serif-luxury text-2xl font-bold text-[#C8A96A]">Dispatching Booking Box...</h3>
                    <p className="text-xs text-gray-500">Connecting securely to WhatsApp to finalize your delivery scheduling.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {sampleCart.map(item => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 hover:border-[#C8A96A]/30 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover border border-[#C8A96A]/30 transition-transform duration-500 group-hover:scale-105"
                          />
                          <div>
                            <h4 className="font-serif-luxury font-bold text-base text-gray-900 dark:text-white">{item.name}</h4>
                            <p className="text-xs text-gray-500 font-sans-luxury">{item.category} • {item.origin}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeSampleFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-[#131316] hover:bg-red-50 dark:hover:bg-red-950/20 border border-gray-200 dark:border-gray-800 rounded-xl"
                          title="Remove Swatch"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}

                    <div className="pt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-450 border-t border-gray-150 dark:border-gray-800/80">
                      <span>Express courier dispatching packaging included</span>
                      <button
                        onClick={clearSampleCart}
                        className="text-red-500 hover:underline font-semibold"
                      >
                        Clear All Items
                      </button>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Specifier details notice */}
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-5 text-xs text-blue-600 dark:text-blue-400 space-y-2 flex gap-4">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Professional Specifier Program</h4>
                <p className="leading-relaxed">
                  Real stone exhibits geological characteristics, color ranges, and vein configurations unique to each block. We recommend requesting sample boxes to confirm texture compatibility prior to executing formal reservations.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Form */}
          <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <h2 className="font-serif-luxury text-xl font-bold text-gray-900 dark:text-white border-b border-gray-150 dark:border-gray-800/80 pb-3">
              Delivery Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Specifier Name / Firm *</label>
                <input
                  type="text"
                  placeholder="e.g. Suthar & Associates"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-850 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white focus:border-[#C8A96A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Work Email Address *</label>
                <input
                  type="email"
                  placeholder="architect@firm.com"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-850 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white focus:border-[#C8A96A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Delivery Address *</label>
                <input
                  type="text"
                  placeholder="Studio suite, office street name"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-850 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white focus:border-[#C8A96A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">City *</label>
                  <input
                    type="text"
                    placeholder="City"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-850 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Postal Code *</label>
                  <input
                    type="text"
                    placeholder="Zip / Pin"
                    required
                    value={formData.zip}
                    onChange={e => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-850 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Project Specification Notes (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your project volume, target timeline, or custom stone finishing requirements."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-850 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white focus:border-[#C8A96A] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-[10px] text-gray-500 pt-2">
                <ShieldCheck className="w-4.5 h-4.5 text-[#C8A96A]" />
                <span>Complimentary FedEx Express 48-Hour Air Delivery</span>
              </div>

              <button
                type="submit"
                disabled={sampleCart.length === 0}
                className="w-full py-4 rounded-2xl gold-button flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all font-bold text-xs uppercase tracking-widest"
              >
                <span>Request Booking Box</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
