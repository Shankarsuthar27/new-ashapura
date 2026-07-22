import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { StoneProvider } from './context/StoneContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { SearchModal } from './components/SearchModal';
import { SlabInspectorModal } from './components/SlabInspectorModal';
import { SampleDrawer } from './components/SampleDrawer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ProductDescriptionDemoPage } from './pages/ProductDescriptionDemoPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { ScrollToTop } from './components/ScrollToTop';

export default function App() {
  return (
    <StoneProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0A0A0C] text-[#222222] dark:text-[#E5E5E7] font-sans-luxury flex flex-col justify-between selection:bg-[#C8A96A]/30 selection:text-[#C8A96A]">
          <Navbar />
          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/catalog" element={<ProductsPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/product-spec" element={<ProductDescriptionDemoPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/journal" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />

          {/* Global Interactive Overlays */}
          <SearchModal />
          <SlabInspectorModal />
          <SampleDrawer />
          <ToastContainer />
          <FloatingWhatsAppButton />
        </div>
      </BrowserRouter>
    </StoneProvider>
  );
}
