import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { STONE_CATEGORIES, SLABS_DATA } from '../data/stoneData';
import { useStone } from '../context/StoneContext';
import { ArrowLeft, Sparkles, Eye, Package, ArrowUpRight, ShieldCheck } from 'lucide-react';
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
        <div className="relative rounded-3xl overflow-hidden bg-black text-white p-8 sm:p-16 border border-[#C8A96A]/30">
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

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
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 space-y-4">
          <h3 className="font-serif-luxury text-2xl font-bold text-gray-900 dark:text-white">
            {category.name} Key Performance Characteristics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {category.keyFeatures.map((feat, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-800">
                <Sparkles className="w-5 h-5 text-[#C8A96A] shrink-0" />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Slabs Grid */}
        <div className="space-y-6">
          <h3 className="font-serif-luxury text-3xl font-bold">
            Available {category.name} Slab Bundles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categorySlabs.map((slab, idx) => (
              <motion.div
                key={slab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 hover:border-[#C8A96A]/60 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[#C8A96A] text-black font-bold text-[10px] uppercase tracking-wider">
                      {slab.rarity}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs text-[#C8A96A] font-semibold uppercase tracking-wider block">
                      {slab.origin}
                    </span>
                    <h4
                      onClick={() => navigate(`/product/${slab.id}`)}
                      className="font-serif-luxury text-2xl font-bold mt-1 cursor-pointer group-hover:text-[#C8A96A] transition-colors"
                    >
                      {slab.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {slab.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addSampleToCart(slab)}
                      className="py-2.5 px-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-[#C8A96A] text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <Package className="w-3.5 h-3.5 text-[#C8A96A]" /> Sample
                    </button>
                    <button
                      onClick={() => setSelectedSlabForModal(slab)}
                      className="py-2.5 px-3 rounded-xl gold-button text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1"
                    >
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-black" />
                    </button>
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
