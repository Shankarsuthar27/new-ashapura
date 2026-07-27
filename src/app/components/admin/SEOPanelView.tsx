import React, { useState } from 'react';
import { Globe, Search, RefreshCw, CheckCircle2 } from 'lucide-react';

export const SEOPanelView: React.FC = () => {
  const [seo, setSeo] = useState({
    title: 'Ashapura Granite & Tiles | Premium Stone Atelier Jalore',
    description: 'Atelier of luxury marble, custom granite, book-matched quartzite slabs, and vitrified floor tiles sourced from premium quarry origins.',
    keywords: 'granite jalore, marble slabs, double charge tiles, sanitary products, bookmatch marble, luxury stone',
    canonical: 'https://ashapuragranite.in',
    robots: 'index, follow',
    sitemapUrl: 'https://ashapuragranite.in/sitemap.xml'
  });

  const [saved, setSaved] = useState(false);

  const handleSaveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
      {/* Configuration Form */}
      <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="font-serif-luxury text-xl font-bold flex items-center gap-1.5 border-b border-gray-200 dark:border-gray-800 pb-3">
          <Globe className="w-5 h-5 text-[#C8A96A]" /> Site-Wide Metadata Configuration
        </h3>

        <form onSubmit={handleSaveSEO} className="space-y-4 text-xs">
          <div>
            <label className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[9px]">Global Title Tag</label>
            <input
              type="text"
              value={seo.title}
              onChange={e => setSeo({ ...seo, title: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-850 rounded-xl px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[9px]">Meta Description</label>
            <textarea
              rows={3}
              value={seo.description}
              onChange={e => setSeo({ ...seo, description: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-850 rounded-xl p-3.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[9px]">SEO Focus Keywords</label>
            <input
              type="text"
              value={seo.keywords}
              onChange={e => setSeo({ ...seo, keywords: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-850 rounded-xl px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[9px]">Canonical URL</label>
              <input
                type="text"
                value={seo.canonical}
                onChange={e => setSeo({ ...seo, canonical: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-850 rounded-xl px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#C8A96A] font-mono text-[10px]"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[9px]">Robots.txt Rule</label>
              <input
                type="text"
                value={seo.robots}
                onChange={e => setSeo({ ...seo, robots: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-850 rounded-xl px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#C8A96A]"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 block mb-1 font-semibold uppercase tracking-wider text-[9px]">Sitemap XML Link</label>
            <input
              type="text"
              value={seo.sitemapUrl}
              onChange={e => setSeo({ ...seo, sitemapUrl: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#1A1A1F] border border-gray-200 dark:border-gray-850 rounded-xl px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#C8A96A] font-mono text-[10px]"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#C8A96A] hover:brightness-110 text-black font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md mt-4"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> SEO Saved
              </>
            ) : (
              'Save SEO Settings'
            )}
          </button>
        </form>
      </div>

      {/* Interactive Google Preview */}
      <div className="bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="font-serif-luxury text-xl font-bold flex items-center gap-1.5">
            <Search className="w-5 h-5 text-[#C8A96A]" /> Google Search Snippet Preview
          </h3>
          <p className="text-xs text-gray-400">
            This is how your showroom homepage will look in Google SERP results.
          </p>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 font-sans space-y-1.5 text-left text-sm max-w-md shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-[#202124]">
              <span className="bg-[#f1f3f4] p-1.5 rounded-full inline-block font-mono text-[10px]">AG</span>
              <div>
                <span className="block text-[11px] leading-tight font-medium text-[#202124]">Ashapura Granite</span>
                <span className="block text-[10px] text-[#5f6368] leading-none">https://ashapuragranite.in</span>
              </div>
            </div>
            <a
              href="#"
              className="text-[#1a0dab] hover:underline font-medium text-lg leading-tight block pt-1"
            >
              {seo.title}
            </a>
            <p className="text-[#4d5156] text-xs leading-relaxed">
              {seo.description}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 space-y-2 text-xs">
          <span className="text-gray-450 block uppercase tracking-wider text-[9px] font-bold">Metadata Optimization Tip</span>
          <p className="text-gray-500 leading-relaxed font-sans-luxury">
            Keep your titles under <strong className="text-gray-700 dark:text-gray-300">60 characters</strong> and meta descriptions under <strong className="text-gray-700 dark:text-gray-300">160 characters</strong> to ensure they do not get truncated in search result outputs.
          </p>
        </div>
      </div>
    </div>
  );
};
