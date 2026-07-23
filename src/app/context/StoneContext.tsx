import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoneSlab, SLABS_DATA } from '../data/stoneData';
import {
  fetchSupabaseSlabs,
  addSupabaseSlab,
  updateSupabaseSlab,
  deleteSupabaseSlab,
  isSupabaseConfigured
} from '../lib/supabase';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info';
}

interface StoneContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  sampleCart: StoneSlab[];
  addSampleToCart: (slab: StoneSlab) => void;
  removeSampleFromCart: (slabId: string) => void;
  clearSampleCart: () => void;
  isSampleDrawerOpen: boolean;
  setIsSampleDrawerOpen: (open: boolean) => void;
  selectedSlabForModal: StoneSlab | null;
  setSelectedSlabForModal: (slab: StoneSlab | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info') => void;
  isConsultationModalOpen: boolean;
  setIsConsultationModalOpen: (open: boolean) => void;
  presetConsultationSlab?: StoneSlab | null;
  openConsultationWithSlab: (slab?: StoneSlab) => void;
  // Slabs / Products Management
  slabs: StoneSlab[];
  addSlab: (newSlab: StoneSlab) => Promise<void>;
  updateSlab: (updatedSlab: StoneSlab) => Promise<void>;
  deleteSlab: (id: string) => Promise<void>;
  resetSlabsToDefault: () => void;
}

const StoneContext = createContext<StoneContextType | undefined>(undefined);

const SLABS_STORAGE_KEY = 'ashapura_slabs_v3';

function loadInitialSlabs(): StoneSlab[] {
  try {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SLABS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.error('Error loading slabs from localStorage:', e);
  }
  return SLABS_DATA;
}

export const StoneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aurelia_theme');
      if (saved) return saved === 'dark';
      return true; // Default to sleek luxury dark mode
    }
    return true;
  });

  const [slabs, setSlabs] = useState<StoneSlab[]>(loadInitialSlabs);
  const [sampleCart, setSampleCart] = useState<StoneSlab[]>([]);
  const [isSampleDrawerOpen, setIsSampleDrawerOpen] = useState(false);
  const [selectedSlabForModal, setSelectedSlabForModal] = useState<StoneSlab | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [presetConsultationSlab, setPresetConsultationSlab] = useState<StoneSlab | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Supabase Initial Sync
  useEffect(() => {
    async function syncSupabaseData() {
      if (isSupabaseConfigured) {
        const remoteSlabs = await fetchSupabaseSlabs();
        if (remoteSlabs && remoteSlabs.length > 0) {
          setSlabs(remoteSlabs);
        }
      }
    }
    syncSupabaseData();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('aurelia_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('aurelia_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(SLABS_STORAGE_KEY, JSON.stringify(slabs));
      }
    } catch (e) {
      console.error('Failed to save slabs to localStorage:', e);
    }
  }, [slabs]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const addSlab = async (newSlab: StoneSlab) => {
    if (isSupabaseConfigured) {
      const success = await addSupabaseSlab(newSlab);
      if (!success) {
        throw new Error(`Failed to save ${newSlab.name} to database. See console for details.`);
      }
    }
    setSlabs(prev => [newSlab, ...prev]);
    showToast(`Added ${newSlab.name} to catalog`, 'success');
  };

  const updateSlab = async (updatedSlab: StoneSlab) => {
    if (isSupabaseConfigured) {
      const success = await updateSupabaseSlab(updatedSlab);
      if (!success) {
        throw new Error(`Failed to update ${updatedSlab.name} in database. See console for details.`);
      }
    }
    setSlabs(prev => prev.map(item => (item.id === updatedSlab.id ? updatedSlab : item)));
    showToast(`Updated ${updatedSlab.name} details`, 'success');
  };

  const deleteSlab = async (id: string) => {
    if (isSupabaseConfigured) {
      const success = await deleteSupabaseSlab(id);
      if (!success) {
        throw new Error('Failed to delete product from database. See console for details.');
      }
    }
    setSlabs(prev => prev.filter(item => item.id !== id));
    showToast('Product removed from inventory catalog', 'info');
  };

  const resetSlabsToDefault = () => {
    setSlabs(SLABS_DATA);
    try {
      localStorage.removeItem(SLABS_STORAGE_KEY);
    } catch {}
    showToast('Reset product catalog to default inventory.', 'info');
  };

  const addSampleToCart = (slab: StoneSlab) => {
    if (sampleCart.some(item => item.id === slab.id)) {
      showToast(`${slab.name} is already in your sample box.`, 'info');
      setIsSampleDrawerOpen(true);
      return;
    }
    if (sampleCart.length >= 4) {
      showToast('Maximum 4 sample chips per complimentary luxury sample box.', 'info');
      setIsSampleDrawerOpen(true);
      return;
    }
    setSampleCart(prev => [...prev, slab]);
    showToast(`Added ${slab.name} sample to your presentation box!`, 'success');
    setIsSampleDrawerOpen(true);
  };

  const removeSampleFromCart = (slabId: string) => {
    setSampleCart(prev => prev.filter(item => item.id !== slabId));
    showToast('Removed sample chip from presentation box.', 'info');
  };

  const clearSampleCart = () => {
    setSampleCart([]);
  };

  const openConsultationWithSlab = (slab?: StoneSlab) => {
    if (slab) setPresetConsultationSlab(slab);
    setIsConsultationModalOpen(true);
  };

  return (
    <StoneContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        sampleCart,
        addSampleToCart,
        removeSampleFromCart,
        clearSampleCart,
        isSampleDrawerOpen,
        setIsSampleDrawerOpen,
        selectedSlabForModal,
        setSelectedSlabForModal,
        isSearchOpen,
        setIsSearchOpen,
        toasts,
        showToast,
        isConsultationModalOpen,
        setIsConsultationModalOpen,
        presetConsultationSlab,
        openConsultationWithSlab,
        slabs,
        addSlab,
        updateSlab,
        deleteSlab,
        resetSlabsToDefault
      }}
    >
      {children}
    </StoneContext.Provider>
  );
};

export const useStone = () => {
  const context = useContext(StoneContext);
  if (!context) {
    throw new Error('useStone must be used within a StoneProvider');
  }
  return context;
};

