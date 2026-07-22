import React, { useState } from 'react';
import { useStone } from '../context/StoneContext';
import { X, Trash2, Package, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SampleDrawer: React.FC = () => {
  const {
    sampleCart,
    removeSampleFromCart,
    clearSampleCart,
    isSampleDrawerOpen,
    setIsSampleDrawerOpen,
    showToast
  } = useStone();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    address: '',
    city: '',
    zip: '',
    notes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isSampleDrawerOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address) {
      showToast('Please fill in required shipping fields.', 'info');
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      showToast('Sample request order confirmed! Dispatching in luxury presentation box.', 'success');
      clearSampleCart();
      setIsSubmitted(false);
      setIsSampleDrawerOpen(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={() => setIsSampleDrawerOpen(false)} />
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-[#FFFFFF] dark:bg-[#121215] shadow-2xl flex flex-col justify-between border-l border-[#C8A96A]/30 text-gray-900 dark:text-gray-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-[#C8A96A]" />
                <div>
                  <h3 className="font-serif-luxury text-xl font-bold">Luxury Sample Box</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Complimentary 4"x4" stone chips ({sampleCart.length}/4 items)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSampleDrawerOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {sampleCart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#C8A96A]/10 text-[#C8A96A] flex items-center justify-center mx-auto">
                    <Package className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif-luxury text-lg font-semibold">Your Sample Box is Empty</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                    Browse our luxury slab inventory and click "Request Sample" to curate up to 4 real stone chips.
                  </p>
                </div>
              ) : isSubmitted ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] flex items-center justify-center mx-auto animate-pulse">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif-luxury text-xl font-bold text-[#C8A96A]">Dispatching Sample Box...</h4>
                  <p className="text-sm text-gray-500">Preparing your custom stone swatches with specifier guides.</p>
                </div>
              ) : (
                <>
                  {/* Item List */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-widest text-[#C8A96A] font-semibold">
                      Selected Stone Chips
                    </h4>
                    {sampleCart.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover border border-[#C8A96A]/30"
                          />
                          <div>
                            <h5 className="font-serif-luxury font-semibold text-sm">{item.name}</h5>
                            <p className="text-xs text-gray-500">{item.category} • {item.origin}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeSampleFromCart(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove Sample"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <h4 className="text-xs uppercase tracking-widest text-[#C8A96A] font-semibold">
                      Shipping Details
                    </h4>
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name / Architectural Firm *"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#C8A96A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Work Email Address *"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#C8A96A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Delivery Address *"
                        required
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#C8A96A] focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#C8A96A] focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Postal Code"
                        value={formData.zip}
                        onChange={e => setFormData({ ...formData, zip: e.target.value })}
                        className="bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#C8A96A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={2}
                        placeholder="Project Details or Finish Notes (Optional)"
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:border-[#C8A96A] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                      <ShieldCheck className="w-4 h-4 text-[#C8A96A]" />
                      <span>Complimentary FedEx Express 48-Hour Air Delivery</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl gold-button flex items-center justify-center gap-2 shadow-lg"
                    >
                      <span>Order Presentation Box</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
