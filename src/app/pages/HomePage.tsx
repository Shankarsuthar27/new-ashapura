import React from 'react';
import { Hero } from '../components/Hero';
import { LuxuryCategorySection } from '../components/LuxuryCategorySection';
import { FeaturedCollections } from '../components/FeaturedCollections';

import { WhyChooseUs } from '../components/WhyChooseUs';
import { ShowroomLocations } from '../components/ShowroomLocations';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { BlogSection } from '../components/BlogSection';
import { ConsultationFormSection } from '../components/ConsultationFormSection';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0A0A0C] text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* LUXURY SHOWROOM CATEGORY SECTION */}
      <LuxuryCategorySection />

      {/* 2. FEATURED STONE COLLECTIONS */}
      <FeaturedCollections />


      {/* 3. WHY CHOOSE US */}
      <WhyChooseUs />

      {/* 5. SHOWROOM LOCATIONS */}
      <ShowroomLocations />

      {/* 7. CUSTOMER TESTIMONIALS */}
      <TestimonialsSection />

      {/* 8. BLOG SECTION */}
      <BlogSection />

      {/* 9. CONTACT & CONSULTATION SECTION */}
      <ConsultationFormSection />
    </div>
  );
};
