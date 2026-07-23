import React, { useState } from 'react';
import { useStone } from '../context/StoneContext';
import { STONE_CATEGORIES } from '../data/stoneData';
import { ArrowRight, Send, CheckCircle2, ShieldCheck, Instagram, Linkedin, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router';

export const Footer: React.FC = () => {
  const { showToast } = useStone();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    showToast('Subscribed to Aurelia Architectural Newsletter!', 'success');
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Aurelia Marmi | Luxury Stone Atelier',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    '@id': 'https://aureliamarmi.com',
    url: 'https://aureliamarmi.com',
    telephone: '+1 (800) 980-MARBLE',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '680 Fifth Avenue, Suite 1400',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10019',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.7608,
      longitude: -73.9754
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    },
    priceRange: '$$$$$'
  };

  return (
    <footer className="bg-[#0A0A0C] text-gray-300 pt-20 pb-12 border-t border-[#C8A96A]/20 relative overflow-hidden font-sans-luxury">
      {/* Schema Markup Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Newsletter & Brand Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#131316] p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold">
              Exclusive Architectural Dispatch
            </span>
            <h3 className="font-serif-luxury text-3xl font-bold text-white">
              Subscribe to Rare Quarry Drops & Specifier Guides
            </h3>
            <p className="text-xs text-gray-400">
              Receive monthly alerts on newly unblocked Calacatta and Amazonite slab bundles.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="lg:col-span-6 flex items-center gap-3">
            <input
              type="email"
              required
              placeholder="Enter your professional email address..."
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#1A1A1F] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#C8A96A] focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl gold-button text-xs font-bold uppercase tracking-wider shrink-0 flex items-center gap-2"
            >
              {subscribed ? <CheckCircle2 className="w-4 h-4 text-black" /> : <Send className="w-4 h-4" />}
              <span>{subscribed ? 'Subscribed' : 'Join List'}</span>
            </button>
          </form>
        </div>

        {/* 4 Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/Gemini_Generated_Image_4e58ka4e58ka4e58.png"
                alt="Ashapura Tiles & Granite Logo"
                className="w-11 h-11 object-cover rounded-xl border border-[#C8A96A]/40 shadow-lg"
              />
              <div>
                <span className="font-cinzel text-2xl font-bold text-white tracking-wider">
                  ASHAPURA
                </span>
                <span className="block text-[9px] uppercase tracking-[0.25em] text-[#C8A96A] font-semibold">
                  Tiles & Granite Atelier
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              World-class quarrying, precision 5-axis waterjet fabrication, and custom book-matched slab exhibits for luxury architectural estates.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-[#18181C] hover:bg-[#C8A96A] hover:text-black transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-[#18181C] hover:bg-[#C8A96A] hover:text-black transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-[#18181C] hover:bg-[#C8A96A] hover:text-black transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Stone Categories */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold">
              Stone Collections
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {STONE_CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate(`/category/${cat.id}`)}
                    className="hover:text-[#C8A96A] transition-colors"
                  >
                    {cat.name} Slabs
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => navigate('/products')} className="hover:text-[#C8A96A] transition-colors font-bold text-[#C8A96A]">
                  Full Slab Catalog →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold">
              Specifier Resources
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">

              <li><a href="#process" className="hover:text-[#C8A96A] transition-colors">Fabrication Process</a></li>
              <li><a href="#journal" className="hover:text-[#C8A96A] transition-colors">Stone Care & Maintenance</a></li>
              <li><a href="#showrooms" className="hover:text-[#C8A96A] transition-colors">Showroom Booking</a></li>
            </ul>
          </div>

          {/* Col 5: Global HQ Contact */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C8A96A] font-bold">
              Global Concierge
            </h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C8A96A] shrink-0" />
                <span>Bhadriya Colony, Barloot Road, Kalandari, Sirohi (Rajasthan)</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C8A96A] shrink-0" />
                <a href="tel:+919974617657" className="hover:text-[#C8A96A] transition-colors">
                  +91 99746 17657
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C8A96A] shrink-0" />
                <span>concierge@aureliamarmi.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 Ashapura tiles and granite. build by ASHTASOFT.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Specification</span>
            <span className="hover:underline cursor-pointer">Quarry Certification</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
