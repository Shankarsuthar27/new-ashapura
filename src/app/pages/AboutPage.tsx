import React from 'react';
import { Sparkles, Globe, Award, ShieldCheck, Users, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#0A0A0C] text-gray-900 dark:text-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Banner */}
        <div className="bg-[#111114] border border-[#C8A96A]/30 rounded-3xl p-8 sm:p-16 text-white text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8A96A]/10 border border-[#C8A96A]/30 text-[#C8A96A] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> 25+ Years Of Italian Heritage
          </div>
          <h1 className="font-serif-luxury text-4xl sm:text-7xl font-bold tracking-tight">
            Quarrying Earth’s Fine Art
          </h1>
          <p className="text-gray-300 text-base sm:text-xl font-sans-luxury max-w-3xl mx-auto leading-relaxed">
            Aurelia Marmi was founded with a singular purpose: to discover, extract, and sculpt the rarest natural stone slabs on earth for world-class architectural projects.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold">
              Our Legacy & Craft
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold">
              From Italian Apuan Alps to Global Penthouse Sanctuaries
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans-luxury">
              Our journey began in Carrara, Italy, where master stone petrographers selected individual blocks of white calcite marble for classical European cathedrals. Today, Aurelia operates exclusive quarry rights across Italy, Brazil, Greece, and Spain.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans-luxury">
              We combine ancestral stone masons' hand-finishing traditions with cutting-edge Italian 5-axis waterjet CNC precision to achieve zero-defect book-matching.
            </p>
          </div>

          <div className="lg:col-span-6 h-80 sm:h-96 rounded-2xl overflow-hidden bg-black shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
              alt="Marble Quarry"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#141417] border border-gray-200 dark:border-gray-800 space-y-3">
            <Globe className="w-8 h-8 text-[#C8A96A]" />
            <h3 className="font-serif-luxury text-xl font-bold">Direct Quarries</h3>
            <p className="text-xs text-gray-500">Over 50 direct quarry access agreements across 4 continents.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#141417] border border-gray-200 dark:border-gray-800 space-y-3">
            <Award className="w-8 h-8 text-[#C8A96A]" />
            <h3 className="font-serif-luxury text-xl font-bold">Grade A+ Selection</h3>
            <p className="text-xs text-gray-500">Every slab bundle undergoes petrographic density & flexural strength certification.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#141417] border border-gray-200 dark:border-gray-800 space-y-3">
            <Compass className="w-8 h-8 text-[#C8A96A]" />
            <h3 className="font-serif-luxury text-xl font-bold">CAD Layouts</h3>
            <p className="text-xs text-gray-500">3D digital slab vein alignment overlays before waterjet cutting begins.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#141417] border border-gray-200 dark:border-gray-800 space-y-3">
            <ShieldCheck className="w-8 h-8 text-[#C8A96A]" />
            <h3 className="font-serif-luxury text-xl font-bold">White-Glove Service</h3>
            <p className="text-xs text-gray-500">Climate-controlled transport and certified master mason installation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
