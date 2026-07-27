import React, { useState } from 'react';
import { Layers, Plus, Trash2, Globe, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { STONE_CATEGORIES, StoneCategory } from '../../data/stoneData';

export const CategoriesBrandsView: React.FC = () => {
  const [categories, setCategories] = useState<StoneCategory[]>(STONE_CATEGORIES);
  const [newSubName, setNewSubName] = useState('');
  const [selectedCatId, setSelectedCatId] = useState(STONE_CATEGORIES[0]?.id || '');
  
  // Custom mock nested subcategories
  const [nestedSubcategories, setNestedSubcategories] = useState<Record<string, string[]>>({
    'floor-tiles': ['Vitrified Tiles', 'Double Charge Tiles', 'Polished Glazed Vitrified Tiles (PGVT)'],
    'wall-tiles': ['Ceramic Wall Tiles', 'Elevation Tiles', 'Mosaic Tiles', 'Subway Tiles'],
    'granite': ['South Granite Slabs', 'North Granite Slabs', 'Exotic Granite Slabs'],
    'marble': ['Italian Marble', 'Imported Marble Slabs', 'Indian Marble', 'Onyx Marble Slabs'],
    'sanitary-items': ['Vitreous China Wash Basins', 'Water Closets (WC)', 'Luxury Bath Accessories']
  });

  const handleAddSubcategory = () => {
    if (!newSubName.trim()) return;
    setNestedSubcategories(prev => {
      const current = prev[selectedCatId] || [];
      return {
        ...prev,
        [selectedCatId]: [...current, newSubName.trim()]
      };
    });
    setNewSubName('');
  };

  const handleDeleteSubcategory = (catId: string, indexToDelete: number) => {
    setNestedSubcategories(prev => {
      const current = prev[catId] || [];
      return {
        ...prev,
        [catId]: current.filter((_, idx) => idx !== indexToDelete)
      };
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
      {/* Left: Parent Categories */}
      <div className="lg:col-span-2 bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
          <h3 className="font-serif-luxury text-xl font-bold flex items-center gap-1.5">
            <Layers className="w-5 h-5 text-[#C8A96A]" /> Parent Stone Collections
          </h3>
        </div>

        <div className="space-y-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                selectedCatId === cat.id
                  ? 'border-[#C8A96A] bg-[#C8A96A]/5'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-serif-luxury font-bold text-base text-gray-900 dark:text-white">{cat.name}</h4>
                  <p className="text-xs text-gray-400 font-sans-luxury">{cat.tagline}</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${selectedCatId === cat.id ? 'translate-x-1 text-[#C8A96A]' : ''}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Nested Subcategories & SEO */}
      <div className="space-y-6">
        {/* Nested Subcategories Editor */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h4 className="font-serif-luxury text-base font-bold text-[#C8A96A]">
            Nested Subcategories
          </h4>
          <p className="text-[11px] text-gray-450">
            Define specific styles for the active collection ({categories.find(c => c.id === selectedCatId)?.name}).
          </p>

          <div className="space-y-2">
            {(nestedSubcategories[selectedCatId] || []).map((sub, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-[#1A1A1F] border border-gray-250 dark:border-gray-800 text-xs"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300">{sub}</span>
                <button
                  onClick={() => handleDeleteSubcategory(selectedCatId, idx)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Add subcategory..."
              value={newSubName}
              onChange={e => setNewSubName(e.target.value)}
              className="flex-1 bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C8A96A]"
            />
            <button
              onClick={handleAddSubcategory}
              className="p-2 rounded-xl bg-[#C8A96A] text-black hover:brightness-110"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SEO Category settings */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h4 className="font-serif-luxury text-base font-bold flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#C8A96A]" /> Search Engine Optimization (SEO)
          </h4>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-gray-400 block mb-1">Meta Title Tag</label>
              <input
                type="text"
                defaultValue={`${categories.find(c => c.id === selectedCatId)?.name} Slabs & Tiles | Ashapura Granite`}
                className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#C8A96A]"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Meta Description</label>
              <textarea
                rows={2}
                defaultValue={`Explore the absolute premium collection of imported ${categories.find(c => c.id === selectedCatId)?.name?.toLowerCase()} for architectural floors and kitchen countertops.`}
                className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:outline-none focus:border-[#C8A96A]"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Focus Keywords</label>
              <input
                type="text"
                defaultValue="luxury stone slabs, premium tiles, granite, import marble"
                className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#C8A96A]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
