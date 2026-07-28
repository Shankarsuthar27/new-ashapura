import React, { useState, useMemo } from 'react';
import {
  Trash2, Edit3, Copy, Undo, Plus, CheckSquare, Square,
  Download, Archive, Calendar, Eye, EyeOff, Search, ArrowUpDown, ChevronDown
} from 'lucide-react';
import { StoneSlab } from '../../data/stoneData';

interface ProductManagementViewProps {
  slabs: StoneSlab[];
  onStartEdit: (slab: StoneSlab) => void;
  onDeleteSlab: (id: string) => Promise<void>;
  onAddSlab: (slab: StoneSlab) => Promise<void>;
  onUpdateSlab: (slab: StoneSlab) => Promise<void>;
  onNavigateToAdd?: () => void;
}

export const ProductManagementView: React.FC<ProductManagementViewProps> = ({
  slabs,
  onStartEdit,
  onDeleteSlab,
  onAddSlab,
  onUpdateSlab,
  onNavigateToAdd
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Published, Draft, Scheduled
  const [trashBin, setTrashBin] = useState<StoneSlab[]>([]);
  const [sortField, setSortField] = useState<keyof StoneSlab>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Simulated status mapping (default to published for standard slabs)
  const [slabStatuses, setSlabStatuses] = useState<Record<string, 'published' | 'draft' | 'scheduled'>>(() => {
    const statuses: Record<string, 'published' | 'draft' | 'scheduled'> = {};
    slabs.forEach(s => {
      statuses[s.id] = 'published';
    });
    return statuses;
  });

  // Bulk actions toggle
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSlabs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSlabs.map(s => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(x => x !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  // Duplicate product
  const handleDuplicate = async (slab: StoneSlab) => {
    const newId = `${slab.id}-copy-${Date.now().toString(36)}`;
    const duplicated: StoneSlab = {
      ...slab,
      id: newId,
      name: `${slab.name} (Copy)`,
      bundleNumber: `LOT-${Math.floor(1000 + Math.random() * 9000)}`
    };
    await onAddSlab(duplicated);
    setSlabStatuses(prev => ({ ...prev, [newId]: 'draft' })); // default copies to draft
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
      const itemsToDelete = slabs.filter(s => selectedIds.includes(s.id));
      setTrashBin(prev => [...prev, ...itemsToDelete]);
      for (const id of selectedIds) {
        await onDeleteSlab(id);
      }
      setSelectedIds([]);
    }
  };

  // Bulk Status Update
  const handleBulkStatusChange = (newStatus: 'published' | 'draft' | 'scheduled') => {
    setSlabStatuses(prev => {
      const updated = { ...prev };
      selectedIds.forEach(id => {
        updated[id] = newStatus;
      });
      return updated;
    });
    setSelectedIds([]);
  };

  // Restore deleted
  const handleRestore = async (slab: StoneSlab) => {
    await onAddSlab(slab);
    setTrashBin(prev => prev.filter(s => s.id !== slab.id));
  };

  // Filter & Sort Slabs
  const filteredSlabs = useMemo(() => {
    return slabs.filter(slab => {
      const matchesSearch = slab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            slab.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            slab.origin.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || slab.category === categoryFilter;
      const status = slabStatuses[slab.id] || 'published';
      const matchesStatus = statusFilter === 'All' || status === statusFilter.toLowerCase();
      
      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => {
      const valA = a[sortField] ?? '';
      const valB = b[sortField] ?? '';
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
    });
  }, [slabs, searchQuery, categoryFilter, statusFilter, slabStatuses, sortField, sortAsc]);

  const handleSort = (field: keyof StoneSlab) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Name', 'Category', 'Color', 'Origin', 'In Stock', 'Bundle Number', 'Price', 'Dimensions'];
    const rows = filteredSlabs.map(s => [
      s.name, s.category, s.color, s.origin, s.inStockSlabs, s.bundleNumber, s.price ?? 150, s.dimensions
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Ashapura_Products_Catalog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search & Filtering Action Bar */}
      <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, colors, quarries..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl pl-11 pr-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#C8A96A]"
            >
              <option value="All">All Categories</option>
              <option value="Floor Tiles">Floor Tiles</option>
              <option value="Wall Tiles">Wall Tiles</option>
              <option value="Granite">Granite</option>
              <option value="Marble">Marble</option>
              <option value="Sanitary Items">Sanitary Items</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#C8A96A]"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#C8A96A] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>

            {onNavigateToAdd && (
              <button
                onClick={onNavigateToAdd}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#DFBA73] via-[#C8A96A] to-[#8C6D2B] text-black text-xs font-bold flex items-center gap-1.5 hover:brightness-110 transition-all shadow-md"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Product (Tiles / Granite / Marble)
              </button>
            )}
          </div>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="bg-[#C8A96A]/10 border border-[#C8A96A]/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-200">
            <span className="text-xs font-semibold text-[#C8A96A]">
              {selectedIds.length} items selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkStatusChange('published')}
                className="px-3 py-1.5 rounded-lg bg-gray-150 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-[#C8A96A] transition-colors"
              >
                Publish Selected
              </button>
              <button
                onClick={() => handleBulkStatusChange('draft')}
                className="px-3 py-1.5 rounded-lg bg-gray-150 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-[#C8A96A] transition-colors"
              >
                Draft Selected
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold border border-red-500/20 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Inventory Table */}
      {/* Main Inventory Table/Cards Grid */}
      <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-[#17171C] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="py-4 px-6 w-12 text-center">
                  <button onClick={toggleSelectAll} className="text-gray-400 hover:text-white">
                    {selectedIds.length === filteredSlabs.length && filteredSlabs.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#C8A96A]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-4 px-4 cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">Product <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-4 px-4 cursor-pointer" onClick={() => handleSort('category')}>
                  <div className="flex items-center gap-1">Category <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-4 px-4">Origin & Specs</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 font-sans-luxury">
              {filteredSlabs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredSlabs.map(slab => {
                  const isSelected = selectedIds.includes(slab.id);
                  const status = slabStatuses[slab.id] || 'published';

                  return (
                    <tr key={slab.id} className="hover:bg-gray-50/50 dark:hover:bg-[#1A1A20] transition-colors">
                      <td className="py-4 px-6 text-center">
                        <button onClick={() => toggleSelectOne(slab.id)} className="text-gray-400">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#C8A96A]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={slab.image}
                            alt={slab.name}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-250 dark:border-gray-700 shadow-sm flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">
                              {slab.name}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {slab.color} • Bundle {slab.bundleNumber}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {slab.category}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                        <p className="text-[10px] font-semibold">{slab.origin}</p>
                        <p className="text-[9px] text-gray-400">{slab.dimensions}</p>
                      </td>

                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                        <p className="font-bold text-[#C8A96A]">₹{slab.price ?? 150}</p>
                        <p className="text-[9px] text-gray-400">/ sq.ft.</p>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : status === 'draft'
                              ? 'bg-gray-500/10 text-gray-400'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onStartEdit(slab)}
                            title="Edit"
                            className="p-2 rounded-lg bg-gray-100 dark:bg-[#202026] text-gray-700 dark:text-gray-300 hover:text-[#C8A96A] transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(slab)}
                            title="Duplicate"
                            className="p-2 rounded-lg bg-gray-100 dark:bg-[#202026] text-gray-700 dark:text-gray-300 hover:text-emerald-500 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Delete this product?')) {
                                setTrashBin(prev => [...prev, slab]);
                                await onDeleteSlab(slab.id);
                              }
                            }}
                            title="Delete"
                            className="p-2 rounded-lg bg-gray-100 dark:bg-[#202026] text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card List View */}
        <div className="block md:hidden divide-y divide-gray-200 dark:divide-gray-800 p-4 space-y-4">
          {filteredSlabs.length === 0 ? (
            <p className="py-6 text-center text-gray-400">No products found matching filters.</p>
          ) : (
            filteredSlabs.map(slab => {
              const isSelected = selectedIds.includes(slab.id);
              const status = slabStatuses[slab.id] || 'published';

              return (
                <div key={slab.id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleSelectOne(slab.id)} className="text-gray-400">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#C8A96A]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                      <img
                        src={slab.image}
                        alt={slab.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-250 dark:border-gray-700 shadow-sm flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{slab.name}</h4>
                        <p className="text-[10px] text-gray-400">{slab.color} • Bundle {slab.bundleNumber}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                        status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : status === 'draft'
                          ? 'bg-gray-500/10 text-gray-400'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] bg-gray-50 dark:bg-[#1A1A1F] p-3 rounded-xl">
                    <div>
                      <span className="text-gray-400 block uppercase text-[8px] font-semibold">Category</span>
                      <span className="font-semibold text-gray-850 dark:text-gray-200">{slab.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase text-[8px] font-semibold">Price</span>
                      <span className="font-bold text-[#C8A96A]">₹{slab.price ?? 150} <span className="text-gray-450 font-normal">/ sqft</span></span>
                    </div>
                    <div>
                      <span className="text-gray-400 block uppercase text-[8px] font-semibold">Origin</span>
                      <span className="font-semibold text-gray-850 dark:text-gray-200 block truncate">{slab.origin}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-150 dark:border-gray-800 pt-2 flex-wrap gap-2">
                    <span className="text-[9px] text-gray-400">Dim: {slab.dimensions}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onStartEdit(slab)}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#202026] text-gray-700 dark:text-gray-300 hover:text-[#C8A96A] text-[10px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDuplicate(slab)}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#202026] text-gray-700 dark:text-gray-300 hover:text-emerald-500 text-[10px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('Delete this product?')) {
                            setTrashBin(prev => [...prev, slab]);
                            await onDeleteSlab(slab.id);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold flex items-center gap-1 border border-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Del
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Recycle Bin / Trash Drawer */}
      {trashBin.length > 0 && (
        <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3 mb-4">
            <h4 className="font-serif-luxury text-base font-bold text-red-500 flex items-center gap-1.5">
              <Archive className="w-4 h-4" /> Recycle Bin ({trashBin.length} items)
            </h4>
            <button
              onClick={() => setTrashBin([])}
              className="text-xs font-semibold text-gray-400 hover:text-gray-200"
            >
              Empty Bin
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trashBin.map(slab => (
              <div
                key={slab.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl p-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={slab.image}
                    alt={slab.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-xs">{slab.name}</h5>
                    <p className="text-[9px] text-gray-400">{slab.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRestore(slab)}
                  className="px-2.5 py-1 bg-[#C8A96A]/10 hover:bg-[#C8A96A]/20 text-[#C8A96A] rounded-lg text-[10px] font-bold uppercase flex items-center gap-1"
                >
                  <Undo className="w-3 h-3" /> Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
