import React from 'react';
import { ProductDescriptionSection } from '../components/ProductDescriptionSection';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export const ProductDescriptionDemoPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Page Header Banner */}
      <div className="bg-stone-950 text-white px-6 py-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-1.5 text-[11px] text-stone-400 hover:text-white uppercase tracking-wider font-semibold mb-3 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Inventory
            </button>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C8A96A] mb-1">
              Product Specification Sheet · Demo Preview
            </p>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Georgia', serif" }}>
              Adunik Brown/Grey Granite
            </h1>
            <p className="text-stone-400 text-sm mt-1">
              Premium natural stone product description with responsive layout, SEO microdata, and luxury stone industry styling.
            </p>
          </div>
          <a
            href="/products"
            className="shrink-0 px-5 py-2.5 bg-[#C8A96A] text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-[#d8b97a] transition-colors shadow-lg"
          >
            Full Inventory →
          </a>
        </div>
      </div>

      {/* Embedded Product Description Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-stone-200 bg-white">
          <ProductDescriptionSection
            productName="Adunik Brown/Grey Granite"
            price="130"
            category="Granite"
            origin="South Bengalore"
            slabSize="ORIGINAL"
            thickness="15–16 mm"
            finish="Polished"
            priceRange="₹130–140 / sq.ft."
            stoneType="Granite"
            inStock={true}
            image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionDemoPage;
