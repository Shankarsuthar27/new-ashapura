import React, { useState, useEffect } from 'react';
import { useStone } from '../context/StoneContext';
import { STONE_CATEGORIES } from '../data/stoneData';
import {
  Search,
  Package,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router';

export const Navbar: React.FC = () => {
  const {
    darkMode,
    toggleDarkMode,
    sampleCart,
    setIsSampleDrawerOpen,
    setIsSearchOpen,
    setIsConsultationModalOpen
  } = useStone();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string, hash?: string) => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
    if (hash) {
      if (location.pathname !== path) {
        navigate(path);
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Clean & Minimal Fixed Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#0D0D0F]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 py-3.5 shadow-none'
            : 'bg-transparent py-5 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/Gemini_Generated_Image_jv5q70jv5q70jv5q.png"
              alt="Ashapura Tiles & Granite Logo"
              className="w-10 h-10 object-cover bg-white rounded-lg border border-[#C8A96A]/30 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-cinzel text-lg font-bold tracking-wider text-gray-900 dark:text-white group-hover:text-[#C8A96A] transition-colors leading-none">
                Ashapura
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#C8A96A] font-medium mt-1">
                Tiles & Granite
              </span>
            </div>
          </div>

          {/* Desktop Clean Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold uppercase tracking-widest font-sans-luxury text-gray-700 dark:text-gray-300">
            <button
              onClick={() => handleNavClick('/')}
              className={`hover:text-[#C8A96A] transition-colors ${
                isActive('/') ? 'text-[#C8A96A] font-bold' : ''
              }`}
            >
              Home
            </button>

            {/* Dropdown for Collections */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button
                onClick={() => handleNavClick('/products')}
                className={`flex items-center gap-1 hover:text-[#C8A96A] transition-colors ${
                  isActive('/products') || location.pathname.startsWith('/category')
                    ? 'text-[#C8A96A] font-bold'
                    : ''
                }`}
              >
                <span>Collections</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#C8A96A] group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {/* Minimal Collections Dropdown */}
              <AnimatePresence>
                {isMegaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full -left-4 w-64 bg-white dark:bg-[#141417] border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-gray-100 space-y-1"
                  >
                    <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-[#C8A96A] font-bold border-b border-gray-100 dark:border-white/5 mb-1">
                      Categories
                    </div>

                    {STONE_CATEGORIES.map(cat => (
                      <div
                        key={cat.id}
                        onClick={() => handleNavClick(`/category/${cat.id}`)}
                        className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1E1E24] cursor-pointer transition-colors flex items-center justify-between text-xs font-medium"
                      >
                        <span>{cat.name}</span>
                        <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-60" />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            <button
              onClick={() => handleNavClick('/', 'why-choose-us')}
              className="hover:text-[#C8A96A] transition-colors"
            >
              Choose Us
            </button>

            <button
              onClick={() => handleNavClick('/', 'showrooms')}
              className="hover:text-[#C8A96A] transition-colors"
            >
              Showrooms
            </button>

            <button
              onClick={() => handleNavClick('/admin')}
              className="hover:text-[#C8A96A] transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Minimal Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-[#C8A96A] transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-[#C8A96A] transition-colors"
              title="Theme Toggle"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Cart Box */}
            <button
              onClick={() => setIsSampleDrawerOpen(true)}
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-[#C8A96A] transition-colors"
              title="Sample Box"
            >
              <Package className="w-4 h-4" />
              {sampleCart.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C8A96A]" />
              )}
            </button>

            {/* Minimal Gold Border CTA Button */}
            <button
              onClick={() => setIsConsultationModalOpen(true)}
              className="hidden sm:inline-block border border-[#C8A96A] text-[#C8A96A] hover:bg-[#C8A96A] hover:text-black transition-all text-xs tracking-widest font-semibold uppercase px-4 py-2 rounded-lg"
            >
              Book Consultation
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-900 dark:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Minimal Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[64px] z-40 bg-white dark:bg-[#0D0D0F] border-b border-gray-200 dark:border-white/10 p-5 lg:hidden text-gray-900 dark:text-white space-y-4"
          >
            <div className="flex flex-col space-y-3 font-sans-luxury text-xs font-semibold uppercase tracking-wider">
              <button
                onClick={() => handleNavClick('/')}
                className="text-left py-2 border-b border-gray-100 dark:border-white/5 hover:text-[#C8A96A]"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('/products')}
                className="text-left py-2 border-b border-gray-100 dark:border-white/5 hover:text-[#C8A96A]"
              >
                Collections
              </button>
              <button
                onClick={() => handleNavClick('/', 'why-choose-us')}
                className="text-left py-2 border-b border-gray-100 dark:border-white/5 hover:text-[#C8A96A]"
              >
                Choose Us
              </button>
              <button
                onClick={() => handleNavClick('/admin')}
                className="text-left py-2 text-[#C8A96A] font-bold flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Panel</span>
              </button>
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsConsultationModalOpen(true);
              }}
              className="w-full py-2.5 rounded-lg border border-[#C8A96A] text-[#C8A96A] hover:bg-[#C8A96A] hover:text-black transition-all text-xs uppercase tracking-widest font-semibold"
            >
              Book Consultation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};