import React, { useState } from 'react';
import { SLABS_DATA, StoneSlab } from '../data/stoneData';
import { useStone } from '../context/StoneContext';
import { Eye, Layers, Sun, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

const ROOM_PRESETS = [
  {
    id: 'kitchen-island',
    name: 'Waterfall Kitchen Island',
    subtitle: 'Contemporary Penthouse Kitchen',
    baseImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90'
  },
  {
    id: 'master-bath',
    name: 'Master Suite Vanity & Wall',
    subtitle: 'Minimalist Sanctuary Spa',
    baseImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=90'
  },
  {
    
    id: 'executive-wall',
    name: 'Foyer Bookmatched Feature Wall',
    subtitle: 'Architectural Entrance Lobby',
    baseImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=90'
  },
  {
    id: 'fireplace',
    name: 'Monolithic Fireplace Surround',
    subtitle: 'High-Ceiling Living Salon',
    baseImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=90'
  }
];

export const SlabVisualizer: React.FC = () => {
  const { slabs, setSelectedSlabForModal, addSampleToCart, openConsultationWithSlab } = useStone();
  const [activeRoom, setActiveRoom] = useState(ROOM_PRESETS[0]);
  const [selectedSlab, setSelectedSlab] = useState<StoneSlab>(slabs[0] || SLABS_DATA[0]);
  const [selectedFinish, setSelectedFinish] = useState('Polished');
  const [lightingMode, setLightingMode] = useState<'Warm Ambient' | 'Daylight' | 'Dramatic Spot'>('Daylight');

  return (
    <section id="visualizer" className="py-24 bg-[#0B0B0D] text-white relative overflow-hidden">
      {/* Decorative Gold Ambient Glow */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#C8A96A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#C8A96A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8A96A]/10 border border-[#C8A96A]/30 text-[#C8A96A] text-xs uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Architectural Tool</span>
          </div>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight">
            Live 3D Stone Room Studio
          </h2>
          <p className="text-gray-400 text-base sm:text-lg font-sans-luxury">
            Visualize exotic marble, quartzite, and granite slabs in world-class interior spaces. Test surface finishes and lighting temperatures in real-time.
          </p>
        </div>

        {/* Visualizer Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#141417] border border-[#C8A96A]/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Main Visual Display (Left 8 Cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            {/* Viewport Frame */}
            <div className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden bg-black group border border-white/10 shadow-2xl">
              {/* Room Image with Stone Texture Simulation */}
              <motion.img
                key={`${activeRoom.id}-${selectedSlab.id}`}
                initial={{ opacity: 0.5, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                src={selectedSlab.image}
                alt={selectedSlab.name}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  selectedFinish === 'Honed'
                    ? 'contrast-90 brightness-105'
                    : selectedFinish === 'Leathered'
                    ? 'contrast-125 saturate-90'
                    : 'contrast-105'
                }`}
              />

              {/* Lighting Mode Overlay */}
              <div
                className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
                  lightingMode === 'Warm Ambient'
                    ? 'bg-amber-900/20 mix-blend-color-burn'
                    : lightingMode === 'Dramatic Spot'
                    ? 'bg-black/30 backdrop-brightness-110'
                    : 'bg-transparent'
                }`}
              />

              {/* Live Info Tag */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#C8A96A] animate-pulse" />
                <div>
                  <h4 className="font-serif-luxury font-bold text-sm text-white">{selectedSlab.name}</h4>
                  <p className="text-[11px] text-gray-400 font-mono">
                    {activeRoom.name} • {selectedFinish} Finish
                  </p>
                </div>
              </div>

              {/* Zoom & Lightbox Button */}
              <button
                onClick={() => setSelectedSlabForModal(selectedSlab)}
                className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-all hover:border-[#C8A96A]"
              >
                <Eye className="w-4 h-4 text-[#C8A96A]" />
                <span>Inspect Full Slab Bundle</span>
              </button>
            </div>

            {/* Room Selector Pills */}
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold">
                1. Select Architectural Space
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ROOM_PRESETS.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoom(room)}
                    className={`p-3 rounded-xl text-left border text-xs font-medium transition-all ${
                      activeRoom.id === room.id
                        ? 'border-[#C8A96A] bg-[#C8A96A]/10 text-white font-bold shadow-md'
                        : 'border-white/10 bg-[#1A1A1E] text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <p className="font-serif-luxury text-sm truncate">{room.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{room.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Controls Panel (Right 4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 bg-[#1A1A1F] p-6 rounded-2xl border border-white/5">
            <div className="space-y-6">
              {/* Stone Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C8A96A]" />
                    <span>2. Choose Stone Slab</span>
                  </label>
                  <span className="text-[11px] text-[#C8A96A] font-semibold">{slabs.length} Slabs Available</span>
                </div>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {slabs.map(slab => (
                    <div
                      key={slab.id}
                      onClick={() => setSelectedSlab(slab)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer border transition-all ${
                        selectedSlab.id === slab.id
                          ? 'border-[#C8A96A] bg-[#C8A96A]/15 text-white'
                          : 'border-white/5 bg-[#121215] text-gray-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={slab.image}
                          alt={slab.name}
                          className="w-10 h-10 rounded-lg object-cover border border-white/10"
                        />
                        <div>
                          <p className="font-serif-luxury font-semibold text-xs text-white">{slab.name}</p>
                          <p className="text-[10px] text-gray-400">{slab.category} • {slab.origin}</p>
                        </div>
                      </div>
                      {selectedSlab.id === slab.id && <Check className="w-4 h-4 text-[#C8A96A]" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Finish Control */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                  3. Surface Finish
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Polished', 'Honed', 'Leathered'].map(finish => (
                    <button
                      key={finish}
                      onClick={() => setSelectedFinish(finish)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                        selectedFinish === finish
                          ? 'bg-[#C8A96A] text-black shadow-md'
                          : 'bg-[#121215] text-gray-400 border border-white/10 hover:text-white'
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lighting Mode */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2 flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>4. Lighting Atmosphere</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Daylight', 'Warm Ambient', 'Dramatic Spot'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setLightingMode(mode)}
                      className={`py-2 px-1 text-[11px] rounded-xl font-medium transition-all ${
                        lightingMode === mode
                          ? 'bg-white/20 text-white border border-[#C8A96A]'
                          : 'bg-[#121215] text-gray-400 border border-white/5 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <button
                onClick={() => addSampleToCart(selectedSlab)}
                className="w-full py-3 rounded-xl border border-[#C8A96A] text-[#C8A96A] hover:bg-[#C8A96A]/10 text-xs font-bold uppercase tracking-wider transition-all"
              >
                Request 4"x4" Sample Box
              </button>
              <button
                onClick={() => openConsultationWithSlab(selectedSlab)}
                className="w-full py-3 rounded-xl gold-button text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <span>Reserve Slabs For Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
