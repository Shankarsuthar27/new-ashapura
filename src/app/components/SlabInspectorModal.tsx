import React, { useState } from 'react';
import { useStone } from '../context/StoneContext';
import { X, Package, Calendar, ShieldCheck, Check, Globe, Layers, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SlabInspectorModal: React.FC = () => {
  const {
    selectedSlabForModal,
    setSelectedSlabForModal,
    addSampleToCart,
    openConsultationWithSlab,
    showToast
  } = useStone();

  const [activeFinish, setActiveFinish] = useState<string>('Polished');
  const [showBookmatchView, setShowBookmatchView] = useState(false);
  const [slabHeld, setSlabHeld] = useState(false);

  if (!selectedSlabForModal) return null;

  const slab = selectedSlabForModal;

  const handleHoldSlab = () => {
    setSlabHeld(true);
    showToast(`Locked 48-Hour Quarry Hold on Bundle ${slab.bundleNumber}!`, 'success');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto">
        <div
          className="fixed inset-0"
          onClick={() => setSelectedSlabForModal(null)}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl bg-[#FFFFFF] dark:bg-[#121215] border border-[#C8A96A]/40 rounded-3xl shadow-2xl overflow-hidden z-10 text-gray-900 dark:text-gray-100 my-auto"
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedSlabForModal(null)}
            className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Inspector (Left) */}
            <div className="lg:col-span-7 relative bg-[#0B0B0C] min-h-[350px] lg:min-h-[580px] flex items-center justify-center p-6 overflow-hidden">
              <img
                src={showBookmatchView && slab.bookmatchImage ? slab.bookmatchImage : slab.image}
                alt={slab.name}
                className="w-full h-full object-cover rounded-xl shadow-2xl transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Rarity & Bundle Badge */}
              <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-[#C8A96A] text-black font-semibold text-xs uppercase tracking-wider shadow-lg">
                  {slab.rarity}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-gray-200 text-xs font-mono">
                  Bundle #{slab.bundleNumber}
                </span>
              </div>

              {/* Bookmatch Toggle overlay */}
              {slab.bookmatchImage && (
                <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span>Book-Match Layout Preview</span>
                  </div>
                  <button
                    onClick={() => setShowBookmatchView(!showBookmatchView)}
                    className="px-4 py-1.5 rounded-xl bg-[#C8A96A]/20 hover:bg-[#C8A96A]/40 border border-[#C8A96A]/50 text-[#C8A96A] text-xs font-semibold transition-all"
                  >
                    {showBookmatchView ? 'Single Slab View' : 'Mirror Bookmatch'}
                  </button>
                </div>
              )}
            </div>

            {/* Spec Details (Right) */}
            <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold">
                    {slab.category} Stone • {slab.origin}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#C8A96A]/10 text-[#C8A96A]">
                    {slab.priceTier}
                  </span>
                </div>

                <h2 className="font-serif-luxury text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {slab.name}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {slab.longDescription}
                </p>

                {/* Technical Specs */}
                <div className="space-y-3 mb-6 bg-gray-50 dark:bg-[#19191D] p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                    Architectural Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block">Slab Dimensions</span>
                      <span className="font-medium font-mono">{slab.dimensions}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Thickness</span>
                      <span className="font-medium font-mono">{slab.thickness}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Quarry Origin</span>
                      <span className="font-medium">{slab.origin}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Available Slabs</span>
                      <span className="font-medium text-[#C8A96A]">{slab.inStockSlabs} Slabs in Stock</span>
                    </div>
                  </div>
                </div>

                {/* Available Finishes Selector */}
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                    Surface Finish Options
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {slab.finishes.map(finish => (
                      <button
                        key={finish}
                        onClick={() => setActiveFinish(finish)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                          activeFinish === finish
                            ? 'bg-[#C8A96A] text-black font-semibold shadow-md'
                            : 'bg-gray-100 dark:bg-[#1E1E22] text-gray-600 dark:text-gray-300 hover:border-[#C8A96A]/40 border border-transparent'
                        }`}
                      >
                        {finish}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Key Applications */}
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                    Recommended Applications
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {slab.applications.map(app => (
                      <span
                        key={app}
                        className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-[#1A1A1E] text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => addSampleToCart(slab)}
                    className="py-3 px-4 rounded-xl border border-[#C8A96A] text-[#C8A96A] hover:bg-[#C8A96A]/10 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    <span>Request Sample</span>
                  </button>

                  <button
                    onClick={handleHoldSlab}
                    disabled={slabHeld}
                    className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      slabHeld
                        ? 'bg-green-600/20 text-green-400 border border-green-500/40'
                        : 'bg-gray-100 dark:bg-[#1E1E24] hover:bg-gray-200 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {slabHeld ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Slab Bundle Reserved</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 text-[#C8A96A]" />
                        <span>Hold 48 Hours</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSelectedSlabForModal(null);
                    openConsultationWithSlab(slab);
                  }}
                  className="w-full py-3.5 rounded-xl gold-button text-xs uppercase tracking-widest font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Book Consultation For This Slab</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
