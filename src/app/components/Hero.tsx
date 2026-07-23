import React from 'react';
import { useStone } from '../context/StoneContext';
import { ArrowRight, Award, Layers, ShieldCheck, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export const Hero: React.FC = () => {
  const { setIsConsultationModalOpen } = useStone();
  const navigate = useNavigate();

  const handleScrollToCollections = () => {
    const el = document.getElementById('featured-collections');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/products');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Cinematic Visual */}
      <div className="absolute inset-0 z-0">
        <img
          src="./main.jpeg"
          alt="Luxury Marble Slab Background"
          className="w-full h-full object-cover scale-105 animate-pulse duration-[10000ms] opacity-75 brightness-90 contrast-125"
        />
        {/* Dark Luxury Vignette Overlays */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C] via-transparent to-[#0A0A0C]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0A0A0C]/20 to-[#0A0A0C]" /> */}
      </div>

      {/* Floating Animated Gold Ambient Particles */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#C8A96A]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C8A96A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Core Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
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
          className="font-serif-luxury  text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-gray-900 max-w-5xl mx-auto leading-[1.05]"
        >
          Ashapura Premium Tiles & Granite at Unbeatable Prices. <br />
          <span className="gold-gradient-text italic font-normal">Stone Collection</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-sans-luxury text-lg sm:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed"
        >
          Premium Marble , Granite  &  Luxury Spaces
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={handleScrollToCollections}
            className="w-full sm:w-auto px-8 py-4 rounded-xl gold-button text-sm uppercase tracking-widest font-bold shadow-2xl flex items-center justify-center gap-3 group"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => setIsConsultationModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/30 hover:border-[#C8A96A] bg-black/40 hover:bg-white/10 backdrop-blur-md text-white text-sm uppercase tracking-widest font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Book Consultation</span>
          </button>
        </motion.div>

        {/* Floating Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-12 text-left"
        >
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-[#C8A96A]/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#C8A96A]/10 border border-[#C8A96A]/30 flex items-center justify-center text-[#C8A96A] shrink-0 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif-luxury font-bold text-3xl text-white block">5000+</span>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                In-Stock Slabs
              </span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-[#C8A96A]/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#C8A96A]/10 border border-[#C8A96A]/30 flex items-center justify-center text-[#C8A96A] shrink-0 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif-luxury font-bold text-3xl text-white block">25+ Years</span>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Quarry Master Experience
              </span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-[#C8A96A]/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#C8A96A]/10 border border-[#C8A96A]/30 flex items-center justify-center text-[#C8A96A] shrink-0 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif-luxury font-bold text-3xl text-white block">10,000+</span>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Global Projects Delivered
              </span>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="pt-8 flex justify-center">
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
