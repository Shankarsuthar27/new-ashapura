import React from 'react';
import { STONE_CATEGORIES } from '../data/stoneData';
import { ArrowUpRight, Layers, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export const FeaturedCollections: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="featured-collections" className="py-24 bg-[#FFFFFF] dark:bg-[#0B0B0D] text-gray-900 dark:text-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Architectural Masterpieces
            </span>
            <h2 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight">
              Featured Stone Collections
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base font-sans-luxury">
              Hand-selected natural marble, granite, engineered quartz, exotics, and sintered porcelain slabs quarried globally.
            </p>
          </div>

          <button
            onClick={() => navigate('/products')}
            className="self-start md:self-end px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-800 hover:border-[#C8A96A] text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 group"
          >
            <span>View All {STONE_CATEGORIES.reduce((acc, c) => acc + c.count, 0)}+ Slabs</span>
            <ArrowUpRight className="w-4 h-4 text-[#C8A96A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Grid Cards (5 Categories) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STONE_CATEGORIES.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
              className={`group relative rounded-3xl overflow-hidden bg-gray-50 dark:bg-[#131316] border border-gray-200 dark:border-gray-800 hover:border-[#C8A96A]/60 transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col justify-between ${
                idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
            >
              {/* Image Container with Zoom Effect */}
              <div className="relative h-[360px] sm:h-[440px] w-full overflow-hidden bg-black">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />

                {/* Count Badge */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs font-mono">
                  {category.count} Slabs In Stock
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#C8A96A] font-semibold">
                    {category.tagline}
                  </span>
                  <h3 className="font-serif-luxury text-3xl font-bold text-gray-900 dark:text-white mt-1 group-hover:text-[#C8A96A] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Card Footer Action */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest font-bold text-gray-900 dark:text-gray-200 group-hover:text-[#C8A96A] transition-colors">
                    Explore Collection
                  </span>
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#1E1E24] group-hover:bg-[#C8A96A] group-hover:text-black flex items-center justify-center transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
