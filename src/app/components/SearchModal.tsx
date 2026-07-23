import React, { useState } from 'react';
import { useStone } from '../context/StoneContext';
import { SLABS_DATA, STONE_CATEGORIES, BLOG_ARTICLES } from '../data/stoneData';
import { Search, X, ChevronRight, Layers, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';

export const SearchModal: React.FC = () => {
  const { slabs, isSearchOpen, setIsSearchOpen, setSelectedSlabForModal } = useStone();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!isSearchOpen) return null;

  const filteredSlabs = query.trim()
    ? slabs.filter(
        slab =>
          slab.name.toLowerCase().includes(query.toLowerCase()) ||
          slab.category.toLowerCase().includes(query.toLowerCase()) ||
          slab.color.toLowerCase().includes(query.toLowerCase()) ||
          slab.origin.toLowerCase().includes(query.toLowerCase())
      )
    : slabs.slice(0, 4);

  const filteredCategories = query.trim()
    ? STONE_CATEGORIES.filter(cat => cat.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredBlogs = query.trim()
    ? BLOG_ARTICLES.filter(
        art =>
          art.title.toLowerCase().includes(query.toLowerCase()) ||
          art.summary.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#121214] border border-[#C8A96A]/30 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header Input */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <Search className="w-5 h-5 text-[#C8A96A] mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Search by stone name, color (e.g. Calacatta, Gold, Nero), origin..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
              className="w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none text-lg font-sans-luxury"
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
            {/* Categories */}
            {filteredCategories.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-widest text-[#C8A96A] font-semibold mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Stone Collections
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {filteredCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate(`/category/${cat.id}`);
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1A1A1E] hover:border-[#C8A96A]/50 border border-transparent transition-all group text-left"
                    >
                      <span className="font-serif-luxury font-medium text-gray-900 dark:text-gray-100">
                        {cat.name} Collection
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#C8A96A] transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Slabs */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#C8A96A] font-semibold mb-3 flex items-center gap-2">
                <Search className="w-4 h-4" /> {query ? 'Matching Slabs' : 'Featured Luxury Slabs'}
              </h4>
              {filteredSlabs.length === 0 ? (
                <p className="text-sm text-gray-500 py-2">No matching stone slabs found.</p>
              ) : (
                <div className="space-y-3">
                  {filteredSlabs.map(slab => (
                    <div
                      key={slab.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSelectedSlabForModal(slab);
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1A1A1E] hover:border-[#C8A96A]/50 border border-transparent transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={slab.image}
                          alt={slab.name}
                          className="w-14 h-14 object-cover rounded-lg border border-[#C8A96A]/20"
                        />
                        <div>
                          <h5 className="font-serif-luxury text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#C8A96A] transition-colors">
                            {slab.name}
                          </h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {slab.category} • {slab.origin}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Blogs */}
            {filteredBlogs.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-widest text-[#C8A96A] font-semibold mb-3 flex items-center gap-2">
                  <Newspaper className="w-4 h-4" /> Journal Articles
                </h4>
                <div className="space-y-2">
                  {filteredBlogs.map(art => (
                    <button
                      key={art.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate(`/journal#${art.id}`);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-[#1A1A1E] hover:border-[#C8A96A]/50 border border-transparent transition-all"
                    >
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{art.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{art.summary}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
