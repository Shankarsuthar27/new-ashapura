import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { products as initialProducts, Product } from '../data/products';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: number) => void;
  updateProduct: (product: Product) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const STORAGE_KEY = 'app_products';
const STORAGE_VERSION_KEY = 'app_products_version';
// Bump this number whenever the Product shape changes to auto-clear stale data
const CURRENT_VERSION = '1';

function loadProducts(): Product[] {
  try {
    const version = localStorage.getItem(STORAGE_VERSION_KEY);
    const saved = localStorage.getItem(STORAGE_KEY);

    // If version mismatch or no saved data, wipe and use defaults
    if (version !== CURRENT_VERSION || !saved) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      return initialProducts;
    }

    const parsed = JSON.parse(saved) as Product[];
    // Basic sanity check — must be a non-empty array
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return initialProducts;
    }
    return parsed;
  } catch {
    // JSON.parse failed or localStorage unavailable — fall back gracefully
    return initialProducts;
  }
}

function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(loadProducts);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const removeProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct, updateProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}
