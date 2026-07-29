import React from 'react';
import { useStone } from '../context/StoneContext';
import { ArrowRight, Award, Layers, ShieldCheck, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import Slideshow from './ui/slideshow';

export const Hero: React.FC = () => {
  const { setIsConsultationModalOpen } = useStone();
  const navigate = useNavigate();

  const handleScrollToCollections = () => {
    const el = document.getElementById('featured-collections');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/products');
  };

  return (
  <section className="relative min-h-[65vh] sm:min-h-screen flex items-center justify-center pt-16 sm:pt-24 pb-8 sm:pb-16 overflow-hidden">
      {/* Background Cinematic Slideshow */}
      <div className="absolute inset-0 z-0">
        <Slideshow />
        {/* Dark Luxury Vignette Overlays */}
        <div className="absolute inset-0  pointer-events-none" />
        <div className="absolute inset-0  pointer-events-none" />
      </div>

      {/* Floating Animated Gold Ambient Particles */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#C8A96A]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C8A96A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Core Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 text-center space-y-3 sm:space-y-8">
        {/* Luxury Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
         
        >
         
         
        </motion.div>

        {/* Large Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif-luxury text-sm sm:text-3xl md:text-3xl font-bold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]"
        >
          Ashapura Premium Tiles & Granite at Unbeatable Prices. <br />
          <span className="gold-gradient-text italic font-normal">Stone Collection</span>
        </motion.h1>

        {/* Subheadline */}


        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-row sm:flex-row items-center justify-center gap-2 sm:gap-4 pt-2 sm:pt-4"
        >
          {/* <button
            onClick={handleScrollToCollections}
            className="w-auto px-4 py-2 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl gold-button text-[10px] sm:text-sm uppercase tracking-widest font-bold shadow-2xl flex items-center justify-center gap-2 group"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => setIsConsultationModalOpen(true)}
            className="w-auto px-4 py-2 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl border border-white/30 hover:border-[#C8A96A] bg-black/40 hover:bg-white/10 backdrop-blur-md text-white text-[10px] sm:text-sm uppercase tracking-widest font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Book Consultation</span>
          </button> */}
        </motion.div>

        {/* Floating Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-3 gap-1.5 sm:gap-2 max-w-xs sm:max-w-2xl mx-auto pt-2 sm:pt-5 text-left"
        >
          {/* <div className="glass-panel p-1.5 sm:p-2 rounded-lg border border-white/10 flex items-center gap-1.5 sm:gap-2 hover:border-[#C8A96A]/50 transition-all group">
            <div className="hidden sm:flex w-7 h-7 rounded-md bg-[#C8A96A]/10 border border-[#C8A96A]/30 items-center justify-center text-[#C8A96A] shrink-0 group-hover:scale-110 transition-transform">
              <Layers className="w-3 h-3" />
            </div>
            <div>
              <span className="font-serif-luxury font-bold text-[11px] sm:text-base text-black block leading-tight">5000+</span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-black font-semibold leading-tight">
                In-Stock Slabs
              </span>
            </div>
          </div> */}

          {/* <div className="glass-panel p-1.5 sm:p-2 rounded-lg border border-white/10 flex items-center gap-1.5 sm:gap-2 hover:border-[#C8A96A]/50 transition-all group">
            <div className="hidden sm:flex w-7 h-7 rounded-md bg-[#C8A96A]/10 border border-[#C8A96A]/30 items-center justify-center text-[#C8A96A] shrink-0 group-hover:scale-110 transition-transform">
              <Award className="w-3 h-3" />
            </div>
            <div>
              <span className="font-serif-luxury font-bold text-[11px] sm:text-base text-black block leading-tight">25+ Years</span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-black font-semibold leading-tight">
                Quarry Master Experience
              </span>
            </div>
          </div> */}

          {/* <div className="glass-panel p-1.5 sm:p-2 rounded-lg border border-white/10 flex items-center gap-1.5 sm:gap-2 hover:border-[#C8A96A]/50 transition-all group">
            <div className="hidden sm:flex w-7 h-7 rounded-md bg-[#C8A96A]/10 border border-[#C8A96A]/30 items-center justify-center text-[#C8A96A] shrink-0 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-3 h-3" />
            </div>
            <div>
              <span className="font-serif-luxury font-bold text-[11px] sm:text-base text-black block leading-tight">10,000+</span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-gray-400 font-semibold leading-tight">
                Global Projects Delivered
              </span>
            </div>
          </div> */}
        </motion.div>



        {/* Scroll Indicator */}
        <div className="pt-3 sm:pt-8 flex justify-center">
          <button
            onClick={handleScrollToCollections}
            className="text-gray-400 hover:text-[#C8A96A] transition-colors animate-bounce p-2"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};
