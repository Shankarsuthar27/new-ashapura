import React, { useState } from 'react';
import { BLOG_ARTICLES, BlogArticle } from '../data/stoneData';
import { Clock, Calendar, User, ArrowRight, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BlogSection: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);

  return (
    <section id="journal" className="py-24 bg-[#FFFFFF] dark:bg-[#0B0B0D] text-gray-900 dark:text-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold inline-flex items-center gap-2">
            Architectural Journal & Insights
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight">
            Stone & Interior Journal
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base font-sans-luxury">
            Expert insights on stone petrography, book-matching trends, maintenance protocols, and luxury interior design ideas.
          </p>
        </div>

        {/* 3 Grid Articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_ARTICLES.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setActiveArticle(article)}
              className="group rounded-3xl overflow-hidden bg-gray-50 dark:bg-[#131316] border border-gray-200 dark:border-gray-800 hover:border-[#C8A96A]/60 transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Banner */}
              <div className="relative h-56 w-full overflow-hidden bg-black">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#C8A96A] text-black font-bold text-[10px] uppercase tracking-wider">
                  {article.category}
                </span>
                <span className="absolute bottom-4 right-4 text-xs text-white/90 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#C8A96A]" /> {article.readTime}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-sans-luxury mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C8A96A]" /> {article.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#C8A96A]" /> {article.author}
                    </span>
                  </div>

                  <h3 className="font-serif-luxury text-2xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#C8A96A] transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest font-bold text-gray-900 dark:text-gray-200 group-hover:text-[#C8A96A] transition-colors">
                    Read Article
                  </span>
                  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-[#1E1E24] group-hover:bg-[#C8A96A] group-hover:text-black flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Article Detail Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="fixed inset-0" onClick={() => setActiveArticle(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative max-w-3xl w-full bg-[#FFFFFF] dark:bg-[#121215] border border-[#C8A96A]/40 rounded-3xl overflow-hidden shadow-2xl z-10 text-gray-900 dark:text-gray-100 my-auto max-h-[85vh] flex flex-col"
            >
              {/* Top Banner */}
              <div className="relative h-64 sm:h-72 w-full shrink-0">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-black/50" />
                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="px-3 py-1 rounded-full bg-[#C8A96A] text-black font-bold text-[10px] uppercase tracking-wider">
                    {activeArticle.category}
                  </span>
                  <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold mt-2">
                    {activeArticle.title}
                  </h3>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between text-xs text-gray-500 border-b border-gray-200 dark:border-gray-800 pb-4">
                  <div>
                    <span className="font-bold text-gray-900 dark:text-gray-200">{activeArticle.author}</span>
                    <span className="block text-[11px] text-[#C8A96A]">{activeArticle.authorRole}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{activeArticle.date}</span>
                    <span>•</span>
                    <span>{activeArticle.readTime}</span>
                  </div>
                </div>

                <div className="prose dark:prose-invert text-sm leading-relaxed space-y-4 font-sans-luxury text-gray-700 dark:text-gray-300">
                  {activeArticle.content.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-wrap gap-2">
                  {activeArticle.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-md bg-gray-100 dark:bg-[#1A1A1E] text-xs text-gray-600 dark:text-gray-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
