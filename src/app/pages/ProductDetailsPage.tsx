import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { SLABS_DATA } from '../data/stoneData';
import { useStone } from '../context/StoneContext';
import { ArrowLeft, Package, Calendar, ShieldCheck, Check, Globe, Layers, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductDescriptionSection } from '../components/ProductDescriptionSection';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { slabs, addSampleToCart, openConsultationWithSlab, showToast } = useStone();

  const slab = slabs.find(s => s.id === id) || slabs[0] || SLABS_DATA[0];

  const derivedPrice = slab.price !== undefined && slab.price !== null ? Number(slab.price) : (
    slab.priceTier === '$$$$$' ? 280 :
    slab.priceTier === '$$$$' ? 180 :
    slab.priceTier === '$$$' ? 120 :
    slab.priceTier === '$$' ? 75 : 45
  );
  const derivedUnit = slab.unit || 'Per Square Foot';

  const [activeFinish, setActiveFinish] = useState(slab.finishes[0]);
  const [showBookmatch, setShowBookmatch] = useState(false);
  const [held, setHeld] = useState(false);

  const handleHold = () => {
    setHeld(true);
    showToast(`Locked 48-Hour Quarry Hold on Bundle ${slab.bundleNumber}!`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#0A0A0C] text-gray-900 dark:text-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8A96A] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Full Slab Inventory
        </button>

        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Visual Area */}
          <div className="lg:col-span-7 relative bg-[#0B0B0C] min-h-[450px] lg:min-h-[600px] flex items-center justify-center p-6 overflow-hidden">
            <motion.img
              key={showBookmatch ? 'bm' : 'single'}
              initial={{ opacity: 0.6, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={showBookmatch && slab.bookmatchImage ? slab.bookmatchImage : slab.image}
              alt={slab.name}
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-[#C8A96A] text-black font-bold text-xs uppercase tracking-wider">
                {slab.rarity}
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 text-xs font-mono">
                Bundle #{slab.bundleNumber}
              </span>
            </div>

            {slab.bookmatchImage && (
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-black/70 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                <span className="text-xs text-gray-300 flex items-center gap-2">
                  Book-Match Preview
                </span>
                <button
                  onClick={() => setShowBookmatch(!showBookmatch)}
                  className="px-4 py-1.5 rounded-xl bg-[#C8A96A]/20 border border-[#C8A96A]/50 text-[#C8A96A] text-xs font-bold"
                >
                  {showBookmatch ? 'Single View' : 'Mirror Bookmatch'}
                </button>
              </div>
            )}
          </div>

          {/* Right Details Panel */}
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold">
                  {slab.category} Stone • {slab.origin}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#C8A96A]/10 text-[#C8A96A]">
                  {slab.priceTier}
                </span>
              </div>

              <h1 className="font-serif-luxury text-4xl font-bold mb-4">{slab.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {slab.longDescription}
              </p>

              {/* Technical Specifications */}
              <div className="space-y-3 bg-gray-50 dark:bg-[#1A1A1F] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 mb-6 text-xs">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                  Architectural Spec Sheet
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-gray-400 block">Slab Dimensions</span>
                    <span className="font-medium font-mono text-gray-900 dark:text-gray-100">{slab.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Thickness</span>
                    <span className="font-medium font-mono text-gray-900 dark:text-gray-100">{slab.thickness}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Compressive Strength</span>
                    <span className="font-medium">{slab.specifications.compressiveStrength}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Water Absorption</span>
                    <span className="font-medium">{slab.specifications.waterAbsorption}</span>
                  </div>
                </div>
              </div>

              {/* Surface Finish */}
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                  Select Surface Finish
                </label>
                <div className="flex flex-wrap gap-2">
                  {slab.finishes.map(finish => (
                    <button
                       key={finish}
                       onClick={() => setActiveFinish(finish)}
                       className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                         activeFinish === finish
                           ? 'bg-[#C8A96A] text-black'
                           : 'bg-gray-100 dark:bg-[#1A1A1F] text-gray-600 dark:text-gray-400 border border-transparent'
                       }`}
                     >
                       {finish}
                     </button>
                   ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addSampleToCart(slab)}
                  className="py-3 px-4 rounded-xl border border-[#C8A96A] text-[#C8A96A] hover:bg-[#C8A96A]/10 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" /> Request Sample Box
                </button>
                <button
                  onClick={handleHold}
                  disabled={held}
                  className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                    held
                      ? 'bg-green-600/20 text-green-400 border border-green-500/40'
                      : 'bg-gray-100 dark:bg-[#1A1A1F] text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700'
                  }`}
                >
                  {held ? (
                    <>
                      <Check className="w-4 h-4" /> Bundle Reserved
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 text-[#C8A96A]" /> Hold 48 Hours
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => openConsultationWithSlab(slab)}
                className="w-full py-4 rounded-xl gold-button text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <span>Book Consultation For This Slab</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Product Description & Architectural Specification Section */}
        <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white">
          <ProductDescriptionSection
            productName={slab.name}
            price={derivedPrice}
            category={slab.category}
            origin={slab.origin}
            slabSize={slab.dimensions || "ORIGINAL"}
            thickness={slab.thickness || "15–16 mm"}
            finish={activeFinish || "Polished"}
            priceRange={`₹${derivedPrice} / ${derivedUnit === 'Per Square Foot' ? 'sq.ft.' : derivedUnit}`}
            stoneType={slab.category}
            customDescription={`${slab.name} is a premium ${slab.category} sourced from ${slab.origin}. Carefully selected for residential and commercial projects, it is ideal for flooring, countertops, wall cladding, staircases, and luxury interiors. Known for its durability, elegant appearance, and long-lasting performance, it enhances both modern and traditional spaces.`}
            image={slab.image}
          />
        </div>
      </div>
    </div>
  );
};
