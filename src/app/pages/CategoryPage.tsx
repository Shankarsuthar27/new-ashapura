import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { STONE_CATEGORIES, SLABS_DATA } from '../data/stoneData';
import { useStone } from '../context/StoneContext';
import { ArrowLeft, Eye, Package, ArrowUpRight, ShieldCheck, PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { slabs, setSelectedSlabForModal, addSampleToCart } = useStone();

  const category = STONE_CATEGORIES.find(c => c.id === categoryId || c.name.toLowerCase() === categoryId?.toLowerCase()) || STONE_CATEGORIES[0];
  const categorySlabs = slabs.filter(s => s.category.toLowerCase() === category.name.toLowerCase());

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#0A0A0C] text-gray-900 dark:text-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back navigation */}
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8A96A] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Full Slab Catalog
        </button>

        {/* Hero Header */}
        <div className="relative rounded-3xl overflow-hidden bg-stone-950 text-white p-8 sm:p-16 border border-[#C8A96A]/30">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-4 py-1.5 rounded-full bg-[#C8A96A] text-black font-bold text-xs uppercase tracking-widest inline-block shadow-md">
              {category.tagline}
            </span>
            <h1 className="font-serif-luxury text-4xl sm:text-7xl font-bold tracking-tight">
              {category.name} Collection
            </h1>
            <p className="text-gray-300 text-base sm:text-lg font-sans-luxury leading-relaxed">
              {category.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-4 text-xs font-semibold text-gray-300">
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/20">
                <ShieldCheck className="w-4 h-4 text-[#C8A96A]" /> {categorySlabs.length} Certified Slab Bundles
              </span>
            </div>
          </div>
        </div>

        {/* Category Key Features */}
        {category.keyFeatures && category.keyFeatures.length > 0 && (
          <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 space-y-4">
            <h3 className="font-serif-luxury text-2xl font-bold text-gray-900 dark:text-white">
              {category.name} Key Performance Characteristics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {category.keyFeatures.map((feat, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-800">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slabs Grid */}
        <div className="space-y-6">
          <h3 className="font-serif-luxury text-3xl font-bold">
            Available {category.name} Slab Bundles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categorySlabs.map((slab, idx) => (
              <motion.div
                key={slab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 hover:border-[#C8A96A]/60 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between shadow-none hover:shadow-none"
              >
                <div
                  className="relative h-80 sm:h-96 w-full overflow-hidden bg-black cursor-pointer"
                  onClick={() => setSelectedSlabForModal(slab)}
                >
                  <img
                    src={slab.image}
                    alt={slab.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[#C8A96A] text-black font-bold text-[10px] uppercase tracking-wider">
                      {slab.rarity}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4
                      onClick={() => navigate(`/product/${slab.id}`)}
                      className="font-serif-luxury text-2xl font-bold mt-1 cursor-pointer group-hover:text-[#C8A96A] transition-colors"
                    >
                      {slab.name}
                    </h4>

                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                    <div className="grid grid-cols-1 min-[375px]:grid-cols-2 gap-2">
                      <button
                        onClick={() => addSampleToCart(slab)}
                        className="py-2.5 px-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-[#C8A96A] text-xs font-semibold flex items-center justify-center gap-1.5 text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-[#C8A96A]" /> Sample
                      </button>
                      <button
                        onClick={() => setSelectedSlabForModal(slab)}
                        className="py-2.5 px-3 rounded-xl gold-button text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-black" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 min-[375px]:grid-cols-2 gap-2">
                      <a
                        href={`https://wa.me/919974617657?text=${encodeURIComponent(`Hi Ashapura Tiles & Granite, I am interested in ${slab.name} (${slab.category}).`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.8.001-2.615-1.013-5.074-2.859-6.921C16.375 2.036 13.918 1.017 11.3 1.017c-5.409 0-9.81 4.399-9.813 9.8-.001 1.77.464 3.498 1.347 5.022L1.817 21.39l5.961-1.565-.131-.22z"/>
                        </svg>
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href="tel:+919974617657"
                        className="py-2 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 text-[#C8A96A] font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-[#C8A96A]" />
                        <span>Call Now</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
