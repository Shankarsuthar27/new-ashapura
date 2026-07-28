import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { CatalogProduct, COLOR_HEX_MAP } from '../data/catalogData';
import { useStone } from '../context/StoneContext';
import {
  X,
  ShoppingCart,
  PhoneCall,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuickViewModalProps {
  product: CatalogProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onEnquire?: (product: CatalogProduct) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onEnquire
}) => {
  const { showToast, addSampleToCart } = useStone();
  const navigate = useNavigate();
  const [selectedFinish, setSelectedFinish] = useState<string>('');
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Prevent background body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus close button on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    // Adapt to StoneSlab format for sample cart compatibility
    const adaptedSlab: any = {
      id: String(product.id),
      name: product.name,
      category: product.category,
      color: product.color,
      origin: product.origin || 'Imported Quarry',
      finishes: product.finishes || ['Polished'],
      dimensions: '3000 x 1800 x 20 mm',
      thickness: '20 mm',
      priceTier: '$$$$',
      inStockSlabs: 50,
      bundleNumber: `LOT-${product.id}`,
      rarity: 'Signature',
      description: product.description || '',
      longDescription: product.description || '',
      image: product.image,
      applications: ['Flooring', 'Countertop'],
      specifications: product.specifications || {
        compressiveStrength: '200 MPa',
        waterAbsorption: '< 0.1%',
        density: '2.6 g/cm³',
        flexuralStrength: '35 MPa'
      }
    };

    addSampleToCart(adaptedSlab);
    onClose();
    navigate('/booking-box');
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
      >
        {/* Backdrop overlay trigger */}
        <div className="absolute inset-0 cursor-default" onClick={onClose} aria-hidden="true" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-white dark:bg-[#121215] rounded-[32px] border border-gray-200 dark:border-gray-800/80 shadow-2xl max-w-4xl w-full h-[94vh] sm:h-[620px] max-h-[94vh] sm:max-h-[90vh] overflow-hidden text-[#0B1F44] dark:text-gray-100 relative font-sans-luxury flex flex-col sm:grid sm:grid-cols-12 items-stretch"
        >
          {/* Always Visible Fixed Close Button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close product details"
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/50 hover:bg-black/80 sm:bg-white/80 sm:hover:bg-gray-100 text-white sm:text-gray-700 hover:text-black border border-white/10 sm:border-gray-250 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#C8A96A] active:scale-95"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          {/* Left Media Area: Fits within bounds, no oversize image */}
          <div className="sm:col-span-7 bg-gray-150 dark:bg-[#19191D] relative h-[280px] sm:h-auto overflow-hidden flex flex-col justify-center select-none shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Visual bottom mask overlay for mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent sm:hidden pointer-events-none" />


            {/* Top Categories Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
              <span className="px-3.5 py-1 rounded-full bg-[#0B1F44]/90 dark:bg-[#C8A96A] text-white dark:text-black font-bold text-[10px] sm:text-xs uppercase tracking-wider shadow-md">
                {product.category}
              </span>
              {product.featured && (
                <span className="px-3 py-0.5 rounded-full bg-[#EF233C] text-white font-bold text-[8px] sm:text-[10px] uppercase tracking-wider inline-flex items-center gap-1 shadow-md">
                  Featured Collection
                </span>
              )}
            </div>
          </div>

          {/* Right Information & Action Panel: Scrolls internally on overflow */}
          <div className="sm:col-span-5 flex flex-col h-[calc(94vh-280px)] sm:h-auto overflow-hidden bg-white dark:bg-[#121215]">
            
            {/* Dynamic details scroll container with scrollbars hidden */}
            <div className="flex-1 overflow-y-auto no-scrollbar scrollbar-none p-5 sm:p-8 space-y-5">
              
              {/* Product Title and Series info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="w-3 h-3 rounded-full border border-gray-300 shadow-xs"
                    style={{ backgroundColor: COLOR_HEX_MAP[product.color] || '#6B7280' }}
                  />
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {product.color} Series • {product.origin || 'Imported Quarry'}
                  </span>
                </div>

                <h2 id="modal-title" className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#0B1F44] dark:text-white leading-tight">
                  {product.name}
                </h2>
              </div>

              {/* Price Tag with Direct Pricing Badge & Stock Status */}
              <div className="bg-gray-50 dark:bg-[#1A1A20] border border-gray-150 dark:border-gray-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Wholesale Project Price</p>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="font-bold text-2xl text-[#EF233C]">₹{product.price.toFixed(2)}</span>
                    <span className="text-xs font-semibold text-gray-500">/ {product.unit}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md mt-1 border border-emerald-500/20">
                    <TrendingDown className="w-3 h-3" /> Quarry Direct Price
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full shadow-xs">
                    In Stock
                  </span>
                  <span className="text-[9px] text-gray-400 font-medium">Ready to Ship</span>
                </div>
              </div>

              {/* Descriptions & Editorial Text */}
              <div className="space-y-3">
                {product.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    {product.description}
                  </p>
                )}
                {product.longDescription && (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed italic border-l-2 border-[#C8A96A] pl-3 py-0.5 bg-gray-50/50 dark:bg-[#1A1A20]/40 rounded-r-lg">
                    {product.longDescription}
                  </p>
                )}
              </div>

              {/* Variants: Available Surface Finishes selector */}
              {product.finishes && product.finishes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Surface Finish Option
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.finishes.map(finish => {
                      const isSelected = selectedFinish === finish || (!selectedFinish && finish === product.finishes![0]);
                      return (
                        <button
                          key={finish}
                          onClick={() => setSelectedFinish(finish)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                            isSelected
                              ? 'border-[#0B1F44] dark:border-[#C8A96A] bg-[#0B1F44] dark:bg-[#C8A96A] text-white dark:text-black shadow-md'
                              : 'border-gray-250 dark:border-gray-800 bg-gray-50 dark:bg-[#1A1A20] text-gray-700 dark:text-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {finish}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Technical Specifications Grid */}
              {product.specifications && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    Architectural Specifications
                  </label>
                  <div className="grid grid-cols-1 min-[340px]:grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 dark:bg-[#1A1A20] p-3 rounded-xl border border-gray-150 dark:border-gray-800">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Compressive Strength</span>
                      <span className="font-bold text-[#0B1F44] dark:text-[#C8A96A]">{product.specifications.compressiveStrength}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#1A1A20] p-3 rounded-xl border border-gray-150 dark:border-gray-800">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Water Absorption</span>
                      <span className="font-bold text-[#0B1F44] dark:text-[#C8A96A]">{product.specifications.waterAbsorption}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#1A1A20] p-3 rounded-xl border border-gray-150 dark:border-gray-800">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Density</span>
                      <span className="font-bold text-[#0B1F44] dark:text-[#C8A96A]">{product.specifications.density}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#1A1A20] p-3 rounded-xl border border-gray-150 dark:border-gray-800">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Flexural Strength</span>
                      <span className="font-bold text-[#0B1F44] dark:text-[#C8A96A]">{product.specifications.flexuralStrength}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Area: Fixed at the base */}
            <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#121215] shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Add to Cart (Booking Box) */}
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-[#EF233C] hover:bg-[#d90429] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/20 active:scale-[0.98] transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Booking Box</span>
                </button>

                {/* WhatsApp Enquire Button */}
                <a
                  href={`https://wa.me/919974617657?text=${encodeURIComponent(
                    `Hi Ashapura Tiles & Granite, I am interested in inquiring about ${product.name} (${product.category}). Price: ₹${product.price}/${product.unit}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-white hover:bg-gray-50 border-2 border-[#0B1F44] text-[#0B1F44] dark:bg-transparent dark:text-[#C8A96A] dark:border-[#C8A96A] dark:hover:bg-[#C8A96A]/5 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
                >
                  <PhoneCall className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp Enquire</span>
                </a>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
