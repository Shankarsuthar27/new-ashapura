import React, { useState } from 'react';
import { TESTIMONIALS_DATA } from '../data/stoneData';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === TESTIMONIALS_DATA.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS_DATA[currentIndex];

  return (
    <section className="py-24 bg-[#F8F8F8] dark:bg-[#0E0E11] text-gray-900 dark:text-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Endorsements From Industry Leaders
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight">
            Client & Architect Testimonials
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base font-sans-luxury">
            Hear from world-renowned architectural firms, luxury interior designers, and estate owners who rely on Aurelia Marmi.
          </p>
        </div>

        {/* Testimonial Showcase Card */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Project Photo (Left 6 cols) */}
            <div className="lg:col-span-6 relative h-[320px] sm:h-[420px] rounded-2xl overflow-hidden bg-black shadow-xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  src={current.projectPhoto}
                  alt={current.clientName}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#C8A96A] font-bold block">
                  Material Sourced
                </span>
                <span className="font-serif-luxury text-xl font-bold">
                  {current.materialPurchased}
                </span>
              </div>
            </div>

            {/* Testimonial Quote (Right 6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <Quote className="w-12 h-12 text-[#C8A96A]/30" />

              {/* 5-Star Rating */}
              <div className="flex items-center gap-1">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#C8A96A] text-[#C8A96A]" />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={current.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="font-serif-luxury text-2xl sm:text-3xl italic text-gray-900 dark:text-gray-100 leading-snug"
                >
                  "{current.quote}"
                </motion.p>
              </AnimatePresence>

              {/* Author Bio */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <img
                  src={current.image}
                  alt={current.clientName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#C8A96A]"
                />
                <div>
                  <h4 className="font-serif-luxury font-bold text-lg text-gray-900 dark:text-white">
                    {current.clientName}
                  </h4>
                  <p className="text-xs text-gray-500 font-sans-luxury">
                    {current.clientTitle} • {current.firm}
                  </p>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  {TESTIMONIALS_DATA.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        currentIndex === i ? 'w-8 bg-[#C8A96A]' : 'w-2 bg-gray-300 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    className="p-3 rounded-full bg-gray-100 dark:bg-[#1E1E24] hover:bg-[#C8A96A] hover:text-black transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-3 rounded-full bg-gray-100 dark:bg-[#1E1E24] hover:bg-[#C8A96A] hover:text-black transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
