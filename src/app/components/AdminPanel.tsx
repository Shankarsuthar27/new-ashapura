import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Plus, Trash2, ShieldCheck, Package, Tag, DollarSign,
  Image as ImageIcon, Layers, ChevronDown, CheckCircle,
  RotateCcw, Pencil, Save, XCircle, Eye, EyeOff, Lock, User, LogOut,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { Product } from '../data/products';

/* ─────────── Auth config ─────────── */
const ADMIN_USERNAME = 'admin2233';
const ADMIN_PASSWORD = 'admin@2233';
const AUTH_SESSION_KEY = 'admin_authenticated';

/* ─────────── Types ─────────── */
interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Smartphones', 'Laptops', 'Smart TVs', 'Accessories', 'Wearables', 'Tablets', 'Smart Watches'];
const UNDO_DURATION = 10;

const emptyForm = {
  name: '',
  price: '',
  originalPrice: '',
  discount: '',
  category: '',
  brand: '',
  image: '',
  features: '',
};

type FormState = typeof emptyForm;

interface UndoState {
  product: Product;
  timeoutId: ReturnType<typeof setTimeout>;
  intervalId: ReturnType<typeof setInterval>;
  secondsLeft: number;
}

type Toast = { id: number; message: string };

/* ─────────── Helpers ─────────── */
function productToForm(p: Product): FormState {
  return {
    name: p.name,
    price: String(p.price),
    originalPrice: String(p.originalPrice),
    discount: String(p.discount),
    category: p.category,
    brand: p.brand,
    image: p.image,
    features: (p.features ?? []).join('\n'),
  };
}

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 600;
        let { width, height } = img;
        if (width > height) {
          if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
        } else {
          if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = (error) => reject(error);
  });
};

/* ─────────── Login Screen ─────────── */
function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      triggerShake();
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_SESSION_KEY, '1');
      onSuccess();
    } else {
      setError('Invalid username or password.');
      setLoading(false);
      triggerShake();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-center px-6 py-8"
    >
      {/* Shield icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        className="w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6"
      >
        <Lock className="w-9 h-9 text-orange-400" />
      </motion.div>

      <h3 className="text-white font-bold text-2xl mb-1">Admin Access</h3>
      <p className="text-gray-500 text-sm text-center mb-8">Sign in to manage products and catalogue</p>

      <motion.div
        animate={shake ? { x: [-12, 12, -10, 10, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex flex-col gap-4"
      >
        {/* Username */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3 h-3" /> Username
          </label>
          <input
            type="text"
            value={username}
            onChange={e => { setUsername(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            placeholder="Enter your username"
            autoComplete="off"
            className="bg-gray-800/80 border border-gray-700 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> Password
          </label>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter your password"
              autoComplete="off"
              className="w-full bg-gray-800/80 border border-gray-700 focus:border-orange-500 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPwd(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 -mt-1"
            >
              <span className="text-red-400 text-xs">✕</span>
              <p className="text-red-400 text-xs font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign in button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-400 disabled:opacity-60 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/30 mt-1"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Sign In to Admin Panel
            </>
          )}
        </button>
      </motion.div>

      <p className="text-gray-600 text-xs mt-10 text-center">
        Restricted access · Authorised personnel only
      </p>
    </motion.div>
  );
}

/* ─────────── Field ─────────── */
interface FieldProps {
  label: string;
  field: keyof FormState;
  placeholder: string;
  type?: string;
  icon: React.ElementType;
  form: FormState;
  setForm: (f: FormState) => void;
  errors: Partial<FormState>;
  setErrors: (e: Partial<FormState>) => void;
}
function Field({ label, field, placeholder, type = 'text', icon: Icon, form, setForm, errors, setErrors }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
        <Icon className="w-3 h-3" /> {label}
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={e => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: '' }); }}
        placeholder={placeholder}
        className={`bg-gray-800/80 border rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-all
          ${errors[field] ? 'border-red-500' : 'border-gray-700 focus:border-orange-500'}`}
      />
      {errors[field] && <p className="text-xs text-red-400">{errors[field]}</p>}
    </div>
  );
}

/* ─────────── Category Select ─────────── */
interface CategorySelectProps {
  form: FormState;
  setForm: (f: FormState) => void;
  errors: Partial<FormState>;
  setErrors: (e: Partial<FormState>) => void;
}
function CategorySelect({ form, setForm, errors, setErrors }: CategorySelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
        <Layers className="w-3 h-3" /> Category
      </label>
      <div className="relative">
        <select
          value={form.category}
          onChange={e => { setForm({ ...form, category: e.target.value }); setErrors({ ...errors, category: '' }); }}
          className={`w-full appearance-none bg-gray-800/80 border rounded-xl px-3 py-2 text-sm text-white outline-none transition-all pr-8
            ${errors.category ? 'border-red-500' : 'border-gray-700 focus:border-orange-500'}`}
        >
          <option value="">Select a category…</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
      {errors.category && <p className="text-xs text-red-400">{errors.category}</p>}
    </div>
  );
}

/* ─────────── Image Field ─────────── */
interface ImageFieldProps {
  form: FormState;
  setForm: (f: FormState) => void;
  errors: Partial<FormState>;
  setErrors: (e: Partial<FormState>) => void;
}
function ImageField({ form, setForm, errors, setErrors }: ImageFieldProps) {
  const [mode, setMode] = useState<'url' | 'upload'>(form.image.startsWith('data:') ? 'upload' : 'url');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMode(form.image.startsWith('data:') ? 'upload' : 'url');
  }, [form.image]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      setForm({ ...form, image: compressed });
      setErrors({ ...errors, image: '' });
    } catch {
      setErrors({ ...errors, image: 'Failed to process image file.' });
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const switchToUrl = () => {
    setMode('url');
    if (form.image.startsWith('data:')) setForm({ ...form, image: '' });
  };

  const switchToUpload = () => {
    setMode('upload');
    if (!form.image.startsWith('data:')) setForm({ ...form, image: '' });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
        <ImageIcon className="w-3 h-3" /> Product Image
      </label>

      {/* Toggle */}
      <div className="flex bg-gray-800/60 rounded-lg p-0.5 border border-gray-700 w-fit mb-0.5">
        <button type="button" onClick={switchToUrl}
          className={`px-4 py-1.5 rounded text-xs font-semibold transition-all ${mode === 'url' ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
          🌐 Web URL
        </button>
        <button type="button" onClick={switchToUpload}
          className={`px-4 py-1.5 rounded text-xs font-semibold transition-all ${mode === 'upload' ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
          📁 Upload File
        </button>
      </div>

      {mode === 'url' ? (
        <input
          type="text"
          value={form.image.startsWith('data:') ? '' : form.image}
          onChange={e => { setForm({ ...form, image: e.target.value }); setErrors({ ...errors, image: '' }); }}
          placeholder="https://images.unsplash.com/photo-..."
          className={`bg-gray-800/80 border rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-all
            ${errors.image ? 'border-red-500' : 'border-gray-700 focus:border-orange-500'}`}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          {form.image.startsWith('data:') ? (
            <div className="flex items-center justify-between bg-gray-800/80 border border-green-600/40 rounded-xl px-3 py-2">
              <div className="flex items-center gap-3 overflow-hidden">
                <img src={form.image} alt="Uploaded" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-700" />
                <div>
                  <p className="text-xs text-white font-medium">Image uploaded ✓</p>
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-orange-400 hover:text-orange-300 underline">Change image</button>
                </div>
              </div>
              <button type="button" onClick={() => setForm({ ...form, image: '' })}
                className="text-xs text-red-400 hover:text-red-300 font-semibold ml-2 flex-shrink-0">Remove</button>
            </div>
          ) : (
            <button type="button" disabled={loading} onClick={() => fileInputRef.current?.click()}
              className={`w-full py-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all
                ${errors.image ? 'border-red-500 bg-red-500/5 text-red-400' : 'border-gray-600 hover:border-orange-500 bg-gray-800/30 text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-medium">Processing image…</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-6 h-6 opacity-60" />
                  <span className="text-xs font-medium">Click to choose an image from your device</span>
                  <span className="text-xs opacity-50">PNG, JPG, WEBP — auto-compressed</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {mode === 'url' && form.image && !form.image.startsWith('data:') && (
        <div className="mt-1 rounded-xl overflow-hidden border border-gray-700 h-28 bg-gray-800/40">
          <img src={form.image} alt="URL preview" className="w-full h-full object-cover"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}

      {errors.image && <p className="text-xs text-red-400 mt-0.5">{errors.image}</p>}
    </div>
  );
}

/* ─────────── Main AdminPanel ─────────── */
export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { products, addProduct, removeProduct, updateProduct } = useProducts();
  const [tab, setTab] = useState<'manage' | 'add'>('manage');

  // ── Auth ──
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(AUTH_SESSION_KEY) === '1'
  );

  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(sessionStorage.getItem(AUTH_SESSION_KEY) === '1');
    }
  }, [isOpen]);

  const handleSignOut = () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setIsAuthenticated(false);
  };

  // ── Add form ──
  const [addForm, setAddForm] = useState<FormState>(emptyForm);
  const [addErrors, setAddErrors] = useState<Partial<FormState>>({});

  // ── Edit state ──
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [editErrors, setEditErrors] = useState<Partial<FormState>>({});

  // ── Delete / Undo ──
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [undoState, setUndoState] = useState<UndoState | null>(null);

  // ── UI ──
  const [search, setSearch] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const toastIdRef = useRef(0);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (editingId) setEditingId(null); else onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, editingId]);

  useEffect(() => {
    if (!isOpen && undoState) {
      clearTimeout(undoState.timeoutId);
      clearInterval(undoState.intervalId);
      setUndoState(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const pushToast = (message: string) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const clearUndo = useCallback(() => {
    setUndoState(prev => {
      if (prev) { clearTimeout(prev.timeoutId); clearInterval(prev.intervalId); }
      return null;
    });
  }, []);

  const handleRemove = (id: number) => {
    const product = products.find(x => x.id === id);
    if (!product) return;
    clearUndo();
    removeProduct(id);
    setConfirmDelete(null);
    setEditingId(null);
    let secondsLeft = UNDO_DURATION;
    const intervalId = setInterval(() => {
      setUndoState(prev => {
        if (!prev) return null;
        const next = prev.secondsLeft - 1;
        if (next <= 0) { clearInterval(prev.intervalId); return null; }
        return { ...prev, secondsLeft: next };
      });
    }, 1000);
    const timeoutId = setTimeout(() => { clearInterval(intervalId); setUndoState(null); }, UNDO_DURATION * 1000);
    setUndoState({ product, timeoutId, intervalId, secondsLeft });
  };

  const handleUndo = () => {
    if (!undoState) return;
    clearTimeout(undoState.timeoutId);
    clearInterval(undoState.intervalId);
    addProduct(undoState.product);
    setUndoState(null);
    pushToast(`"${undoState.product.name}" restored!`);
  };

  const validateForm = (form: FormState, setErr: (e: Partial<FormState>) => void): boolean => {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Valid sale price is required';
    if (!form.originalPrice || isNaN(Number(form.originalPrice)) || Number(form.originalPrice) <= 0) errs.originalPrice = 'Valid original price is required';
    if (!form.category) errs.category = 'Please select a category';
    if (!form.brand.trim()) errs.brand = 'Brand is required';
    if (!form.image.trim()) errs.image = 'Please add an image URL or upload a file';
    setErr(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = () => {
    if (!validateForm(addForm, setAddErrors)) return;
    const maxId = products.reduce((m, p) => Math.max(m, p.id), 0);
    const name = addForm.name.trim();
    addProduct({
      id: maxId + 1,
      name,
      price: Number(addForm.price),
      originalPrice: Number(addForm.originalPrice),
      discount: addForm.discount
        ? Number(addForm.discount)
        : Math.round((1 - Number(addForm.price) / Number(addForm.originalPrice)) * 100),
      category: addForm.category,
      brand: addForm.brand.trim(),
      image: addForm.image.trim(),
      features: addForm.features.split('\n').map(f => f.trim()).filter(Boolean),
    });
    setAddForm(emptyForm);
    setAddErrors({});
    pushToast(`"${name}" added!`);
    setTab('manage');
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm(productToForm(product));
    setEditErrors({});
    setConfirmDelete(null);
  };

  const cancelEdit = () => { setEditingId(null); setEditErrors({}); };

  const handleSave = () => {
    if (!validateForm(editForm, setEditErrors)) return;
    updateProduct({
      id: editingId!,
      name: editForm.name.trim(),
      price: Number(editForm.price),
      originalPrice: Number(editForm.originalPrice),
      discount: editForm.discount
        ? Number(editForm.discount)
        : Math.round((1 - Number(editForm.price) / Number(editForm.originalPrice)) * 100),
      category: editForm.category,
      brand: editForm.brand.trim(),
      image: editForm.image.trim(),
      features: editForm.features.split('\n').map(f => f.trim()).filter(Boolean),
    });
    pushToast(`"${editForm.name.trim()}" updated!`);
    setEditingId(null);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const progressPct = undoState ? (undoState.secondsLeft / UNDO_DURATION) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Toast stack */}
          <div className="fixed top-24 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
              {toasts.map(t => (
                <motion.div key={t.id}
                  initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium pointer-events-auto bg-green-600 text-white"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" /> {t.message}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Undo banner */}
          <AnimatePresence>
            {undoState && (
              <motion.div key="undo"
                initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 80 }}
                transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[250] w-[min(480px,calc(100vw-2rem))]"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl"
                  style={{ background: 'linear-gradient(135deg,#1a1a1a,#0f0f0f)' }}>
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-orange-500 rounded-full origin-left"
                    initial={{ scaleX: 1 }} animate={{ scaleX: progressPct / 100 }}
                    transition={{ duration: 0.9, ease: 'linear' }} style={{ width: '100%' }}
                  />
                  <div className="flex items-center gap-4 px-5 py-4">
                    <img src={undoState.product.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-gray-700" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">"{undoState.product.name}" deleted</p>
                      <p className="text-gray-400 text-xs mt-0.5">Removed from all pages · {undoState.secondsLeft}s to undo</p>
                    </div>
                    <button onClick={handleUndo}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/30 flex-shrink-0">
                      <RotateCcw className="w-4 h-4" /> Undo
                    </button>
                    <button onClick={clearUndo}
                      className="w-7 h-7 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors flex-shrink-0">
                      <X className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Backdrop */}
          <motion.div ref={overlayRef}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[110] w-full max-w-lg flex flex-col"
            style={{ background: 'linear-gradient(135deg,#0f0f0f 0%,#1a1a1a 100%)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg leading-tight">Admin Panel</h2>
                  <p className="text-gray-500 text-xs">
                    {isAuthenticated ? `${products.length} products in catalogue` : 'Authentication required'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAuthenticated && (
                  <button onClick={handleSignOut} title="Sign out"
                    className="w-8 h-8 rounded-full bg-gray-800 hover:bg-red-600/30 flex items-center justify-center transition-colors group">
                    <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                  </button>
                )}
                <button onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Auth gate */}
            {!isAuthenticated && (
              <LoginScreen onSuccess={() => setIsAuthenticated(true)} />
            )}

            {/* Authenticated content */}
            {isAuthenticated && (
              <>
                {/* Tabs */}
                <div className="flex mx-6 mt-4 bg-gray-800/60 rounded-xl p-1 gap-1 flex-shrink-0">
                  {(['manage', 'add'] as const).map(t => (
                    <button key={t} onClick={() => { setTab(t); setEditingId(null); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                        ${tab === t ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-400 hover:text-white'}`}>
                      {t === 'manage' ? <Package className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {t === 'manage' ? 'Manage Products' : 'Add Product'}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <AnimatePresence mode="wait">

                    {/* ══ MANAGE TAB ══ */}
                    {tab === 'manage' ? (
                      <motion.div key="manage" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3">
                        <input type="text" placeholder="Search products…" value={search}
                          onChange={e => setSearch(e.target.value)}
                          className="bg-gray-800 border border-gray-700 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all"
                        />

                        {filtered.length === 0 && (
                          <div className="text-center py-12 text-gray-500">
                            <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No products found</p>
                          </div>
                        )}

                        <AnimatePresence>
                          {filtered.map(product => (
                            <motion.div key={product.id} layout
                              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, height: 0 }}
                              className="bg-gray-800/60 border border-gray-700/50 rounded-2xl overflow-hidden transition-all hover:border-orange-500/20"
                            >
                              <div className="flex items-center gap-3 p-3">
                                <img src={product.image} alt={product.name}
                                  className="w-14 h-14 object-cover rounded-xl flex-shrink-0 bg-gray-700" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-semibold truncate">{product.name}</p>
                                  <p className="text-gray-400 text-xs">{product.brand} · {product.category}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-orange-400 text-sm font-bold">₹{product.price}</span>
                                    <span className="text-gray-600 text-xs line-through">₹{product.originalPrice}</span>
                                    <span className="text-green-400 text-xs font-medium">{product.discount}% off</span>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1.5 flex-shrink-0">
                                  {editingId === product.id ? (
                                    <button onClick={cancelEdit}
                                      className="w-8 h-8 rounded-xl bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all" title="Cancel edit">
                                      <XCircle className="w-4 h-4 text-gray-300" />
                                    </button>
                                  ) : (
                                    <button onClick={() => startEdit(product)}
                                      className="w-8 h-8 rounded-xl bg-blue-600/30 hover:bg-blue-500 flex items-center justify-center transition-all" title="Edit product">
                                      <Pencil className="w-4 h-4 text-blue-300 hover:text-white" />
                                    </button>
                                  )}
                                  {confirmDelete === product.id ? (
                                    <div className="flex gap-1">
                                      <button onClick={() => setConfirmDelete(null)}
                                        className="text-xs px-1.5 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600">✕</button>
                                      <button onClick={() => handleRemove(product.id)}
                                        className="text-xs px-1.5 py-1 rounded-lg bg-red-600 text-white hover:bg-red-500">✓</button>
                                    </div>
                                  ) : (
                                    <button onClick={() => { setConfirmDelete(product.id); setEditingId(null); }}
                                      className="w-8 h-8 rounded-xl bg-red-600/20 hover:bg-red-600 flex items-center justify-center transition-all" title="Delete product">
                                      <Trash2 className="w-4 h-4 text-red-400 hover:text-white" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Inline edit form */}
                              <AnimatePresence>
                                {editingId === product.id && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden border-t border-gray-700/60"
                                  >
                                    <div className="p-4 flex flex-col gap-3">
                                      <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                                        <Pencil className="w-3 h-3" /> Editing product
                                      </p>
                                      <Field label="Name" field="name" placeholder="Product name" icon={Package}
                                        form={editForm} setForm={setEditForm} errors={editErrors} setErrors={setEditErrors} />
                                      <div className="grid grid-cols-2 gap-2">
                                        <Field label="Sale Price ($)" field="price" placeholder="999" type="number" icon={DollarSign}
                                          form={editForm} setForm={setEditForm} errors={editErrors} setErrors={setEditErrors} />
                                        <Field label="Orig. Price ($)" field="originalPrice" placeholder="1199" type="number" icon={DollarSign}
                                          form={editForm} setForm={setEditForm} errors={editErrors} setErrors={setEditErrors} />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <Field label="Discount %" field="discount" placeholder="Auto" type="number" icon={Tag}
                                          form={editForm} setForm={setEditForm} errors={editErrors} setErrors={setEditErrors} />
                                        <Field label="Brand" field="brand" placeholder="e.g. Apple" icon={Tag}
                                          form={editForm} setForm={setEditForm} errors={editErrors} setErrors={setEditErrors} />
                                      </div>
                                      <CategorySelect form={editForm} setForm={setEditForm} errors={editErrors} setErrors={setEditErrors} />
                                      <ImageField form={editForm} setForm={setEditForm} errors={editErrors} setErrors={setEditErrors} />
                                      <div className="flex flex-col gap-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Features (one per line)</label>
                                        <textarea rows={3} value={editForm.features}
                                          onChange={e => setEditForm({ ...editForm, features: e.target.value })}
                                          className="bg-gray-800/80 border border-gray-700 focus:border-orange-500 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-all resize-none" />
                                      </div>
                                      <div className="flex gap-2">
                                        <button onClick={handleSave}
                                          className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20">
                                          <Save className="w-4 h-4" /> Save Changes
                                        </button>
                                        <button onClick={cancelEdit}
                                          className="px-4 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-semibold transition-all">
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>

                    ) : (
                      /* ══ ADD TAB ══ */
                      <motion.div key="add" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-4">
                        <p className="text-gray-500 text-sm">Fill in all fields below to add a new product to the catalogue.</p>

                        <Field label="Product Name" field="name" placeholder="e.g. iPhone 16 Pro Max" icon={Package}
                          form={addForm} setForm={setAddForm} errors={addErrors} setErrors={setAddErrors} />

                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Sale Price ($)" field="price" placeholder="999" type="number" icon={DollarSign}
                            form={addForm} setForm={setAddForm} errors={addErrors} setErrors={setAddErrors} />
                          <Field label="Original Price ($)" field="originalPrice" placeholder="1199" type="number" icon={DollarSign}
                            form={addForm} setForm={setAddForm} errors={addErrors} setErrors={setAddErrors} />
                        </div>

                        <Field label="Discount % (optional — auto-calculated if blank)" field="discount" placeholder="e.g. 15" type="number" icon={Tag}
                          form={addForm} setForm={setAddForm} errors={addErrors} setErrors={setAddErrors} />

                        <CategorySelect form={addForm} setForm={setAddForm} errors={addErrors} setErrors={setAddErrors} />

                        <Field label="Brand" field="brand" placeholder="e.g. Apple" icon={Tag}
                          form={addForm} setForm={setAddForm} errors={addErrors} setErrors={setAddErrors} />

                        <ImageField form={addForm} setForm={setAddForm} errors={addErrors} setErrors={setAddErrors} />

                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Features (one per line)</label>
                          <textarea rows={4} value={addForm.features}
                            onChange={e => setAddForm({ ...addForm, features: e.target.value })}
                            placeholder={"6.7\" Display\nA18 Pro chip\n48MP Main camera\nTitanium design"}
                            className="bg-gray-800 border border-gray-700 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all resize-none"
                          />
                        </div>

                        {/* Live preview card */}
                        {(addForm.name || addForm.image || addForm.price) && (
                          <div className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-800/40">
                            <div className="relative h-32 bg-gray-700/50 flex items-center justify-center overflow-hidden">
                              {addForm.image ? (
                                <img src={addForm.image} alt="preview" className="w-full h-full object-cover"
                                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                              ) : (
                                <ImageIcon className="w-10 h-10 text-gray-600" />
                              )}
                              {addForm.category && (
                                <span className="absolute top-2 left-2 text-xs bg-orange-500/80 text-white px-2 py-0.5 rounded-full font-medium">
                                  {addForm.category}
                                </span>
                              )}
                            </div>
                            <div className="px-4 py-3">
                              <p className="text-white font-semibold text-sm">{addForm.name || 'Product Name'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-orange-400 text-sm font-bold">{addForm.price ? `₹${addForm.price}` : '₹—'}</p>
                                {addForm.originalPrice && <p className="text-gray-500 text-xs line-through">₹{addForm.originalPrice}</p>}
                              </div>
                              {addForm.brand && <p className="text-gray-500 text-xs mt-0.5">{addForm.brand}</p>}
                            </div>
                          </div>
                        )}

                        <button onClick={handleAdd}
                          className="mt-1 w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/30">
                          <Plus className="w-5 h-5" /> Add Product to Catalogue
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
