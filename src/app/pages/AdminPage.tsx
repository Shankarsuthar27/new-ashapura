import React, { useState } from 'react';
import { useStone } from '../context/StoneContext';
import { StoneSlab } from '../data/stoneData';
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  Package,
  Layers,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  ShieldAlert,
  Grid,
  List,
  ChevronRight,
  Boxes,
  Compass,
  LogOut,
  Upload,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminLoginPage } from './AdminLoginPage';
import { uploadProductImage, getAdminAuth, setAdminAuth } from '../lib/supabase';

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}


// Preset luxury image URLs for quick selection in the form
const PRESET_IMAGES = [
  {
    name: 'Italian White Marble',
    category: 'Marble',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Black Gold Granite',
    category: 'Granite',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Statuario Carving Floor Tile',
    category: 'Floor Tiles',
    url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Moroccan Zellige Wall Tile',
    category: 'Wall Tiles',
    url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Nordic Stone Sanitary Tub',
    category: 'Sanitary Items',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85'
  }
];

export const AdminPage: React.FC = () => {
  const { slabs, addSlab, updateSlab, deleteSlab, resetSlabsToDefault } = useStone();

  // --- ALL HOOKS MUST BE DECLARED BEFORE ANY CONDITIONAL RETURN ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getAdminAuth());
  const [activeTab, setActiveTab] = useState<'inventory' | 'add'>('inventory');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingSlab, setEditingSlab] = useState<StoneSlab | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Form State for Adding / Editing
  const initialFormState: Partial<StoneSlab> = {
    name: '',
    category: 'Floor Tiles',
    color: '',
    origin: '',
    finishes: ['Polished'],
    dimensions: '3000 x 1800 x 20 mm',
    thickness: '20 mm',
    priceTier: '$$$$',
    price: 150,
    unit: 'Per Square Foot',
    inStockSlabs: 25,
    bundleNumber: `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
    rarity: 'Signature',
    description: '',
    longDescription: '',
    image: PRESET_IMAGES[2].url,
    bookmatchImage: '',
    applications: ['Flooring', 'Bathroom Wall'],
    featured: true,
    specifications: {
      compressiveStrength: '210 MPa',
      waterAbsorption: '< 0.08%',
      density: '2.50 g/cm³',
      flexuralStrength: '40 MPa'
    }
  };

  const [formData, setFormData] = useState<Partial<StoneSlab>>(initialFormState);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are supported.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const publicUrl = await uploadProductImage(file);
      if (publicUrl) {
        setFormData(prev => ({ ...prev, image: publicUrl }));
      } else {
        // Fallback to local canvas base64 compression for offline/demo usage
        const base64Data = await compressImage(file);
        setFormData(prev => ({ ...prev, image: base64Data }));
      }
    } catch (err) {
      console.error('File read/upload error:', err);
      setUploadError('Failed to read or upload image.');
    } finally {
      setIsUploading(false);
    }
  };


  // --- AUTH GUARD (safe: all hooks already declared above) ---
  const handleLogout = () => {
    setAdminAuth(false);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }
  // -----------------------------------------------------------

  // Stats
  const totalSlabs = slabs.length;
  const tilesCount = slabs.filter(s => s.category.toLowerCase() === 'tiles').length;
  const graniteCount = slabs.filter(s => s.category.toLowerCase() === 'granite').length;
  const marbleCount = slabs.filter(s => s.category.toLowerCase() === 'marble').length;
  const totalStock = slabs.reduce((acc, s) => acc + (s.inStockSlabs || 0), 0);

  // Filtered inventory
  const filteredSlabs = slabs.filter(s => {
    if (selectedCategory !== 'All' && s.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.color.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.image || formData.price === undefined) {
      alert('Please fill out the product name, category, price, and select/upload an image.');
      return;
    }

    setIsSaving(true);

    const slabId = editingSlab
      ? editingSlab.id
      : formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36);

    const slabToSave: StoneSlab = {
      id: slabId,
      name: formData.name || 'Unnamed Stone Product',
      category: formData.category as any,
      color: formData.color || 'Custom Finish',
      origin: formData.origin || 'Imported Quarry',
      finishes: formData.finishes && formData.finishes.length > 0 ? formData.finishes : ['Polished'],
      dimensions: formData.dimensions || '3000 x 1800 x 20 mm',
      thickness: formData.thickness || '20 mm',
      priceTier: (formData.priceTier as any) || '$$$$',
      price: formData.price !== undefined && formData.price !== null ? Number(formData.price) : 150,
      unit: formData.unit || 'Per Square Foot',
      inStockSlabs: Number(formData.inStockSlabs) || 0,
      bundleNumber: formData.bundleNumber || 'LOT-101',
      rarity: (formData.rarity as any) || 'Signature',
      description: formData.description || 'Premium grade architectural surface stone tile.',
      longDescription: formData.longDescription || formData.description || 'Directly harvested and processed for luxury architectural installations.',
      image: formData.image || PRESET_IMAGES[0].url,
      bookmatchImage: formData.bookmatchImage || undefined,
      applications: formData.applications && formData.applications.length > 0 ? formData.applications : ['Flooring'],
      featured: formData.featured ?? true,
      specifications: formData.specifications || {
        compressiveStrength: '200 MPa',
        waterAbsorption: '< 0.1%',
        density: '2.6 g/cm³',
        flexuralStrength: '35 MPa'
      }
    };

    try {
      if (editingSlab) {
        await updateSlab(slabToSave);
        setEditingSlab(null);
      } else {
        await addSlab(slabToSave);
        setFormData(initialFormState);
      }
      setActiveTab('inventory');
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error saving product: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (slab: StoneSlab) => {
    setEditingSlab(slab);
    setFormData(slab);
    setActiveTab('add');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingSlab(null);
    setFormData(initialFormState);
    setActiveTab('inventory');
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#0A0A0C] text-gray-900 dark:text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Banner */}
        <div className="bg-[#111114] border border-[#C8A96A]/40 rounded-3xl p-8 sm:p-10 shadow-2xl text-white relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="relative z-10 space-y-2 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold inline-flex items-center gap-2">
              <Boxes className="w-4 h-4" /> Admin Inventory Control Portal
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold tracking-tight">
              Product & Slab Catalog Management
            </h1>
            <p className="text-gray-300 text-sm font-sans-luxury">
              Add and manage live inventory for <span className="text-[#C8A96A] font-bold">Tiles</span>, <span className="text-[#C8A96A] font-bold">Granites</span>, <span className="text-[#C8A96A] font-bold">Marbles</span>, and Exotic Stone Slabs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
            <button
              onClick={() => {
                setEditingSlab(null);
                setFormData(initialFormState);
                setActiveTab(activeTab === 'add' ? 'inventory' : 'add');
              }}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#DFBA73] via-[#C8A96A] to-[#8C6D2B] text-black text-xs font-bold uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
            >
              {activeTab === 'add' ? (
                <>
                  <List className="w-4 h-4" /> View Inventory List
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Add New Product (Tiles / Granite / Marble)
                </>
              )}
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all product inventory to default initial values?')) {
                  resetSlabsToDefault();
                }
              }}
              title="Reset inventory to default values"
              className="px-4 py-3 rounded-xl border border-gray-700 hover:border-red-500 hover:text-red-400 text-xs font-semibold text-gray-300 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reset Demo Data
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to log out of the admin panel?')) {
                  handleLogout();
                }
              }}
              title="Logout from admin panel"
              className="px-4 py-3 rounded-xl border border-gray-700 hover:border-orange-500 hover:text-orange-400 text-xs font-semibold text-gray-300 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Overview Dashboard Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-lg">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Total Catalog</p>
            <p className="font-serif-luxury text-3xl font-bold text-[#C8A96A] mt-1">{totalSlabs}</p>
            <p className="text-[10px] text-gray-400 mt-1">Live Slabs & Tiles</p>
          </div>

          <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-lg">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Tiles Collection</p>
            <p className="font-serif-luxury text-3xl font-bold text-blue-500 mt-1">{tilesCount}</p>
            <p className="text-[10px] text-gray-400 mt-1">Vitrified & Ceramic</p>
          </div>

          <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-lg">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Granites</p>
            <p className="font-serif-luxury text-3xl font-bold text-emerald-500 mt-1">{graniteCount}</p>
            <p className="text-[10px] text-gray-400 mt-1">Subterranean Hard Rock</p>
          </div>

          <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-lg">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Marbles</p>
            <p className="font-serif-luxury text-3xl font-bold text-purple-500 mt-1">{marbleCount}</p>
            <p className="text-[10px] text-gray-400 mt-1">Italian & Greek Calcite</p>
          </div>

          <div className="col-span-2 md:col-span-1 bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-lg">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Total Stock Slabs</p>
            <p className="font-serif-luxury text-3xl font-bold text-[#DFBA73] mt-1">{totalStock}</p>
            <p className="text-[10px] text-gray-400 mt-1">Ready in Warehouse</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-3">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'bg-[#C8A96A] text-black shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <List className="w-4 h-4" /> Live Inventory List ({slabs.length})
          </button>

          <button
            onClick={() => {
              if (editingSlab) cancelEdit();
              setActiveTab('add');
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'add'
                ? 'bg-[#C8A96A] text-black shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {editingSlab ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editingSlab ? `Edit "${editingSlab.name}"` : 'Add New Product (Tiles / Granite / Marble)'}
          </button>
        </div>

        {/* TAB 1: ADD / EDIT PRODUCT FORM */}
        {activeTab === 'add' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8"
          >
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <div>
                <h2 className="font-serif-luxury text-2xl font-bold text-gray-900 dark:text-white">
                  {editingSlab ? 'Edit Product Details' : 'Add New Product to Atelier Catalog'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Fill in the details below to add Floor Tiles, Wall Tiles, Granite, Marble, or Sanitary Items.
                </p>
              </div>

              {editingSlab && (
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel Editing
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Category Quick Selector */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider text-[#C8A96A] font-bold block">
                  1. Select Product Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { label: 'Floor Tiles', icon: '🧱' },
                    { label: 'Wall Tiles', icon: '🪟' },
                    { label: 'Granite', icon: '🪨' },
                    { label: 'Marble', icon: '🏛️' },
                    { label: 'Sanitary Items', icon: '🚿' }
                  ].map(({ label, icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: label as any })}
                      className={`p-4 rounded-2xl border text-sm font-bold tracking-wide transition-all text-center flex flex-col items-center gap-1.5 ${
                        formData.category === label
                          ? 'border-[#C8A96A] bg-[#C8A96A]/10 text-[#C8A96A] shadow-md ring-2 ring-[#C8A96A]/30'
                          : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1A1A1F] text-gray-700 dark:text-gray-300 hover:border-[#C8A96A]/50'
                      }`}
                    >
                      <span className="text-base">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold block">
                    Product / Slab Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Statuario Carving Tile or Black Galaxy Granite"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold block">
                    Color & Veining Tone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pure White & Gold Veins"
                    value={formData.color || ''}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>


                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold block">
                    In-Stock Quantity (Slabs / Boxes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50"
                    value={formData.inStockSlabs ?? 25}
                    onChange={e => setFormData({ ...formData, inStockSlabs: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold block">
                    Product Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 150"
                    value={formData.price ?? ''}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold block">
                    Pricing Unit
                  </label>
                  <select
                    value={formData.unit || 'Per Square Foot'}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:border-[#C8A96A] focus:outline-none"
                  >
                    <option value="Per Square Foot">Per Square Foot (sq.ft.)</option>
                    <option value="Per Box">Per Box</option>
                    <option value="Per Piece">Per Piece</option>
                    <option value="Per Slab">Per Slab</option>
                  </select>
                </div>


                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold block">
                    Dimensions (e.g. 1200 x 1800 x 9 mm)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3200 x 1950 x 20 mm"
                    value={formData.dimensions || ''}
                    onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold block">
                    Thickness Options
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9 mm / 12 mm / 20 mm"
                    value={formData.thickness || ''}
                    onChange={e => setFormData({ ...formData, thickness: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold block">
                    Lot / Bundle Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LOT-8840"
                    value={formData.bundleNumber || ''}
                    onChange={e => setFormData({ ...formData, bundleNumber: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Upload Zone */}
              <div className="space-y-4 border-t border-b border-gray-200 dark:border-gray-800 py-6">
                <label className="text-xs uppercase tracking-wider text-[#C8A96A] font-bold block">
                  Product High-Resolution Image *
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-3">
                    {formData.image ? (
                      <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1A1A1F] p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={formData.image}
                            alt="Uploaded"
                            className="w-16 h-16 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm shrink-0"
                            onError={e => {
                              (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                            }}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">Image successfully uploaded</p>
                            <p className="text-[10px] text-emerald-500 font-semibold">Ready to publish</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors shadow-sm"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <label className="group flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-[#C8A96A]/60 rounded-3xl bg-gray-50 dark:bg-[#1A1A1F]/30 hover:bg-gray-50/50 dark:hover:bg-[#1A1A1F]/60 cursor-pointer transition-all duration-300 min-h-[160px] text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className="hidden"
                          />
                          
                          {isUploading ? (
                            <div className="space-y-2">
                              <Loader2 className="w-8 h-8 mx-auto text-[#C8A96A] animate-spin" />
                              <p className="text-xs font-bold text-gray-600 dark:text-gray-400">Processing & uploading image...</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="w-12 h-12 rounded-2xl bg-[#C8A96A]/10 text-[#C8A96A] flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-105">
                                <Upload className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                  Drag & drop or <span className="text-[#C8A96A] hover:underline">browse file</span>
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1 font-medium">Supports JPG, PNG, WEBP (Max 5MB)</p>
                              </div>
                            </div>
                          )}
                        </label>
                      </div>
                    )}

                    {uploadError && (
                      <div className="flex items-center gap-1.5 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{uploadError}</span>
                      </div>
                    )}


                  </div>

                  {/* Image Preview Box */}
                  <div className="bg-gray-100 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center min-h-[160px] relative overflow-hidden">
                    {formData.image ? (
                      <div className="space-y-2 w-full">
                        <img
                          src={formData.image}
                          alt="Product Preview"
                          className="w-full h-40 object-cover rounded-xl shadow-md border border-gray-200 dark:border-gray-800"
                        />
                        <p className="text-[11px] text-gray-400">High-Resolution Live Preview</p>
                      </div>
                    ) : (
                      <div className="text-gray-400 space-y-1">
                        <ImageIcon className="w-8 h-8 mx-auto text-gray-400 opacity-60" />
                        <p className="text-xs font-semibold">Image Preview Zone</p>
                        <p className="text-[10px] opacity-60">Upload an image to preview here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>


              {/* Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold block">
                    Short Tagline / Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description for catalog view..."
                    value={formData.description || ''}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold block">
                    Detailed Specification Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Full geological origin details, interior design recommendations..."
                    value={formData.longDescription || ''}
                    onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#DFBA73] via-[#C8A96A] to-[#8C6D2B] text-black font-bold text-xs uppercase tracking-widest shadow-xl hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{editingSlab ? 'Save Changes' : 'Publish Product to Live Inventory'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* TAB 2: INVENTORY TABLE */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Search & Category Filter Bar */}
            <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {['All', 'Floor Tiles', 'Wall Tiles', 'Granite', 'Marble', 'Sanitary Items'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#C8A96A] text-black shadow-md'
                        : 'bg-gray-100 dark:bg-[#1A1A1F] text-gray-600 dark:text-gray-300 hover:border-[#C8A96A]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name, color..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-800 rounded-xl pl-11 pr-4 py-2 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
                />
              </div>
            </div>

            {/* Inventory List Table */}
            <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-[#17171C] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="py-4 px-6">Product</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Origin & Dimensions</th>
                      <th className="py-4 px-4">Price</th>
                      <th className="py-4 px-4 text-center">In Stock</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800 font-sans-luxury">
                    {filteredSlabs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400">
                          No products found matching your search filters.
                        </td>
                      </tr>
                    ) : (
                      filteredSlabs.map(slab => (
                        <tr key={slab.id} className="hover:bg-gray-50/50 dark:hover:bg-[#1A1A20] transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <img
                                src={slab.image}
                                alt={slab.name}
                                className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0"
                              />
                              <div>
                                <p className="font-bold text-sm text-gray-900 dark:text-white hover:text-[#C8A96A] transition-colors">
                                  {slab.name}
                                </p>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                  {slab.color} • {slab.rarity}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                slab.category === 'Tiles'
                                  ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30'
                                  : slab.category === 'Granite'
                                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                                  : slab.category === 'Marble'
                                  ? 'bg-purple-500/10 text-purple-500 border border-purple-500/30'
                                  : 'bg-[#C8A96A]/10 text-[#C8A96A] border border-[#C8A96A]/30'
                              }`}
                            >
                              {slab.category}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                            <p className="text-[10px] text-gray-400">{slab.dimensions}</p>
                          </td>

                          <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                            <p className="font-bold text-[#C8A96A]">
                              {slab.price !== undefined && slab.price !== null ? `₹${slab.price}` : '—'}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {slab.unit || 'Per Square Foot'}
                            </p>
                          </td>

                          <td className="py-4 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                                slab.inStockSlabs > 0
                                  ? 'bg-green-500/10 text-green-500'
                                  : 'bg-red-500/10 text-red-500'
                              }`}
                            >
                              {slab.inStockSlabs} {slab.category === 'Tiles' ? 'boxes' : 'slabs'}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => startEdit(slab)}
                                title="Edit Product"
                                className="p-2 rounded-lg bg-gray-100 dark:bg-[#202026] text-gray-700 dark:text-gray-300 hover:text-[#C8A96A] hover:border-[#C8A96A] transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {deleteConfirmId === slab.id ? (
                                <div className="flex items-center gap-1 bg-red-500/10 p-1 rounded-lg border border-red-500/30">
                                  <button
                                    disabled={isDeleting === slab.id}
                                    onClick={async () => {
                                      setIsDeleting(slab.id);
                                      try {
                                        await deleteSlab(slab.id);
                                        setDeleteConfirmId(null);
                                      } catch (err) {
                                        console.error('Delete failed:', err);
                                        alert(err instanceof Error ? err.message : String(err));
                                      } finally {
                                        setIsDeleting(null);
                                      }
                                    }}
                                    className="px-2 py-1 bg-red-600 text-white font-bold text-[10px] rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                                  >
                                    {isDeleting === slab.id && <Loader2 className="w-3 h-3 animate-spin" />}
                                    {isDeleting === slab.id ? 'Deleting...' : 'Confirm Delete'}
                                  </button>
                                  <button
                                    disabled={isDeleting === slab.id}
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="p-1 text-gray-400 hover:text-white disabled:opacity-50"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirmId(slab.id)}
                                  title="Delete Product"
                                  className="p-2 rounded-lg bg-gray-100 dark:bg-[#202026] text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
