import React, { useState } from 'react';
import { CatalogProduct, COLOR_HEX_MAP } from '../data/catalogData';
import { useStone } from '../context/StoneContext';
import {
  X,
  ShoppingCart,
  PhoneCall,
  CheckCircle2,
  MapPin,
  Layers,
  ShieldCheck,
  PackageCheck,
  Send
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
  const [selectedFinish, setSelectedFinish] = useState<string>('');
  const [enquirySent, setEnquirySent] = useState<boolean>(false);
  const [enquiryForm, setEnquiryForm] = useState({ name: '', phone: '', sqft: '500' });

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
  };

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone) {
      showToast('Please enter your name and phone number.', 'info');
      return;
    }
    setEnquirySent(true);
    setTimeout(() => {
      showToast(`Ququiry received for ${product.name}! Our desk will reach out within 15 mins.`, 'success');
      setEnquirySent(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-[24px] border border-gray-200 shadow-2xl max-w-4xl w-full overflow-hidden text-[#0B1F44] my-8 relative font-sans-luxury"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 hover:bg-gray-100 text-gray-700 hover:text-black border border-gray-200 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
            {/* Left Image Area */}
            <div className="md:col-span-6 bg-gray-50 relative min-h-[300px] md:min-h-[480px]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="px-3.5 py-1 rounded-full bg-[#0B1F44] text-white font-bold text-xs uppercase tracking-wider shadow-md">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="px-3 py-0.5 rounded-full bg-[#EF233C] text-white font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1 shadow-md">
                    Featured Collection
                  </span>
                )}
              </div>
            </div>

            {/* Right Information & Action Panel */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Title & Color Badge */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-sm"
                      style={{ backgroundColor: COLOR_HEX_MAP[product.color] || '#6B7280' }}
                    />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {product.color} Series • {product.origin || 'Imported Quarry'}
                    </span>
                  </div>

                  <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#0B1F44] leading-tight">
                    {product.name}
                  </h2>
                </div>

                {/* Price Display */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-baseline justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Wholesale Price</p>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-bold text-2xl text-[#EF233C]">₹{product.price.toFixed(2)}</span>
                      <span className="text-xs font-semibold text-gray-500">/ {product.unit}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#0B1F44] bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                    In Stock
                  </span>
                </div>

                {/* Finishes */}
                {product.finishes && product.finishes.length > 0 && (
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                      Available Surface Finishes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.finishes.map(finish => (
                        <button
                          key={finish}
                          onClick={() => setSelectedFinish(finish)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${selectedFinish === finish || (!selectedFinish && finish === product.finishes![0])
                              ? 'border-[#0B1F44] bg-[#0B1F44] text-white shadow-sm'
                              : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400'
                            }`}
                        >
                          {finish}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications Grid */}
                {product.specifications && (
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-semibold block">Compressive Strength</span>
                      <span className="font-bold text-[#0B1F44]">{product.specifications.compressiveStrength}</span>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-semibold block">Water Absorption</span>
                      <span className="font-bold text-[#0B1F44]">{product.specifications.waterAbsorption}</span>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-semibold block">Density</span>
                      <span className="font-bold text-[#0B1F44]">{product.specifications.density}</span>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-semibold block">Flexural Strength</span>
                      <span className="font-bold text-[#0B1F44]">{product.specifications.flexuralStrength}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Primary Red Button (Add to Presentation Cart) */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#EF233C] hover:bg-[#d90429] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/20 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add Sample Box</span>
                  </button>

                  {/* Secondary Navy Button (Enquire) */}
                  <a
                    href={`https://wa.me/919974617657?text=${encodeURIComponent(`Hi Ashapura Tiles & Granite, I am interested in inquiring about ${product.name} (${product.category}). Price: ₹${product.price}/${product.unit}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-gray-50 border-2 border-[#0B1F44] text-[#0B1F44] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <PhoneCall className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp Enquire</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
