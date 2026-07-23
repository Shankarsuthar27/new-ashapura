import React from 'react';
import { SHOWROOM_LOCATIONS } from '../data/stoneData';
import { useStone } from '../context/StoneContext';
import { MapPin, Phone, Clock, Mail, Compass, Calendar } from 'lucide-react';

export const ShowroomLocations: React.FC = () => {
  const { setIsConsultationModalOpen } = useStone();

  // Only display the first showroom
  const showroom = SHOWROOM_LOCATIONS[0];

  return (
    <section id="showrooms" className="py-24 bg-[#F8F8F8] dark:bg-[#0E0E11] text-gray-900 dark:text-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold inline-flex items-center gap-2">
            <Compass className="w-4 h-4" /> Flagship Design Gallery
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight">
            Visit Our Showroom
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base font-sans-luxury">
            Step into our immersive physical gallery. Touch full-scale bookmatched slab exhibits and consult with master stone masons.
          </p>
        </div>

        {/* Single Showroom Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl">

          {/* Left — Details & Photo */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-6">

              {/* Image Banner */}
              <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-black">
                <img
                  src={showroom.image}
                  alt={showroom.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="px-3 py-1 rounded-full bg-[#C8A96A] text-black font-semibold text-[10px] uppercase tracking-wider">
                    Ashapura tiles & granite
                  </span>
                  <h3 className="font-serif-luxury text-2xl font-bold mt-1">
                    {showroom.title}
                  </h3>
                </div>
              </div>

              {/* Info Cards */}
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-4 p-3.5 rounded-xl bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-800">
                  <MapPin className="w-5 h-5 text-[#C8A96A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Address</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{showroom.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-4 p-3.5 rounded-xl bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-800">
                    <Phone className="w-5 h-5 text-[#C8A96A] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Direct Line</span>
                      <a href={`tel:${showroom.phone}`} className="font-medium text-[#C8A96A] hover:underline">
                        {showroom.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3.5 rounded-xl bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-800">
                    <Mail className="w-5 h-5 text-[#C8A96A] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Email Concierge</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-xs truncate block">{showroom.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3.5 rounded-xl bg-gray-50 dark:bg-[#1A1A1E] border border-gray-200 dark:border-gray-800">
                  <Clock className="w-5 h-5 text-[#C8A96A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Opening Hours</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{showroom.hours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setIsConsultationModalOpen(true)}
              className="w-full py-4 rounded-xl gold-button text-xs font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Private Visit</span>
            </button>
          </div>

          {/* Right — Google Map */}
          <div className="lg:col-span-6 h-[400px] lg:h-auto rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 relative bg-gray-100 dark:bg-[#18181B]">
            <iframe
              title={`${showroom.city} Showroom Map`}
              src={showroom.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'contrast(1.1)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-2 border border-white/20">
              <MapPin className="w-4 h-4 text-[#C8A96A]" />
              <span>{showroom.city} Flagship Atelier</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
