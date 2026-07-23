import React, { useState } from 'react';
import { INSPIRATION_GALLERY, InspirationItem } from '../data/stoneData';
import { Maximize2, X, MapPin, Building2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const InspirationGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeLightbox, setActiveLightbox] = useState<InspirationItem | null>(null);

  const categories = ['All', 'Kitchen', 'Bathroom', 'Commercial', 'Living'];

  const filteredItems = activeCategory === 'All'
    ? INSPIRATION_GALLERY
    : INSPIRATION_GALLERY.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="py-24 bg-[#FFFFFF] dark:bg-[#0B0B0D] text-gray-900 dark:text-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold inline-flex items-center gap-2">
            Architectural Showcase
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight">
            Inspiration Gallery
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base font-sans-luxury">
            Explore world-class penthouses, 5-star hotels, and luxury private estates featuring Aurelia Marmi stone fabrications.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-[#C8A96A] text-black shadow-lg font-bold'
                  : 'bg-gray-100 dark:bg-[#18181C] text-gray-600 dark:text-gray-400 hover:border-[#C8A96A]/40 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Pinterest-Style Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative rounded-3xl overflow-hidden bg-black aspect-[4/5] cursor-pointer shadow-xl border border-gray-200 dark:border-gray-800 hover:border-[#C8A96A]/60"
                onClick={() => setActiveLightbox(item)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Lightbox Icon trigger */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4 text-[#C8A96A]" />
                </div>

                {/* Architectural Metadata */}
                <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
                  <span className="px-3 py-1 rounded-full bg-[#C8A96A]/20 border border-[#C8A96A]/40 text-[#C8A96A] text-[10px] uppercase tracking-wider font-bold">
                    {item.materialUsed}
                  </span>
                  <h3 className="font-serif-luxury text-2xl font-bold line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-300 font-sans-luxury">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C8A96A]" /> {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#C8A96A]" /> {item.architect}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightbox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
            <div className="fixed inset-0" onClick={() => setActiveLightbox(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full bg-[#121215] border border-[#C8A96A]/40 rounded-3xl overflow-hidden shadow-2xl z-10 text-white"
            >
              <button
                onClick={() => setActiveLightbox(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-8 h-[350px] lg:h-[500px]">
                  <img
                    src={activeLightbox.image}
                    alt={activeLightbox.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold block mb-2">
                      {activeLightbox.category} Architecture
                    </span>
                    <h3 className="font-serif-luxury text-3xl font-bold mb-4">
                      {activeLightbox.title}
                    </h3>
                    <div className="space-y-3 text-xs text-gray-300">
                      <div>
                        <span className="text-gray-500 block uppercase tracking-wider">Material Installed</span>
                        <span className="font-semibold text-white text-sm">{activeLightbox.materialUsed}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block uppercase tracking-wider">Location</span>
                        <span className="font-semibold text-white">{activeLightbox.location}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block uppercase tracking-wider">Architect / Studio</span>
                        <span className="font-semibold text-white">{activeLightbox.architect}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block uppercase tracking-wider">Completion Year</span>
                        <span className="font-semibold text-white">{activeLightbox.year}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveLightbox(null)}
                    className="w-full py-3 rounded-xl gold-button text-xs uppercase tracking-widest font-bold"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
