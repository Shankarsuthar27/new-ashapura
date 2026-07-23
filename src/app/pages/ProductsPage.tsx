import React, { useState, useMemo } from 'react';
import { CatalogProduct, COLOR_HEX_MAP } from '../data/catalogData';
import { useStone } from '../context/StoneContext';
import { QuickViewModal } from '../components/QuickViewModal';
import {
  Search,
  ShoppingCart,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  PackageCheck,
  Tag,
  CheckCircle2,
  RefreshCw,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router';

const COLOR_OPTIONS = ['All Colors', 'Black', 'White', 'Brown', 'Red', 'Pink', 'Green', 'Grey', 'Blue'];
const CATEGORY_OPTIONS = ['All', 'Floor Tiles', 'Wall Tiles', 'Granite', 'Marble', 'Sanitary Items'];
const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price Low to High', value: 'price-asc' },
  { label: 'Price High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Popular', value: 'popular' }
];

export const ProductsPage: React.FC = () => {
  const { showToast, addSampleToCart, setIsConsultationModalOpen, slabs } = useStone();
  const navigate = useNavigate();
  const location = useLocation();

  // Read ?category= from URL so FeaturedCollections deep-links work
  const initialCategory = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('category') || 'All';
  }, [location.search]);

  // Convert StoneContext slabs → CatalogProduct shape (same source as category pages)
  const allProducts: CatalogProduct[] = useMemo(() => slabs.map((slab) => ({
    id: slab.id,
    slug: slab.id,
    name: slab.name,
    category: slab.category,
    color: slab.color || 'Grey',
    colorHex: COLOR_HEX_MAP[slab.color] || '#6B7280',
    price: slab.price !== undefined && slab.price !== null ? Number(slab.price) : (
           slab.priceTier === '$$$$$' ? 280 :
           slab.priceTier === '$$$$' ? 180 :
           slab.priceTier === '$$$' ? 120 :
           slab.priceTier === '$$' ? 75 : 45
    ),
    unit: slab.unit || 'Per Square Foot',
    image: slab.image,
    featured: slab.featured,
    origin: slab.origin,
    finishes: slab.finishes,
    description: slab.description,
    popularityScore: slab.inStockSlabs,
    createdDate: '2026-01-01',
    specifications: slab.specifications
  })), [slabs]);

  // State Filters — initialise category from URL param
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('All Colors');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Modal State
  const [quickViewProduct, setQuickViewProduct] = useState<CatalogProduct | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // 1. Search Query (Name or Color or Category)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchColor = product.color.toLowerCase().includes(q);
        const matchCat = product.category.toLowerCase().includes(q);
        if (!matchName && !matchColor && !matchCat) return false;
      }

      // 2. Color Filter
      if (selectedColor !== 'All Colors' && product.color.toLowerCase() !== selectedColor.toLowerCase()) {
        return false;
      }

      // 3. Category Filter
      if (selectedCategory !== 'All' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'price-asc') return a.price - b.price;
      if (selectedSort === 'price-desc') return b.price - a.price;
      if (selectedSort === 'newest') return (b.createdDate || '').localeCompare(a.createdDate || '');
      if (selectedSort === 'popular') return (b.popularityScore || 0) - (a.popularityScore || 0);
      // default: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [allProducts, searchQuery, selectedColor, selectedCategory, selectedSort]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedColor('All Colors');
    setSelectedCategory('All');
    setSelectedSort('featured');
    setCurrentPage(1);
  };

  const handleOpenQuickView = (product: CatalogProduct) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleAddToCartSample = (product: CatalogProduct) => {
    const adaptedSlab: any = {
      id: String(product.id),
      name: product.name,
      category: product.category,
      color: product.color,
      origin: product.origin || 'Imported Quarry',
      finishes: product.finishes || ['Polished'],
      dimensions: '3000 x 1800 x 20 mm',
      thickness: '20 mm',
      priceTier: '$$$$',
      inStockSlabs: 45,
      bundleNumber: `LOT-${product.id}`,
      rarity: 'Signature',
      description: product.description || '',
      longDescription: product.description || '',
      image: product.image,
      applications: ['Flooring', 'Wall Cladding'],
      specifications: product.specifications || {
        compressiveStrength: '200 MPa',
        waterAbsorption: '< 0.1%',
        density: '2.6 g/cm³',
        flexuralStrength: '35 MPa'
      }
    };
    addSampleToCart(adaptedSlab);
  };

  // Related products subset for footer section (4 products)
  const relatedProducts = useMemo(() => {
    return allProducts.filter(p => p.id !== (quickViewProduct?.id || 1)).slice(0, 4);
  }, [allProducts, quickViewProduct]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0B1F44] font-sans-luxury py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 1. PRODUCTS HEADER SECTION */}
        <div className="space-y-8">
          {/* Header Title & Tagline */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            
            <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-[#0B1F44] tracking-tight mb-20">
              Granite, Marble & Tile Collection
            </h1>
           
          </div>

          {/* Search Box (Large, Rounded Full Corners, Soft Shadow) */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by color or name..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-gray-200 rounded-full pl-14 pr-12 py-4 text-sm sm:text-base text-[#0B1F44] placeholder-gray-400 shadow-md hover:shadow-lg focus:shadow-xl focus:border-[#0B1F44] focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B1F44]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category Tabs & Sort Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-gray-200 pb-6">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              {CATEGORY_OPTIONS.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#0B1F44] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
              </span>
              <select
                value={selectedSort}
                onChange={e => setSelectedSort(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-semibold text-[#0B1F44] shadow-sm focus:border-[#0B1F44] focus:outline-none"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Color Pill Filters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                Filter By Color Tone:
              </span>
              {(selectedColor !== 'All Colors' || selectedCategory !== 'All' || searchQuery) && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-[#EF233C] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Clear Filters
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {COLOR_OPTIONS.map(color => {
                const isSelected = selectedColor === color;

                return (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'border-[#0B1F44] bg-[#0B1F44] text-white shadow-md ring-2 ring-[#0B1F44]/20'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <span>{color}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. PRODUCT GRID SECTION */}
        {paginatedProducts.length === 0 ? (
          /* Empty State UI */
          <div className="bg-gray-50 border border-gray-200 rounded-[24px] p-12 text-center space-y-4 max-w-md mx-auto my-12 shadow-sm">
            <Box className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="text-xl font-bold text-[#0B1F44]">No Stone Products Found</h3>
            <p className="text-xs text-gray-500">
              No products matched your search "{searchQuery}" or selected color filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 rounded-full bg-[#0B1F44] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-black transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {paginatedProducts.map(product => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                className="group bg-white rounded-[24px] border border-gray-200 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Image Area with 4:3 Aspect Ratio & Hover Zoom */}
                <div
                  onClick={() => handleOpenQuickView(product)}
                  className="relative aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-[#0B1F44]/90 text-white font-bold text-[10px] uppercase tracking-wider backdrop-blur-md shadow-sm">
                      {product.category}
                    </span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-gray-200 text-right">
                    <span className="text-xs font-bold text-[#EF233C] block leading-none">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-gray-500 font-semibold uppercase">
                      / {product.unit}
                    </span>
                  </div>
                </div>

                {/* Product Information */}
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Color Indicator */}
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: COLOR_HEX_MAP[product.color] || '#6B7280' }}
                      />
                      <span className="text-xs font-semibold text-gray-500">
                        {product.color} Series
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3
                      onClick={() => handleOpenQuickView(product)}
                      className="font-serif-luxury text-xl font-bold text-[#0B1F44] hover:text-[#EF233C] transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {/* Primary Button: "View" */}
                    <button
                      onClick={() => handleOpenQuickView(product)}
                      className="w-full py-3 rounded-2xl bg-[#EF233C] hover:bg-[#d90429] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:shadow-red-500/20 transition-all"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    {/* Secondary Button: "Enquire" */}
                    <a
                      href={`https://wa.me/919974617657?text=${encodeURIComponent(`Hi Ashapura Tiles & Granite, I would like to enquire about ${product.name} (${product.category}). Price: ₹${product.price}/${product.unit}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-2xl bg-white hover:bg-gray-50 border-2 border-[#0B1F44] text-[#0B1F44] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Enquire</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 3. PAGINATION */}
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 pt-8">
            <span className="text-xs text-gray-500 font-semibold">
              Showing Page <strong className="text-[#0B1F44]">{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredProducts.length} Total Slabs)
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-[#0B1F44] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === page
                      ? 'bg-[#0B1F44] text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-[#0B1F44] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 4. RELATED PRODUCTS SECTION */}
        <div className="border-t border-gray-200 pt-16 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#0B1F44]">
              Related Products
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EF233C]">
              Featured Showroom Inventory
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <div
                key={rel.id}
                className="group bg-white rounded-[20px] border border-gray-200 p-4 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div
                    onClick={() => handleOpenQuickView(rel)}
                    className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#EF233C]">
                      {rel.category}
                    </span>
                    <h4
                      onClick={() => handleOpenQuickView(rel)}
                      className="font-serif-luxury font-bold text-sm text-[#0B1F44] hover:text-[#EF233C] transition-colors cursor-pointer line-clamp-1"
                    >
                      {rel.name}
                    </h4>
                    <p className="text-xs font-bold text-gray-700 mt-1">
                      ₹{rel.price.toFixed(2)} <span className="text-[10px] text-gray-400 font-normal">/ {rel.unit}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCartSample(rel)}
                  className="mt-4 w-full py-2.5 rounded-xl bg-[#0B1F44] hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onEnquire={() => setIsConsultationModalOpen(true)}
      />
    </div>
  );
};
