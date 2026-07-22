import React from 'react';
import { ConsultationFormSection } from '../components/ConsultationFormSection';
import { ShowroomLocations } from '../components/ShowroomLocations';

export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#0A0A0C] text-gray-900 dark:text-gray-100 py-12">
      <ConsultationFormSection />
      <ShowroomLocations />
    </div>
  );
};
