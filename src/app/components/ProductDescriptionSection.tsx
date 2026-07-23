import React, { useState } from 'react';
import {
  ShieldCheck, MapPin, Layers, Award, Copy, Check,
  Calculator, ArrowRight, Share2, CheckCircle2, Gem, Ruler,
  Paintbrush, Package, Phone
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoneProductData {
  productName?: string;
  price?: string | number;
  category?: string;
  origin?: string;
  slabSize?: string;
  thickness?: string;
  finish?: string;
  priceRange?: string;
  stoneType?: string;
  customDescription?: string;
  image?: string;
  inStock?: boolean;
}

// ─── Finish Swatch Config ─────────────────────────────────────────────────────

const FINISH_SWATCHES = [
  { name: 'Polished',   bg: 'bg-gradient-to-br from-stone-200 to-stone-400', ring: 'ring-stone-600' },
  { name: 'Honed',      bg: 'bg-gradient-to-br from-stone-300 to-stone-500', ring: 'ring-stone-700' },
  { name: 'Leathered',  bg: 'bg-gradient-to-br from-amber-800  to-stone-700', ring: 'ring-amber-700' },
  { name: 'Flamed',     bg: 'bg-gradient-to-br from-stone-600  to-stone-900', ring: 'ring-stone-900' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const ProductDescriptionSection: React.FC<StoneProductData> = ({
  productName   = 'Adunik Brown/Grey Granite',
  price         = '130',
  category      = 'Granite',
  origin        = 'South Bengalore',
  slabSize      = 'ORIGINAL',
  thickness     = '15–16 mm',
  finish        = 'Polished',
  priceRange    = '₹130–140 / sq.ft.',
  stoneType     = 'Granite',
  customDescription,
  image         = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  inStock       = true,
}) => {
  const [selectedFinish, setSelectedFinish] = useState(finish);
  const [copied,          setCopied]         = useState(false);
  const [area,            setArea]           = useState(500);
  const [calcOpen,        setCalcOpen]       = useState(false);

  // Numeric price
  const numericPrice  = typeof price === 'number' ? price : parseFloat(String(price).replace(/[^0-9.]/g, '')) || 130;
  const estimatedCost = (area * numericPrice).toLocaleString('en-IN');

  // Description
  const description = customDescription ||
    `${productName} is a premium ${stoneType || category} sourced from ${origin}. Carefully selected for residential and commercial projects, it is ideal for flooring, countertops, wall cladding, staircases, and luxury interiors. Known for its durability, elegant appearance, and long-lasting performance, it enhances both modern and traditional spaces.`;

  // Spec rows
  const specs = [
    { icon: <Gem       className="w-3.5 h-3.5" />, label: 'Category',         value: category       },
    { icon: <MapPin    className="w-3.5 h-3.5" />, label: 'Origin',           value: origin         },
    { icon: <Ruler     className="w-3.5 h-3.5" />, label: 'Slab Size (H × L)', value: slabSize       },
    { icon: <Layers    className="w-3.5 h-3.5" />, label: 'Thickness',        value: thickness      },
    { icon: <Paintbrush className="w-3.5 h-3.5"/>, label: 'Finish',           value: selectedFinish },
    { icon: <Award     className="w-3.5 h-3.5" />, label: 'Approx. Price',    value: priceRange      },
  ];

  // Applications
  const applications = ['Flooring', 'Countertops', 'Wall Cladding', 'Staircases', 'Luxury Interiors', 'Pool Surrounds'];

  // Copy handler
  const handleCopy = () => {
    const text =
      `Product: ${productName}\nPrice: ₹${price} / Per Square Foot\n\n${description}\n\nSpecifications:\n` +
      specs.map(s => `${s.label}: ${s.value}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type':    'Product',
    name:       productName,
    image:      [image],
    description,
    category,
    brand:  { '@type': 'Brand', name: 'Ashapura Natural Stone' },
    offers: {
      '@type':          'Offer',
      priceCurrency:    'INR',
      price:            numericPrice,
      priceValidUntil:  '2026-12-31',
      itemCondition:    'https://schema.org/NewCondition',
      availability:     inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller:           { '@type': 'Organization', name: 'Ashapura Natural Stone Industry' },
    },
    additionalProperty: specs.map(s => ({ '@type': 'PropertyValue', name: s.label, value: s.value })),
  };

  return (
    <section
      className="w-full bg-white font-sans"
      itemScope
      itemType="https://schema.org/Product"
      aria-label={`${productName} product description`}
    >
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Gold top accent bar ───────────────────────────────────────────── */}
      <div className="h-1 w-full bg-gradient-to-r from-[#C8A96A] via-[#E6C687] to-[#C8A96A]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-16">

        {/* ── Eyebrow breadcrumb ───────────────────────────────────────────── */}
        <div className="flex items-center gap-2.5 mb-8">
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#9A7B3E]">
            Premium Natural Stone Collection
          </span>
          <span className="text-stone-300">·</span>
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-stone-400" itemProp="category">
            {category}
          </span>
        </div>

        {/* ── Main grid ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">

          {/* ════════════════════════════════════════════════════════════════
              LEFT COLUMN — Visual & Tools
          ════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-5">

            {/* Stone image card */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 shadow-2xl group aspect-[4/3]">
              <img
                src={image}
                alt={`${productName} — ${category} from ${origin}`}
                className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                itemProp="image"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />

              {/* Top badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                <span className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/15 tracking-wider uppercase">
                  <Gem className="w-3 h-3 text-[#C8A96A]" /> Direct Quarry Sourced
                </span>
                {inStock && (
                  <span className="inline-flex items-center gap-1 bg-emerald-600/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-emerald-300/20">
                    <CheckCircle2 className="w-3 h-3" /> In Stock
                  </span>
                )}
              </div>

              {/* Bottom info strip */}
              <div className="absolute bottom-0 inset-x-0 p-5 z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6C687] mb-0.5">
                  Origin · {origin}
                </p>
                <p className="text-sm text-stone-300 font-light leading-snug">
                  Precision-finished architectural slab with natural grain variation.
                </p>
              </div>
            </div>

            {/* ── Surface Finish Swatches ────────────────────────────────── */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500 flex items-center gap-1.5">
                <Paintbrush className="w-3.5 h-3.5 text-[#9A7B3E]" /> Select Surface Finish
              </p>
              <div className="grid grid-cols-4 gap-3">
                {FINISH_SWATCHES.map(sw => (
                  <button
                    key={sw.name}
                    type="button"
                    onClick={() => setSelectedFinish(sw.name)}
                    className="group flex flex-col items-center gap-2 focus:outline-none"
                    aria-pressed={selectedFinish === sw.name}
                    aria-label={`Select ${sw.name} finish`}
                  >
                    <div className={`
                      w-full aspect-square rounded-xl ${sw.bg} shadow-sm
                      transition-all duration-200
                      ${selectedFinish === sw.name
                        ? `ring-2 ${sw.ring} ring-offset-2 scale-105 shadow-md`
                        : 'border border-stone-200 group-hover:scale-105 group-hover:shadow-sm'}
                    `} />
                    <span className={`text-[10px] font-semibold tracking-wide ${
                      selectedFinish === sw.name ? 'text-stone-900' : 'text-stone-500'
                    }`}>
                      {sw.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Applications ──────────────────────────────────────────── */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#9A7B3E]" /> Architectural Applications
              </p>
              <div className="flex flex-wrap gap-2">
                {applications.map(app => (
                  <span
                    key={app}
                    className="text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-[#C8A96A]/10 hover:text-[#9A7B3E] border border-stone-200 hover:border-[#C8A96A]/40 px-3 py-1.5 rounded-lg transition-colors cursor-default"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Area Cost Estimator ───────────────────────────────────── */}
            <div className="rounded-2xl bg-stone-950 border border-stone-800 p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#E6C687] flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-[#C8A96A]" /> Area Cost Estimator
                </p>
                <button
                  type="button"
                  onClick={() => setCalcOpen(v => !v)}
                  className="text-[11px] font-semibold text-stone-400 hover:text-white underline underline-offset-2 transition-colors"
                >
                  {calcOpen ? 'Close' : 'Calculate →'}
                </button>
              </div>

              {calcOpen && (
                <div className="space-y-4 pt-1 border-t border-stone-800">
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1.5" htmlFor="area-input">
                      Required Area (sq. ft.)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        id="area-input"
                        type="number"
                        min={10}
                        max={50000}
                        step={10}
                        value={area}
                        onChange={e => setArea(Math.max(1, Number(e.target.value)))}
                        className="w-28 bg-stone-800 border border-stone-700 text-white text-sm font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#C8A96A] transition-colors"
                      />
                      <span className="text-xs text-stone-500">sq. ft.</span>
                    </div>
                  </div>
                  <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-0.5">Estimated Material Cost</p>
                      <p className="text-xl font-black text-[#E6C687] font-mono tracking-tight">₹{estimatedCost}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-stone-500">@ ₹{numericPrice}/sq.ft.</p>
                      <p className="text-[10px] text-stone-600">Excl. GST & Freight</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              RIGHT COLUMN — Product Info + Spec Table
          ════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-8">

            {/* ── Product Heading + Price ───────────────────────────────── */}
            <div className="pb-7 border-b-2 border-stone-100">
              {/* Product Name — large bold heading */}
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black text-stone-900 leading-tight tracking-tight mb-4"
                itemProp="name"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
              >
                {productName}
              </h1>

              {/* Decorative gold rule */}
              <div className="w-16 h-[3px] bg-gradient-to-r from-[#C8A96A] to-[#E6C687] rounded-full mb-5" />

              {/* Price per Square Foot — directly below title */}
              <div
                className="flex items-baseline gap-3 flex-wrap"
                itemProp="offers"
                itemScope
                itemType="https://schema.org/Offer"
              >
                <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                  ₹{price}
                </span>
                <span className="text-base font-semibold text-stone-500 uppercase tracking-[0.12em]">
                  / Per Square Foot
                </span>
                {inStock && (
                  <span className="ml-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> In Stock
                  </span>
                )}
                <meta itemProp="price" content={String(numericPrice)} />
                <meta itemProp="priceCurrency" content="INR" />
                <link itemProp="availability" href={inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'} />
              </div>
            </div>

            {/* ── Product Description ───────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-[#C8A96A] shrink-0" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9A7B3E]">
                  Architectural Product Overview
                </h2>
              </div>
              <p
                className="text-stone-700 text-base sm:text-[1.05rem] leading-[1.85] font-normal"
                itemProp="description"
              >
                {description}
              </p>
            </div>

            {/* ── Specifications Table ──────────────────────────────────── */}
            <div className="space-y-4">
              {/* Table header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-1 h-5 bg-gradient-to-b from-[#C8A96A] to-[#9A7B3E] rounded-full" />
                  <h3
                    className="text-lg font-black text-stone-900"
                    style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                  >
                    Product Specifications
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300 px-3 py-1.5 rounded-lg transition-all"
                  title="Copy specifications to clipboard"
                >
                  {copied
                    ? <><Check className="w-3.5 h-3.5 text-emerald-600" /><span className="text-emerald-700">Copied!</span></>
                    : <><Copy className="w-3.5 h-3.5" /><span>Copy Specs</span></>
                  }
                </button>
              </div>

              {/* ── Clean 2-column table with borders ──────────────────── */}
              <div className="overflow-hidden rounded-2xl border border-stone-200 shadow-sm">
                <table
                  className="w-full border-collapse text-sm"
                  aria-label={`${productName} Technical Specifications`}
                >
                  <thead>
                    <tr className="bg-gradient-to-r from-stone-900 to-stone-800 text-white">
                      <th
                        scope="col"
                        className="py-3.5 px-5 sm:px-7 text-left text-[10px] font-black uppercase tracking-[0.18em] border-r border-white/10 w-2/5"
                      >
                        Specification
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-5 sm:px-7 text-left text-[10px] font-black uppercase tracking-[0.18em] w-3/5"
                      >
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {specs.map((spec, i) => (
                      <tr
                        key={spec.label}
                        className={`
                          border-b border-stone-100 last:border-b-0
                          transition-colors hover:bg-amber-50/40
                          ${i % 2 === 0 ? 'bg-white' : 'bg-stone-50/60'}
                        `}
                      >
                        {/* Left column — bold label */}
                        <td className="py-4 px-5 sm:px-7 border-r border-stone-200 w-2/5 align-middle">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[#9A7B3E] shrink-0">{spec.icon}</span>
                            <span className="font-bold text-stone-900 text-[13px]">
                              {spec.label}
                            </span>
                          </div>
                        </td>

                        {/* Right column — value */}
                        <td className="py-4 px-5 sm:px-7 w-3/5 align-middle">
                          {spec.label === 'Approx. Price' ? (
                            <span className="font-black text-stone-900 font-mono text-[13px]">
                              {spec.value}
                            </span>
                          ) : spec.label === 'Finish' ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-gradient-to-br from-stone-300 to-stone-500 border border-stone-300 shrink-0" />
                              <span className="font-semibold text-stone-700 text-[13px]">{spec.value}</span>
                            </span>
                          ) : (
                            <span className="font-medium text-stone-700 text-[13px]">{spec.value}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── CTA Buttons ───────────────────────────────────────────── */}
            <div className="pt-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Primary CTA */}
                <a
                  href="#consultation"
                  className="group flex items-center justify-center gap-2.5 w-full py-4 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-[13px] uppercase tracking-[0.1em] shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Phone className="w-4 h-4 text-[#C8A96A]" />
                  <span>Request Wholesale Quote</span>
                  <ArrowRight className="w-4 h-4 text-[#C8A96A] group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* Secondary CTA */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2.5 w-full py-4 px-6 rounded-xl bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-stone-300 text-stone-800 font-bold text-[13px] uppercase tracking-[0.1em] transition-all duration-200"
                >
                  <Share2 className="w-4 h-4 text-stone-500" />
                  <span>Share Specification</span>
                </button>
              </div>

              {/* Sample request */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl border border-[#C8A96A]/40 bg-[#C8A96A]/5 hover:bg-[#C8A96A]/10 text-[#9A7B3E] font-semibold text-[12px] uppercase tracking-[0.1em] transition-all duration-200"
              >
                <Package className="w-4 h-4" />
                <span>Request Free Physical Sample</span>
              </button>
            </div>

            {/* ── Trust Badges ──────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[
                { icon: <ShieldCheck className="w-5 h-5 text-[#C8A96A]" />, title: '100% Inspected',    sub: 'Every slab quality-certified' },
                { icon: <MapPin       className="w-5 h-5 text-[#C8A96A]" />, title: 'Direct Origin',    sub: origin                          },
                { icon: <Award        className="w-5 h-5 text-[#C8A96A]" />, title: 'Grade A Durability', sub: 'Premium structural stone'    },
              ].map(badge => (
                <div
                  key={badge.title}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 hover:border-[#C8A96A]/30 hover:bg-amber-50/30 transition-colors"
                >
                  <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center shadow-sm">
                    {badge.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-stone-800 uppercase tracking-wide">{badge.title}</p>
                    <p className="text-[11px] text-stone-500 font-medium leading-tight mt-0.5">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── Gold bottom accent bar ────────────────────────────────────────── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C8A96A]/40 to-transparent" />
    </section>
  );
};

export default ProductDescriptionSection;
