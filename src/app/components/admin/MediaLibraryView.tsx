import React, { useState, useMemo } from 'react';
import {
  Folder, Image as ImageIcon, Plus, Trash2, Search, Tag, Upload,
  Edit2, ChevronRight, File, Info, Check, RefreshCw
} from 'lucide-react';
import { STONE_CATEGORIES } from '../../data/stoneData';

export const MediaLibraryView: React.FC = () => {
  const [activeFolder, setActiveFolder] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  // Mock media assets
  const [assets, setAssets] = useState<any[]>([
    { id: '1', name: 'calacatta_gold_slab.jpg', folder: 'Slabs', size: '1.8 MB', dimensions: '3200x1900', url: './img1.jpeg', tags: ['Marble', 'Calacatta', 'Luxury'] },
    { id: '2', name: 'ceramic_wall_tiles.jpg', folder: 'Tiles', size: '940 KB', dimensions: '1200x900', url: './t1.jpeg', tags: ['Tiles', 'Ceramic'] },
    { id: '3', name: 'black_galaxy_detail.jpg', folder: 'Slabs', size: '2.4 MB', dimensions: '3000x1800', url: './img2.jpeg', tags: ['Granite', 'Black'] },
    { id: '4', name: 'jalore_showroom_facade.jpg', folder: 'Showroom', size: '1.2 MB', dimensions: '1920x1080', url: './img3.jpeg', tags: ['Showroom', 'Storefront'] },
    { id: '5', name: 'ashapura_catalog_pdf.pdf', folder: 'Documents', size: '4.5 MB', dimensions: 'PDF File', url: '#', tags: ['Catalog', 'Brochure'] }
  ]);

  const [folders, setFolders] = useState(['All', 'Slabs', 'Tiles', 'Showroom', 'Documents']);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const handleCreateFolder = () => {
    if (!newFolderName.trim() || folders.includes(newFolderName.trim())) return;
    setFolders([...folders, newFolderName.trim()]);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const handleDeleteAsset = (id: string) => {
    if (confirm('Delete this asset permanently from the media library?')) {
      setAssets(prev => prev.filter(a => a.id !== id));
      if (selectedAsset?.id === id) setSelectedAsset(null);
    }
  };

  const handleSimulateCompress = (asset: any) => {
    alert(`Compressed ${asset.name}!\nSize reduced from ${asset.size} to ${parseInt(asset.size) > 1 ? '720 KB' : '240 KB'} (optimized for WebP)`);
    setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, size: parseInt(a.size) > 1 ? '720 KB' : '240 KB' } : a));
    setSelectedAsset(prev => prev ? { ...prev, size: parseInt(prev.size) > 1 ? '720 KB' : '240 KB' } : null);
  };

  // Filter Assets
  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      const matchesFolder = activeFolder === 'All' || a.folder === activeFolder;
      const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag === 'All' || a.tags.includes(selectedTag);
      return matchesFolder && matchesSearch && matchesTag;
    });
  }, [assets, activeFolder, searchQuery, selectedTag]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-300">
      {/* Sidebar: Folders List */}
      <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="font-serif-luxury text-base font-bold">Media Folders</h4>
          <button
            onClick={() => setIsCreatingFolder(!isCreatingFolder)}
            className="p-1 rounded bg-[#C8A96A]/10 text-[#C8A96A] hover:bg-[#C8A96A]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {isCreatingFolder && (
          <div className="flex gap-2 animate-in slide-in-from-top-2 duration-150">
            <input
              type="text"
              placeholder="Folder name..."
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              className="flex-1 bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-850 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C8A96A] text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={handleCreateFolder}
              className="px-3 py-1.5 bg-[#C8A96A] text-black text-xs font-bold rounded-xl"
            >
              Add
            </button>
          </div>
        )}

        <div className="space-y-1.5">
          {folders.map(folder => (
            <button
              key={folder}
              onClick={() => {
                setActiveFolder(folder);
                setSelectedAsset(null);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                activeFolder === folder
                  ? 'bg-[#C8A96A]/10 text-[#C8A96A]'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-[#1A1A1F]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Folder className="w-4 h-4" /> {folder}
              </span>
              <span className="font-mono text-[10px] text-gray-400">
                {folder === 'All' ? assets.length : assets.filter(a => a.folder === folder).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Center: Media Grid Browser */}
      <div className="lg:col-span-2 space-y-6">
        {/* Search & Upload Bar */}
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-md flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl pl-11 pr-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
            />
          </div>

          <button className="px-4 py-2.5 bg-[#C8A96A] text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-110 flex items-center gap-1.5 shadow-md">
            <Upload className="w-4 h-4" /> Upload Media
          </button>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredAssets.map(asset => {
            const isImage = !asset.name.endsWith('.pdf');
            const isSelected = selectedAsset?.id === asset.id;

            return (
              <div
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className={`group bg-white dark:bg-[#131316] border rounded-2xl overflow-hidden cursor-pointer shadow-md hover:-translate-y-1 transition-all ${
                  isSelected ? 'border-[#C8A96A] ring-2 ring-[#C8A96A]/20' : 'border-gray-250 dark:border-gray-800 hover:border-gray-400'
                }`}
              >
                {/* Visual Preview */}
                <div className="aspect-[4/3] bg-gray-50 dark:bg-[#19191D] relative overflow-hidden flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
                  {isImage ? (
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <File className="w-10 h-10 text-[#C8A96A] opacity-80" />
                  )}
                </div>

                <div className="p-3 text-[10px] space-y-1">
                  <p className="font-bold text-gray-800 dark:text-gray-200 truncate">{asset.name}</p>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>{asset.folder}</span>
                    <span className="font-mono">{asset.size}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Asset Details Drawer */}
      <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl">
        {selectedAsset ? (
          <div className="space-y-6 text-xs animate-in fade-in duration-150">
            <h4 className="font-serif-luxury text-base font-bold flex items-center gap-1.5 border-b border-gray-200 dark:border-gray-800 pb-3">
              <Info className="w-4 h-4 text-[#C8A96A]" /> Asset Specifications
            </h4>

            {/* Preview Banner */}
            <div className="aspect-[4/3] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-50 flex items-center justify-center">
              {!selectedAsset.name.endsWith('.pdf') ? (
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <File className="w-12 h-12 text-[#C8A96A]" />
              )}
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-gray-400 block font-semibold uppercase tracking-wider text-[8px]">File Name</span>
                <span className="font-bold text-gray-900 dark:text-white break-all">{selectedAsset.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 block font-semibold uppercase tracking-wider text-[8px]">Dimensions</span>
                  <span className="font-medium font-mono text-gray-800 dark:text-gray-200">{selectedAsset.dimensions}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold uppercase tracking-wider text-[8px]">File Size</span>
                  <span className="font-medium font-mono text-gray-800 dark:text-gray-200">{selectedAsset.size}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold uppercase tracking-wider text-[8px]">Asset Tags</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedAsset.tags.map((t: string) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#1E1E24] text-[#C8A96A] text-[9px] font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t pt-4 border-gray-200 dark:border-gray-800">
              {!selectedAsset.name.endsWith('.pdf') && (
                <button
                  onClick={() => handleSimulateCompress(selectedAsset)}
                  className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Optimize WebP / Compress
                </button>
              )}
              <button
                onClick={() => handleDeleteAsset(selectedAsset.id)}
                className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete File Permanent
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 space-y-2 text-xs">
            <Info className="w-8 h-8 mx-auto" />
            <p>Select a media asset file to inspect details.</p>
          </div>
        )}
      </div>
    </div>
  );
};
