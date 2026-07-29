import React, { useState, useEffect } from 'react';
import { useStone } from '../context/StoneContext';
import { StoneSlab } from '../data/stoneData';
import {
  LayoutDashboard, List, Plus, ClipboardList, ShieldAlert,
  Layers, Calendar, Users, Image as ImageIcon,
  Settings, LogOut, ChevronLeft, ChevronRight, Bell,
  Command, Menu, X, CheckCircle2,
  Trash2, Edit3, Loader2, AlertCircle, Sparkles, Folder
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminLoginPage } from './AdminLoginPage';
import { uploadProductImage, getAdminAuth, setAdminAuth } from '../lib/supabase';

// Subcomponents
import { DashboardView } from '../components/admin/DashboardView';
import { ProductManagementView } from '../components/admin/ProductManagementView';
import { InventoryView } from '../components/admin/InventoryView';
import { CategoriesBrandsView } from '../components/admin/CategoriesBrandsView';
import { ContactBookingsView } from '../components/admin/ContactBookingsView';

import { AuditLogsView } from '../components/admin/AuditLogsView';


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

const PRESET_IMAGES = [
  { name: 'Italian White Marble', category: 'Marble', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Black Gold Granite', category: 'Granite', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Statuario Carving Floor Tile', category: 'Floor Tiles', url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Moroccan Zellige Wall Tile', category: 'Wall Tiles', url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Nordic Stone Sanitary Tub', category: 'Sanitary Items', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85' }
];

export const AdminPage: React.FC = () => {
  const { slabs, addSlab, updateSlab, deleteSlab } = useStone();

  // Authentication & Navigation Tabs
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getAdminAuth());
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'inventory' | 'add' | 'stock' | 'categories' | 'bookings' | 'logs'
  >('dashboard');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  // Command Palette
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');

  // Notifications Drawer
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'n1', text: 'New consultation booking from Kabir Dev.', time: '5 mins ago', read: false },
    { id: 'n2', text: 'Low stock warning: Statuario Tiles under 5 boxes.', time: '1 hour ago', read: false },
    { id: 'n3', text: 'Daily catalog backup synced successfully.', time: '3 hours ago', read: true }
  ]);

  const [editingSlab, setEditingSlab] = useState<StoneSlab | null>(null);

  // Sample Orders (localStorage Database fallback)
  const [sampleOrders, setSampleOrders] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('ashapura_sample_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Hotkey hook for Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync sample orders
  useEffect(() => {
    if (activeTab === 'bookings') {
      try {
        const saved = localStorage.getItem('ashapura_sample_orders');
        setSampleOrders(saved ? JSON.parse(saved) : []);
      } catch (e) {
        console.error(e);
      }
    }
  }, [activeTab]);

  // Add Notification
  const triggerNotification = (text: string) => {
    setNotifications(prev => [
      { id: Math.random().toString(36).substring(2, 9), text, time: 'Just now', read: false },
      ...prev
    ]);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Are you sure you want to delete this sample order record?')) {
      const updated = sampleOrders.filter(o => o.id !== orderId);
      setSampleOrders(updated);
      try {
        localStorage.setItem('ashapura_sample_orders', JSON.stringify(updated));
        triggerNotification('Sample request deleted.');
      } catch (e) {
        console.error(e);
      }
    }
  };

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
    inStockSlabs: 0,
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
        const base64Data = await compressImage(file);
        setFormData(prev => ({ ...prev, image: base64Data }));
      }
    } catch (err) {
      console.error('File upload error:', err);
      setUploadError('Failed to read or upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    setAdminAuth(false);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

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
        triggerNotification(`Updated "${slabToSave.name}" successfully.`);
        setEditingSlab(null);
      } else {
        await addSlab(slabToSave);
        triggerNotification(`Published "${slabToSave.name}" to live inventory.`);
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
  };

  const cancelEdit = () => {
    setEditingSlab(null);
    setFormData(initialFormState);
    setActiveTab('inventory');
  };

  // Commands lookup for Ctrl+K Palette
  const navigationCommands = [
    { name: 'Dashboard Analytics', tab: 'dashboard' },
    { name: 'Live Slabs List', tab: 'inventory' },
    { name: 'Add Stone Product', tab: 'add' },
    { name: 'Stock Margin Analysis', tab: 'stock' },
    { name: 'Nested Categories & Brands', tab: 'categories' },
    { name: 'Bookings & Sample Orders', tab: 'bookings' },
    { name: 'Activity Trail Logs', tab: 'logs' }
  ];

  const filteredCommands = navigationCommands.filter(cmd =>
    cmd.name.toLowerCase().includes(commandQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0C] text-gray-900 dark:text-[#E5E5E7] flex flex-row overflow-hidden font-sans-luxury">
      
      {/* ───────────────── COLLAPSIBLE SIDEBAR ───────────────── */}
      {/* Mobile Sidebar backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 lg:relative lg:z-30 border-r border-gray-250 dark:border-gray-800/80 bg-white dark:bg-[#0F0F12] flex flex-col justify-between transition-all duration-300 shrink-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${
        isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
      } w-64`}>
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo Brand Title */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800/80 flex items-center justify-between">
            {!isSidebarCollapsed && (
              <span className="font-serif-luxury text-base font-bold tracking-tight text-[#C8A96A] truncate">
                ASHAPURA ATELIER
              </span>
            )}
            {/* Collapse button - hidden on mobile, only desktop */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 mx-auto"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            {/* Close button for mobile menu */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'inventory', label: 'Live Inventory', icon: List },
              { id: 'add', label: 'Add New Product (Tiles / Granite / Marble)', icon: Plus },
              { id: 'stock', label: 'Stock & Margin', icon: ClipboardList },
              { id: 'categories', label: 'Categories & Brands', icon: Layers },
              { id: 'bookings', label: 'Bookings & Orders', icon: Calendar },
              { id: 'logs', label: 'Activity Logs', icon: ShieldAlert }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileMenuOpen(false); // Close drawer on link click
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#C8A96A] text-black shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#15151A] hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <span className={`${isSidebarCollapsed ? 'lg:hidden' : ''} truncate`}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800/80">
          <button
            onClick={() => {
              if (confirm('Log out from Admin portal?')) {
                handleLogout();
                setIsMobileMenuOpen(false);
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all"
            title="Logout"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            <span className={`${isSidebarCollapsed ? 'lg:hidden' : ''} truncate`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* ───────────────── MAIN AREA CONTENT ───────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Sticky Header */}
        <header className="sticky top-0 bg-white/80 dark:bg-[#0A0A0C]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800/85 z-20 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Sidebar menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden text-gray-500"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 sm:px-2.5 py-1.5 rounded-xl font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portal Root Admin</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Keyboard Palette Button */}
            <button
              onClick={() => setShowCommandPalette(true)}
              className="px-2 sm:px-3 py-1.5 border border-gray-200 dark:border-gray-800 hover:border-[#C8A96A]/60 rounded-xl text-[10px] font-bold text-gray-400 dark:text-gray-400 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Command className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search Options</span>
              <kbd className="hidden sm:inline bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-[9px]">Ctrl+K</kbd>
            </button>



            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#C8A96A] text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all relative"
              >
                <Bell className="w-4.5 h-4.5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#121215] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-2xl z-40 text-xs text-left"
                    >
                      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2 mb-3">
                        <span className="font-bold text-sm">Notifications Center</span>
                        <button
                          onClick={() => {
                            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                            setShowNotifications(false);
                          }}
                          className="text-[10px] text-[#C8A96A] font-bold hover:underline"
                        >
                          Clear Unread
                        </button>
                      </div>
                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                        {notifications.map(n => (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded-xl border ${
                              n.read ? 'border-transparent bg-gray-50/50 dark:bg-[#1A1A1F]/30' : 'border-[#C8A96A]/20 bg-[#C8A96A]/5'
                            }`}
                          >
                            <p className="font-semibold text-gray-850 dark:text-gray-200 leading-tight">{n.text}</p>
                            <span className="text-[9px] text-gray-400 block mt-1">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* View Content Workspace */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <DashboardView key="dashboard" slabs={slabs} sampleRequestsCount={sampleOrders.length} />
            )}

            {activeTab === 'inventory' && (
              <ProductManagementView
                key="inventory"
                slabs={slabs}
                onStartEdit={startEdit}
                onDeleteSlab={deleteSlab}
                onAddSlab={addSlab}
                onUpdateSlab={updateSlab}
                onNavigateToAdd={() => setActiveTab('add')}
              />
            )}

            {activeTab === 'stock' && (
              <InventoryView key="stock" slabs={slabs} onUpdateSlab={updateSlab} />
            )}

            {activeTab === 'categories' && (
              <CategoriesBrandsView key="categories" />
            )}

            {activeTab === 'bookings' && (
              <ContactBookingsView
                key="bookings"
                sampleOrders={sampleOrders}
                onDeleteSampleOrder={handleDeleteOrder}
              />
            )}



            {activeTab === 'logs' && (
              <AuditLogsView key="logs" />
            )}


            {/* TAB 1: ADD / EDIT PRODUCT FORM */}
            {activeTab === 'add' && (
              <motion.div
                key="add"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8 text-left text-xs"
              >
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                  <div>
                    <h2 className="font-serif-luxury text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {editingSlab ? 'Edit Product Details' : 'Add New Product to Atelier Catalog'}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Fill in the details below to add Floor Tiles, Wall Tiles, Granite, Marble, or Sanitary Items.
                    </p>
                  </div>
                  {editingSlab && (
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-650 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Cancel Editing
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 text-gray-850 dark:text-gray-200">
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
                          className={`p-4 rounded-2xl border text-xs font-bold tracking-wide transition-all text-center flex flex-col items-center gap-1.5 ${
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
                        placeholder="e.g. White Statuario Marble or Black Galaxy Granite"
                        value={formData.name || ''}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-250 dark:border-gray-800 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
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
                        className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-250 dark:border-gray-800 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
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
                        value={formData.price !== undefined && formData.price !== null ? formData.price : ''}
                        onChange={e => {
                          const val = e.target.value;
                          setFormData({ ...formData, price: val === '' ? undefined : parseFloat(val) || 0 });
                        }}
                        className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-250 dark:border-gray-800 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold block">
                        Price Unit
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Per Square Foot"
                        value={formData.unit || ''}
                        onChange={e => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-255 dark:border-gray-800 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold block">
                        Slab Dimensions (H × L)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 3000 x 1800 x 20 mm"
                        value={formData.dimensions || ''}
                        onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-250 dark:border-gray-800 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold block">
                        Thickness
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 20 mm"
                        value={formData.thickness || ''}
                        onChange={e => setFormData({ ...formData, thickness: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-250 dark:border-gray-800 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
                      />
                    </div>
                  </div>


                  {/* Images & Details */}
                  <div className="space-y-4 border-t border-gray-200 dark:border-gray-805 pt-6">
                    <label className="text-xs uppercase tracking-wider text-[#C8A96A] font-bold block">
                      3. Media Files & Imagery
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      <div className="space-y-3">
                        {formData.image ? (
                          <div className="relative rounded-2xl overflow-hidden border border-gray-250 dark:border-gray-800 bg-gray-55 dark:bg-[#1A1A1F] p-4 flex items-center justify-between gap-4">
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
                              className="p-1.5 text-gray-400 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-250 dark:border-gray-800 rounded-3xl p-6 text-center space-y-2">
                            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
                            <div>
                              <label className="inline-block px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold text-[#C8A96A] cursor-pointer hover:bg-[#C8A96A]/10 transition-colors">
                                Upload Product Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleFileUpload}
                                  disabled={isUploading}
                                />
                              </label>
                              <p className="text-[9px] text-gray-400 mt-1">PNG, JPG or WebP up to 5MB</p>
                            </div>
                            {isUploading && <Loader2 className="w-4 h-4 animate-spin text-[#C8A96A] mx-auto" />}
                            {uploadError && <p className="text-[10px] text-red-500">{uploadError}</p>}
                          </div>
                        )}
                      </div>

                      {/* Preset quick selection images */}
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase text-gray-450 font-bold block">Or Quick Select Preset Mock Asset</label>
                        <div className="grid grid-cols-2 gap-2">
                          {PRESET_IMAGES.map((img, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setFormData({ ...formData, image: img.url })}
                              className={`flex items-center gap-2 p-2 rounded-xl border text-left text-[9px] transition-all hover:bg-gray-50 dark:hover:bg-[#1A1A1F] ${
                                formData.image === img.url ? 'border-[#C8A96A] bg-[#C8A96A]/5' : 'border-gray-200 dark:border-gray-800'
                              }`}
                            >
                              <img src={img.url} alt="" className="w-8 h-8 object-cover rounded-lg" />
                              <span className="font-bold truncate text-gray-700 dark:text-gray-300">{img.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 dark:border-gray-805 pt-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 font-semibold block">
                        Short Tagline / Summary
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Brief description for catalog view..."
                        value={formData.description || ''}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-250 dark:border-gray-800 rounded-xl p-3 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
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
                        className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-250 dark:border-gray-800 rounded-xl p-3 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#C8A96A] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Form Submit buttons */}
                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-250 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-bold uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#DFBA73] via-[#C8A96A] to-[#8C6D2B] text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md"
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
          </AnimatePresence>
        </main>
      </div>

      {/* ───────────────── COMMAND PALETTE (CTRL+K) ───────────────── */}
      <AnimatePresence>
        {showCommandPalette && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCommandPalette(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Panel Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#111114] border border-[#C8A96A]/30 w-full max-w-lg rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col text-xs text-left mx-3 sm:mx-0"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                <Command className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Type a view or category..."
                  value={commandQuery}
                  onChange={e => setCommandQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm sm:text-xs text-gray-900 dark:text-white placeholder-gray-450"
                  autoFocus
                />
                <button
                  onClick={() => setShowCommandPalette(false)}
                  className="p-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                {filteredCommands.length === 0 ? (
                  <p className="text-center py-6 text-gray-400">No matching commands found.</p>
                ) : (
                  filteredCommands.map(cmd => (
                    <button
                      key={cmd.tab}
                      onClick={() => {
                        setActiveTab(cmd.tab as any);
                        setShowCommandPalette(false);
                        setCommandQuery('');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1A1A1F] text-left text-gray-700 dark:text-gray-300 font-bold transition-all"
                    >
                      <span>{cmd.name}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
